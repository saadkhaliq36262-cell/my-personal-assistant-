export type EnglishLevel = 'beginner' | 'intermediate' | 'advanced';

export type PracticeTopic =
  | 'free'
  | 'daily'
  | 'interview'
  | 'travel'
  | 'shopping'
  | 'introduction'
  | 'tech'
  | 'family';

export type PracticeGoalMinutes = 5 | 10 | 15 | 30;

export type TutorStatus = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

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
}

export interface TopicInfo {
  id: PracticeTopic;
  title: string;
  icon: string;
  description: string;
  starterPrompt: string;
  starterSuggestions: string[];
}