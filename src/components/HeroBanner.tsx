import React from 'react';
import { Sparkles, ShieldCheck, Flame, Tag, ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  onSelectCategory: (catId: string) => void;
  onOpenAiAssistant: () => void;
  onApplyPromoCode: (code: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSelectCategory,
  onOpenAiAssistant,
  onApplyPromoCode,
}) => {
  return (
    <div className="relative overflow-hidden bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Main Headline */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#F97316] text-xs font-semibold shadow-sm">
              <Flame className="w-3.5 h-3.5 text-[#F97316] fill-[#F97316]" />
              <span>Express 20-Min Delivery</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#111827] tracking-tight leading-tight">
              Satisfy Your Cravings <br className="hidden sm:inline" />
              <span className="text-[#F97316]">
                Delivered Hot & Fresh
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#64748B] max-w-xl font-normal leading-relaxed">
              Order from top artisan kitchens, woodfired pizzerias, and sushi bars near you. Track your driver live with turn-by-turn updates.
            </p>

            {/* AI Callout Widget */}
            <div className="pt-1">
              <div 
                onClick={onOpenAiAssistant}
                className="group cursor-pointer max-w-xl p-4 rounded-2xl bg-slate-50 hover:bg-orange-50/60 border border-gray-200 hover:border-orange-300 transition-all flex items-center justify-between gap-4 shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#F97316] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#111827] flex items-center gap-2">
                      <span>AI Culinary Assistant</span>
                      <span className="text-[10px] bg-orange-100 text-[#F97316] px-1.5 py-0.5 rounded font-semibold">Gemini Powered</span>
                    </p>
                    <p className="text-xs text-[#64748B]">
                      Not sure what to eat? Tell us your budget & mood for smart meal picks.
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#F97316] group-hover:translate-x-1 transition-transform shrink-0" />
              </div>
            </div>

          </div>

          {/* Special Vouchers & Deal Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
            
            {/* Promo Card 1 */}
            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#F97316] bg-orange-50 px-2 py-0.5 rounded-md mb-1.5">
                    <Tag className="w-3 h-3" /> Special Voucher
                  </span>
                  <h3 className="text-base font-bold text-[#111827]">20% OFF Everything</h3>
                  <p className="text-xs text-[#64748B] mt-0.5">Valid on orders $20+ across all restaurants</p>
                </div>
                <button
                  onClick={() => onApplyPromoCode('CRAVE20')}
                  className="px-3.5 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold text-xs shrink-0 active:scale-95 transition-all shadow-sm"
                >
                  CRAVE20
                </button>
              </div>
            </div>

            {/* Promo Card 2 */}
            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#F97316] bg-orange-50 px-2 py-0.5 rounded-md mb-1.5">
                    <ShieldCheck className="w-3 h-3" /> Welcome Deal
                  </span>
                  <h3 className="text-base font-bold text-[#111827]">50% OFF First Order</h3>
                  <p className="text-xs text-[#64748B] mt-0.5">Use on your first food delivery checkout</p>
                </div>
                <button
                  onClick={() => onApplyPromoCode('WELCOME50')}
                  className="px-3.5 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold text-xs shrink-0 active:scale-95 transition-all shadow-sm"
                >
                  WELCOME50
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
