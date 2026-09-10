'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { PracticeGoalMinutes } from '@/types';

export function usePracticeTimer() {
  const [goalMinutes, setGoalMinutes] = useState<PracticeGoalMinutes>(10);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [goalReached, setGoalReached] = useState<boolean>(false);

  const goalReachedRef = useRef(false);

  // Tick timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1;
          const targetSeconds = goalMinutes * 60;

          if (next >= targetSeconds && !goalReachedRef.current) {
            goalReachedRef.current = true;
            setGoalReached(true);
            try {
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
              });
            } catch (e) {
              // ignore confetti errors
            }
          }

          return next;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, goalMinutes]);

  const changeGoal = useCallback((minutes: PracticeGoalMinutes) => {
    setGoalMinutes(minutes);
    if (elapsedSeconds < minutes * 60) {
      goalReachedRef.current = false;
      setGoalReached(false);
    }
  }, [elapsedSeconds]);

  const resetTimer = useCallback(() => {
    setElapsedSeconds(0);
    goalReachedRef.current = false;
    setGoalReached(false);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min(100, Math.round((elapsedSeconds / (goalMinutes * 60)) * 100));

  return {
    elapsedSeconds,
    goalMinutes,
    goalReached,
    isActive,
    setIsActive,
    changeGoal,
    resetTimer,
    formattedTime: formatTime(elapsedSeconds),
    formattedGoal: `${goalMinutes}m`,
    progressPercent,
  };
}