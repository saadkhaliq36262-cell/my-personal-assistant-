import { VocabItem, ProgressStats, PracticeSessionSummary, EnglishLevel, PracticeTopic } from '@/types';

const STORAGE_KEYS = {
  MESSAGES: 'my_english_coach_messages_v2',
  SETTINGS: 'my_english_coach_settings_v2',
  API_KEY: 'my_english_coach_api_key_v1',
  VOCABULARY: 'my_english_coach_vocabulary_v2',
  PROGRESS: 'my_english_coach_progress_v2',
  SESSIONS: 'my_english_coach_sessions_v2',
};

const DEFAULT_STATS: ProgressStats = {
  totalSessions: 0,
  totalMinutes: 0,
  totalConversations: 0,
  weeklyActivity: {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
  },
};

const DEFAULT_VOCAB: VocabItem[] = [
  {
    id: 'v_default_1',
    word: 'Confident',
    meaning: 'Feeling sure about your abilities or qualities.',
    example: 'Practicing speaking every day makes me feel more confident.',
    topic: 'free',
    createdAt: Date.now() - 86400000 * 2,
    mastered: false,
  },
  {
    id: 'v_default_2',
    word: 'Improve',
    meaning: 'To become better or make something better.',
    example: 'I want to improve my English fluency for my career.',
    topic: 'daily',
    createdAt: Date.now() - 86400000,
    mastered: false,
  },
  {
    id: 'v_default_3',
    word: 'Opportunity',
    meaning: 'A set of circumstances that makes it possible to do something.',
    example: 'Learning English opens up great global career opportunities.',
    topic: 'interview',
    createdAt: Date.now(),
    mastered: false,
  },
];

export const StorageService = {
  // Vocabulary
  getVocabulary(): VocabItem[] {
    if (typeof window === 'undefined') return DEFAULT_VOCAB;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VOCABULARY);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.VOCABULARY, JSON.stringify(DEFAULT_VOCAB));
        return DEFAULT_VOCAB;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_VOCAB;
    }
  },

  saveVocabulary(items: VocabItem[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.VOCABULARY, JSON.stringify(items));
    } catch (e) {
      console.warn('Storage error saving vocabulary:', e);
    }
  },

  addWord(word: string, meaning: string, example?: string, topic?: PracticeTopic): VocabItem[] {
    const existing = this.getVocabulary();
    const cleanWord = word.trim();
    if (!cleanWord) return existing;

    // Check if already exists
    if (existing.some((w) => w.word.toLowerCase() === cleanWord.toLowerCase())) {
      return existing;
    }

    const newItem: VocabItem = {
      id: `vocab_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      word: cleanWord,
      meaning: meaning.trim() || 'A useful English vocabulary expression.',
      example: example?.trim(),
      topic,
      createdAt: Date.now(),
      mastered: false,
    };

    const updated = [newItem, ...existing];
    this.saveVocabulary(updated);
    return updated;
  },

  deleteWord(id: string): VocabItem[] {
    const existing = this.getVocabulary();
    const updated = existing.filter((w) => w.id !== id);
    this.saveVocabulary(updated);
    return updated;
  },

  toggleMastered(id: string): VocabItem[] {
    const existing = this.getVocabulary();
    const updated = existing.map((w) => (w.id === id ? { ...w, mastered: !w.mastered } : w));
    this.saveVocabulary(updated);
    return updated;
  },

  // Progress Stats
  getProgressStats(): ProgressStats {
    if (typeof window === 'undefined') return DEFAULT_STATS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      return data ? { ...DEFAULT_STATS, ...JSON.parse(data) } : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  },

  recordSession(minutes: number, messagesCount: number): ProgressStats {
    const current = this.getProgressStats();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDay = days[new Date().getDay()];

    const updated: ProgressStats = {
      totalSessions: current.totalSessions + 1,
      totalMinutes: current.totalMinutes + minutes,
      totalConversations: current.totalConversations + messagesCount,
      weeklyActivity: {
        ...current.weeklyActivity,
        [currentDay]: (current.weeklyActivity[currentDay] || 0) + minutes,
      },
    };

    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage error saving progress:', e);
    }

    return updated;
  },

  // Session Summaries History
  getSessionSummaries(): PracticeSessionSummary[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveSessionSummary(summary: PracticeSessionSummary): PracticeSessionSummary[] {
    const existing = this.getSessionSummaries();
    const updated = [summary, ...existing].slice(0, 20); // keep last 20
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage error saving session summary:', e);
    }
    return updated;
  },
};