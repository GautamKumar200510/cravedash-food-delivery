import React from 'react';
import { 
  Utensils, 
  Beef, 
  Pizza, 
  Fish, 
  Flame, 
  Salad, 
  Soup, 
  CookingPot, 
  Cake 
} from 'lucide-react';
import { CuisineCategory } from '../types';

interface CategoryBarProps {
  categories: CuisineCategory[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Utensils,
  Beef,
  Pizza,
  Fish,
  Flame,
  Salad,
  Soup,
  CookingPot,
  Cake
};

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className="py-4 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
            Explore Cuisines
          </h2>
          {activeCategory !== 'all' && (
            <button
              onClick={() => onSelectCategory('all')}
              className="text-xs font-semibold text-[#F97316] hover:text-[#EA580C] hover:underline"
            >
              Reset Category
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
          {categories.map((cat) => {
            const IconComponent = ICON_MAP[cat.icon] || Utensils;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#F97316] text-white shadow-sm ring-2 ring-orange-400/30'
                    : 'bg-white hover:bg-slate-50 text-[#111827] border border-gray-200 shadow-sm'
                }`}
              >
                <div className={`p-1 rounded-lg ${isActive ? 'bg-white/20 text-white' : 'bg-orange-50 text-[#F97316]'}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
