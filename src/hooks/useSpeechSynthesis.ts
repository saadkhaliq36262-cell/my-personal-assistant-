'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface VoiceOption {
  voice: SpeechSynthesisVoice;
  name: string;
  lang: string;
  isDefault: boolean;
}

export function useSpeechSynthesis() {
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(1.0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    const loadVoices = () => {
      try {
        const availableVoices = window.speechSynthesis.getVoices();
        // Filter English voices
        const englishVoices = availableVoices.filter(
          v => v.lang.startsWith('en') || v.lang.startsWith('EN')
        );

        const formatted: VoiceOption[] = (englishVoices.length > 0 ? englishVoices : availableVoices).map(v => ({
          voice: v,
          name: v.name,
          lang: v.lang,
          isDefault: v.default,
        }));

        setVoices(formatted);

        // Pick preferred default voice (e.g., Google US English, Natural, Samantha, or first English voice)
        if (!selectedVoice && formatted.length > 0) {
          const naturalOrGoogle = formatted.find(
            v =>
              v.name.includes('Natural') ||
              v.name.includes('Google') ||
              v.name.includes('Samantha') ||
              v.name.includes('US')
          );
          setSelectedVoice(naturalOrGoogle ? naturalOrGoogle.voice : formatted[0].voice);
        }
      } catch (err) {
        console.warn('Failed to load speech synthesis voices:', err);
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [selectedVoice]);

  const cancel = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return;
      }

      if (!text || text.trim().length === 0) return;

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      try {
        // Clean text for cleaner audio reading (remove markdown asterisks or code formatting)
        const cleanText = text
          .replace(/[*_#`~]/g, '')
          .replace(/\n+/g, '. ')
          .trim();

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utteranceRef.current = utterance;

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
        utterance.rate = rate;
        utterance.pitch = pitch;

        utterance.onstart = () => {
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
        };

        utterance.onerror = (e) => {
          // If cancelled purposefully, don't flag as failure
          if (e.error !== 'canceled' && e.error !== 'interrupted') {
            console.warn('Speech synthesis error:', e);
          }
          setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.error('SpeechSynthesis.speak failed:', e);
        setIsSpeaking(false);
      }
    },
    [selectedVoice, rate, pitch]
  );

  return {
    isSpeaking,
    isSupported,
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    pitch,
    setPitch,
    autoSpeak,
    setAutoSpeak,
    speak,
    cancel,
  };
}