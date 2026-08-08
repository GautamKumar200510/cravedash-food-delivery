import React from 'react';
import { Star, Clock, Heart, Zap, Tag, MapPin } from 'lucide-react';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  isFavorite,
  onToggleFavorite,
  onSelectRestaurant,
}) => {
  return (
    <div
      onClick={() => onSelectRestaurant(restaurant)}
      className="group cursor-pointer bg-white border border-gray-200 hover:border-orange-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
    >
      {/* Cover Image & Badges */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => onToggleFavorite(restaurant.id, e)}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all shadow-sm ${
            isFavorite
              ? 'bg-[#F97316] text-white scale-105'
              : 'bg-white/90 hover:bg-white text-[#64748B] hover:text-[#F97316]'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
        </button>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[80%]">
          {restaurant.isSuperFast && (
            <span className="inline-flex items-center gap-1 bg-[#F97316] text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full shadow-sm">
              <Zap className="w-3 h-3 fill-white" /> Express
            </span>
          )}
          {restaurant.hasDiscount && restaurant.discountText && (
            <span className="inline-flex items-center gap-1 bg-white text-[#F97316] border border-orange-200 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full shadow-sm">
              <Tag className="w-3 h-3" /> {restaurant.discountText}
            </span>
          )}
        </div>

        {/* Rating & Delivery Time Pill over cover */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full font-bold text-[#111827] shadow-sm">
            <Star className="w-3.5 h-3.5 text-[#F97316] fill-[#F97316]" />
            <span className="text-[#111827]">{restaurant.rating.toFixed(1)}</span>
            <span className="text-[#64748B] font-normal text-[11px]">({restaurant.ratingCount}+)</span>
          </div>

          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full font-semibold text-[#111827] shadow-sm">
            <Clock className="w-3.5 h-3.5 text-[#F97316]" />
            <span>{restaurant.deliveryTimeMin}-{restaurant.deliveryTimeMax} min</span>
            <span className="text-gray-300">•</span>
            <span className={restaurant.deliveryFee === 0 ? 'text-[#F97316] font-bold' : 'text-[#64748B]'}>
              {restaurant.deliveryFee === 0 ? 'FREE' : `$${restaurant.deliveryFee.toFixed(2)}`}
            </span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base sm:text-lg font-bold text-[#111827] group-hover:text-[#F97316] transition-colors line-clamp-1">
              {restaurant.name}
            </h3>
            <span className="text-xs font-bold text-[#F97316] bg-orange-50 px-2 py-0.5 rounded-md shrink-0">
              {restaurant.priceRange}
            </span>
          </div>

          <p className="text-xs text-[#64748B] mt-1 line-clamp-1">
            {restaurant.tagline}
          </p>

          <div className="flex items-center gap-2 text-[11px] text-[#64748B] mt-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#64748B]" />
              {restaurant.distanceMiles} mi away
            </span>
            <span>•</span>
            <span className="truncate">{restaurant.cuisines.join(' • ')}</span>
          </div>
        </div>

        {/* Popular Item Tags */}
        <div className="pt-2.5 border-t border-gray-100 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Top Items:</span>
          {restaurant.menuItems.slice(0, 2).map((item) => (
            <span
              key={item.id}
              className="text-[10px] font-medium bg-slate-100 text-[#111827] px-2 py-0.5 rounded-md truncate max-w-[140px]"
            >
              {item.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
