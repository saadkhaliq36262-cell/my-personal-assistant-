'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Settings as SettingsIcon,
  Clock,
  ChevronDown,
  RotateCcw,
  Layers,
  Award,
} from 'lucide-react';
import { EnglishLevel, PracticeTopic, PracticeGoalMinutes } from '@/types';
import { ENGLISH_LEVELS, PRACTICE_TOPICS, PRACTICE_GOALS } from '@/lib/constants';

interface HeaderProps {
  level: EnglishLevel;
  onLevelChange: (level: EnglishLevel) => void;
  topic: PracticeTopic;
  onTopicChange: (topic: PracticeTopic) => void;
  formattedTime: string;
  goalMinutes: PracticeGoalMinutes;
  progressPercent: number;
  goalReached: boolean;
  onOpenSettings: () => void;
  onClearChat: () => void;
  onGoalChange: (goal: PracticeGoalMinutes) => void;
}

export const Header: React.FC<HeaderProps> = ({
  level,
  onLevelChange,
  topic,
  onTopicChange,
  formattedTime,
  goalMinutes,
  progressPercent,
  goalReached,
  onOpenSettings,
  onClearChat,
  onGoalChange,
}) => {
  const [isLevelMenuOpen, setIsLevelMenuOpen] = useState(false);
  const [isTopicMenuOpen, setIsTopicMenuOpen] = useState(false);
  const [isGoalMenuOpen, setIsGoalMenuOpen] = useState(false);

  const activeLevelObj = ENGLISH_LEVELS.find((l) => l.id === level) || ENGLISH_LEVELS[1];
  const activeTopicObj = PRACTICE_TOPICS.find((t) => t.id === topic) || PRACTICE_TOPICS[0];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md px-3 sm:px-6 py-3">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[2px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              My English Coach
            </h1>
            <p className="text-[11px] text-slate-400 hidden xs:block font-medium">
              Personal AI Speaking Tutor
            </p>
          </div>
        </div>

        {/* Practice Timer & Goal */}
        <div className="relative">
          <button
            onClick={() => setIsGoalMenuOpen(!isGoalMenuOpen)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              goalReached
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-500/20'
                : 'bg-slate-900/80 border-slate-700/70 text-slate-300 hover:border-slate-600'
            }`}
            title="Practice duration and daily goal"
          >
            {goalReached ? (
              <Award className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
            )}
            <span className="tabular-nums font-semibold">{formattedTime}</span>
            <span className="text-slate-500">/ {goalMinutes}m</span>
            <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden ml-1">
              <div
                className={`h-full transition-all duration-500 ${
                  goalReached ? 'bg-emerald-400' : 'bg-indigo-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </button>

          {isGoalMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsGoalMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-2 text-xs">
                <p className="px-2 py-1 text-slate-400 font-semibold mb-1">Set Daily Goal</p>
                {PRACTICE_GOALS.map((mins) => (
                  <button
                    key={mins}
                    onClick={() => {
                      onGoalChange(mins);
                      setIsGoalMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                      goalMinutes === mins
                        ? 'bg-indigo-600 text-white font-medium'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{mins} Minutes</span>
                    {goalMinutes === mins && <span>✓</span>}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Controls: Level Selector, Topic Selector, Settings */}
        <div className="flex items-center space-x-2">
          {/* Level Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsLevelMenuOpen(!isLevelMenuOpen);
                setIsTopicMenuOpen(false);
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 font-medium transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>{activeLevelObj.label}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isLevelMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsLevelMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-1.5 text-xs">
                  <div className="px-2 py-1.5 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                    English Level
                  </div>
                  {ENGLISH_LEVELS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onLevelChange(item.id);
                        setIsLevelMenuOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg transition-colors mb-1 ${
                        level === item.id
                          ? 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-200'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-100">{item.label}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {item.description}
                      </p>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Topic Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsTopicMenuOpen(!isTopicMenuOpen);
                setIsLevelMenuOpen(false);
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 font-medium transition-colors"
            >
              <span>{activeTopicObj.icon}</span>
              <span className="hidden sm:inline">{activeTopicObj.title}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isTopicMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsTopicMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-1.5 text-xs max-h-80 overflow-y-auto">
                  <div className="px-2 py-1.5 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                    Practice Topic
                  </div>
                  {PRACTICE_TOPICS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTopicChange(item.id);
                        setIsTopicMenuOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg flex items-start space-x-2 transition-colors mb-1 ${
                        topic === item.id
                          ? 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-200'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-base mt-0.5">{item.icon}</span>
                      <div>
                        <div className="font-semibold text-slate-100">{item.title}</div>
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Reset / Clear Chat Button */}
          <button
            onClick={onClearChat}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Start new conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Audio and App Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};