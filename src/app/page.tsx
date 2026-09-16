'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { HeroBanner } from '@/components/HeroBanner';
import { LevelSelector } from '@/components/LevelSelector';
import { TopicGrid } from '@/components/TopicGrid';
import { ConversationView } from '@/components/ConversationView';
import { VoiceControls } from '@/components/VoiceControls';
import { SettingsModal } from '@/components/SettingsModal';
import { SessionSummaryModal } from '@/components/SessionSummaryModal';
import { ProgressDashboard } from '@/components/ProgressDashboard';
import { VocabularyNotebook } from '@/components/VocabularyNotebook';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { usePracticeTimer } from '@/hooks/usePracticeTimer';
import { StorageService } from '@/lib/storage';
import { PRACTICE_TOPICS } from '@/lib/constants';
import {
  EnglishLevel,
  PracticeTopic,
  ChatMessage,
  TutorStatus,
  CoachApiResponse,
  ActiveNavTab,
  VocabItem,
  ProgressStats,
  PracticeSessionSummary,
  ConversationSession,
} from '@/types';
import { AlertCircle, X } from 'lucide-react';

const STORAGE_KEY_SETTINGS = 'my_english_coach_settings_v2';
const STORAGE_KEY_API_KEY = 'my_english_coach_api_key_v1';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('practice');
  const [level, setLevel] = useState<EnglishLevel>('intermediate');
  const [topic, setTopic] = useState<PracticeTopic>('free');
  const [apiKey, setApiKey] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState<boolean>(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);
  const [liveSpeechText, setLiveSpeechText] = useState<string>('');
  const [languageHelp, setLanguageHelp] = useState<boolean>(true);

  // ChatGPT / Gemini Style Conversation History State
  const [conversations, setConversations] = useState<ConversationSession[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState<boolean>(false);

  // Vocabulary & Progress Stats state
  const [vocabulary, setVocabulary] = useState<VocabItem[]>([]);
  const [progressStats, setProgressStats] = useState<ProgressStats>({
    totalSessions: 0,
    totalMinutes: 0,
    totalConversations: 0,
    weeklyActivity: { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 },
  });
  const [sessionSummaries, setSessionSummaries] = useState<PracticeSessionSummary[]>([]);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Speech Synthesis Hook
  const {
    speak,
    cancel: cancelSpeech,
    isSpeaking,
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    autoSpeak,
    setAutoSpeak,
  } = useSpeechSynthesis();

  // Practice Timer Hook
  const {
    elapsedSeconds,
    formattedTime,
    goalMinutes,
    progressPercent,
    goalReached,
    changeGoal,
    resetTimer,
  } = usePracticeTimer();

  // Scroll to bottom on new messages
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  // Load saved state from LocalStorage on mount
  useEffect(() => {
    try {
      setVocabulary(StorageService.getVocabulary());
      setProgressStats(StorageService.getProgressStats());
      setSessionSummaries(StorageService.getSessionSummaries());

      const loadedConversations = StorageService.getConversations();
      setConversations(loadedConversations);

      const savedActiveId = StorageService.getActiveConversationId();
      if (savedActiveId && loadedConversations.some((c) => c.id === savedActiveId)) {
        const found = loadedConversations.find((c) => c.id === savedActiveId);
        if (found) {
          setActiveConversationId(found.id);
          setMessages(found.messages || []);
          setTopic(found.topic || 'free');
          setLevel(found.level || 'intermediate');
        }
      } else if (loadedConversations.length > 0) {
        const first = loadedConversations[0];
        setActiveConversationId(first.id);
        setMessages(first.messages || []);
        setTopic(first.topic || 'free');
        setLevel(first.level || 'intermediate');
        StorageService.setActiveConversationId(first.id);
      } else {
        // Initialize with a fresh blank conversation ID
        const newId = `conv_${Date.now()}`;
        setActiveConversationId(newId);
        setMessages([]);
        StorageService.setActiveConversationId(newId);
      }

      const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.level) setLevel(parsed.level);
        if (parsed.topic) setTopic(parsed.topic);
        if (typeof parsed.autoSpeak === 'boolean') setAutoSpeak(parsed.autoSpeak);
        if (typeof parsed.rate === 'number') setRate(parsed.rate);
        if (typeof parsed.languageHelp === 'boolean') setLanguageHelp(parsed.languageHelp);
      }

      const savedKey = localStorage.getItem(STORAGE_KEY_API_KEY);
      if (savedKey) {
        setApiKey(savedKey);
      }
    } catch (e) {
      console.warn('LocalStorage restoration error:', e);
    }
  }, [setAutoSpeak, setRate]);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_SETTINGS,
        JSON.stringify({ level, topic, autoSpeak, rate, languageHelp })
      );
    } catch {
      // ignore
    }
  }, [level, topic, autoSpeak, rate, languageHelp]);

  // Start a fresh new chat session
  const handleNewChat = useCallback(
    (initialTopic?: PracticeTopic) => {
      const newId = `conv_${Date.now()}`;
      const targetTopic = initialTopic || topic || 'free';
      const targetLevel = level || 'intermediate';

      setActiveConversationId(newId);
      setMessages([]);
      setTopic(targetTopic);
      setLevel(targetLevel);
      setLiveSpeechText('');
      cancelSpeech();
      setActiveSpeakingId(null);
      StorageService.setActiveConversationId(newId);
      resetTimer();
    },
    [cancelSpeech, level, resetTimer, topic]
  );

  // Switch to a previous conversation from the sidebar
  const handleSelectConversation = useCallback(
    (id: string) => {
      const found = conversations.find((c) => c.id === id);
      if (!found) return;

      setActiveConversationId(found.id);
      setMessages(found.messages || []);
      setTopic(found.topic || 'free');
      setLevel(found.level || 'intermediate');
      setLiveSpeechText('');
      cancelSpeech();
      setActiveSpeakingId(null);
      StorageService.setActiveConversationId(found.id);
      scrollToBottom();
    },
    [cancelSpeech, conversations, scrollToBottom]
  );

  // Delete a previous conversation from the sidebar
  const handleDeleteConversation = useCallback(
    (id: string) => {
      const updated = StorageService.deleteConversation(id);
      setConversations(updated);

      if (activeConversationId === id) {
        // If the deleted conversation is currently open, automatically open a new empty conversation
        handleNewChat();
      }
    },
    [activeConversationId, handleNewChat]
  );

  // Rename a conversation in the sidebar
  const handleRenameConversation = useCallback(
    (id: string, newTitle: string) => {
      const updated = StorageService.renameConversation(id, newTitle);
      setConversations(updated);
    },
    []
  );

  // Vocabulary handlers
  const handleSaveWord = useCallback(
    (word: string, meaning: string, example?: string) => {
      const updated = StorageService.addWord(word, meaning, example, topic);
      setVocabulary(updated);
    },
    [topic]
  );

  const handleDeleteWord = useCallback((id: string) => {
    const updated = StorageService.deleteWord(id);
    setVocabulary(updated);
  }, []);

  const handleToggleMastered = useCallback((id: string) => {
    const updated = StorageService.toggleMastered(id);
    setVocabulary(updated);
  }, []);

  // Send message to backend Gemini API and update conversation history
  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text || text.trim().length === 0 || isThinking) return;

      const trimmedText = text.trim();
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const convId = activeConversationId || `conv_${Date.now()}`;
      if (!activeConversationId) {
        setActiveConversationId(convId);
        StorageService.setActiveConversationId(convId);
      }

      const newMsg: ChatMessage = {
        id: messageId,
        role: 'user',
        timestamp: Date.now(),
        originalText: trimmedText,
        topic,
        level,
      };

      const updatedMessages = [...messages, newMsg];
      setMessages(updatedMessages);
      setIsThinking(true);
      setErrorToast(null);
      setLiveSpeechText('');
      scrollToBottom();

      // Find or create current conversation session
      const existingConv = conversations.find((c) => c.id === convId);
      const convTitle =
        existingConv?.title && existingConv.title !== 'English Practice'
          ? existingConv.title
          : StorageService.generateTitle(topic, trimmedText);

      const updatedSession: ConversationSession = {
        id: convId,
        title: convTitle,
        topic,
        level,
        messages: updatedMessages,
        createdAt: existingConv?.createdAt || Date.now(),
        updatedAt: Date.now(),
      };

      const newConversations = StorageService.saveConversation(updatedSession);
      setConversations(newConversations);

      try {
        // Build recent history for context
        const historyContext = updatedMessages.slice(-6).flatMap((m) => [
          { role: 'user', content: m.originalText },
          ...(m.aiResponse ? [{ role: 'assistant', content: m.aiResponse }] : []),
        ]);

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(apiKey ? { 'x-gemini-api-key': apiKey } : {}),
          },
          body: JSON.stringify({
            message: trimmedText,
            level,
            topic,
            history: historyContext,
            apiKey: apiKey || undefined,
            languageHelp,
          }),
        });

        const data = await res.json();

        if (!res.ok || data.error) {
          throw new Error(data.error || 'Failed to analyze sentence. Please try again.');
        }

        const coachData = data as CoachApiResponse;

        // Update message with coach evaluation
        const finalMessages = updatedMessages.map((m) =>
          m.id === messageId
            ? {
                ...m,
                correctedText: coachData.corrected,
                explanation: coachData.explanation,
                explanationRomanUrdu: coachData.explanationRomanUrdu,
                naturalVersion: coachData.naturalVersion,
                aiResponse: coachData.aiResponse,
                followUpQuestion: coachData.followUpQuestion,
                questionRomanUrdu: coachData.questionRomanUrdu,
                hintEnglish: coachData.hintEnglish,
                hintRomanUrdu: coachData.hintRomanUrdu,
                simpleEnglishQuestion: coachData.simpleEnglishQuestion,
                hasMistakes: coachData.hasMistakes,
                vocabWords: coachData.vocabWords,
              }
            : m
        );

        setMessages(finalMessages);

        // Update conversation session in storage
        const finishedSession: ConversationSession = {
          ...updatedSession,
          messages: finalMessages,
          updatedAt: Date.now(),
        };
        const syncedConversations = StorageService.saveConversation(finishedSession);
        setConversations(syncedConversations);

        // If AI recommended vocabulary words, auto-save to notebook
        if (coachData.vocabWords && coachData.vocabWords.length > 0) {
          coachData.vocabWords.forEach((v) => {
            if (v.word && v.meaning) {
              const updatedVocab = StorageService.addWord(
                v.word,
                v.meaning,
                coachData.corrected || trimmedText,
                topic
              );
              setVocabulary(updatedVocab);
            }
          });
        }

        // Auto-play speech if enabled
        if (autoSpeak) {
          const speakText = `${coachData.aiResponse} ${coachData.followUpQuestion || ''}`;
          setActiveSpeakingId(messageId);
          speak(speakText);
        }

        scrollToBottom();
      } catch (err: unknown) {
        console.error('Error sending message:', err);
        const errorObj = err as { message?: string };
        setErrorToast(errorObj?.message || 'Network error communicating with English coach.');
      } finally {
        setIsThinking(false);
      }
    },
    [
      activeConversationId,
      apiKey,
      autoSpeak,
      conversations,
      isThinking,
      level,
      messages,
      scrollToBottom,
      speak,
      topic,
      languageHelp,
    ]
  );

  // Speech Recognition Hook (Only populates text for review; does not auto-send)
  const {
    isListening,
    isSupported: isSpeechRecSupported,
    startListening,
    stopListening,
    error: speechError,
  } = useSpeechRecognition({
    onTranscriptChange: (text) => {
      setLiveSpeechText(text);
    },
    onError: (err) => {
      setErrorToast(err);
    },
  });

  // Calculate global status
  const currentStatus: TutorStatus = isThinking
    ? 'thinking'
    : isListening
    ? 'listening'
    : isSpeaking
    ? 'speaking'
    : speechError
    ? 'error'
    : 'idle';

  // End Session & Generate Performance Summary
  const handleEndSession = useCallback(() => {
    const sessionMinutes = Math.max(1, Math.round(elapsedSeconds / 60));
    const correctionsCount = messages.filter((m) => m.hasMistakes).length;

    const summary: PracticeSessionSummary = {
      id: `session_${Date.now()}`,
      topic,
      level,
      messagesCount: messages.length,
      durationMinutes: sessionMinutes,
      correctionsCount,
      strengths:
        messages.length >= 6
          ? 'Great continuous conversational engagement and vocabulary usage.'
          : 'Clear sentence structures and motivated speaking practice.',
      focusAreas:
        correctionsCount >= 2
          ? 'Focus on applying suggested verb tenses and natural phrasings.'
          : 'Continue building confidence with more complex compound sentences.',
      timestamp: Date.now(),
    };

    const updatedSummaries = StorageService.saveSessionSummary(summary);
    const updatedStats = StorageService.recordSession(sessionMinutes, messages.length);

    setSessionSummaries(updatedSummaries);
    setProgressStats(updatedStats);
    setIsSummaryModalOpen(true);
    resetTimer();
  }, [elapsedSeconds, level, messages, resetTimer, topic]);

  const handleApiKeyChange = (newKey: string) => {
    setApiKey(newKey);
    try {
      if (newKey) {
        localStorage.setItem(STORAGE_KEY_API_KEY, newKey);
      } else {
        localStorage.removeItem(STORAGE_KEY_API_KEY);
      }
    } catch {
      // ignore
    }
    setErrorToast(null);
  };

  const handleClearChat = () => {
    handleNewChat();
  };

  const handleSpeakSingleMessage = (text: string, messageId: string) => {
    setActiveSpeakingId(messageId);
    speak(text);
  };

  const handleStopSpeaking = () => {
    cancelSpeech();
    setActiveSpeakingId(null);
  };

  const currentTopicObj = PRACTICE_TOPICS.find((t) => t.id === topic) || PRACTICE_TOPICS[0];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Header with Sidebar Toggle for mobile */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        level={level}
        onLevelChange={setLevel}
        topic={topic}
        formattedTime={formattedTime}
        goalMinutes={goalMinutes}
        progressPercent={progressPercent}
        goalReached={goalReached}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onClearChat={handleClearChat}
        onGoalChange={changeGoal}
        onEndSession={handleEndSession}
        messagesCount={messages.length}
        onToggleSidebar={() => setIsSidebarOpenMobile((prev) => !prev)}
        languageHelp={languageHelp}
        onToggleLanguageHelp={() => setLanguageHelp((prev) => !prev)}
      />

      {/* Error Toast Notification */}
      {errorToast && (
        <div className="sticky top-16 z-40 max-w-lg mx-auto mt-3 px-4 w-full animate-fadeIn">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-600 text-white text-xs font-semibold shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-2 mr-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorToast}</span>
            </div>
            <button
              onClick={() => setErrorToast(null)}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-rose-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {/* 1. PRACTICE TAB: ChatGPT / Gemini Two-Column Layout (Sidebar + Active Chat) */}
        {activeTab === 'practice' && (
          <div className="flex w-full min-h-[calc(100vh-61px)]">
            {/* Left Sidebar (Desktop Docked + Mobile Slide-over Drawer) */}
            <Sidebar
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={handleSelectConversation}
              onNewChat={() => handleNewChat()}
              onDeleteConversation={handleDeleteConversation}
              onRenameConversation={handleRenameConversation}
              isOpenMobile={isSidebarOpenMobile}
              onCloseMobile={() => setIsSidebarOpenMobile(false)}
              onSelectTab={setActiveTab}
            />

            {/* Right Main Chat & Practice Area */}
            <div className="flex-1 min-w-0 flex flex-col justify-between max-w-4xl mx-auto px-3 sm:px-6 py-6 pb-48">
              {messages.length === 0 ? (
                <div className="space-y-6">
                  {/* Hero Introduction Banner */}
                  <HeroBanner
                    onStartPractice={() => startListening()}
                    level={level}
                    topic={topic}
                    onOpenTopics={() => setActiveTab('topics')}
                  />

                  {/* Level Selection Cards */}
                  <LevelSelector currentLevel={level} onSelectLevel={setLevel} />

                  {/* Topics Grid */}
                  <TopicGrid
                    currentTopic={topic}
                    onSelectTopic={(t) => {
                      setTopic(t);
                    }}
                    onStartChat={(starter) => {
                      if (starter) setLiveSpeechText(starter);
                    }}
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Active Session Info Bar */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-2 rounded-xl bg-indigo-50 border border-indigo-100">
                        {currentTopicObj.icon}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-sm font-bold text-slate-900">
                            {currentTopicObj.title}
                          </h2>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 uppercase">
                            {level}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {currentTopicObj.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleNewChat()}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 transition-colors"
                      >
                        + New Chat
                      </button>
                      <button
                        onClick={() => setActiveTab('topics')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                      >
                        Change Topic
                      </button>
                      <button
                        onClick={handleEndSession}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                      >
                        End Session
                      </button>
                    </div>
                  </div>

                  {/* Main Active Conversation View */}
                  <ConversationView
                    messages={messages}
                    isThinking={isThinking}
                    onSpeakText={handleSpeakSingleMessage}
                    onStopSpeaking={handleStopSpeaking}
                    isSpeaking={isSpeaking}
                    activeSpeakingId={activeSpeakingId}
                    onSaveWord={handleSaveWord}
                    languageHelp={languageHelp}
                  />
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>
          </div>
        )}

        {/* 2. TOPICS TAB */}
        {activeTab === 'topics' && (
          <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Explore Conversation Topics
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Choose a specific scenario to practice specialized vocabulary, idioms, and realistic questions.
              </p>
            </div>

            <TopicGrid
              currentTopic={topic}
              onSelectTopic={(selectedTopic) => {
                setTopic(selectedTopic);
                handleNewChat(selectedTopic);
                setActiveTab('practice');
              }}
              onStartChat={(starter) => {
                if (starter) setLiveSpeechText(starter);
                setActiveTab('practice');
              }}
            />
          </div>
        )}

        {/* 3. PROGRESS TAB */}
        {activeTab === 'progress' && (
          <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6">
            <ProgressDashboard
              stats={progressStats}
              sessionSummaries={sessionSummaries}
              savedWordsCount={vocabulary.length}
              currentLevel={level}
              onStartPractice={() => {
                handleNewChat();
                setActiveTab('practice');
              }}
              onSelectTopic={(t) => {
                setTopic(t);
                handleNewChat(t);
                setActiveTab('practice');
              }}
            />
          </div>
        )}

        {/* 4. VOCABULARY TAB */}
        {activeTab === 'vocabulary' && (
          <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6">
            <VocabularyNotebook
              vocabulary={vocabulary}
              onAddWord={(word, meaning, example, t) => {
                const updated = StorageService.addWord(word, meaning, example, t);
                setVocabulary(updated);
              }}
              onDeleteWord={handleDeleteWord}
              onToggleMastered={handleToggleMastered}
              onSpeakWord={(word) => speak(word)}
              onStartPractice={() => {
                handleNewChat();
                setActiveTab('practice');
              }}
            />
          </div>
        )}
      </main>

      {/* Floating Bottom Voice Controls (Active on Practice Tab) */}
      {activeTab === 'practice' && (
        <VoiceControls
          status={currentStatus}
          isListening={isListening}
          isSpeaking={isSpeaking}
          liveSpeechText={liveSpeechText}
          onStartListening={startListening}
          onStopListening={stopListening}
          onStopSpeaking={handleStopSpeaking}
          onSendMessage={handleSendMessage}
          isSpeechSupported={isSpeechRecSupported}
        />
      )}

      {/* Footer */}
      <Footer onSelectTab={setActiveTab} />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        voices={voices}
        selectedVoice={selectedVoice}
        onSelectVoice={setSelectedVoice}
        rate={rate}
        onRateChange={setRate}
        autoSpeak={autoSpeak}
        onAutoSpeakChange={setAutoSpeak}
        goalMinutes={goalMinutes}
        onGoalChange={changeGoal}
        onClearHistory={handleClearChat}
        apiKey={apiKey}
        onApiKeyChange={handleApiKeyChange}
        languageHelp={languageHelp}
        onLanguageHelpChange={setLanguageHelp}
      />

      {/* Session Summary Modal */}
      <SessionSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        topic={topic}
        level={level}
        messagesCount={messages.length}
        durationMinutes={Math.max(1, Math.round(elapsedSeconds / 60))}
        correctionsCount={messages.filter((m) => m.hasMistakes).length}
        onStartNewSession={() => {
          handleNewChat();
          setActiveTab('practice');
        }}
        onViewProgress={() => setActiveTab('progress')}
      />

      {/* Floating WhatsApp Support Button */}
      <WhatsAppButton />
    </div>
  );
}