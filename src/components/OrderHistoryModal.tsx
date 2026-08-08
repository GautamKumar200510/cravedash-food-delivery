import React from 'react';
import { X, Clock, RotateCcw, ShoppingBag, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Order } from '../types';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onReorder: (order: Order) => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  orders,
  onSelectOrder,
  onReorder,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-base font-bold text-[#111827] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#F97316]" />
              <span>Your Order History</span>
            </h2>
            <p className="text-xs text-[#64748B]">View past orders and re-order in 1 click</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-[#64748B] hover:text-[#111827] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-[#111827]">
          {orders.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 mx-auto flex items-center justify-center text-[#F97316]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-sm font-bold text-[#111827]">No past orders yet</p>
              <p className="text-xs text-[#64748B] max-w-xs mx-auto">
                Place your first food delivery order to view history and live tracking status!
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-xl bg-slate-50 border border-gray-200 space-y-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={order.restaurantLogo}
                      alt={order.restaurantName}
                      className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-gray-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-[#111827]">{order.restaurantName}</h4>
                      <p className="text-xs text-[#64748B]">#{order.id} • {order.createdAt}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                    order.status === 'delivered'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-orange-50 text-[#F97316] border border-orange-200 animate-pulse'
                  }`}>
                    {order.status === 'delivered' ? 'Delivered' : 'In Progress'}
                  </span>
                </div>

                <div className="text-xs text-[#64748B] space-y-1 bg-white p-3 rounded-xl border border-gray-100">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.quantity}x {item.menuItem.name}</span>
                      <span className="font-semibold text-[#111827]">${item.totalPrice.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-[#111827] pt-1.5 border-t border-gray-100">
                    <span>Total Amount</span>
                    <span className="text-[#F97316]">${order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => {
                      onSelectOrder(order);
                      onClose();
                    }}
                    className="text-xs font-bold text-[#F97316] hover:underline flex items-center gap-1"
                  >
                    <span>View Tracking Status</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      onReorder(order);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs flex items-center gap-1 transition-all shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reorder All</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
