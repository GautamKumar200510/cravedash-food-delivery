import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Utensils, 
  ArrowRight, 
  Flame, 
  DollarSign, 
  Plus, 
  CheckCircle2,
  ChefHat
} from 'lucide-react';
import { Restaurant, MenuItem } from '../types';

interface AiRecommendationDish {
  dishName: string;
  restaurantName: string;
  restaurantId: string;
  price: number;
  reason: string;
}

interface AiRecommendationResult {
  title: string;
  summary: string;
  dishes: AiRecommendationDish[];
}

interface AiFoodAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurants: Restaurant[];
  onSelectRestaurantById: (id: string) => void;
  onQuickAddToCart: (item: MenuItem) => void;
}

export const AiFoodAssistantModal: React.FC<AiFoodAssistantModalProps> = ({
  isOpen,
  onClose,
  restaurants,
  onSelectRestaurantById,
  onQuickAddToCart,
}) => {
  const [prompt, setPrompt] = useState('');
  const [dietary, setDietary] = useState('none');
  const [budget, setBudget] = useState<number>(25);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<AiRecommendationResult | null>(null);

  if (!isOpen) return null;

  const presetQueries = [
    "Juicy spicy smash burger under $18",
    "Healthy high-protein salmon bowl",
    "Woodfired pizza with truffle glaze",
    "Fresh salmon sushi rolls & ramen",
    "Crispy birria tacos with consomé"
  ];

  const handleFetchAiRecommendation = async (userQuery?: string) => {
    const q = userQuery || prompt;
    if (!q.trim()) return;

    setIsLoading(true);
    setRecommendation(null);

    try {
      const res = await fetch('/api/ai-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: q,
          dietaryPreference: dietary,
          maxBudget: budget,
        }),
      });

      const data = await res.json();
      if (data.success && data.recommendation) {
        setRecommendation(data.recommendation);
      }
    } catch (err) {
      console.error('Error getting AI recommendation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRecommendedDish = (dish: AiRecommendationDish) => {
    const rest = restaurants.find((r) => r.id === dish.restaurantId || r.name.toLowerCase().includes(dish.restaurantName.toLowerCase()));
    if (rest) {
      const item = rest.menuItems.find((m) => m.name.toLowerCase().includes(dish.dishName.toLowerCase()));
      if (item) {
        onQuickAddToCart(item);
        return;
      }
    }
    // If exact item match not found, navigate to restaurant
    if (dish.restaurantId) {
      onSelectRestaurantById(dish.restaurantId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#F97316] shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#111827]">AI Culinary Assistant</h2>
                <span className="text-[10px] font-bold uppercase bg-orange-50 text-[#F97316] px-2 py-0.5 rounded border border-orange-200">
                  Gemini AI
                </span>
              </div>
              <p className="text-xs text-[#64748B]">Personalized dish recommendations based on your cravings & budget</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-[#64748B] hover:text-[#111827] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-[#111827]">
          
          {/* Preset Craving Chips */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider">
              Quick Craving Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {presetQueries.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setPrompt(preset);
                    handleFetchAiRecommendation(preset);
                  }}
                  className="px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-gray-200 text-xs font-semibold text-[#64748B] hover:text-[#111827] transition-all text-left flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3 h-3 text-[#F97316] shrink-0" />
                  <span>{preset}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Budget & Diet Preferences */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Dietary Preference
              </label>
              <select
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#F97316]"
              >
                <option value="none">No Restrictions (Anything)</option>
                <option value="vegetarian">Vegetarian Only 🌿</option>
                <option value="vegan">Vegan Only 🌱</option>
                <option value="gluten_free">Gluten-Free 🌾</option>
                <option value="spicy">Spicy Cravings 🌶️</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Max Budget: ${budget}
              </label>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-[#F97316] bg-slate-200 cursor-pointer"
              />
            </div>
          </div>

          {/* Prompt Input Box */}
          <div className="relative">
            <textarea
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to eat (e.g. 'I want something spicy and rich with noodles or rice')..."
              className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3.5 pr-12 text-xs text-[#111827] placeholder-[#64748B] focus:outline-none focus:border-[#F97316] resize-none"
            />
            <button
              onClick={() => handleFetchAiRecommendation()}
              disabled={isLoading || !prompt.trim()}
              className="absolute right-3 bottom-4 p-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold disabled:opacity-40 transition-all shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Loading Animation State */}
          {isLoading && (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 text-[#F97316] flex items-center justify-center mx-auto animate-bounce">
                <ChefHat className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-[#111827]">Consulting AI Chef...</p>
              <p className="text-xs text-[#64748B]">Searching partner menus matching your exact craving</p>
            </div>
          )}

          {/* AI Recommendation Result View */}
          {recommendation && !isLoading && (
            <div className="space-y-4 pt-2 border-t border-gray-200 animate-fadeIn">
              <div className="p-4 rounded-xl bg-orange-50/80 border border-orange-200">
                <h3 className="text-sm font-bold text-[#111827] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#F97316]" />
                  <span>{recommendation.title}</span>
                </h3>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  {recommendation.summary}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                  Recommended Dishes
                </h4>
                {recommendation.dishes.map((dish, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white border border-gray-200 flex items-start justify-between gap-3 group hover:border-orange-300 transition-all shadow-sm"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs sm:text-sm font-bold text-[#111827] group-hover:text-[#F97316] transition-colors">
                          {dish.dishName}
                        </h5>
                        <span className="text-xs font-bold text-[#F97316]">
                          ${dish.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-[#64748B]">
                        from {dish.restaurantName}
                      </p>
                      <p className="text-xs text-[#64748B] mt-1 leading-normal">
                        "{dish.reason}"
                      </p>
                    </div>

                    <button
                      onClick={() => handleAddRecommendedDish(dish)}
                      className="px-3 py-1.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs shrink-0 flex items-center gap-1 active:scale-95 transition-all shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Add Dish</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
