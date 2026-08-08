import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Clock, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Navigation, 
  ShoppingBag, 
  RotateCcw,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Bike
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface LiveOrderTrackerProps {
  order: Order | null;
  onClose: () => void;
  onReorder: (order: Order) => void;
}

export const LiveOrderTracker: React.FC<LiveOrderTrackerProps> = ({
  order,
  onClose,
  onReorder,
}) => {
  if (!order) return null;

  // Active status simulation index: 0=placed, 1=confirmed, 2=preparing, 3=on_the_way, 4=delivered
  const [statusIndex, setStatusIndex] = useState<number>(() => {
    const statusOrder: OrderStatus[] = ['placed', 'confirmed', 'preparing', 'on_the_way', 'delivered'];
    return Math.max(0, statusOrder.indexOf(order.status));
  });

  const [driverPos, setDriverPos] = useState({ x: 20, y: 70 }); // percentages on map

  const statuses: { id: OrderStatus; label: string; subtext: string }[] = [
    { id: 'placed', label: 'Order Sent', subtext: 'Received by kitchen' },
    { id: 'confirmed', label: 'Confirmed', subtext: 'Accepted by restaurant' },
    { id: 'preparing', label: 'Kitchen Cooking', subtext: 'Chef is preparing your meal' },
    { id: 'on_the_way', label: 'Out for Delivery', subtext: 'Driver Alex is en route' },
    { id: 'delivered', label: 'Delivered', subtext: 'Enjoy your hot meal!' },
  ];

  // Animate driver position along simulated road path when "on_the_way" or progressing
  useEffect(() => {
    if (statusIndex === 3) {
      const interval = setInterval(() => {
        setDriverPos((prev) => {
          if (prev.x >= 75) return { x: 75, y: 30 };
          return { x: prev.x + 1.5, y: prev.y - 0.8 };
        });
      }, 400);
      return () => clearInterval(interval);
    } else if (statusIndex === 4) {
      setDriverPos({ x: 80, y: 25 }); // at destination
    }
  }, [statusIndex]);

  const handleAdvanceStatus = () => {
    if (statusIndex < statuses.length - 1) {
      setStatusIndex(statusIndex + 1);
    }
  };

  const currentStep = statuses[statusIndex];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[95vh]">
        
        {/* Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Clock className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100">Live Order Status</h2>
                <span className="text-xs font-mono font-bold bg-slate-800 text-amber-400 px-2 py-0.5 rounded">
                  #{order.id}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                From <strong className="text-slate-200">{order.restaurantName}</strong> • {order.createdAt}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          
          {/* Status Stepper Progress Bar */}
          <div className="bg-slate-800/80 border border-slate-700/80 p-4 sm:p-5 rounded-2xl space-y-4">
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                  Current Status
                </span>
                <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
                  <span>{currentStep.label}</span>
                  <span className="text-xs font-semibold text-slate-400">({currentStep.subtext})</span>
                </h3>
              </div>

              {/* Simulation button to test progress */}
              {statusIndex < statuses.length - 1 && (
                <button
                  onClick={handleAdvanceStatus}
                  className="px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md transition-all active:scale-95"
                  title="Advance tracking state for interactive testing"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Simulate Next Stage</span>
                  <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              )}
            </div>

            {/* Stepper Dots & Line */}
            <div className="relative pt-2 pb-2">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-700 -translate-y-1/2 rounded-full z-0" />
              <div 
                className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-amber-500 to-emerald-500 -translate-y-1/2 rounded-full z-0 transition-all duration-500"
                style={{ width: `${(statusIndex / (statuses.length - 1)) * 100}%` }}
              />

              <div className="relative z-10 flex justify-between">
                {statuses.map((step, idx) => {
                  const isDone = idx < statusIndex;
                  const isCurrent = idx === statusIndex;

                  return (
                    <div key={step.id} className="flex flex-col items-center text-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isDone
                            ? 'bg-emerald-500 text-slate-950'
                            : isCurrent
                            ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/30 scale-110'
                            : 'bg-slate-800 border border-slate-700 text-slate-500'
                        }`}
                      >
                        {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                      </div>
                      <span className={`text-[10px] font-bold mt-2 max-w-[65px] leading-tight ${isCurrent ? 'text-amber-400' : isDone ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Interactive Simulated GPS Map */}
          <div className="relative h-64 sm:h-72 w-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-inner">
            
            {/* Dark Styled Map Roads Overlay SVG */}
            <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 0 180 Q 200 120 400 180 T 800 100" fill="none" stroke="#64748b" strokeWidth="12" strokeLinecap="round" />
              <path d="M 150 0 L 150 300" fill="none" stroke="#475569" strokeWidth="8" />
              <path d="M 450 0 L 450 300" fill="none" stroke="#475569" strokeWidth="8" />
              <path d="M 0 80 L 800 80" fill="none" stroke="#475569" strokeWidth="6" />
            </svg>

            {/* Restaurant Pin */}
            <div className="absolute left-[15%] top-[65%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-bold text-slate-200 mb-1 shadow">
                {order.restaurantName}
              </div>
              <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-lg">
                <ShoppingBag className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Destination User Pin */}
            <div className="absolute left-[80%] top-[25%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px] font-bold mb-1 shadow">
                Your Address
              </div>
              <div className="w-7 h-7 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center font-bold shadow-lg">
                <MapPin className="w-4 h-4 fill-slate-950" />
              </div>
            </div>

            {/* Animated Driver Marker */}
            <div 
              className="absolute transition-all duration-500 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20"
              style={{ left: `${driverPos.x}%`, top: `${driverPos.y}%` }}
            >
              <div className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-extrabold uppercase tracking-wider mb-1 shadow-lg animate-bounce">
                Driver Alex
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-orange-500 text-white flex items-center justify-center shadow-xl ring-4 ring-rose-500/30">
                <Bike className="w-5 h-5" />
              </div>
            </div>

            {/* Live ETA Banner over Map */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-200 shadow-lg">
              <Navigation className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>
                {statusIndex === 4 ? 'Order Delivered!' : `Estimated Arrival: ~${Math.max(2, 20 - statusIndex * 4)} mins`}
              </span>
            </div>

          </div>

          {/* Driver Info Card */}
          {order.driver && (
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={order.driver.photo}
                  alt={order.driver.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-500 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-100">{order.driver.name}</h4>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.2 rounded">
                      ★ {order.driver.rating}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{order.driver.vehicle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${order.driver.phone}`}
                  className="p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                  title="Call Driver"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                </a>
                <button
                  className="p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                  title="Message Driver"
                  onClick={() => alert(`Messaging Driver ${order.driver?.name}: "I'm waiting at the front door!"`)}
                >
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>
          )}

          {/* Itemized Order Receipt Details */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Ordered Items
            </h4>
            <div className="divide-y divide-slate-700/40 text-xs">
              {order.items.map((item) => (
                <div key={item.id} className="py-2 flex items-center justify-between text-slate-300">
                  <div>
                    <span className="font-bold text-slate-100">{item.quantity}x</span> {item.menuItem.name}
                    {item.selectedOptions.length > 0 && (
                      <span className="block text-[10px] text-slate-400">
                        {item.selectedOptions.map(o => o.optionName).join(', ')}
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-slate-200">${item.totalPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-700 flex justify-between text-sm font-black text-slate-100">
              <span>Total Paid</span>
              <span className="text-amber-400">${order.total.toFixed(2)}</span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Need help with this order? Contact Support 24/7</span>
          </div>

          <button
            onClick={() => onReorder(order)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Order Again</span>
          </button>
        </div>

      </div>
    </div>
  );
};
