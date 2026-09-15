'use client';

import React from 'react';
import { Sparkles, MessageSquare, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { EnglishLevel, PracticeTopic } from '@/types';
import { ENGLISH_LEVELS, PRACTICE_TOPICS } from '@/lib/constants';

interface HeroBannerProps {
  onStartPractice: () => void;
  level: EnglishLevel;
  topic: PracticeTopic;
  onOpenTopics: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onStartPractice,
  level,
  topic,
  onOpenTopics,
}) => {
  const currentLevel = ENGLISH_LEVELS.find((l) => l.id === level) || ENGLISH_LEVELS[1];
  const currentTopic = PRACTICE_TOPICS.find((t) => t.id === topic) || PRACTICE_TOPICS[0];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-sm mb-6 transition-all">
      {/* Subtle background glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-indigo-100/60 to-violet-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-gradient-to-tr from-cyan-100/40 to-blue-100/30 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-700 text-xs font-semibold mb-3.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI-Powered English Speaking Tutor</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight mb-3">
            Improve Your English Through <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent">Real Conversation</span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">
            Practice English with your AI speaking coach, get instant feedback, and build confidence one conversation at a time.
          </p>

          {/* Supporting Trust Badges */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>10-minute focused sessions</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Instant grammar & phrasing feedback</span>
            </span>
          </div>
        </div>

        {/* Action Card */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-2.5 flex-shrink-0">
          <button
            onClick={onStartPractice}
            className="flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all transform active:scale-98"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Start Practicing</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenTopics}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-medium text-xs border border-slate-200/80 transition-colors"
          >
            <span>Topic: <strong>{currentTopic.title}</strong></span>
            <span className="text-indigo-600 font-semibold ml-1">Change →</span>
          </button>
        </div>
      </div>
    </div>
  );
};