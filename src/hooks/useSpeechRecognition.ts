'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechRecognitionOptions {
  onTranscriptChange?: (transcript: string) => void;
  onError?: (error: string) => void;
  lang?: string;
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

  // Keep callback refs fresh without triggering effect re-runs
  useEffect(() => {
    onTranscriptChangeRef.current = onTranscriptChange;
    onErrorRef.current = onError;
  }, [onTranscriptChange, onError]);

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

        if (fullCaptured && onTranscriptChangeRef.current) {
          onTranscriptChangeRef.current(fullCaptured);
        }
      };

      recognition.onerror = (event: any) => {
        // 'aborted' is a normal event when stopping speech recognition
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
        isListeningRef.current = false;
        setIsListening(false);

        // Keep whatever speech was transcribed so user can review and edit it
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
      setError('Speech recognition is not supported in this browser. You can type using the keyboard below.');
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