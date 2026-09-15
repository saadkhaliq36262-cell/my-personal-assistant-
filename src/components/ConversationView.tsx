'use client';

import React from 'react';
import {
  User,
  Bot,
  Volume2,
  VolumeX,
  MessageCircle,
} from 'lucide-react';
import { ChatMessage } from '@/types';
import { FeedbackCard } from './FeedbackCard';

interface ConversationViewProps {
  messages: ChatMessage[];
  isThinking: boolean;
  onSpeakText: (text: string, messageId: string) => void;
  onStopSpeaking: () => void;
  isSpeaking: boolean;
  activeSpeakingId: string | null;
  onSaveWord: (word: string, meaning: string, example?: string) => void;
}

export const ConversationView: React.FC<ConversationViewProps> = ({
  messages,
  isThinking,
  onSpeakText,
  onStopSpeaking,
  isSpeaking,
  activeSpeakingId,
  onSaveWord,
}) => {
  return (
    <div className="flex flex-col space-y-6 max-w-3xl mx-auto px-3 sm:px-4 py-6">
      {messages.map((msg, index) => {
        const isMsgSpeaking = isSpeaking && activeSpeakingId === msg.id;

        return (
          <div key={msg.id || index} className="space-y-4 animate-fadeIn">
            {/* 1. USER SPOKEN MESSAGE (Right-aligned) */}
            <div className="flex items-start justify-end gap-2.5 sm:gap-3">
              <div className="flex flex-col items-end max-w-[85%] sm:max-w-[78%]">
                <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400 font-medium">
                  <span>You</span>
                  <span>•</span>
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="p-3.5 sm:p-4 rounded-2xl rounded-tr-sm bg-indigo-600 text-white shadow-sm text-sm sm:text-base leading-relaxed">
                  &ldquo;{msg.originalText}&rdquo;
                </div>
              </div>
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-5 shadow-xs">
                <User className="w-4 h-4" />
              </div>
            </div>

            {/* 2. GRAMMAR & VOCABULARY FEEDBACK CARD */}
            <FeedbackCard message={msg} onSaveWord={onSaveWord} />

            {/* 3. AI TUTOR SPOKEN RESPONSE (Left-aligned) */}
            {msg.aiResponse && (
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="relative shrink-0 mt-1">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                  {isMsgSpeaking && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-start max-w-[90%] sm:max-w-[82%]">
                  <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400 font-medium">
                    <span className="text-indigo-600 font-bold">AI English Coach</span>
                    <span>•</span>
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* AI Bubble */}
                  <div
                    className={`p-4 sm:p-5 rounded-2xl rounded-tl-sm border text-slate-800 shadow-sm text-sm sm:text-base leading-relaxed transition-all ${
                      isMsgSpeaking
                        ? 'bg-white border-indigo-400 ring-2 ring-indigo-100 shadow-md'
                        : 'bg-white border-slate-200/90'
                    }`}
                  >
                    <p className="text-slate-800 leading-relaxed font-normal">{msg.aiResponse}</p>

                    {/* Follow-up question badge */}
                    {msg.followUpQuestion && (
                      <div className="mt-3 pt-3 border-t border-slate-100 bg-indigo-50/60 -mx-2 px-3 py-2.5 rounded-xl flex items-start gap-2">
                        <MessageCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <p className="text-xs sm:text-sm text-indigo-900 font-medium">
                          {msg.followUpQuestion}
                        </p>
                      </div>
                    )}

                    {/* Audio Controls Bar */}
                    <div className="flex items-center justify-between mt-3 pt-2">
                      <div className="flex items-center gap-2">
                        {isMsgSpeaking ? (
                          <button
                            onClick={onStopSpeaking}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition-colors"
                          >
                            <VolumeX className="w-3.5 h-3.5" />
                            <span>Stop Audio</span>
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              onSpeakText(
                                `${msg.aiResponse} ${msg.followUpQuestion || ''}`,
                                msg.id
                              )
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 text-xs font-semibold transition-colors"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Replay Audio</span>
                          </button>
                        )}
                      </div>

                      {/* Equalizer Soundwave Animation */}
                      {isMsgSpeaking && (
                        <div className="flex items-center gap-1 h-4">
                          <span className="w-1 bg-indigo-600 rounded-full soundwave-1"></span>
                          <span className="w-1 bg-indigo-600 rounded-full soundwave-2"></span>
                          <span className="w-1 bg-indigo-600 rounded-full soundwave-3"></span>
                          <span className="w-1 bg-indigo-600 rounded-full soundwave-4"></span>
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

      {/* Typing / Thinking Indicator */}
      {isThinking && (
        <div className="flex items-start gap-3 animate-fadeIn">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shrink-0 shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-xs text-slate-500 font-medium">Coach is thinking and reviewing grammar...</span>
          </div>
        </div>
      )}
    </div>
  );
};