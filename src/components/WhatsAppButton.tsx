'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [customNumber, setCustomNumber] = useState(phoneNumber);
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  // Default pre-filled message requested by user
  const defaultMessage = 'Hi, I have a question about My English Coach.';

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    // If no phone number is configured yet, prompt user or open with default
    const activeNumber = customNumber || localStorage.getItem('my_english_coach_whatsapp') || '';

    if (!activeNumber || activeNumber.includes('PASTE')) {
      e.preventDefault();
      setIsPromptOpen(true);
      return;
    }

    const cleanNumber = activeNumber.replace(/[^\d+]/g, '').replace('+', '');
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSaveNumber = (e: React.FormEvent) => {
    e.preventDefault();
    if (customNumber) {
      localStorage.setItem('my_english_coach_whatsapp', customNumber);
      setIsPromptOpen(false);
      const cleanNumber = customNumber.replace(/[^\d+]/g, '').replace('+', '');
      const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(defaultMessage)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      {/* Floating WhatsApp Action Button */}
      <div className="fixed bottom-28 sm:bottom-6 right-4 sm:right-6 z-30 flex items-center">
        {/* Hover Tooltip (Desktop) */}
        {showTooltip && (
          <div className="hidden sm:block mr-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-lg whitespace-nowrap animate-fadeIn">
            Chat with us on WhatsApp
            <div className="absolute right-0 top-1/2 -mr-1 -mt-1 w-2 h-2 bg-slate-900 transform rotate-45" />
          </div>
        )}

        <button
          onClick={handleWhatsAppClick}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 group"
          title="Chat with us on WhatsApp"
          aria-label="Chat with us on WhatsApp"
        >
          {/* WhatsApp SVG Icon */}
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7 fill-current transition-transform group-hover:scale-110"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413z" />
          </svg>
        </button>
      </div>

      {/* Number Configuration Modal (if user hasn't set their WhatsApp number) */}
      {isPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
            <button
              onClick={() => setIsPromptOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center mb-3">
              <MessageCircle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              WhatsApp Support Number
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Enter your WhatsApp number with country code (e.g. +1234567890 or 1234567890) to connect the support button.
            </p>

            <form onSubmit={handleSaveNumber} className="space-y-3">
              <input
                type="text"
                required
                placeholder="+1 234 567 890"
                value={customNumber}
                onChange={(e) => setCustomNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#25D366]"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsPromptOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20bd5a] rounded-xl shadow-sm"
                >
                  Connect & Open Chat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
