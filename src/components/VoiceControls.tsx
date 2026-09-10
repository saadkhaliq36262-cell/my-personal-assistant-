'use client';

import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Square,
  Send,
  Keyboard,
  Loader2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { TutorStatus } from '@/types';

interface VoiceControlsProps {
  status: TutorStatus;
  isListening: boolean;
  isSpeaking: boolean;
  interimTranscript: string;
  onStartListening: () => void;
  onStopListening: () => void;
  onStopSpeaking: () => void;
  onSendTextMessage: (text: string) => void;
  isSpeechSupported: boolean;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  status,
  isListening,
  isSpeaking,
  interimTranscript,
  onStartListening,
  onStopListening,
  onStopSpeaking,
  onSendTextMessage,
  isSpeechSupported,
}) => {
  const [showTextInput, setShowTextInput] = useState(!isSpeechSupported);
  const [textInput, setTextInput] = useState('');

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim() && status !== 'thinking') {
      onSendTextMessage(textInput.trim());
      setTextInput('');
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'listening':
        return (
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Listening... Speak English now</span>
          </div>
        );
      case 'thinking':
        return (
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Analyzing your sentence...</span>
          </div>
        );
      case 'speaking':
        return (
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            <Volume2 className="w-3.5 h-3.5 animate-bounce" />
            <span>AI Coach is speaking...</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            <span>Notice: Check mic or type below</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Ready to practice</span>
          </div>
        );
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 pointer-events-none pb-4 pt-2">
      <div className="max-w-xl mx-auto px-4 pointer-events-auto">
        {/* Floating Controls Container */}
        <div className="flex flex-col items-center">
          {/* Live Interim Transcript Banner */}
          {isListening && interimTranscript && (
            <div className="w-full mb-3 p-3 bg-slate-900/95 border border-indigo-500/40 rounded-2xl shadow-2xl backdrop-blur-md animate-fade-in text-center">
              <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
                Hearing you:
              </span>
              <p className="text-slate-100 text-sm font-medium italic">
                &ldquo;{interimTranscript}&rdquo;
              </p>
            </div>
          )}

          {/* Status Badge */}
          <div className="mb-3">{getStatusBadge()}</div>

          {/* Keyboard input drawer (if toggled) */}
          {showTextInput && (
            <form
              onSubmit={handleTextSubmit}
              className="w-full mb-3 flex items-center space-x-2 bg-slate-900/95 border border-slate-700/80 rounded-2xl p-1.5 shadow-2xl backdrop-blur-md"
            >
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Or type your English sentence here..."
                disabled={status === 'thinking'}
                className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!textInput.trim() || status === 'thinking'}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white transition-colors flex-shrink-0"
                title="Send text"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Main Action Bar */}
          <div className="flex items-center space-x-4 bg-slate-950/90 border border-slate-800/80 backdrop-blur-lg px-6 py-2.5 rounded-full shadow-2xl">
            {/* Keyboard toggle */}
            <button
              onClick={() => setShowTextInput(!showTextInput)}
              className={`p-2.5 rounded-full border transition-all ${
                showTextInput
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Type with keyboard"
            >
              <Keyboard className="w-4 h-4" />
            </button>

            {/* Giant Central Microphone Button */}
            <div className="relative">
              {isListening && (
                <div className="absolute inset-0 rounded-full bg-rose-500/30 animate-ping -m-1.5"></div>
              )}
              {isListening && (
                <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-pulse -m-3"></div>
              )}

              <button
                onClick={() => {
                  if (isListening) {
                    onStopListening();
                  } else {
                    if (isSpeaking) {
                      onStopSpeaking();
                    }
                    onStartListening();
                  }
                }}
                disabled={status === 'thinking'}
                className={`relative w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl transition-all transform active:scale-95 disabled:opacity-50 ${
                  isListening
                    ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/50 scale-105'
                    : 'bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-indigo-600/40'
                }`}
                title={isListening ? 'Tap to finish speaking' : 'Tap to speak English'}
              >
                {status === 'thinking' ? (
                  <Loader2 className="w-7 h-7 animate-spin" />
                ) : isListening ? (
                  <Square className="w-6 h-6 fill-white" />
                ) : (
                  <Mic className="w-7 h-7" />
                )}
              </button>
            </div>

            {/* Stop AI Audio Button */}
            <button
              onClick={onStopSpeaking}
              disabled={!isSpeaking}
              className={`p-2.5 rounded-full border transition-all ${
                isSpeaking
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 hover:bg-rose-500/30 animate-pulse'
                  : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
              }`}
              title="Stop AI speech"
            >
              <VolumeX className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};