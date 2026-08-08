import React, { useState } from 'react';
import { X, MapPin, Plus, Check } from 'lucide-react';
import { UserAddress } from '../types';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: UserAddress[];
  currentAddress: UserAddress;
  onSelectAddress: (addr: UserAddress) => void;
  onAddNewAddress: (addr: UserAddress) => void;
}

export const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  addresses,
  currentAddress,
  onSelectAddress,
  onAddNewAddress,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [label, setLabel] = useState<'Home' | 'Work' | 'Gym' | 'Other'>('Home');
  const [street, setStreet] = useState('');
  const [apt, setApt] = useState('');
  const [city, setCity] = useState('Springfield');
  const [zip, setZip] = useState('97477');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!street.trim()) return;

    const newAddr: UserAddress = {
      id: `addr-${Date.now()}`,
      label,
      street: street.trim(),
      apt: apt.trim(),
      city: city.trim(),
      zip: zip.trim(),
      deliveryNotes: notes.trim(),
    };

    onAddNewAddress(newAddr);
    onSelectAddress(newAddr);
    setShowAddForm(false);
    setStreet('');
    setApt('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-base font-bold text-[#111827] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#F97316]" />
              <span>Select Delivery Address</span>
            </h2>
            <p className="text-xs text-[#64748B]">Where should we deliver your order?</p>
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
          {!showAddForm ? (
            <>
              <div className="space-y-2.5">
                {addresses.map((addr) => {
                  const isSelected = currentAddress.id === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => {
                        onSelectAddress(addr);
                        onClose();
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                        isSelected
                          ? 'bg-orange-50 border-orange-300 text-[#111827] shadow-sm'
                          : 'bg-white hover:bg-slate-50 border-gray-200 text-[#111827]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl mt-0.5 ${isSelected ? 'bg-[#F97316] text-white' : 'bg-slate-100 text-[#64748B]'}`}>
                          <MapPin className="w-4 h-4" />
                        </div>
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
                          {addr.deliveryNotes && (
                            <p className="text-[11px] text-[#64748B] italic mt-1">
                              Note: "{addr.deliveryNotes}"
                            </p>
                          )}
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#F97316] shrink-0" />}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setShowAddForm(true)}
                className="w-full py-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-gray-200 text-[#F97316] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Delivery Address</span>
              </button>
            </>
          ) : (
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-4 gap-2">
                {(['Home', 'Work', 'Gym', 'Other'] as const).map((lbl) => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => setLabel(lbl)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      label === lbl
                        ? 'bg-[#F97316] text-white border-[#F97316]'
                        : 'bg-white text-[#64748B] border-gray-200 hover:bg-slate-50'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. 123 Main Street"
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#F97316]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Apt / Suite</label>
                  <input
                    type="text"
                    value={apt}
                    onChange={(e) => setApt(e.target.value)}
                    placeholder="Apt 2B"
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#F97316]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#F97316]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">ZIP Code</label>
                  <input
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#F97316]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">Driver Notes (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Gate code #4021"
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#F97316]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#64748B] font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs shadow-sm"
                >
                  Save & Use Address
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
