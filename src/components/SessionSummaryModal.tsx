'use client';

import React from 'react';
import {
  Award,
  Clock,
  MessageSquare,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BarChart3,
  X,
  CheckCircle2,
} from 'lucide-react';
import { PracticeTopic, EnglishLevel } from '@/types';
import { PRACTICE_TOPICS } from '@/lib/constants';

interface SessionSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: PracticeTopic;
  level: EnglishLevel;
  messagesCount: number;
  durationMinutes: number;
  correctionsCount: number;
  onStartNewSession: () => void;
  onViewProgress: () => void;
}

export const SessionSummaryModal: React.FC<SessionSummaryModalProps> = ({
  isOpen,
  onClose,
  topic,
  level,
  messagesCount,
  durationMinutes,
  correctionsCount,
  onStartNewSession,
  onViewProgress,
}) => {
  if (!isOpen) return null;

  const currentTopic = PRACTICE_TOPICS.find((t) => t.id === topic) || PRACTICE_TOPICS[0];

  // Dynamic feedback synthesis based on actual user session performance
  const getStrengths = () => {
    if (messagesCount >= 8) {
      return "You maintained an engaging conversation flow and responded actively to the AI's follow-up questions.";
    } else if (correctionsCount === 0 && messagesCount > 0) {
      return "You spoke with great grammatical accuracy and natural sentence structures.";
    }
    return "Great effort in expressing your thoughts clearly and practicing consistent English speaking.";
  };

  const getFocusAreas = () => {
    if (correctionsCount >= 3) {
      return "Review the past tense verbs and preposition suggestions highlighted during your conversation.";
    } else if (level === 'beginner') {
      return "Try combining shorter sentences with connecting words like 'because', 'and', or 'when'.";
    }
    return "Keep expanding your vocabulary with native idioms and practicing longer continuous sentences.";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-fade-in">
        {/* Top Celebration Banner */}
        <div className="relative bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 px-6 py-6 text-white text-center">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-md mx-auto flex items-center justify-center mb-2.5 shadow-lg">
            <Award className="w-7 h-7 text-amber-300 animate-bounce" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-1">
            Session Completed! 🎉
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 font-medium">
            Great job! You finished a dedicated English speaking session.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <div className="flex items-center justify-center space-x-1 text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">
                <Clock className="w-3 h-3 text-indigo-600" />
                <span>Practice</span>
              </div>
              <p className="text-base sm:text-lg font-black text-slate-900">
                {durationMinutes} min
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <div className="flex items-center justify-center space-x-1 text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">
                <MessageSquare className="w-3 h-3 text-emerald-600" />
                <span>Messages</span>
              </div>
              <p className="text-base sm:text-lg font-black text-slate-900">
                {messagesCount}
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <div className="flex items-center justify-center space-x-1 text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">
                <AlertCircle className="w-3 h-3 text-amber-600" />
                <span>Feedback</span>
              </div>
              <p className="text-base sm:text-lg font-black text-slate-900">
                {correctionsCount} tips
              </p>
            </div>
          </div>

          {/* Topic Badge */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{currentTopic.icon}</span>
              <div>
                <span className="text-slate-500 font-medium text-[11px]">Topic Practiced:</span>
                <p className="font-bold text-slate-900">{currentTopic.title}</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-white border border-indigo-200 text-indigo-700 font-semibold text-[10px] uppercase tracking-wider">
              Level: {level}
            </span>
          </div>

          {/* What you did well */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 space-y-1.5 text-xs">
            <div className="flex items-center space-x-1.5 font-bold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>What You Did Well:</span>
            </div>
            <p className="text-slate-700 leading-relaxed pl-5.5">{getStrengths()}</p>
          </div>

          {/* Focus for next time */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-1.5 text-xs">
            <div className="flex items-center space-x-1.5 font-bold text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Focus For Next Time:</span>
            </div>
            <p className="text-slate-700 leading-relaxed pl-5.5">{getFocusAreas()}</p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <button
            onClick={() => {
              onClose();
              onViewProgress();
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>View Progress</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onStartNewSession();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center space-x-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start New Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};