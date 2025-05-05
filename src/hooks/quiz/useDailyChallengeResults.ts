
import { useEffect } from "react";
import { submitDailyChallengeResult } from "@/services/questionService";
import { toast } from "sonner";
import { Question } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

interface UseDailyChallengeResultsProps {
  questions: Question[];
  score: number;
  timeSpent: number;
  isCompleted: boolean;
}

/**
 * Hook for managing daily challenge result submission
 */
export const useDailyChallengeResults = ({
  questions, 
  score,
  timeSpent,
  isCompleted
}: UseDailyChallengeResultsProps) => {
  const { isAuthenticated } = useAuth();
  
  // Record daily challenge results
  useEffect(() => {
    const recordResults = async () => {
      if (!isCompleted || questions.length === 0) return;
      
      try {
        // Only submit if user is authenticated
        if (isAuthenticated) {
          await submitDailyChallengeResult(
            Math.round((score / questions.length) * 100),
            timeSpent,
            questions.length,
            score
          );
          
          toast.success("Daily challenge results saved successfully!");
        } else {
          // Store in local storage for non-authenticated users
          localStorage.setItem('lastDailyChallenge', JSON.stringify({
            date: new Date().toISOString(),
            score: Math.round((score / questions.length) * 100),
            timeSpent,
            questionsAttempted: questions.length,
            correctAnswers: score
          }));
        }
      } catch (error) {
        console.error("Error saving daily challenge results:", error);
        toast.error("Failed to save results. Please try again later.");
      }
    };

    if (isCompleted) {
      recordResults();
    }
  }, [isCompleted, questions, score, timeSpent, isAuthenticated]);

  return {
    isSubmitting: false // We don't need loading state for this simple operation
  };
};
