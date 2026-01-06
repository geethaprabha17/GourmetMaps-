
import React, { useState } from 'react';
import { Search, MapPin, ShoppingBag, UtensilsCrossed } from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  isLoading: boolean;
}

const Header: React.FC<HeaderProps> = ({ onSearch, cartCount, onOpenCart, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="bg-orange-500 p-2 rounded-xl">
              <UtensilsCrossed className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:block">GourmetMaps<span className="text-orange-500">AI</span></span>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="flex-1 max-w-2xl">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={`w-5 h-5 ${isLoading ? 'text-orange-500 animate-pulse' : 'text-gray-400'}`} />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are you craving today?"
                className="block w-full pl-10 pr-3 py-2.5 sm:py-3 border border-gray-200 rounded-2xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all sm:text-sm"
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="absolute inset-y-1 right-1 px-4 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 focus:outline-none transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Searching...' : 'Explore'}
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="hidden md:flex items-center gap-1 text-gray-600 hover:text-orange-500 transition-colors">
              <MapPin className="w-5 h-5" />
              <span className="text-sm font-medium">Nearby</span>
            </button>
            
            <button 
              onClick={onOpenCart}
              className="relative p-2.5 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
