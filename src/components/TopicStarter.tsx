'use client';

import React from 'react';
import { Mic, MessageSquare, Sparkles, Volume2 } from 'lucide-react';
import { PracticeTopic, EnglishLevel } from '@/types';
import { PRACTICE_TOPICS, ENGLISH_LEVELS } from '@/lib/constants';

interface TopicStarterProps {
  topic: PracticeTopic;
  level: EnglishLevel;
  onSelectSuggestion: (text: string) => void;
  onStartSpeaking: () => void;
}

export const TopicStarter: React.FC<TopicStarterProps> = ({
  topic,
  level,
  onSelectSuggestion,
  onStartSpeaking,
}) => {
  const currentTopic = PRACTICE_TOPICS.find((t) => t.id === topic) || PRACTICE_TOPICS[0];
  const currentLevel = ENGLISH_LEVELS.find((l) => l.id === level) || ENGLISH_LEVELS[1];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-xl mx-auto px-4 py-8 text-center animate-fade-in">
      {/* Tutor Avatar */}
      <div className="relative mb-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[2px] shadow-xl shadow-indigo-500/25">
          <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-4xl">
            {currentTopic.icon}
          </div>
        </div>
        <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-5 h-5 rounded-full border-2 border-slate-950 flex items-center justify-center shadow">
          <Sparkles className="w-3 h-3 text-white" />
        </div>
      </div>

      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
        {currentTopic.title}
      </h2>
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-950/70 border border-indigo-700/50 text-indigo-300 font-medium">
          Level: {currentLevel.label} ({currentLevel.tag})
        </span>
      </div>

      {/* AI Coach Opening Prompt */}
      <div className="w-full bg-gradient-to-b from-slate-900/90 to-slate-900/50 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-6 text-left shadow-lg">
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Coach Prompt</span>
        </div>
        <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
          &ldquo;{currentTopic.starterPrompt}&rdquo;
        </p>
      </div>

      {/* Suggestions / Conversation Starters */}
      <div className="w-full mb-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          💡 Try saying one of these:
        </p>
        <div className="flex flex-col gap-2.5">
          {currentTopic.starterSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSelectSuggestion(suggestion)}
              className="w-full text-left p-3 rounded-xl bg-slate-900/70 hover:bg-slate-800/90 border border-slate-800/80 hover:border-indigo-500/50 text-slate-300 hover:text-white text-xs sm:text-sm transition-all group flex items-center justify-between"
            >
              <span>&ldquo;{suggestion}&rdquo;</span>
              <span className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium ml-2">
                Practice →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Mic CTA */}
      <button
        onClick={onStartSpeaking}
        className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all transform hover:-translate-y-0.5"
      >
        <Mic className="w-4 h-4" />
        <span>Tap here to speak</span>
      </button>
    </div>
  );
};