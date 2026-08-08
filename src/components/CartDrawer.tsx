import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  ArrowRight, 
  ShoppingBag, 
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  tip: number;
  onChangeTip: (tipAmount: number) => void;
  promoCode: string;
  onApplyPromoCode: (code: string) => void;
  discount: number;
  total: number;
  onProceedToCheckout: () => void;
  restaurantName?: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  subtotal,
  deliveryFee,
  serviceFee,
  tip,
  onChangeTip,
  promoCode,
  onApplyPromoCode,
  discount,
  total,
  onProceedToCheckout,
  restaurantName,
}) => {
  const [inputCode, setInputCode] = useState(promoCode);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApplyCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    onApplyPromoCode(inputCode.trim());
    setPromoMessage(`Applied code ${inputCode.toUpperCase()}!`);
    setTimeout(() => setPromoMessage(null), 3000);
  };

  const tipPresets = [
    { label: '10%', val: Number((subtotal * 0.10).toFixed(2)) },
    { label: '15%', val: Number((subtotal * 0.15).toFixed(2)) },
    { label: '20%', val: Number((subtotal * 0.20).toFixed(2)) },
    { label: '25%', val: Number((subtotal * 0.25).toFixed(2)) },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-gray-200 shadow-2xl flex flex-col justify-between text-[#111827] z-10">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between gap-3 bg-white">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-orange-50 border border-orange-200 text-[#F97316]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#111827]">Your Cart</h2>
                <p className="text-xs text-[#64748B]">
                  {restaurantName ? `From ${restaurantName}` : `${cartItems.length} items`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-[#64748B] hover:text-[#111827] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 mx-auto flex items-center justify-center text-[#F97316]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-[#111827]">Your cart is empty</p>
                <p className="text-xs text-[#64748B] max-w-xs mx-auto">
                  Browse top restaurants near you and add delicious dishes to get started!
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs shadow-sm transition-colors"
                >
                  Explore Restaurants
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-gray-200 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="text-xs sm:text-sm font-bold text-[#111827]">
                        {item.menuItem.name}
                      </h4>
                      <p className="text-xs font-bold text-[#F97316] mt-0.5">
                        ${item.totalPrice.toFixed(2)}
                      </p>
                      
                      {/* Selected Custom Options */}
                      {item.selectedOptions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {item.selectedOptions.map((opt) => (
                            <span
                              key={opt.optionId}
                              className="text-[10px] bg-white border border-gray-200 text-[#64748B] px-2 py-0.5 rounded-md"
                            >
                              + {opt.optionName} {opt.price > 0 ? `($${opt.price.toFixed(2)})` : ''}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Special instructions */}
                      {item.specialInstructions && (
                        <p className="text-[11px] text-[#F97316] italic mt-1">
                          Note: "{item.specialInstructions}"
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-[#64748B] hover:text-red-500 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity Modifier */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-[11px] text-[#64748B] font-medium">Quantity</span>
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-2 py-1">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded text-[#64748B] hover:text-[#111827]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-[#111827] min-w-[16px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded text-[#64748B] hover:text-[#111827]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {cartItems.length > 0 && (
              <>
                {/* Promo Code Input */}
                <form onSubmit={handleApplyCodeSubmit} className="pt-2 space-y-1.5">
                  <label className="block text-xs font-bold text-[#111827] flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-[#F97316]" /> Have a promo code?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      placeholder="e.g. CRAVE20, WELCOME50"
                      className="flex-1 bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#111827] placeholder-[#64748B] focus:outline-none focus:border-[#F97316] uppercase font-bold tracking-wider"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                    >
                      Apply
                    </button>
                  </div>
                  {promoMessage && (
                    <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {promoMessage}
                    </p>
                  )}
                </form>

                {/* Driver Tip Selection */}
                <div className="pt-2 space-y-2">
                  <label className="block text-xs font-bold text-[#111827] flex items-center gap-1">
                    <HeartHandshake className="w-3.5 h-3.5 text-[#F97316]" /> Driver Tip
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {tipPresets.map((t) => (
                      <button
                        key={t.label}
                        type="button"
                        onClick={() => onChangeTip(t.val)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
                          tip === t.val
                            ? 'bg-[#F97316] text-white shadow-sm'
                            : 'bg-slate-100 text-[#64748B] hover:bg-slate-200'
                        }`}
                      >
                        {t.label} (${t.val.toFixed(2)})
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Pricing Breakdown & Checkout Button */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-gray-200 bg-white space-y-3 shrink-0 shadow-sm">
              <div className="space-y-1.5 text-xs text-[#64748B]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#111827]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className={deliveryFee === 0 ? 'text-[#F97316] font-bold' : ''}>
                    {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Driver Tip</span>
                  <span className="text-[#F97316] font-semibold">${tip.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#F97316] font-bold">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-[#111827] pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-[#F97316]">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                id="cart-drawer-checkout-btn"
                onClick={onProceedToCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-sm shadow-sm active:scale-98 transition-all flex items-center justify-between"
              >
                <span>Proceed to Checkout</span>
                <div className="flex items-center gap-1">
                  <span>${total.toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </div>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
