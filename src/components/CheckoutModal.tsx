import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  CreditCard, 
  Wallet, 
  Banknote, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Check, 
  ArrowRight
} from 'lucide-react';
import { UserAddress, DeliveryMethod, PaymentMethod, CartItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: UserAddress[];
  selectedAddress: UserAddress;
  onSelectAddress: (addr: UserAddress) => void;
  cartItems: CartItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  tip: number;
  discount: number;
  total: number;
  onPlaceOrder: (details: {
    deliveryMethod: DeliveryMethod;
    paymentMethod: PaymentMethod;
    instructions: string;
  }) => void;
  isSubmitting: boolean;
  restaurantName: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  addresses,
  selectedAddress,
  onSelectAddress,
  cartItems,
  subtotal,
  deliveryFee,
  serviceFee,
  tip,
  discount,
  total,
  onPlaceOrder,
  isSubmitting,
  restaurantName,
}) => {
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [driverInstructions, setDriverInstructions] = useState('Leave at front door & ring bell');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPlaceOrder({
      deliveryMethod,
      paymentMethod,
      instructions: driverInstructions,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
              <span>Checkout</span>
              <span className="text-xs font-bold text-[#F97316] bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">
                {restaurantName}
              </span>
            </h2>
            <p className="text-xs text-[#64748B]">Review your address, payment & order details</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-[#64748B] hover:text-[#111827] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-[#111827]">
          
          {/* Delivery Method Toggle */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider">
              1. Delivery Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryMethod('delivery')}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  deliveryMethod === 'delivery'
                    ? 'bg-orange-50 border-orange-300 text-[#111827] shadow-sm'
                    : 'bg-white border-gray-200 text-[#111827] hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#F97316]" />
                  <div className="text-left">
                    <span className="block text-xs font-bold">Express Delivery</span>
                    <span className="text-[10px] text-[#64748B]">Estimated 20-30 mins</span>
                  </div>
                </div>
                {deliveryMethod === 'delivery' && <Check className="w-4 h-4 text-[#F97316]" />}
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMethod('pickup')}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  deliveryMethod === 'pickup'
                    ? 'bg-orange-50 border-orange-300 text-[#111827] shadow-sm'
                    : 'bg-white border-gray-200 text-[#111827] hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#F97316]" />
                  <div className="text-left">
                    <span className="block text-xs font-bold">Store Pickup</span>
                    <span className="text-[10px] text-[#64748B]">Ready in 15 mins</span>
                  </div>
                </div>
                {deliveryMethod === 'pickup' && <Check className="w-4 h-4 text-[#F97316]" />}
              </button>
            </div>
          </div>

          {/* Delivery Address Selection */}
          {deliveryMethod === 'delivery' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider">
                2. Select Delivery Address
              </label>
              <div className="space-y-2">
                {addresses.map((addr) => {
                  const isSelected = selectedAddress.id === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => onSelectAddress(addr)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                        isSelected
                          ? 'bg-orange-50 border-orange-300 text-[#111827] shadow-sm'
                          : 'bg-white border-gray-200 text-[#111827] hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-[#F97316]' : 'text-[#64748B]'}`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold">{addr.label}</span>
                            {addr.isDefault && (
                              <span className="text-[9px] uppercase font-bold bg-slate-100 text-[#64748B] px-1.5 py-0.2 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#64748B] mt-0.5">
                            {addr.street} {addr.apt ? `, ${addr.apt}` : ''}, {addr.city} {addr.zip}
                          </p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#F97316] shrink-0" />}
                    </div>
                  );
                })}
              </div>

              {/* Driver Dropoff Instructions */}
              <div className="pt-1">
                <label className="block text-xs font-semibold text-[#64748B] mb-1">
                  Delivery Dropoff Notes:
                </label>
                <input
                  type="text"
                  value={driverInstructions}
                  onChange={(e) => setDriverInstructions(e.target.value)}
                  placeholder="e.g. Leave at front door, gate code #1234..."
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#111827] placeholder-[#64748B] focus:outline-none focus:border-[#F97316]"
                />
              </div>
            </div>
          )}

          {/* Payment Method Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider">
              3. Payment Option
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-orange-50 border-orange-300 text-[#111827] shadow-sm'
                    : 'bg-white border-gray-200 text-[#111827] hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-5 h-5 text-[#F97316]" />
                <span className="text-xs font-bold">Credit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`p-3 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'apple_pay'
                    ? 'bg-orange-50 border-orange-300 text-[#111827] shadow-sm'
                    : 'bg-white border-gray-200 text-[#111827] hover:bg-slate-50'
                }`}
              >
                <Wallet className="w-5 h-5 text-[#F97316]" />
                <span className="text-xs font-bold">Apple / GPay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-3 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'cash'
                    ? 'bg-orange-50 border-orange-300 text-[#111827] shadow-sm'
                    : 'bg-white border-gray-200 text-[#111827] hover:bg-slate-50'
                }`}
              >
                <Banknote className="w-5 h-5 text-[#F97316]" />
                <span className="text-xs font-bold">Cash on Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`p-3 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'wallet'
                    ? 'bg-orange-50 border-orange-300 text-[#111827] shadow-sm'
                    : 'bg-white border-gray-200 text-[#111827] hover:bg-slate-50'
                }`}
              >
                <Sparkles className="w-5 h-5 text-[#F97316]" />
                <span className="text-xs font-bold">Crave Wallet</span>
              </button>
            </div>
          </div>

          {/* Order Summary Recap */}
          <div className="p-4 rounded-xl bg-slate-50 border border-gray-200 space-y-2">
            <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
              Order Total Summary
            </h4>
            <div className="text-xs space-y-1 text-[#64748B]">
              <div className="flex justify-between">
                <span>Items Subtotal ({cartItems.length})</span>
                <span className="font-medium text-[#111827]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery & Service Fee</span>
                <span>${(deliveryFee + serviceFee).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Driver Tip</span>
                <span className="text-[#F97316] font-semibold">${tip.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#F97316] font-bold">
                  <span>Discount Applied</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-[#111827] pt-2 border-t border-gray-200">
                <span>Final Total Due</span>
                <span className="text-[#F97316]">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#64748B] justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-bit Encrypted SSL Guarantee • Contactless Delivery</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-sm shadow-sm active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Placing Order...</span>
            ) : (
              <>
                <span>Confirm & Place Order (${total.toFixed(2)})</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
