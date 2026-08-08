import React, { useState, useMemo } from 'react';
import { 
  X, 
  Star, 
  Clock, 
  MapPin, 
  Search, 
  Plus, 
  Leaf, 
  Flame, 
  Tag, 
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { Restaurant, MenuItem, SelectedOption } from '../types';

interface RestaurantDetailModalProps {
  restaurant: Restaurant;
  onClose: () => void;
  onOpenCustomization: (item: MenuItem) => void;
  onQuickAddToCart: (item: MenuItem) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
}

export const RestaurantDetailModal: React.FC<RestaurantDetailModalProps> = ({
  restaurant,
  onClose,
  onOpenCustomization,
  onQuickAddToCart,
  cartCount,
  cartTotal,
  onOpenCart,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(restaurant.menuCategories[0] || 'All');
  const [menuSearch, setMenuSearch] = useState('');

  const filteredMenuItems = useMemo(() => {
    return restaurant.menuItems.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = !menuSearch || 
        item.name.toLowerCase().includes(menuSearch.toLowerCase()) || 
        item.description.toLowerCase().includes(menuSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [restaurant.menuItems, activeCategory, menuSearch]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex justify-center p-0 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white border border-gray-200 rounded-none sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col min-h-screen sm:min-h-[85vh] my-auto">
        
        {/* Header Banner & Close */}
        <div className="relative h-56 sm:h-72 w-full bg-slate-100 shrink-0">
          <img
            src={restaurant.coverImage}
            alt={restaurant.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 hover:bg-white text-[#111827] backdrop-blur-md transition-all z-10 shadow-md"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Restaurant Header Details Overlay */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white bg-[#F97316] px-2.5 py-0.5 rounded-full shadow-sm">
                    {restaurant.cuisines.join(' • ')}
                  </span>
                  {restaurant.hasDiscount && (
                    <span className="text-xs font-bold text-orange-900 bg-orange-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <Tag className="w-3 h-3 text-[#F97316]" /> {restaurant.discountText}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {restaurant.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
                  {restaurant.tagline}
                </p>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-200 pt-1">
                  <span className="flex items-center gap-1 text-white font-bold bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-[#F97316] text-[#F97316]" />
                    {restaurant.rating.toFixed(1)} ({restaurant.ratingCount}+ reviews)
                  </span>
                  <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full">
                    <Clock className="w-4 h-4 text-[#F97316]" />
                    {restaurant.deliveryTimeMin}-{restaurant.deliveryTimeMax} min
                  </span>
                  <span className="flex items-center gap-1 text-slate-200 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full">
                    <MapPin className="w-4 h-4 text-[#F97316]" />
                    {restaurant.address}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Navigation & Search Toolbar */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 space-y-3 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            
            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar flex-1">
              <button
                onClick={() => setActiveCategory('All')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === 'All'
                    ? 'bg-[#F97316] text-white shadow-sm'
                    : 'bg-slate-100 text-[#64748B] hover:text-[#111827] hover:bg-slate-200'
                }`}
              >
                All Items
              </button>
              {restaurant.menuCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-[#F97316] text-white shadow-sm'
                      : 'bg-slate-100 text-[#64748B] hover:text-[#111827] hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu Search Box */}
            <div className="relative w-48 sm:w-64 shrink-0">
              <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                placeholder="Search menu..."
                className="w-full bg-slate-50 border border-gray-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#111827] placeholder-[#64748B] focus:outline-none focus:border-[#F97316]"
              />
            </div>

          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="p-4 sm:p-6 space-y-4 flex-1 overflow-y-auto">
          {filteredMenuItems.length === 0 ? (
            <div className="text-center py-12 text-[#64748B]">
              <p className="text-sm">No items found matching "{menuSearch}" in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMenuItems.map((item) => {
                const hasCustomizations = item.customizationGroups && item.customizationGroups.length > 0;

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-white hover:bg-slate-50/80 border border-gray-200 hover:border-orange-300 transition-all flex justify-between gap-4 group shadow-sm hover:shadow-md"
                  >
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        {item.isVegetarian && (
                          <span className="p-0.5 rounded border border-emerald-500/50 text-emerald-600 text-[10px] font-bold">
                            <Leaf className="w-3 h-3" />
                          </span>
                        )}
                        {item.isSpicy && (
                          <span className="p-0.5 rounded text-rose-500 text-[10px] font-bold">
                            <Flame className="w-3 h-3" />
                          </span>
                        )}
                        {item.isPopular && (
                          <span className="text-[10px] uppercase font-bold text-[#F97316] bg-orange-50 px-2 py-0.5 rounded">
                            Bestseller ★
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-[#111827] group-hover:text-[#F97316] transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      <p className="text-sm font-extrabold text-[#111827] pt-1">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="relative shrink-0 flex flex-col items-center gap-2">
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <button
                        onClick={() => {
                          if (hasCustomizations) {
                            onOpenCustomization(item);
                          } else {
                            onQuickAddToCart(item);
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>{hasCustomizations ? 'Customize' : 'Add'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Floating Cart Footer if Items present */}
        {cartCount > 0 && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg flex items-center justify-between gap-4 z-30">
            <div className="text-[#111827]">
              <span className="text-xs text-[#64748B] block">Current Order</span>
              <span className="text-sm font-bold text-[#F97316]">{cartCount} items selected</span>
            </div>
            <button
              onClick={onOpenCart}
              className="flex items-center gap-3 px-6 py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-sm shadow-md active:scale-98 transition-all"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              <span>View Cart & Checkout</span>
              <span className="bg-white text-[#F97316] px-2.5 py-0.5 rounded-full text-xs font-black">
                ${cartTotal.toFixed(2)}
              </span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
