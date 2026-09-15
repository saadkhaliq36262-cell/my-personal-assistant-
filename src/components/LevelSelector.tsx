'use client';

import React from 'react';
import { Check, Layers } from 'lucide-react';
import { EnglishLevel } from '@/types';
import { ENGLISH_LEVELS } from '@/lib/constants';

interface LevelSelectorProps {
  currentLevel: EnglishLevel;
  onSelectLevel: (level: EnglishLevel) => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  currentLevel,
  onSelectLevel,
}) => {
  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-800 tracking-tight">
            Select Your English Level
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Adapts vocabulary & feedback difficulty
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {ENGLISH_LEVELS.map((item) => {
          const isSelected = currentLevel === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectLevel(item.id)}
              className={`relative text-left p-4 rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-white border-indigo-600 ring-2 ring-indigo-600/10 shadow-md shadow-indigo-600/5'
                  : 'bg-white hover:bg-slate-50/80 border-slate-200/90 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900 text-sm">{item.label}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.tag}
                  </span>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-2">
                {item.description}
              </p>

              <div className="text-[11px] text-indigo-700 font-medium bg-indigo-50/70 px-2 py-1 rounded-lg">
                🎯 {item.focus}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};