'use client';

import React, { useState } from 'react';
import {
  X,
  Volume2,
  Gauge,
  Clock,
  Trash2,
  HelpCircle,
  Sparkles,
  Key,
  Eye,
  EyeOff,
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
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  languageHelp: boolean;
  onLanguageHelpChange: (enabled: boolean) => void;
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
  apiKey,
  onApiKeyChange,
  languageHelp,
  onLanguageHelpChange,
}) => {
  const [showKey, setShowKey] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const [savedBadge, setSavedBadge] = useState(false);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    onApiKeyChange(tempKey.trim());
    setSavedBadge(true);
    setTimeout(() => setSavedBadge(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Coach & Audio Settings
              </h3>
              <p className="text-xs text-slate-500">Configure your personal practice preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-sm">
          {/* 1. Gemini API Key Setting */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs sm:text-sm">
                <Key className="w-4 h-4 text-indigo-600" />
                <span>Gemini API Key</span>
              </div>
              {savedBadge && (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                  <Check className="w-3 h-3" />
                  <span>Saved!</span>
                </span>
              )}
            </div>
            <p className="text-xs text-indigo-700/80 leading-relaxed">
              Your API key is saved safely in your browser&apos;s local storage and used directly for your AI coaching sessions.
            </p>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  placeholder="Enter your Gemini API key..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <button
                onClick={handleSaveKey}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors"
              >
                Save
              </button>
            </div>
          </div>

          {/* 2. Speech Speed */}
          <div>
            <div className="flex items-center gap-2 text-slate-900 font-bold mb-1">
              <Gauge className="w-4 h-4 text-indigo-600" />
              <span>Speaking Speed</span>
            </div>
            <p className="text-xs text-slate-500 mb-2.5">
              Adjust how fast the AI speaks to match your listening fluency.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SPEED_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onRateChange(opt.value)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    rate === opt.value
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Voice Selector */}
          <div>
            <div className="flex items-center gap-2 text-slate-900 font-bold mb-1">
              <Volume2 className="w-4 h-4 text-indigo-600" />
              <span>Coach Voice & Accent</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">
              Select your preferred English accent or voice engine.
            </p>
            <select
              value={selectedVoice?.name || ''}
              onChange={(e) => {
                const found = voices.find((v) => v.name === e.target.value);
                if (found) onSelectVoice(found.voice);
              }}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

          {/* Language Help (Roman Urdu Support) Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <div>
              <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                <span>🌐 Language Help (Roman Urdu)</span>
                <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded">
                  Active Learning Aid
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Provide simple Roman Urdu meanings for questions, hints, and grammar explanations.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onLanguageHelpChange(!languageHelp)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ml-3 ${
                languageHelp ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                  languageHelp ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* 4. Auto-play Voice Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <div className="font-bold text-slate-900 text-xs sm:text-sm">
                Auto-speak AI Responses
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically speak the AI coach&apos;s replies out loud.
              </p>
            </div>
            <button
              onClick={() => onAutoSpeakChange(!autoSpeak)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoSpeak ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                  autoSpeak ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* 5. Daily Speaking Goal */}
          <div>
            <div className="flex items-center gap-2 text-slate-900 font-bold mb-1">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Daily Practice Goal</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {PRACTICE_GOALS.map((mins) => (
                <button
                  key={mins}
                  onClick={() => onGoalChange(mins)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    goalMinutes === mins
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          {/* 6. Clear History */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear your current conversation?')) {
                  onClearHistory();
                  onClose();
                }
              }}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset Current Conversation</span>
            </button>
          </div>

          {/* 7. Help & Tips */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
              <span>Tips for Best Experience</span>
            </div>
            <p>• Works seamlessly in Google Chrome, Edge, Safari, and Android browsers.</p>
            <p>• Make sure microphone permissions are granted in your browser address bar.</p>
            <p>• Review what you spoke before pressing Send to verify accuracy.</p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-sm"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};