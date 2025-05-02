
import { useState } from "react";

/**
 * Hook for managing quiz scores and performance metrics
 */
export const useQuizScoring = () => {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [performance, setPerformance] = useState<{
    questionId: string;
    correct: boolean;
    timeSpent: number;
  }[]>([]);

  // Handle answer submission
  const handleAnswerSubmit = (questionId: string, isCorrect: boolean, questionTimeSpent: number) => {
    // Record performance for this question
    setPerformance(prev => [
      ...prev, 
      {
        questionId,
        correct: isCorrect,
        timeSpent: questionTimeSpent
      }
    ]);
    
    if (isCorrect) {
      setScore(score => score + 1);
      // If correct, increment streak
      setStreak(streak => streak + 1);
    } else {
      // If incorrect, reset streak
      setStreak(0);
    }
  };

  return {
    score,
    setScore,
    streak,
    performance,
    setPerformance,
    handleAnswerSubmit
  };
};
