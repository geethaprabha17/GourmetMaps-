
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviews: number;
  cuisine: string;
  priceLevel: string;
  address: string;
  mapsUrl: string;
  imageUrl: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  restaurantId: string;
  restaurantName: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}
