'use client';

import React from 'react';
import { ProgressStats, PracticeSessionSummary, EnglishLevel, PracticeTopic } from '@/types';
import { WEEK_DAYS, PRACTICE_TOPICS, ENGLISH_LEVELS } from '@/lib/constants';

interface ProgressDashboardProps {
  stats: ProgressStats;
  sessionSummaries: PracticeSessionSummary[];
  savedWordsCount: number;
  currentLevel: EnglishLevel;
  onStartPractice: () => void;
  onSelectTopic: (topic: PracticeTopic) => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  stats,
  sessionSummaries,
  savedWordsCount,
  currentLevel,
  onStartPractice,
  onSelectTopic,
}) => {
  const currentLevelObj = ENGLISH_LEVELS.find((l) => l.id === currentLevel) || ENGLISH_LEVELS[0];

  // Calculate max minutes for bar height scaling (at least 20 min scale)
  const maxWeeklyMinutes = Math.max(
    20,
    ...Object.values(stats.weeklyActivity || {})
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm mb-3">
            <span>✨ Your Learning Journey</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Practice Consistency Dashboard
          </h2>
          <p className="text-indigo-100 text-sm sm:text-base leading-relaxed mb-6">
            Track your daily speaking minutes, fluency milestones, and grammar improvement as you practice with your AI coach.
          </p>
          <button
            onClick={onStartPractice}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-700 font-semibold text-sm rounded-xl shadow-md hover:bg-indigo-50 active:scale-95 transition-all"
          >
            <span>🎙️ Start Practice Session</span>
          </button>
        </div>
      </div>

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Sessions
            </span>
            <span className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
              🎯
            </span>
          </div>
          <div className="text-3xl font-bold text-slate-900 tracking-tight">
            {stats.totalSessions}
          </div>
          <p className="text-xs text-slate-500 mt-1">Speaking practices completed</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Practice Time
            </span>
            <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
              ⏱️
            </span>
          </div>
          <div className="text-3xl font-bold text-slate-900 tracking-tight">
            {stats.totalMinutes} <span className="text-base font-normal text-slate-500">min</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Total minutes spoken</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Conversations
            </span>
            <span className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
              💬
            </span>
          </div>
          <div className="text-3xl font-bold text-slate-900 tracking-tight">
            {stats.totalConversations}
          </div>
          <p className="text-xs text-slate-500 mt-1">Sentences & exchanges</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Saved Words
            </span>
            <span className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
              📚
            </span>
          </div>
          <div className="text-3xl font-bold text-slate-900 tracking-tight">
            {savedWordsCount}
          </div>
          <p className="text-xs text-slate-500 mt-1">Vocabulary notebook items</p>
        </div>
      </div>

      {/* Main Grid: Weekly Activity & Current Level */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Visualizer (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Weekly Practice Activity</h3>
              <p className="text-xs text-slate-500">Minutes practiced per day this week</p>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
              Daily Target: 10m
            </span>
          </div>

          <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2">
            {WEEK_DAYS.map((day) => {
              const minutes = stats.weeklyActivity?.[day] || 0;
              const heightPercent = Math.min(100, Math.round((minutes / maxWeeklyMinutes) * 100));
              const isTargetMet = minutes >= 10;

              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[11px] font-semibold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {minutes}m
                  </div>
                  <div className="w-full max-w-[42px] bg-slate-100 rounded-t-lg relative h-36 flex items-end overflow-hidden">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        isTargetMet
                          ? 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                          : minutes > 0
                          ? 'bg-gradient-to-t from-indigo-600 to-indigo-400'
                          : 'bg-slate-200'
                      }`}
                      style={{ height: `${Math.max(6, heightPercent)}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-900">
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Level & Mastery Card (1 col) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Active Level</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                {currentLevelObj.tag}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 mb-4">
              <h4 className="text-sm font-bold text-slate-800 mb-1">{currentLevelObj.label} English</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{currentLevelObj.description}</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-slate-600">
                <span>Fluency Focus</span>
                <span className="text-indigo-600 font-semibold">Active</span>
              </div>
              <p className="text-xs text-slate-500 bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100">
                🎯 {currentLevelObj.focus}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-[11px] text-slate-400 text-center">
              Switch anytime between Beginner, Intermediate & Advanced from the Practice tab.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Session Summaries */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Past Practice Summaries</h3>
            <p className="text-xs text-slate-500">Review highlights and coaching feedback from your sessions</p>
          </div>
        </div>

        {sessionSummaries.length === 0 ? (
          <div className="text-center py-10 px-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            <span className="text-3xl mb-2 block">📝</span>
            <p className="text-sm font-semibold text-slate-700">No session summaries yet</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Complete a 5–10 minute speaking session or click &quot;End Session&quot; to generate an AI performance summary.
            </p>
            <button
              onClick={onStartPractice}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              Start First Practice
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sessionSummaries.map((s) => {
              const topicMeta = PRACTICE_TOPICS.find((t) => t.id === s.topic);
              const dateStr = new Date(s.timestamp).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={s.id}
                  className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base">{topicMeta?.icon || '💬'}</span>
                      <h4 className="text-sm font-bold text-slate-800">
                        {topicMeta?.title || 'Practice Session'}
                      </h4>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200/80 font-medium text-slate-700 uppercase">
                        {s.level}
                      </span>
                      <span className="text-xs text-slate-400">• {dateStr}</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      <strong className="text-emerald-700">Strength:</strong> {s.strengths}
                    </p>
                    <p className="text-xs text-slate-600">
                      <strong className="text-indigo-700">Focus:</strong> {s.focusAreas}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                    <div className="text-right text-xs">
                      <div className="font-bold text-slate-800">{s.durationMinutes} min</div>
                      <div className="text-slate-500">{s.messagesCount} exchanges</div>
                    </div>
                    <button
                      onClick={() => onSelectTopic(s.topic)}
                      className="px-3 py-1.5 bg-white border border-slate-300 hover:border-indigo-500 hover:text-indigo-600 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-all"
                    >
                      Practice Again
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
