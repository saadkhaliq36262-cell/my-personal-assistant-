'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Settings as SettingsIcon,
  Clock,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { EnglishLevel, PracticeTopic, PracticeGoalMinutes, ActiveNavTab } from '@/types';
import { ENGLISH_LEVELS, PRACTICE_GOALS } from '@/lib/constants';

interface HeaderProps {
  activeTab: ActiveNavTab;
  onTabChange: (tab: ActiveNavTab) => void;
  level: EnglishLevel;
  onLevelChange: (level: EnglishLevel) => void;
  topic: PracticeTopic;
  formattedTime: string;
  goalMinutes: PracticeGoalMinutes;
  progressPercent: number;
  goalReached: boolean;
  onOpenSettings: () => void;
  onClearChat: () => void;
  onGoalChange: (goal: PracticeGoalMinutes) => void;
  onEndSession: () => void;
  messagesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  level,
  onLevelChange,
  formattedTime,
  goalMinutes,
  progressPercent,
  goalReached,
  onOpenSettings,
  onClearChat,
  onGoalChange,
  onEndSession,
  messagesCount,
}) => {
  const [isLevelMenuOpen, setIsLevelMenuOpen] = useState(false);
  const [isGoalMenuOpen, setIsGoalMenuOpen] = useState(false);

  const activeLevelObj = ENGLISH_LEVELS.find((l) => l.id === level) || ENGLISH_LEVELS[1];

  const tabs: { id: ActiveNavTab; label: string; icon: string }[] = [
    { id: 'practice', label: 'Practice', icon: '🎙️' },
    { id: 'topics', label: 'Topics', icon: '🗂️' },
    { id: 'progress', label: 'Progress', icon: '📊' },
    { id: 'vocabulary', label: 'Vocabulary', icon: '📚' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onTabChange('practice')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                  My English Coach
                </span>
                <span className="hidden md:inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  AI 2.5
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Personal AI Speaking Tutor
              </p>
            </div>
          </button>
        </div>

        {/* Center Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/60">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Area */}
        <div className="flex items-center gap-2">
          {/* Practice Session Timer */}
          <div className="relative">
            <button
              onClick={() => setIsGoalMenuOpen(!isGoalMenuOpen)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                goalReached
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
              title="Practice duration & daily goal"
            >
              {goalReached ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
              )}
              <span className="tabular-nums font-mono">{formattedTime}</span>
              <span className="text-slate-400 hidden sm:inline">/ {goalMinutes}m</span>
              <div className="w-8 sm:w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden ml-0.5">
                <div
                  className={`h-full transition-all duration-500 ${
                    goalReached ? 'bg-emerald-500' : 'bg-indigo-600'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </button>

            {/* Goal Dropdown Menu */}
            {isGoalMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsGoalMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 text-xs">
                  <div className="px-2.5 py-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    Daily Practice Goal
                  </div>
                  {PRACTICE_GOALS.map((mins) => (
                    <button
                      key={mins}
                      onClick={() => {
                        onGoalChange(mins);
                        setIsGoalMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                        goalMinutes === mins
                          ? 'bg-indigo-50 text-indigo-700 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{mins} Minutes Goal</span>
                      {goalMinutes === mins && <span>✓</span>}
                    </button>
                  ))}

                  {messagesCount > 0 && (
                    <div className="pt-2 mt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setIsGoalMenuOpen(false);
                          onEndSession();
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold flex items-center justify-between transition-colors"
                      >
                        <span>🏁 End Session & Review</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Level Selector Dropdown */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => {
                setIsLevelMenuOpen(!isLevelMenuOpen);
                setIsGoalMenuOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 transition-colors"
            >
              <span>{activeLevelObj.tag}</span>
              <span className="hidden md:inline">{activeLevelObj.label}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isLevelMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsLevelMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 text-xs">
                  <div className="px-2.5 py-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    Proficiency Level
                  </div>
                  {ENGLISH_LEVELS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onLevelChange(item.id);
                        setIsLevelMenuOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition-all mb-1 ${
                        level === item.id
                          ? 'bg-indigo-50 border border-indigo-200 text-indigo-900'
                          : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span>{item.label}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {item.description}
                      </p>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Reset / Clear Chat Button */}
          {activeTab === 'practice' && (
            <button
              onClick={onClearChat}
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Audio & AI Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Tab Navigation Bar */}
      <div className="md:hidden border-t border-slate-200/80 bg-white px-2 py-1.5 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-1 px-3 rounded-lg text-[11px] font-semibold transition-all ${
                isActive
                  ? 'text-indigo-700 bg-indigo-50/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};