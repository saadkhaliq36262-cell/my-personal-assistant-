'use client';

import React from 'react';
import { Compass, Check, ArrowRight, MessageCircle } from 'lucide-react';
import { PracticeTopic } from '@/types';
import { PRACTICE_TOPICS } from '@/lib/constants';

interface TopicGridProps {
  currentTopic: PracticeTopic;
  onSelectTopic: (topic: PracticeTopic) => void;
  onStartChat: (starterText?: string) => void;
}

export const TopicGrid: React.FC<TopicGridProps> = ({
  currentTopic,
  onSelectTopic,
  onStartChat,
}) => {
  return (
    <div className="w-full mb-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 px-1">
        <div>
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-indigo-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Practice Conversation Topics
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Choose a scenario to practice specialized vocabulary and questions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PRACTICE_TOPICS.map((item) => {
          const isSelected = currentTopic === item.id;
          return (
            <div
              key={item.id}
              className={`flex flex-col justify-between p-5 rounded-3xl border transition-all ${
                isSelected
                  ? 'bg-white border-indigo-600 ring-2 ring-indigo-600/10 shadow-md shadow-indigo-600/5'
                  : 'bg-white hover:bg-slate-50/70 border-slate-200/90 shadow-sm'
              }`}
            >
              <div>
                {/* Top icon and category */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl p-2 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm">
                    {item.icon}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {item.category}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    onSelectTopic(item.id);
                    onStartChat();
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{isSelected ? 'Continue Practice' : 'Select Topic'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};