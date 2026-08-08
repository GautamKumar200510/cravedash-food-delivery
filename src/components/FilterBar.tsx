import React from 'react';
import { Star, Clock, Zap, Percent, SlidersHorizontal, Leaf, RotateCcw } from 'lucide-react';
import { FilterOptions } from '../types';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (updated: Partial<FilterOptions>) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
}) => {
  const hasActiveFilters = 
    filters.minRating > 0 || 
    filters.maxDeliveryTime > 0 || 
    filters.freeDeliveryOnly || 
    filters.offersOnly || 
    filters.dietaryFilter !== 'all' || 
    filters.sortBy !== 'relevance';

  return (
    <div className="py-3 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Quick Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
            
            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3.5 py-1.5 text-xs text-[#111827] shadow-sm">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
              <span className="font-semibold text-[#64748B]">Sort:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
                className="bg-transparent text-[#111827] font-bold focus:outline-none cursor-pointer"
              >
                <option value="relevance" className="bg-white text-[#111827]">Relevance</option>
                <option value="rating" className="bg-white text-[#111827]">Top Rated ★</option>
                <option value="delivery_time" className="bg-white text-[#111827]">Fastest Delivery ⚡</option>
                <option value="price_low" className="bg-white text-[#111827]">Price: Low to High</option>
              </select>
            </div>

            {/* Rating 4.0+ Filter */}
            <button
              onClick={() => onFilterChange({ minRating: filters.minRating === 4.0 ? 0 : 4.0 })}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
                filters.minRating === 4.0
                  ? 'bg-orange-50 text-[#F97316] border border-orange-200 shadow-sm'
                  : 'bg-white hover:bg-slate-50 text-[#111827] border border-gray-200 shadow-sm'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-[#F97316] fill-[#F97316]" />
              <span>4.0+ Rated</span>
            </button>

            {/* Fast Delivery (<25 min) */}
            <button
              onClick={() => onFilterChange({ maxDeliveryTime: filters.maxDeliveryTime === 25 ? 0 : 25 })}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
                filters.maxDeliveryTime === 25
                  ? 'bg-orange-50 text-[#F97316] border border-orange-200 shadow-sm'
                  : 'bg-white hover:bg-slate-50 text-[#111827] border border-gray-200 shadow-sm'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#F97316]" />
              <span>Under 25 mins</span>
            </button>

            {/* Free Delivery Toggle */}
            <button
              onClick={() => onFilterChange({ freeDeliveryOnly: !filters.freeDeliveryOnly })}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
                filters.freeDeliveryOnly
                  ? 'bg-orange-50 text-[#F97316] border border-orange-200 shadow-sm'
                  : 'bg-white hover:bg-slate-50 text-[#111827] border border-gray-200 shadow-sm'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-[#F97316]" />
              <span>Free Delivery</span>
            </button>

            {/* Offers Only Toggle */}
            <button
              onClick={() => onFilterChange({ offersOnly: !filters.offersOnly })}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
                filters.offersOnly
                  ? 'bg-orange-50 text-[#F97316] border border-orange-200 shadow-sm'
                  : 'bg-white hover:bg-slate-50 text-[#111827] border border-gray-200 shadow-sm'
              }`}
            >
              <Percent className="w-3.5 h-3.5 text-[#F97316]" />
              <span>Special Offers</span>
            </button>

            {/* Dietary Tabs */}
            <div className="flex items-center bg-white border border-gray-200 rounded-full p-0.5 shrink-0 shadow-sm">
              <button
                onClick={() => onFilterChange({ dietaryFilter: 'all' })}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
                  filters.dietaryFilter === 'all' ? 'bg-[#F97316] text-white shadow-sm' : 'text-[#64748B] hover:text-[#111827]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => onFilterChange({ dietaryFilter: 'veg' })}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors flex items-center gap-1 ${
                  filters.dietaryFilter === 'veg' ? 'bg-[#F97316] text-white shadow-sm' : 'text-[#64748B] hover:text-[#111827]'
                }`}
              >
                <Leaf className="w-3 h-3" /> Veg
              </button>
              <button
                onClick={() => onFilterChange({ dietaryFilter: 'vegan' })}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
                  filters.dietaryFilter === 'vegan' ? 'bg-[#F97316] text-white shadow-sm' : 'text-[#64748B] hover:text-[#111827]'
                }`}
              >
                Vegan
              </button>
            </div>

          </div>

          {/* Result Count & Reset */}
          <div className="flex items-center gap-3 shrink-0 ml-auto">
            <span className="text-xs font-semibold text-[#64748B]">
              Showing <strong className="text-[#111827]">{totalResults}</strong> restaurants
            </span>
            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="flex items-center gap-1 text-xs font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
