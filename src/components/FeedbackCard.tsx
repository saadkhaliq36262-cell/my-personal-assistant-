'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Sparkles,
  BookmarkPlus,
  Check,
  BookOpen,
} from 'lucide-react';
import { ChatMessage } from '@/types';

interface FeedbackCardProps {
  message: ChatMessage;
  onSaveWord: (word: string, meaning: string, example?: string) => void;
  languageHelp?: boolean;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  message,
  onSaveWord,
  languageHelp = true,
}) => {
  const [savedWords, setSavedWords] = useState<{ [word: string]: boolean }>({});

  const handleSave = (word: string, meaning: string) => {
    onSaveWord(word, meaning, message.correctedText || message.originalText);
    setSavedWords((prev) => ({ ...prev, [word]: true }));
  };

  if (!message.correctedText && !message.explanation && !message.naturalVersion) {
    return null;
  }

  return (
    <div className="my-2.5 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 sm:p-5 shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5 mb-3">
        <div className="flex items-center space-x-2">
          {message.hasMistakes ? (
            <div className="flex items-center space-x-1.5 text-amber-700 text-xs font-bold uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>English Feedback & Correction</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Flawless English!</span>
            </div>
          )}
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-500">
          Coach Tips
        </span>
      </div>

      {/* Content */}
      <div className="space-y-3 text-xs sm:text-sm">
        {/* Correction comparison */}
        {message.hasMistakes && message.correctedText && (
          <div className="bg-white rounded-xl p-3 border border-emerald-200/80 shadow-2xs">
            <div className="text-[11px] text-slate-500 uppercase font-semibold tracking-wider mb-1 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Better:</span>
            </div>
            <p className="text-emerald-800 font-semibold text-sm leading-relaxed">
              &ldquo;{message.correctedText}&rdquo;
            </p>
          </div>
        )}

        {/* Explanation */}
        {message.explanation && (
          <div className="space-y-1.5">
            <div className="flex items-start space-x-2.5 text-slate-700">
              <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900">Explanation: </span>
                <span className="leading-relaxed">{message.explanation}</span>
              </div>
            </div>

            {/* Roman Urdu Explanation when Language Help is ON */}
            {languageHelp && message.explanationRomanUrdu && (
              <div className="ml-6 p-2 rounded-xl bg-amber-50/80 border border-amber-200/70 text-xs text-amber-900 font-medium">
                <span className="font-bold text-amber-800">Roman Urdu: </span>
                <span>{message.explanationRomanUrdu}</span>
              </div>
            )}
          </div>
        )}

        {/* Natural Expression */}
        {message.naturalVersion && (
          <div className="flex items-start space-x-2.5 text-slate-700 pt-2 border-t border-slate-200/60">
            <Sparkles className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-indigo-700">Natural English: </span>
              <span className="font-medium italic text-slate-800">&ldquo;{message.naturalVersion}&rdquo;</span>
            </div>
          </div>
        )}

        {/* Vocabulary highlights from this exchange */}
        {message.vocabWords && message.vocabWords.length > 0 && (
          <div className="pt-2 border-t border-slate-200/60">
            <div className="flex items-center space-x-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>Key Vocabulary:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {message.vocabWords.map((v, i) => {
                const isSaved = savedWords[v.word];
                return (
                  <div
                    key={i}
                    className="flex items-center space-x-2 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs shadow-2xs"
                  >
                    <div>
                      <span className="font-bold text-indigo-700">{v.word}</span>
                      <span className="text-slate-500 text-[11px] ml-1.5">— {v.meaning}</span>
                      {languageHelp && v.romanUrdu && (
                        <span className="text-emerald-700 text-[11px] font-medium ml-1">
                          ({v.romanUrdu})
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleSave(v.word, v.meaning)}
                      className={`p-1 rounded-lg text-[10px] font-semibold flex items-center space-x-0.5 transition-colors ${
                        isSaved
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600'
                      }`}
                      title={isSaved ? 'Saved to Vocabulary Notebook' : 'Save to Vocabulary'}
                    >
                      {isSaved ? <Check className="w-3 h-3" /> : <BookmarkPlus className="w-3 h-3" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};