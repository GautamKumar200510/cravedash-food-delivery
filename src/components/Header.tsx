import React from 'react';
import { 
  MapPin, 
  Search, 
  ShoppingBag, 
  Sparkles, 
  Clock, 
  Heart, 
  ChevronDown,
  User as UserIcon,
  LogIn,
  Crown
} from 'lucide-react';
import { UserAddress, User } from '../types';

interface HeaderProps {
  currentAddress: UserAddress;
  onOpenAddressModal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenAiAssistant: () => void;
  activeOrderCount: number;
  onOpenOrderTracker: () => void;
  onOpenOrderHistory: () => void;
  favoriteCount: number;
  onOpenFavorites: () => void;
  currentUser: User | null;
  onOpenAuthModal: (mode?: 'login' | 'signup') => void;
  onOpenUserProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentAddress,
  onOpenAddressModal,
  searchQuery,
  onSearchChange,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenAiAssistant,
  activeOrderCount,
  onOpenOrderTracker,
  onOpenOrderHistory,
  favoriteCount,
  onOpenFavorites,
  currentUser,
  onOpenAuthModal,
  onOpenUserProfile,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 text-[#111827] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          
          {/* Logo & Location */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 rounded-xl bg-[#F97316] flex items-center justify-center shadow-sm group-hover:bg-[#EA580C] transition-colors">
                <span className="text-xl font-black text-white tracking-wider">C</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-[#111827] tracking-tight">
                  CraveDash
                </span>
                <span className="block text-[10px] uppercase font-semibold text-[#F97316] -mt-1 tracking-widest">
                  Food Express
                </span>
              </div>
            </div>

            {/* Address Selector Pill */}
            <button
              id="location-selector-btn"
              onClick={onOpenAddressModal}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-gray-200 text-xs sm:text-sm font-medium text-[#111827] transition-colors shadow-sm"
              title="Change Delivery Location"
            >
              <MapPin className="w-4 h-4 text-[#F97316] shrink-0" />
              <div className="text-left max-w-[110px] sm:max-w-[160px] truncate">
                <span className="block text-[10px] text-[#64748B] leading-none">Deliver to</span>
                <span className="font-semibold text-[#111827] truncate block">
                  {currentAddress.label}: {currentAddress.street}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
            </button>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search dishes, burgers, sushi, or restaurants..."
                className="w-full bg-slate-50 border border-gray-200 rounded-full pl-10 pr-8 py-2 text-sm text-[#111827] placeholder-[#64748B] focus:outline-none focus:border-[#F97316] focus:bg-white focus:ring-1 focus:ring-[#F97316] transition-all shadow-sm"
              />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#64748B] hover:text-[#111827] bg-slate-200 hover:bg-slate-300 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* AI Assistant Button */}
            <button
              id="ai-assistant-btn"
              onClick={onOpenAiAssistant}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[#F97316] text-xs sm:text-sm font-semibold transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-[#F97316]" />
              <span className="hidden lg:inline">AI Meal Assistant</span>
              <span className="lg:hidden">AI Assistant</span>
            </button>

            {/* Live Order Tracker Badge if active */}
            {activeOrderCount > 0 && (
              <button
                id="active-order-tracker-btn"
                onClick={onOpenOrderTracker}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs font-semibold animate-pulse shadow-sm"
              >
                <Clock className="w-4 h-4 text-white" />
                <span className="hidden sm:inline">Track Order</span>
              </button>
            )}

            {/* Wishlist */}
            <button
              onClick={onOpenFavorites}
              className="relative p-2 rounded-full hover:bg-slate-100 text-[#64748B] hover:text-[#F97316] transition-colors"
              title="Favorite Restaurants"
            >
              <Heart className="w-5 h-5" />
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F97316] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {favoriteCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth Button */}
            {currentUser ? (
              <button
                id="user-profile-pill-btn"
                onClick={onOpenUserProfile}
                className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-gray-200 text-xs font-semibold text-[#111827] transition-all shadow-sm"
                title="View Profile & Crave Wallet"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
                <span className="hidden sm:inline font-bold truncate max-w-[90px]">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className="hidden md:inline text-[10px] bg-[#F97316] text-white px-1.5 py-0.2 rounded font-extrabold">
                  ${currentUser.walletBalance.toFixed(0)}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  id="header-login-btn"
                  onClick={() => onOpenAuthModal('login')}
                  className="px-3 py-1.5 rounded-full hover:bg-slate-100 text-[#111827] text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#F97316]" />
                  <span>Sign In</span>
                </button>
                <button
                  id="header-signup-btn"
                  onClick={() => onOpenAuthModal('signup')}
                  className="hidden sm:flex px-3 py-1.5 rounded-full bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[#F97316] text-xs font-bold transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Cart Button */}
            <button
              id="open-cart-drawer-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 ? (
                <span className="bg-white text-[#F97316] px-2 py-0.5 rounded-full text-xs font-black">
                  {cartCount} • ${cartTotal.toFixed(2)}
                </span>
              ) : (
                <span className="bg-white/20 text-white px-1.5 py-0.5 rounded-full text-xs">
                  0
                </span>
              )}
            </button>

          </div>

        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search dishes, burgers, sushi..."
              className="w-full bg-slate-50 border border-gray-200 rounded-full pl-10 pr-4 py-2 text-xs text-[#111827] placeholder-[#64748B] focus:outline-none focus:border-[#F97316]"
            />
          </div>
        </div>

      </div>
    </header>
  );
};
