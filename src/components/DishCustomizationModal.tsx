import React, { useState, useMemo } from 'react';
import { X, Plus, Minus, Check, Flame, Leaf, Sparkles } from 'lucide-react';
import { MenuItem, SelectedOption } from '../types';

interface DishCustomizationModalProps {
  item: MenuItem;
  onClose: () => void;
  onAddToCart: (item: MenuItem, selectedOptions: SelectedOption[], specialInstructions: string, quantity: number) => void;
}

export const DishCustomizationModal: React.FC<DishCustomizationModalProps> = ({
  item,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Track selected options: groupId -> SelectedOption[]
  const [selectedOptionsMap, setSelectedOptionsMap] = useState<Record<string, SelectedOption[]>>(() => {
    const initial: Record<string, SelectedOption[]> = {};
    if (item.customizationGroups) {
      item.customizationGroups.forEach((group) => {
        const defaultChoice = group.options.find((opt) => opt.isDefault) || group.options[0];
        if (defaultChoice && group.required) {
          initial[group.id] = [{
            groupId: group.id,
            groupTitle: group.title,
            optionId: defaultChoice.id,
            optionName: defaultChoice.name,
            price: defaultChoice.price,
          }];
        } else {
          initial[group.id] = [];
        }
      });
    }
    return initial;
  });

  const handleToggleOption = (groupId: string, groupTitle: string, optionId: string, optionName: string, price: number, isRadio: boolean) => {
    setSelectedOptionsMap((prev) => {
      const current = prev[groupId] || [];
      if (isRadio) {
        return {
          ...prev,
          [groupId]: [{ groupId, groupTitle, optionId, optionName, price }],
        };
      } else {
        const exists = current.some((opt) => opt.optionId === optionId);
        if (exists) {
          return {
            ...prev,
            [groupId]: current.filter((opt) => opt.optionId !== optionId),
          };
        } else {
          return {
            ...prev,
            [groupId]: [...current, { groupId, groupTitle, optionId, optionName, price }],
          };
        }
      }
    });
  };

  const allSelectedOptionsList = useMemo(() => {
    return Object.values(selectedOptionsMap).flat();
  }, [selectedOptionsMap]);

  const unitPrice = useMemo(() => {
    const optionsTotal = allSelectedOptionsList.reduce((acc, opt) => acc + opt.price, 0);
    return item.price + optionsTotal;
  }, [item.price, allSelectedOptionsList]);

  const totalPrice = unitPrice * quantity;

  const handleConfirmAdd = () => {
    onAddToCart(item, allSelectedOptionsList, specialInstructions, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header Photo */}
        <div className="relative h-48 w-full bg-slate-100 shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-[#111827] backdrop-blur-md transition-colors shadow-md"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              {item.isVegetarian && (
                <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  <Leaf className="w-3 h-3" /> Veg
                </span>
              )}
              {item.isSpicy && (
                <span className="inline-flex items-center gap-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  <Flame className="w-3 h-3" /> Spicy
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white">{item.name}</h2>
            <p className="text-xs text-slate-200 line-clamp-2 mt-0.5">{item.description}</p>
          </div>
        </div>

        {/* Customization Options List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-[#111827]">
          
          {item.customizationGroups?.map((group) => {
            const isRadio = (group.maxChoices || 1) === 1;
            const currentSelected = selectedOptionsMap[group.id] || [];

            return (
              <div key={group.id} className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                    <span>{group.title}</span>
                    {group.required && (
                      <span className="text-[10px] uppercase font-bold text-[#F97316] bg-orange-50 px-2 py-0.5 rounded">
                        Required
                      </span>
                    )}
                  </h3>
                  <span className="text-xs text-[#64748B]">
                    {isRadio ? 'Select 1' : 'Optional extras'}
                  </span>
                </div>

                <div className="space-y-2">
                  {group.options.map((opt) => {
                    const isSelected = currentSelected.some((s) => s.optionId === opt.id);

                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleToggleOption(group.id, group.title, opt.id, opt.name, opt.price, isRadio)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-orange-50 border-orange-300 text-[#111827] shadow-sm'
                            : 'bg-white hover:bg-slate-50 border-gray-200 text-[#111827]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-${isRadio ? 'full' : 'md'} flex items-center justify-center border transition-all ${
                              isSelected
                                ? 'bg-[#F97316] border-[#F97316] text-white'
                                : 'border-gray-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className="text-xs sm:text-sm font-medium">{opt.name}</span>
                        </div>
                        <span className="text-xs font-bold text-[#64748B]">
                          {opt.price === 0 ? 'Free' : `+$${opt.price.toFixed(2)}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Special Instructions Note */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#111827]">
              Special Instructions for Kitchen (Optional)
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Extra sauce on side, light salt, allergies..."
              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#111827] placeholder-[#64748B] focus:outline-none focus:border-[#F97316]"
            />
          </div>

        </div>

        {/* Modal Footer: Quantity & Add Button */}
        <div className="p-4 border-t border-gray-200 bg-white flex items-center justify-between gap-4 shrink-0 shadow-sm">
          
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 bg-slate-100 border border-gray-200 rounded-xl px-3 py-1.5">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1 rounded-lg text-[#64748B] hover:text-[#111827] hover:bg-slate-200 disabled:opacity-40"
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-[#111827] min-w-[20px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 rounded-lg text-[#64748B] hover:text-[#111827] hover:bg-slate-200"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add To Cart Submit Button */}
          <button
            onClick={handleConfirmAdd}
            className="flex-1 flex items-center justify-between px-5 py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs sm:text-sm shadow-sm active:scale-98 transition-all"
          >
            <span>Add to Cart</span>
            <span>${totalPrice.toFixed(2)}</span>
          </button>

        </div>

      </div>
    </div>
  );
};
