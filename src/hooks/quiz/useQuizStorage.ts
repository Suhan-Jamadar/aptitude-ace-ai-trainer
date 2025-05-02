
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface UseQuizStorageProps {
  topicId: string;
}

/**
 * Hook for managing quiz storage and attempts data
 */
export const useQuizStorage = ({ topicId }: UseQuizStorageProps) => {
  const [attempts, setAttempts] = useState(0);
  const [avgTime, setAvgTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get previous attempts data if available
  useEffect(() => {
    const attemptData = localStorage.getItem(`${topicId}_attempts`);
    if (attemptData) {
      try {
        const data = JSON.parse(attemptData);
        setAttempts(data.attempts || 0);
        setAvgTime(data.avgTime || 0);
      } catch (e) {
        console.error("Error parsing stored attempt data:", e);
      }
    }
  }, [topicId]);

  // Save quiz results to local storage
  const saveLocalResults = (finalScore: number, finalTimeSpent: number, correctAnswers: number, 
    questionsLength: number, performanceData: any, streak: number) => {
    // Calculate new average time and update attempts
    const newAttempts = attempts + 1;
    const newAvgTime = Math.round(((avgTime * attempts) + finalTimeSpent) / newAttempts);
    
    // Prepare performance data for storage
    const quizPerformance = {
      date: new Date().toISOString(),
      score: finalScore,
      timeSpent: finalTimeSpent,
      questions: questionsLength,
      correctAnswers,
      performance: performanceData,
      streak
    };
    
    // Save to local storage
    localStorage.setItem(`${topicId}_attempts`, JSON.stringify({
      attempts: newAttempts,
      avgTime: newAvgTime,
      lastScore: finalScore,
      performance: performanceData,
      streak
    }));
    
    // Save performance data for analytics
    localStorage.setItem(`${topicId}_lastPerformance`, JSON.stringify(quizPerformance));

    return { newAttempts, newAvgTime };
  };

  // Add pending submission to queue
  const queuePendingSubmission = (data: any) => {
    const pendingSubmissions = JSON.parse(localStorage.getItem('pendingSubmissions') || '[]');
    pendingSubmissions.push({
      type: 'quizResult',
      data
    });
    localStorage.setItem('pendingSubmissions', JSON.stringify(pendingSubmissions));
    toast.error("Failed to save quiz results. Will retry when connection is restored.");
  };

  return {
    attempts,
    avgTime,
    isSubmitting,
    setIsSubmitting,
    saveLocalResults,
    queuePendingSubmission
  };
};
