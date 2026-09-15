'use client';

import React from 'react';
import { ActiveNavTab } from '@/types';

interface FooterProps {
  onSelectTab: (tab: ActiveNavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="mt-20 border-t border-slate-200/80 bg-white/60 backdrop-blur-sm py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white text-lg shadow-md">
              🎙️
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                My English Coach
              </h3>
              <p className="text-xs text-slate-500">
                Personal AI English Speaking Tutor & Fluency Partner
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-6 text-xs font-semibold text-slate-600">
            <button
              onClick={() => onSelectTab('practice')}
              className="hover:text-indigo-600 transition-colors"
            >
              Practice
            </button>
            <button
              onClick={() => onSelectTab('topics')}
              className="hover:text-indigo-600 transition-colors"
            >
              Topics
            </button>
            <button
              onClick={() => onSelectTab('progress')}
              className="hover:text-indigo-600 transition-colors"
            >
              Progress
            </button>
            <button
              onClick={() => onSelectTab('vocabulary')}
              className="hover:text-indigo-600 transition-colors"
            >
              Vocabulary
            </button>
          </div>

          {/* AI Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200/80">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Powered by Gemini 2.5 AI</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>© {new Date().getFullYear()} My English Coach. Designed for English learners worldwide.</p>
          <p className="text-slate-500">Interactive Speaking • Instant Grammar Feedback • Vocabulary Notebook</p>
        </div>
      </div>
    </footer>
  );
};
