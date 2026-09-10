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
  const isManuallyStoppedRef = useRef(false);
  const finalTranscriptRef = useRef('');

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
        setIsListening(true);
        setError(null);
        finalTranscriptRef.current = '';
        setTranscript('');
        setInterimTranscript('');
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let currentFinal = finalTranscriptRef.current;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          const text = result[0].transcript;
          if (result.isFinal) {
            currentFinal += (currentFinal ? ' ' : '') + text.trim();
          } else {
            currentInterim += text;
          }
        }

        finalTranscriptRef.current = currentFinal;
        setTranscript(currentFinal);
        setInterimTranscript(currentInterim);
      };

      recognition.onerror = (event: any) => {
        let userMessage = 'Speech recognition error occurred.';
        switch (event.error) {
          case 'not-allowed':
          case 'permission-denied':
            userMessage = 'Microphone permission was denied. Please allow microphone access in your browser settings.';
            break;
          case 'no-speech':
            userMessage = 'No speech detected. Please try speaking again.';
            break;
          case 'audio-capture':
            userMessage = 'No microphone detected on your device.';
            break;
          case 'network':
            userMessage = 'Network connection issue during speech recognition.';
            break;
          default:
            userMessage = `Speech recognition notice: ${event.error}`;
        }

        // Don't treat silence as a fatal blocking error if we already have text
        if (event.error !== 'no-speech' || !finalTranscriptRef.current) {
          setError(userMessage);
          if (onError) onError(userMessage);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        const finalRecorded = (finalTranscriptRef.current + ' ' + interimTranscript).trim();
        if (finalRecorded && onResult) {
          onResult(finalRecorded);
        }
      };

      recognitionRef.current = recognition;
    } catch (err: any) {
      console.error('SpeechRecognition initialization failed:', err);
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore cleanup errors
        }
      }
    };
  }, [lang, onError, onResult, interimTranscript]);

  const startListening = useCallback(() => {
    setError(null);
    finalTranscriptRef.current = '';
    setTranscript('');
    setInterimTranscript('');
    isManuallyStoppedRef.current = false;

    if (!recognitionRef.current) {
      setError('Speech recognition is not supported in this browser. You can type your sentences below.');
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (e: any) {
      // If already started, stop and restart
      try {
        recognitionRef.current.stop();
        setTimeout(() => {
          recognitionRef.current?.start();
        }, 150);
      } catch (restartErr) {
        console.warn('Could not restart recognition:', restartErr);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    isManuallyStoppedRef.current = true;
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn('Error stopping recognition:', e);
      }
    }
    setIsListening(false);
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    finalTranscriptRef.current = '';
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