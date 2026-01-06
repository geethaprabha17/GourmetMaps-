
import React from 'react';
import { Star, Clock, MapPin, ExternalLink, Plus } from 'lucide-react';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onSelect: (restaurant: Restaurant) => void;
  onAddToCart: (restaurant: Restaurant) => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onSelect, onAddToCart }) => {
  return (
    <div className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={restaurant.imageUrl} 
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-bold">{restaurant.rating.toFixed(1)}</span>
        </div>
        <div className="absolute bottom-3 left-3 flex gap-2">
          <span className="bg-orange-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-lg">
            {restaurant.cuisine}
          </span>
          <span className="bg-black/50 backdrop-blur-sm text-white text-[10px] uppercase font-bold px-2 py-1 rounded-lg">
            {restaurant.priceLevel}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
            {restaurant.name}
          </h3>
          <a 
            href={restaurant.mapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
            title="View on Maps"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {restaurant.description}
        </p>

        <div className="flex items-center gap-4 text-gray-400 text-xs mb-5">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>20-35 min</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>Local Delivery</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => onSelect(restaurant)}
            className="flex-1 py-2.5 px-4 bg-gray-900 text-white text-sm font-bold rounded-2xl hover:bg-black transition-colors"
          >
            View Menu
          </button>
          <button 
            onClick={() => onAddToCart(restaurant)}
            className="p-2.5 bg-orange-100 text-orange-600 rounded-2xl hover:bg-orange-500 hover:text-white transition-all group/btn"
          >
            <Plus className="w-5 h-5 group-hover/btn:rotate-90 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
