'use client';

import React, { useState, useMemo } from 'react';
import { VocabItem, PracticeTopic } from '@/types';
import { PRACTICE_TOPICS } from '@/lib/constants';

interface VocabularyNotebookProps {
  vocabulary: VocabItem[];
  onAddWord: (word: string, meaning: string, example?: string, topic?: PracticeTopic) => void;
  onDeleteWord: (id: string) => void;
  onToggleMastered: (id: string) => void;
  onSpeakWord: (text: string) => void;
  onStartPractice: () => void;
}

export const VocabularyNotebook: React.FC<VocabularyNotebookProps> = ({
  vocabulary,
  onAddWord,
  onDeleteWord,
  onToggleMastered,
  onSpeakWord,
  onStartPractice,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'learning' | 'mastered'>('all');
  const [isAdding, setIsAdding] = useState(false);

  // Form states for manual word addition
  const [newWord, setNewWord] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newExample, setNewExample] = useState('');
  const [newTopic, setNewTopic] = useState<PracticeTopic>('free');

  const filteredVocab = useMemo(() => {
    return vocabulary.filter((item) => {
      const matchesSearch =
        item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.example && item.example.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (selectedFilter === 'learning') return !item.mastered;
      if (selectedFilter === 'mastered') return !!item.mastered;
      return true;
    });
  }, [vocabulary, searchQuery, selectedFilter]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newMeaning.trim()) return;
    onAddWord(newWord.trim(), newMeaning.trim(), newExample.trim() || undefined, newTopic);
    setNewWord('');
    setNewMeaning('');
    setNewExample('');
    setIsAdding(false);
  };

  const masteredCount = vocabulary.filter((v) => v.mastered).length;
  const learningCount = vocabulary.length - masteredCount;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold mb-2 border border-amber-200/60">
            <span>📚 Vocabulary Notebook</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Words to Remember</h2>
          <p className="text-sm text-slate-500 mt-1">
            Review and practice expressions automatically extracted from your coaching conversations.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            <span>{isAdding ? '✕ Cancel' : '➕ Add New Word'}</span>
          </button>
        </div>
      </div>

      {/* Quick Add Form */}
      {isAdding && (
        <form
          onSubmit={handleAddSubmit}
          className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-5 shadow-sm space-y-4 animate-scaleUp"
        >
          <h3 className="text-sm font-bold text-indigo-900">Add a Word or Expression</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Word or Idiom *
              </label>
              <input
                type="text"
                required
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                placeholder="e.g., Hit the ground running"
                className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Definition / Meaning *
              </label>
              <input
                type="text"
                required
                value={newMeaning}
                onChange={(e) => setNewMeaning(e.target.value)}
                placeholder="e.g., Start a project with great enthusiasm and speed."
                className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Example Sentence (Optional)
              </label>
              <input
                type="text"
                value={newExample}
                onChange={(e) => setNewExample(e.target.value)}
                placeholder="e.g., She hit the ground running on her first day."
                className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Topic Category
              </label>
              <select
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value as PracticeTopic)}
                className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {PRACTICE_TOPICS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.icon} {t.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
            >
              Save to Notebook
            </button>
          </div>
        </form>
      )}

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-sm">
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved vocabulary..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              selectedFilter === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({vocabulary.length})
          </button>
          <button
            onClick={() => setSelectedFilter('learning')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              selectedFilter === 'learning'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/60'
            }`}
          >
            Learning ({learningCount})
          </button>
          <button
            onClick={() => setSelectedFilter('mastered')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              selectedFilter === 'mastered'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
            }`}
          >
            Mastered ({masteredCount})
          </button>
        </div>
      </div>

      {/* Vocabulary Cards Grid */}
      {filteredVocab.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm">
          <span className="text-4xl mb-3 block">📖</span>
          <h3 className="text-base font-bold text-slate-800">
            {searchQuery ? 'No matching words found' : 'Your vocabulary notebook is empty'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? 'Try adjusting your search query or clear the filter.'
              : 'Save words during conversation feedback or use the "Add New Word" button above.'}
          </p>
          {!searchQuery && (
            <button
              onClick={onStartPractice}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              Start Speaking Practice
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVocab.map((item) => {
            const topicMeta = PRACTICE_TOPICS.find((t) => t.id === item.topic);

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between group hover:shadow-md ${
                  item.mastered
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-slate-200/90 shadow-sm'
                }`}
              >
                <div>
                  {/* Top row: Word, Audio, Mastered Check */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {item.word}
                      </h4>
                      <button
                        onClick={() => onSpeakWord(item.word)}
                        title="Listen to pronunciation"
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-600 flex items-center justify-center text-xs transition-colors"
                      >
                        🔊
                      </button>
                    </div>

                    <button
                      onClick={() => onToggleMastered(item.id)}
                      title={item.mastered ? 'Mark as learning' : 'Mark as mastered'}
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-all ${
                        item.mastered
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                          : 'bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200'
                      }`}
                    >
                      {item.mastered ? '✓ Mastered' : '○ Learning'}
                    </button>
                  </div>

                  {/* Meaning */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {item.meaning}
                  </p>

                  {/* Example if exists */}
                  {item.example && (
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-150 mb-3 text-xs text-slate-700 italic">
                      &quot;{item.example}&quot;
                    </div>
                  )}
                </div>

                {/* Footer of card */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 font-medium text-slate-500">
                    {topicMeta?.icon || '💬'} {topicMeta?.title || 'General'}
                  </span>
                  <button
                    onClick={() => onDeleteWord(item.id)}
                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    title="Delete word"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
