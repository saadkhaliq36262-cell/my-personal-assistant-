'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechRecognitionOptions {
  onTranscriptChange?: (transcript: string) => void;
  onError?: (error: string) => void;
  lang?: string;
}

// Clean duplicate speech echoes common in mobile speech engines
function deduplicateSpeech(text: string): string {
  if (!text) return '';
  const trimmed = text.replace(/\s+/g, ' ').trim();

  // Check if entire text is repeated (e.g. "I want to go I want to go")
  const words = trimmed.split(' ');
  if (words.length >= 2 && words.length % 2 === 0) {
    const mid = words.length / 2;
    const left = words.slice(0, mid).join(' ').toLowerCase();
    const right = words.slice(mid).join(' ').toLowerCase();
    if (left === right) {
      return words.slice(0, mid).join(' ');
    }
  }

  // Check if phrase is repeated 3 or 4 times (e.g., "hello hello hello")
  if (words.length >= 3 && words.length % 3 === 0) {
    const chunk = words.length / 3;
    const p1 = words.slice(0, chunk).join(' ').toLowerCase();
    const p2 = words.slice(chunk, chunk * 2).join(' ').toLowerCase();
    const p3 = words.slice(chunk * 2).join(' ').toLowerCase();
    if (p1 === p2 && p2 === p3) {
      return words.slice(0, chunk).join(' ');
    }
  }

  // Filter out adjacent duplicate words (e.g., "Yesterday Yesterday I I go")
  const cleanWords: string[] = [];
  for (let i = 0; i < words.length; i++) {
    const current = words[i];
    const prev = cleanWords[cleanWords.length - 1];
    if (prev && prev.toLowerCase() === current.toLowerCase() && current.length > 1) {
      continue;
    }
    cleanWords.push(current);
  }

  return cleanWords.join(' ');
}

export function useSpeechRecognition({
  onTranscriptChange,
  onError,
  lang = 'en-US',
}: UseSpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);
  const onTranscriptChangeRef = useRef(onTranscriptChange);
  const onErrorRef = useRef(onError);
  const recordedTextRef = useRef('');

  useEffect(() => {
    onTranscriptChangeRef.current = onTranscriptChange;
    onErrorRef.current = onError;
  }, [onTranscriptChange, onError]);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

      const recognition = new SpeechRecognition();
      // On mobile devices, continuous = false prevents Android Chrome speech duplication loops
      recognition.continuous = !isMobile;
      recognition.interimResults = true;
      recognition.lang = lang;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        isListeningRef.current = true;
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let currentFinal = '';
        let currentInterim = '';

        for (let i = 0; i < event.results.length; ++i) {
          const res = event.results[i];
          const text = res[0]?.transcript?.trim() || '';
          if (res.isFinal) {
            currentFinal += (currentFinal ? ' ' : '') + text;
          } else {
            currentInterim += (currentInterim ? ' ' : '') + text;
          }
        }

        // Smart combination to avoid Android duplicate cumulative interim appending
        let combined = '';
        if (currentFinal && currentInterim) {
          if (currentInterim.toLowerCase().startsWith(currentFinal.toLowerCase())) {
            combined = currentInterim;
          } else if (currentFinal.toLowerCase().endsWith(currentInterim.toLowerCase())) {
            combined = currentFinal;
          } else {
            combined = `${currentFinal} ${currentInterim}`.trim();
          }
        } else {
          combined = (currentFinal || currentInterim).trim();
        }

        const cleaned = deduplicateSpeech(combined);
        recordedTextRef.current = cleaned;
        setTranscript(currentFinal);
        setInterimTranscript(currentInterim);

        if (cleaned && onTranscriptChangeRef.current) {
          onTranscriptChangeRef.current(cleaned);
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'aborted' || event.error === 'no-speech') {
          return;
        }

        let userMessage: string | null = null;
        switch (event.error) {
          case 'not-allowed':
          case 'permission-denied':
            userMessage = 'Microphone permission was denied. Please click the lock icon in your browser address bar to allow microphone access.';
            break;
          case 'audio-capture':
            userMessage = 'No microphone was found on your device.';
            break;
          case 'network':
            userMessage = 'Network connection issue during speech recognition. Please check your internet connection.';
            break;
          default:
            console.warn('SpeechRecognition notice:', event.error);
        }

        if (userMessage) {
          setError(userMessage);
          if (onErrorRef.current) {
            onErrorRef.current(userMessage);
          }
        }
      };

      recognition.onend = () => {
        isListeningRef.current = false;
        setIsListening(false);

        const finalText = recordedTextRef.current.trim();
        if (finalText && onTranscriptChangeRef.current) {
          onTranscriptChangeRef.current(finalText);
        }
      };

      recognitionRef.current = recognition;
    } catch (err: any) {
      console.error('SpeechRecognition initialization error:', err);
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [lang]);

  const startListening = useCallback(() => {
    setError(null);
    recordedTextRef.current = '';
    setTranscript('');
    setInterimTranscript('');

    if (!recognitionRef.current) {
      setError('Speech recognition is not supported in this browser. You can type your sentence in the box below.');
      return;
    }

    try {
      isListeningRef.current = true;
      setIsListening(true);
      recognitionRef.current.start();
    } catch (e: any) {
      try {
        recognitionRef.current.stop();
        setTimeout(() => {
          try {
            recognitionRef.current?.start();
          } catch (restartErr) {
            console.warn('Recognition start retry:', restartErr);
          }
        }, 100);
      } catch (err) {
        console.warn('Recognition start exception:', err);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    setIsListening(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }

    const finalText = recordedTextRef.current.trim();
    if (finalText && onTranscriptChangeRef.current) {
      onTranscriptChangeRef.current(finalText);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    recordedTextRef.current = '';
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    fullTranscript: (transcript + (interimTranscript ? ' ' + interimTranscript : '')).trim(),
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}