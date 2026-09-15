'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { SUGGESTED_REPLIES } from '@/lib/constants';

interface SuggestedRepliesProps {
  onSelectReply: (text: string) => void;
  disabled?: boolean;
}

export const SuggestedReplies: React.FC<SuggestedRepliesProps> = ({
  onSelectReply,
  disabled = false,
}) => {
  return (
    <div className="w-full flex items-center space-x-2 overflow-x-auto pb-1.5 scrollbar-none mb-2 px-1">
      <div className="flex items-center space-x-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex-shrink-0">
        <Sparkles className="w-3 h-3 text-indigo-600" />
        <span className="hidden xs:inline">Quick replies:</span>
      </div>
      <div className="flex items-center space-x-1.5 flex-nowrap">
        {SUGGESTED_REPLIES.map((reply, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelectReply(reply)}
            className="whitespace-nowrap px-3 py-1 rounded-full bg-white hover:bg-indigo-50/80 border border-slate-200/90 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 text-xs font-medium transition-all shadow-2xs disabled:opacity-50 disabled:pointer-events-none"
          >
            {reply}
          </button>
        ))}
      </div>
    </div>
  );
};