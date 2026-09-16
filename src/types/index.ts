export type EnglishLevel = 'beginner' | 'intermediate' | 'advanced';

export type PracticeTopic =
  | 'free'
  | 'daily'
  | 'interview'
  | 'travel'
  | 'business'
  | 'shopping'
  | 'tech'
  | 'hobbies';

export type PracticeGoalMinutes = 5 | 10 | 15 | 30;

export type TutorStatus = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

export type ActiveNavTab = 'practice' | 'topics' | 'progress' | 'vocabulary';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  timestamp: number;
  originalText: string;
  correctedText?: string;
  explanation?: string;
  naturalVersion?: string;
  aiResponse?: string;
  followUpQuestion?: string;
  hasMistakes?: boolean;
  topic?: PracticeTopic;
  level?: EnglishLevel;
  vocabWords?: { word: string; meaning: string }[];
}

export interface CoachApiResponse {
  hasMistakes: boolean;
  original: string;
  corrected: string;
  explanation: string;
  naturalVersion: string;
  aiResponse: string;
  followUpQuestion: string;
  encouragementTip?: string;
  vocabWords?: { word: string; meaning: string }[];
}

export interface TopicInfo {
  id: PracticeTopic;
  title: string;
  icon: string;
  category: string;
  description: string;
  starterPrompt: string;
  starterSuggestions: string[];
}

export interface VocabItem {
  id: string;
  word: string;
  meaning: string;
  example?: string;
  topic?: PracticeTopic;
  createdAt: number;
  mastered?: boolean;
}

export interface PracticeSessionSummary {
  id: string;
  topic: PracticeTopic;
  level: EnglishLevel;
  messagesCount: number;
  durationMinutes: number;
  correctionsCount: number;
  strengths: string;
  focusAreas: string;
  timestamp: number;
}

export interface ProgressStats {
  totalSessions: number;
  totalMinutes: number;
  totalConversations: number;
  weeklyActivity: { [day: string]: number }; // e.g. { 'Mon': 10, 'Tue': 15 }
}

export interface ConversationSession {
  id: string;
  title: string;
  topic: PracticeTopic;
  level: EnglishLevel;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}