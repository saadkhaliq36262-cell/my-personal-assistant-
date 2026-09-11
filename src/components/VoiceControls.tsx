'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Square,
  Send,
  Loader2,
  Volume2,
  VolumeX,
  X,
  Sparkles,
} from 'lucide-react';
import { TutorStatus } from '@/types';

interface VoiceControlsProps {
  status: TutorStatus;
  isListening: boolean;
  isSpeaking: boolean;
  liveSpeechText: string;
  onStartListening: () => void;
  onStopListening: () => void;
  onStopSpeaking: () => void;
  onSendMessage: (text: string) => void;
  isSpeechSupported: boolean;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  status,
  isListening,
  isSpeaking,
  liveSpeechText,
  onStartListening,
  onStopListening,
  onStopSpeaking,
  onSendMessage,
  isSpeechSupported,
}) => {
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // When live speech arrives from voice recognition, update the input text so user can review and edit
  useEffect(() => {
    if (liveSpeechText) {
      setInputText(liveSpeechText);
    }
  }, [liveSpeechText]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && status !== 'thinking') {
      if (isListening) {
        onStopListening();
      }
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      onStopListening();
    } else {
      if (isSpeaking) {
        onStopSpeaking();
      }
      setInputText('');
      onStartListening();
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'listening':
        return (
          <div className="flex items-center space-x-2 px-3.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/50 text-rose-300 text-xs font-semibold animate-pulse shadow-lg shadow-rose-500/20">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span>Listening... Speak English now</span>
          </div>
        );
      case 'thinking':
        return (
          <div className="flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-lg">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
            <span>Analyzing your sentence...</span>
          </div>
        );
      case 'speaking':
        return (
          <div className="flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-lg">
            <Volume2 className="w-3.5 h-3.5 animate-bounce text-cyan-400" />
            <span>AI Coach is speaking...</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-slate-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Tap Mic to Speak or Type to Practice</span>
          </div>
        );
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 pointer-events-none pb-4 sm:pb-5 pt-2">
      <div className="max-w-2xl mx-auto px-3 sm:px-4 pointer-events-auto">
        <div className="flex flex-col items-center">
          {/* Status Badge */}
          <div className="mb-2.5">{getStatusBadge()}</div>

          {/* Main Action & Review Bar */}
          <form
            onSubmit={handleFormSubmit}
            className={`w-full flex items-center space-x-2 p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border transition-all duration-300 shadow-2xl backdrop-blur-xl ${
              isListening
                ? 'bg-slate-900/95 border-rose-500/60 shadow-rose-500/20 ring-2 ring-rose-500/20'
                : inputText.trim()
                ? 'bg-slate-900/95 border-indigo-500/60 shadow-indigo-500/20'
                : 'bg-slate-950/90 border-slate-800/80'
            }`}
          >
            {/* Microphone Button */}
            <div className="relative flex-shrink-0">
              {isListening && (
                <div className="absolute inset-0 rounded-2xl bg-rose-500/40 animate-ping -m-1"></div>
              )}
              <button
                type="button"
                onClick={handleMicClick}
                disabled={status === 'thinking'}
                className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-white transition-all transform active:scale-95 disabled:opacity-50 ${
                  isListening
                    ? 'bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/50 scale-105'
                    : 'bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-lg shadow-indigo-600/30'
                }`}
                title={isListening ? 'Tap to finish voice recording' : 'Tap to speak English'}
              >
                {status === 'thinking' ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : isListening ? (
                  <Square className="w-5 h-5 fill-white" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Editable Review & Text Input Field */}
            <div className="relative flex-1 min-w-0">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isListening
                    ? 'Speaking... Text will appear here for review'
                    : 'Speak into mic or type your sentence here...'
                }
                disabled={status === 'thinking'}
                className="w-full bg-transparent px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none disabled:opacity-50"
              />
              {inputText && (
                <button
                  type="button"
                  onClick={() => setInputText('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  title="Clear text"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Stop AI Speech Button (if AI is talking) */}
            {isSpeaking && (
              <button
                type="button"
                onClick={onStopSpeaking}
                className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 transition-colors flex-shrink-0 animate-pulse"
                title="Stop AI Coach speech"
              >
                <VolumeX className="w-5 h-5" />
              </button>
            )}

            {/* Manual Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || status === 'thinking'}
              className={`flex items-center space-x-1.5 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-semibold text-xs sm:text-sm text-white transition-all flex-shrink-0 ${
                inputText.trim() && status !== 'thinking'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/30 scale-100'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
              }`}
              title="Click to Send and get AI feedback"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </form>

          {/* Helpful Review Hint */}
          <div className="mt-1.5 text-[11px] text-slate-400 text-center">
            {isListening ? (
              <span className="text-rose-400 font-medium">Recording voice • Tap red button when finished speaking</span>
            ) : inputText.trim() ? (
              <span className="text-emerald-400 font-medium">✓ Review/edit your sentence above, then click Send!</span>
            ) : (
              <span>Tap microphone, speak naturally, review your words, and click Send</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};