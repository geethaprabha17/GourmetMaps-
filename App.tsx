
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import RestaurantCard from './components/RestaurantCard';
import Cart from './components/Cart';
import { Restaurant, CartItem, UserLocation } from './types';
import { searchRestaurants } from './services/geminiService';
// Fixed: Added missing ShoppingBag icon to imports
import { Map as MapIcon, Compass, Sparkles, ChefHat, ShoppingBag } from 'lucide-react';

const App: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [aiInsight, setAiInsight] = useState<string>('');

  // Initial fetch for "nearby"
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setUserLocation(loc);
          handleSearch('best restaurants nearby', loc);
        },
        () => {
          handleSearch('popular restaurants');
        }
      );
    } else {
      handleSearch('popular restaurants');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (query: string, loc: UserLocation | null = userLocation) => {
    setIsLoading(true);
    try {
      const result = await searchRestaurants(query, loc);
      setRestaurants(result.restaurants);
      setAiInsight(result.text);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (restaurant: Restaurant) => {
    const mockItem = {
      id: `${restaurant.id}-special`,
      name: `${restaurant.cuisine} Special Platter`,
      price: 18.99,
      description: "A chef-selected assortment of the finest dishes.",
      category: "Main",
      imageUrl: restaurant.imageUrl,
      quantity: 1,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name
    };

    setCartItems(prev => {
      const existing = prev.find(item => item.id === mockItem.id);
      if (existing) {
        return prev.map(item => 
          item.id === mockItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, mockItem];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    alert("Order placed successfully! In a real app, this would integrate with a payment gateway.");
    setCartItems([]);
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header 
        onSearch={(q) => handleSearch(q)} 
        cartCount={cartItems.reduce((a, b) => a + b.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        isLoading={isLoading}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Insight Section */}
        {aiInsight && !isLoading && (
          <div className="mb-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-orange-200">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 bg-white/20 backdrop-blur-md w-fit px-4 py-1.5 rounded-full border border-white/30">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-bold tracking-wider uppercase">AI Recommendations</span>
              </div>
              <div className="prose prose-invert max-w-none prose-p:text-lg prose-p:leading-relaxed">
                <p className="text-white/90 italic font-medium">"{aiInsight.split('\n')[0]}"</p>
              </div>
            </div>
            {/* Background elements */}
            <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-1/4 -translate-y-1/4">
              <ChefHat className="w-64 h-64" />
            </div>
            <div className="absolute bottom-0 right-10 opacity-10">
               <Compass className="w-32 h-32 animate-pulse" />
            </div>
          </div>
        )}

        {/* Restaurants Grid */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <MapIcon className="text-orange-500" />
              {restaurants.length > 0 ? 'Handpicked for You' : 'Searching Restaurants...'}
            </h2>
            <p className="text-gray-500 font-medium">Verified local hotspots near your current location.</p>
          </div>
          
          <div className="flex gap-2">
            <span className="px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">Highest Rated</span>
            <span className="px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">Fastest</span>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 h-80 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.length > 0 ? (
              restaurants.map((restaurant) => (
                <RestaurantCard 
                  key={restaurant.id}
                  restaurant={restaurant}
                  onSelect={(r) => addToCart(r)}
                  onAddToCart={(r) => addToCart(r)}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChefHat className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">No restaurants found</h3>
                <p className="text-gray-500 mt-2">Try searching for something else like "Best Sushi" or "Tacos".</p>
              </div>
            )}
          </div>
        )}
      </main>

      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />

      {/* Persistent Mobile Action Button */}
      {!isCartOpen && cartItems.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-xs px-4">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-orange-600 text-white py-4 rounded-2xl shadow-2xl flex items-center justify-center gap-3 font-bold animate-bounce-subtle"
          >
            <ShoppingBag className="w-6 h-6" />
            View Order (${cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)})
          </button>
        </div>
      )}

      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default App;
