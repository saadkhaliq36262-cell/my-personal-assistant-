'use client';

import React from 'react';
import {
  User,
  Bot,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Sparkles,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { ChatMessage } from '@/types';

interface ConversationViewProps {
  messages: ChatMessage[];
  onSpeakText: (text: string, messageId: string) => void;
  onStopSpeaking: () => void;
  isSpeaking: boolean;
  activeSpeakingId: string | null;
}

export const ConversationView: React.FC<ConversationViewProps> = ({
  messages,
  onSpeakText,
  onStopSpeaking,
  isSpeaking,
  activeSpeakingId,
}) => {
  return (
    <div className="flex flex-col space-y-6 max-w-3xl mx-auto px-3 sm:px-4 py-6 pb-44">
      {messages.map((msg, index) => {
        const isMsgSpeaking = isSpeaking && activeSpeakingId === msg.id;

        return (
          <div key={msg.id || index} className="space-y-4 animate-fade-in">
            {/* 1. USER SPOKEN MESSAGE */}
            <div className="flex items-start justify-end space-x-3">
              <div className="flex flex-col items-end max-w-[85%] sm:max-w-[75%]">
                <div className="flex items-center space-x-1.5 mb-1 text-[11px] text-slate-400 font-medium">
                  <span>You Spoke</span>
                  <span>•</span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="p-3.5 sm:p-4 rounded-2xl rounded-tr-sm bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md text-sm sm:text-base leading-relaxed">
                  &ldquo;{msg.originalText}&rdquo;
                </div>
              </div>
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 mt-5">
                <User className="w-4 h-4 text-indigo-400" />
              </div>
            </div>

            {/* 2. GRAMMAR CORRECTION & EXPLANATION CARD (If available) */}
            {(msg.correctedText || msg.explanation || msg.naturalVersion) && (
              <div className="mx-2 sm:mx-6 my-2 rounded-2xl border border-slate-800/90 bg-slate-900/70 p-4 sm:p-5 shadow-lg backdrop-blur-sm transition-all hover:border-slate-700">
                {/* Header Badge */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <div className="flex items-center space-x-2">
                    {msg.hasMistakes ? (
                      <div className="flex items-center space-x-1.5 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                        <AlertCircle className="w-4 h-4" />
                        <span>Grammar & Phrasing Coach</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Flawless English!</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                    Feedback
                  </span>
                </div>

                {/* Body Content */}
                <div className="space-y-3.5 text-xs sm:text-sm">
                  {/* Correction */}
                  {msg.hasMistakes && msg.correctedText && (
                    <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
                      <div className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider mb-1 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Corrected English:</span>
                      </div>
                      <p className="text-emerald-300 font-medium text-sm leading-relaxed">
                        &ldquo;{msg.correctedText}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* Explanation */}
                  {msg.explanation && (
                    <div className="flex items-start space-x-2.5 text-slate-300">
                      <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-200">Explanation: </span>
                        <span className="text-slate-300 leading-relaxed">{msg.explanation}</span>
                      </div>
                    </div>
                  )}

                  {/* Natural / Native Phrasing */}
                  {msg.naturalVersion && (
                    <div className="flex items-start space-x-2.5 text-slate-300 pt-1 border-t border-slate-800/60">
                      <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-indigo-300">Natural English: </span>
                        <span className="text-slate-200 font-medium italic">&ldquo;{msg.naturalVersion}&rdquo;</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. AI TUTOR SPOKEN RESPONSE */}
            {msg.aiResponse && (
              <div className="flex items-start space-x-3">
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1.5px] shadow-lg shadow-indigo-500/10">
                    <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                      <Bot className="w-4 h-4 text-cyan-300" />
                    </div>
                  </div>
                  {isMsgSpeaking && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-start max-w-[88%] sm:max-w-[80%]">
                  <div className="flex items-center space-x-2 mb-1 text-[11px] text-slate-400 font-medium">
                    <span className="text-cyan-400 font-semibold">AI English Coach</span>
                    <span>•</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  {/* AI Bubble */}
                  <div
                    className={`p-4 sm:p-5 rounded-2xl rounded-tl-sm border text-slate-100 shadow-md text-sm sm:text-base leading-relaxed transition-all ${
                      isMsgSpeaking
                        ? 'bg-slate-900/95 border-cyan-500/50 shadow-cyan-500/10'
                        : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <p className="mb-3 text-slate-100">{msg.aiResponse}</p>

                    {/* Follow-up question badge */}
                    {msg.followUpQuestion && (
                      <div className="mt-3 pt-3 border-t border-slate-800/80 bg-slate-950/40 -mx-2 px-3 py-2 rounded-xl flex items-start space-x-2">
                        <MessageCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs sm:text-sm text-indigo-200 font-medium">
                          {msg.followUpQuestion}
                        </p>
                      </div>
                    )}

                    {/* Audio Controls Bar */}
                    <div className="flex items-center justify-between mt-3 pt-2">
                      <div className="flex items-center space-x-2">
                        {isMsgSpeaking ? (
                          <button
                            onClick={onStopSpeaking}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 text-xs font-medium transition-colors"
                          >
                            <VolumeX className="w-3.5 h-3.5" />
                            <span>Stop Speaking</span>
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              onSpeakText(
                                `${msg.aiResponse} ${msg.followUpQuestion || ''}`,
                                msg.id
                              )
                            }
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 hover:text-white text-xs font-medium transition-colors"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Replay Audio</span>
                          </button>
                        )}
                      </div>

                      {/* Equalizer when speaking */}
                      {isMsgSpeaking && (
                        <div className="flex items-center space-x-1 h-4">
                          <span className="w-1 bg-cyan-400 rounded-full soundwave-1"></span>
                          <span className="w-1 bg-cyan-400 rounded-full soundwave-2"></span>
                          <span className="w-1 bg-cyan-400 rounded-full soundwave-3"></span>
                          <span className="w-1 bg-cyan-400 rounded-full soundwave-4"></span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};