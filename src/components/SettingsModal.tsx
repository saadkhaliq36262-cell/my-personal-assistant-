'use client';

import React from 'react';
import {
  X,
  Volume2,
  Gauge,
  Clock,
  Trash2,
  HelpCircle,
  Sparkles,
  Check,
} from 'lucide-react';
import { PracticeGoalMinutes } from '@/types';
import { PRACTICE_GOALS } from '@/lib/constants';
import { VoiceOption } from '@/hooks/useSpeechSynthesis';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  voices: VoiceOption[];
  selectedVoice: SpeechSynthesisVoice | null;
  onSelectVoice: (voice: SpeechSynthesisVoice) => void;
  rate: number;
  onRateChange: (rate: number) => void;
  autoSpeak: boolean;
  onAutoSpeakChange: (enabled: boolean) => void;
  goalMinutes: PracticeGoalMinutes;
  onGoalChange: (goal: PracticeGoalMinutes) => void;
  onClearHistory: () => void;
}

const SPEED_OPTIONS = [
  { label: '0.75x Slow', value: 0.75 },
  { label: '1.0x Normal', value: 1.0 },
  { label: '1.25x Fast', value: 1.25 },
  { label: '1.5x Speedy', value: 1.5 },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  voices,
  selectedVoice,
  onSelectVoice,
  rate,
  onRateChange,
  autoSpeak,
  onAutoSpeakChange,
  goalMinutes,
  onGoalChange,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              Coach & Audio Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-sm">
          {/* 1. Speech Speed */}
          <div>
            <div className="flex items-center space-x-2 text-slate-200 font-semibold mb-2">
              <Gauge className="w-4 h-4 text-indigo-400" />
              <span>Voice Speech Speed</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Adjust how fast the AI speaks to match your listening preference.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SPEED_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onRateChange(opt.value)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                    rate === opt.value
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Voice Selector */}
          <div>
            <div className="flex items-center space-x-2 text-slate-200 font-semibold mb-2">
              <Volume2 className="w-4 h-4 text-indigo-400" />
              <span>Coach Voice</span>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              Select your preferred English accent or browser voice.
            </p>
            <select
              value={selectedVoice?.name || ''}
              onChange={(e) => {
                const found = voices.find((v) => v.name === e.target.value);
                if (found) onSelectVoice(found.voice);
              }}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {voices.length === 0 ? (
                <option value="">Default Browser Voice</option>
              ) : (
                voices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* 3. Auto-play Voice Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div>
              <div className="font-semibold text-slate-200 text-xs sm:text-sm">
                Auto-speak AI Responses
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically read AI responses out loud upon arrival.
              </p>
            </div>
            <button
              onClick={() => onAutoSpeakChange(!autoSpeak)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoSpeak ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoSpeak ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* 4. Daily Speaking Goal */}
          <div>
            <div className="flex items-center space-x-2 text-slate-200 font-semibold mb-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Daily Speaking Goal</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {PRACTICE_GOALS.map((mins) => (
                <button
                  key={mins}
                  onClick={() => onGoalChange(mins)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                    goalMinutes === mins
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          {/* 5. Clear History */}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear your current conversation history?')) {
                  onClearHistory();
                  onClose();
                }
              }}
              className="w-full flex items-center justify-center space-x-2 p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Current Conversation</span>
            </button>
          </div>

          {/* 6. Help / Tips */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200/90 space-y-1.5">
            <div className="flex items-center space-x-1.5 font-semibold text-indigo-300">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Microphone & Browser Tips</span>
            </div>
            <p>• Best supported in Chrome, Edge, and Android Chrome browsers.</p>
            <p>• Make sure microphone permissions are allowed when prompted.</p>
            <p>• Tap the keyboard icon anytime if you prefer typing.</p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};