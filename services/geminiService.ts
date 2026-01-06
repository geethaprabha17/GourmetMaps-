
import { GoogleGenAI } from "@google/genai";
import { Restaurant, UserLocation } from "../types";

// Fixed: Always use process.env.API_KEY directly in the named parameter object.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const searchRestaurants = async (
  query: string,
  location: UserLocation | null
): Promise<{ text: string; restaurants: Restaurant[]; sources: any[] }> => {
  try {
    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    if (location) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        },
      };
    }

    // Using gemini-2.5-flash as it is the required model for Google Maps grounding.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find popular restaurants for: ${query}. For each restaurant, provide the name, cuisine type, an estimated rating, and a brief description. Focus on places currently open and highly rated near my location.`,
      config: config,
    });

    const text = response.text || "";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // We parse the text and grounding metadata to extract structured restaurant data
    // In a real app, we'd use responseSchema, but googleMaps tool prohibits it.
    // So we'll map the grounding chunks to our Restaurant interface.
    
    const restaurants: Restaurant[] = groundingChunks
      .filter((chunk: any) => chunk.maps)
      .map((chunk: any, index: number) => ({
        id: `res-${index}`,
        name: chunk.maps.title || "Unknown Restaurant",
        description: "A top-rated local favorite discovered via AI grounding.",
        rating: 4.5 + (Math.random() * 0.5), // Simulated for UI
        reviews: Math.floor(Math.random() * 1000) + 100,
        cuisine: "Local Favorite",
        priceLevel: "$$",
        address: "Refer to Map Link",
        mapsUrl: chunk.maps.uri,
        imageUrl: `https://picsum.photos/seed/${chunk.maps.title}/600/400`,
      }));

    return {
      text,
      restaurants,
      sources: groundingChunks,
    };
  } catch (error) {
    console.error("Error searching restaurants:", error);
    throw error;
  }
};
