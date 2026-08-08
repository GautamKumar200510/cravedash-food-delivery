import React from 'react';
import { 
  X, 
  User as UserIcon, 
  Mail, 
  Phone, 
  Wallet, 
  Crown, 
  MapPin, 
  Clock, 
  LogOut, 
  Sparkles, 
  ChevronRight,
  ShieldCheck,
  Gift
} from 'lucide-react';
import { User } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onLogout: () => void;
  onOpenOrderHistory: () => void;
  onOpenAddressModal: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogout,
  onOpenOrderHistory,
  onOpenAddressModal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto">
        
        {/* Header Banner */}
        <div className="p-6 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
              alt={user.name}
              className="w-16 h-16 rounded-full border-2 border-white object-cover shadow-md shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">{user.name}</h3>
                <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded-full text-white border border-white/30 flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-200 fill-amber-200" />
                  {user.memberTier}
                </span>
              </div>
              <p className="text-xs text-orange-100 flex items-center gap-1 mt-0.5">
                <Mail className="w-3 h-3" />
                <span>{user.email}</span>
              </p>
              {user.phone && (
                <p className="text-[11px] text-orange-100/90 flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3" />
                  <span>{user.phone}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 text-[#111827]">

          {/* Wallet & Rewards Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200">
              <div className="flex items-center justify-between text-[#F97316] mb-1">
                <span className="text-xs font-bold uppercase tracking-wider">Crave Wallet</span>
                <Wallet className="w-4 h-4" />
              </div>
              <p className="text-xl font-extrabold text-[#111827]">
                ${user.walletBalance.toFixed(2)}
              </p>
              <p className="text-[10px] text-[#64748B] mt-0.5">Ready to use on checkout</p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-center justify-between text-amber-600 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider">Rewards</span>
                <Gift className="w-4 h-4" />
              </div>
              <p className="text-xl font-extrabold text-[#111827]">
                {user.rewardPoints} pts
              </p>
              <p className="text-[10px] text-[#64748B] mt-0.5">250 pts = $5 off promo</p>
            </div>
          </div>

          {/* Action List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
              Account Shortcuts
            </h4>

            <button
              onClick={() => {
                onClose();
                onOpenOrderHistory();
              }}
              className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-gray-200 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-[#F97316]">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-[#111827]">Order History & Re-order</span>
                  <span className="block text-[11px] text-[#64748B]">View past food delivery orders</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#64748B]" />
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenAddressModal();
              }}
              className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-gray-200 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-[#F97316]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-[#111827]">Saved Delivery Addresses</span>
                  <span className="block text-[11px] text-[#64748B]">Manage Home, Work & Gym locations</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#64748B]" />
            </button>
          </div>

          {/* Member Privileges */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-gray-200 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F97316]" />
              <span className="text-xs font-bold text-[#111827]">Crave Express VIP Privileges</span>
            </div>
            <ul className="text-[11px] text-[#64748B] space-y-1 list-disc list-inside">
              <li>Free delivery on orders over $15 with promo FREEDEL</li>
              <li>Priority kitchen prep at top partner restaurants</li>
              <li>Earn 10 points per $1 spent on all meal orders</li>
            </ul>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Account</span>
          </button>

        </div>

      </div>
    </div>
  );
};
