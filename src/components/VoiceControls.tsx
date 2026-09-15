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
} from 'lucide-react';
import { TutorStatus } from '@/types';
import { SuggestedReplies } from './SuggestedReplies';

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

  const handleSelectSuggestedReply = (reply: string) => {
    setInputText(reply);
    inputRef.current?.focus();
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'listening':
        return (
          <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-pulse shadow-sm">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
            <span>Listening... Speak English now</span>
          </div>
        );
      case 'thinking':
        return (
          <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold shadow-sm">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
            <span>Analyzing sentence & grammar...</span>
          </div>
        );
      case 'speaking':
        return (
          <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold shadow-sm">
            <Volume2 className="w-3.5 h-3.5 animate-bounce text-emerald-600" />
            <span>AI Coach is speaking...</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/90 border border-slate-200 text-slate-500 text-xs font-medium shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Tap Mic to Speak or Type below</span>
          </div>
        );
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 pointer-events-none pb-4 sm:pb-6 pt-2 bg-gradient-to-t from-slate-100 via-slate-100/90 to-transparent">
      <div className="max-w-2xl mx-auto px-3 sm:px-4 pointer-events-auto">
        <div className="flex flex-col items-center">
          {/* Suggested Quick Replies */}
          <SuggestedReplies
            onSelectReply={handleSelectSuggestedReply}
            disabled={status === 'thinking'}
          />

          {/* Status Badge */}
          <div className="mb-2">{getStatusBadge()}</div>

          {/* Main Action Bar */}
          <form
            onSubmit={handleFormSubmit}
            className={`w-full flex items-center gap-2 p-1.5 sm:p-2 rounded-2xl bg-white border transition-all duration-300 shadow-xl ${
              isListening
                ? 'border-rose-400 ring-4 ring-rose-100'
                : inputText.trim()
                ? 'border-indigo-400 ring-4 ring-indigo-50'
                : 'border-slate-200/90'
            }`}
          >
            {/* Microphone Button */}
            <div className="relative shrink-0">
              {isListening && (
                <div className="absolute inset-0 rounded-2xl bg-rose-400/40 animate-ping -m-1"></div>
              )}
              <button
                type="button"
                onClick={handleMicClick}
                disabled={status === 'thinking'}
                className={`relative w-11 h-11 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl flex items-center justify-center text-white transition-all transform active:scale-95 disabled:opacity-50 ${
                  isListening
                    ? 'bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/30 scale-105'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20'
                }`}
                title={isListening ? 'Stop voice recording' : 'Speak in English'}
              >
                {status === 'thinking' ? (
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                ) : isListening ? (
                  <Square className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                ) : (
                  <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
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
                    ? 'Listening... Your words will appear here for review'
                    : 'Speak into mic or type your sentence here...'
                }
                disabled={status === 'thinking'}
                className="w-full bg-transparent px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none disabled:opacity-50"
              />
              {inputText && (
                <button
                  type="button"
                  onClick={() => setInputText('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
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
                className="p-2.5 sm:p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition-colors shrink-0"
                title="Stop audio playback"
              >
                <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}

            {/* Manual Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || status === 'thinking'}
              className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm text-white transition-all shrink-0 ${
                inputText.trim() && status !== 'thinking'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-sm'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
              title="Send to Coach"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Helpful Review Hint */}
          <div className="mt-1.5 text-[11px] text-slate-500 text-center font-medium">
            {isListening ? (
              <span className="text-rose-600 font-semibold">
                ● Recording voice • Click the square button when finished
              </span>
            ) : inputText.trim() ? (
              <span className="text-emerald-700 font-semibold">
                ✓ Review or edit your speech, then click Send
              </span>
            ) : (
              <span>Speak naturally, review your words, and click Send</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};