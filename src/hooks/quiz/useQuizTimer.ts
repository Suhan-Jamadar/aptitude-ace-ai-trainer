
import { useState, useEffect, useRef } from "react";

/**
 * Hook for tracking quiz time
 */
export const useQuizTimer = () => {
  const [startTime, setStartTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Update time spent
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [startTime]);

  // Reset timer
  const resetTimer = () => {
    const now = Date.now();
    setStartTime(now);
    setQuestionStartTime(now);
    setTimeSpent(0);
  };

  // Stop timer
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  return {
    startTime,
    timeSpent,
    questionStartTime,
    setQuestionStartTime,
    resetTimer,
    stopTimer
  };
};
