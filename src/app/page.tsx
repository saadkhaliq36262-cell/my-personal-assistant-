'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from '@/components/Header';
import { TopicStarter } from '@/components/TopicStarter';
import { ConversationView } from '@/components/ConversationView';
import { VoiceControls } from '@/components/VoiceControls';
import { SettingsModal } from '@/components/SettingsModal';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { usePracticeTimer } from '@/hooks/usePracticeTimer';
import { EnglishLevel, PracticeTopic, ChatMessage, TutorStatus, CoachApiResponse } from '@/types';
import { AlertCircle, X } from 'lucide-react';

const STORAGE_KEY_MESSAGES = 'my_english_coach_messages_v1';
const STORAGE_KEY_SETTINGS = 'my_english_coach_settings_v1';
const STORAGE_KEY_API_KEY = 'my_english_coach_api_key_v1';

export default function HomePage() {
  const [level, setLevel] = useState<EnglishLevel>('intermediate');
  const [topic, setTopic] = useState<PracticeTopic>('free');
  const [apiKey, setApiKey] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);
  const [liveSpeechText, setLiveSpeechText] = useState<string>('');

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
    formattedTime,
    goalMinutes,
    progressPercent,
    goalReached,
    changeGoal,
  } = usePracticeTimer();

  // Scroll to bottom on new messages
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  // Send message to backend Gemini API
  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text || text.trim().length === 0 || isThinking) return;

      const trimmedText = text.trim();
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      const newMsg: ChatMessage = {
        id: messageId,
        role: 'user',
        timestamp: Date.now(),
        originalText: trimmedText,
        topic,
        level,
      };

      setMessages((prev) => [...prev, newMsg]);
      setIsThinking(true);
      setErrorToast(null);
      setLiveSpeechText('');
      scrollToBottom();

      try {
        // Build recent history for context
        const historyContext = messages.slice(-6).flatMap((m) => [
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
          }),
        });

        const data = await res.json();

        if (!res.ok || data.error) {
          throw new Error(data.error || 'Failed to analyze sentence. Please try again.');
        }

        const coachData = data as CoachApiResponse;

        // Update message with coach evaluation
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? {
                  ...m,
                  correctedText: coachData.corrected,
                  explanation: coachData.explanation,
                  naturalVersion: coachData.naturalVersion,
                  aiResponse: coachData.aiResponse,
                  followUpQuestion: coachData.followUpQuestion,
                  hasMistakes: coachData.hasMistakes,
                }
              : m
          )
        );

        // Auto-play speech if enabled
        if (autoSpeak) {
          const speakText = `${coachData.aiResponse} ${coachData.followUpQuestion || ''}`;
          setActiveSpeakingId(messageId);
          speak(speakText);
        }

        scrollToBottom();
      } catch (err: any) {
        console.error('Error sending message:', err);
        setErrorToast(err?.message || 'Network error communicating with English coach.');
      } finally {
        setIsThinking(false);
      }
    },
    [apiKey, autoSpeak, isThinking, level, messages, scrollToBottom, speak, topic]
  );

  // Speech Recognition Hook (Only populates text for manual review; does NOT auto-send)
  const {
    isListening,
    isSupported: isSpeechRecSupported,
    startListening,
    stopListening,
    resetTranscript,
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

  // Load saved state from LocalStorage on mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(STORAGE_KEY_MESSAGES);
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed)) setMessages(parsed);
      }

      const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.level) setLevel(parsed.level);
        if (parsed.topic) setTopic(parsed.topic);
        if (typeof parsed.autoSpeak === 'boolean') setAutoSpeak(parsed.autoSpeak);
        if (typeof parsed.rate === 'number') setRate(parsed.rate);
      }

      const savedKey = localStorage.getItem(STORAGE_KEY_API_KEY);
      if (savedKey) {
        setApiKey(savedKey);
      }
    } catch (e) {
      console.warn('LocalStorage restoration error:', e);
    }
  }, [setAutoSpeak, setRate]);

  // Persist messages to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    } catch (e) {
      // ignore storage quota errors
    }
  }, [messages]);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_SETTINGS,
        JSON.stringify({ level, topic, autoSpeak, rate })
      );
    } catch (e) {
      // ignore
    }
  }, [level, topic, autoSpeak, rate]);

  const handleApiKeyChange = (newKey: string) => {
    setApiKey(newKey);
    try {
      if (newKey) {
        localStorage.setItem(STORAGE_KEY_API_KEY, newKey);
      } else {
        localStorage.removeItem(STORAGE_KEY_API_KEY);
      }
    } catch (e) {
      // ignore
    }
    setErrorToast(null);
  };

  const handleClearChat = () => {
    setMessages([]);
    cancelSpeech();
    setActiveSpeakingId(null);
    setLiveSpeechText('');
    try {
      localStorage.removeItem(STORAGE_KEY_MESSAGES);
    } catch (e) {
      // ignore
    }
  };

  const handleSpeakSingleMessage = (text: string, messageId: string) => {
    setActiveSpeakingId(messageId);
    speak(text);
  };

  const handleStopSpeaking = () => {
    cancelSpeech();
    setActiveSpeakingId(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        level={level}
        onLevelChange={setLevel}
        topic={topic}
        onTopicChange={setTopic}
        formattedTime={formattedTime}
        goalMinutes={goalMinutes}
        progressPercent={progressPercent}
        goalReached={goalReached}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onClearChat={handleClearChat}
        onGoalChange={changeGoal}
      />

      {/* Error Toast notification */}
      {errorToast && (
        <div className="sticky top-16 z-40 max-w-lg mx-auto mt-3 px-4 w-full animate-fade-in">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-950/90 border border-rose-500/40 text-rose-200 text-xs shadow-xl backdrop-blur-md">
            <div className="flex items-center space-x-2 mr-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorToast}</span>
            </div>
            <button
              onClick={() => setErrorToast(null)}
              className="p-1 rounded-lg text-rose-400 hover:text-white hover:bg-rose-900/50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-2 sm:px-4 py-4">
        {messages.length === 0 ? (
          <TopicStarter
            topic={topic}
            level={level}
            onSelectSuggestion={(suggestion) => {
              setLiveSpeechText(suggestion);
            }}
            onStartSpeaking={() => startListening()}
          />
        ) : (
          <ConversationView
            messages={messages}
            onSpeakText={handleSpeakSingleMessage}
            onStopSpeaking={handleStopSpeaking}
            isSpeaking={isSpeaking}
            activeSpeakingId={activeSpeakingId}
          />
        )}
        <div ref={chatBottomRef} />
      </main>

      {/* Floating Bottom Voice Controls */}
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
      />
    </div>
  );
}