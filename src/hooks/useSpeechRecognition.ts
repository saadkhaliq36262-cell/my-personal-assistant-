'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechRecognitionOptions {
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
  lang?: string;
}

export function useSpeechRecognition({
  onResult,
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
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);
  const recordedTextRef = useRef('');

  // Keep callback refs fresh without triggering effect re-runs
  useEffect(() => {
    onResultRef.current = onResult;
    onErrorRef.current = onError;
  }, [onResult, onError]);

  // Initialize Speech Recognition once
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
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        isListeningRef.current = true;
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let currentFinal = '';

        for (let i = 0; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            currentFinal += (currentFinal ? ' ' : '') + res[0].transcript.trim();
          } else {
            currentInterim += (currentInterim ? ' ' : '') + res[0].transcript.trim();
          }
        }

        const fullCaptured = (currentFinal + ' ' + currentInterim).trim();
        recordedTextRef.current = fullCaptured;
        setTranscript(currentFinal);
        setInterimTranscript(currentInterim);
      };

      recognition.onerror = (event: any) => {
        // 'aborted' is a normal event when stopping or restarting speech recognition
        if (event.error === 'aborted') {
          return;
        }

        // 'no-speech' is non-fatal; user might just be pausing before speaking
        if (event.error === 'no-speech') {
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
        const wasListening = isListeningRef.current;
        isListeningRef.current = false;
        setIsListening(false);

        // If speech was recorded when recognition ended, submit it
        const finalText = recordedTextRef.current.trim();
        if (wasListening && finalText && onResultRef.current) {
          onResultRef.current(finalText);
          recordedTextRef.current = '';
          setTranscript('');
          setInterimTranscript('');
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
      setError('Speech recognition is not supported in this browser. You can type using the keyboard below.');
      return;
    }

    try {
      isListeningRef.current = true;
      setIsListening(true);
      recognitionRef.current.start();
    } catch (e: any) {
      // If already active or in starting state, stop first then start
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

    // Submit whatever speech was recorded
    const finalText = recordedTextRef.current.trim();
    if (finalText && onResultRef.current) {
      onResultRef.current(finalText);
      recordedTextRef.current = '';
      setTranscript('');
      setInterimTranscript('');
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