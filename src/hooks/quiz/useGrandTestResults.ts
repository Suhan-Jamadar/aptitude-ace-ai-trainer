
import { useEffect, useState } from "react";
import { submitGrandTestResult } from "@/services/questionService";
import { toast } from "sonner";
import { Question } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

interface UseGrandTestResultsProps {
  questions: Question[];
  score: number;
  timeSpent: number;
  isCompleted: boolean;
}

/**
 * Hook for managing grand test result submission
 */
export const useGrandTestResults = ({
  questions, 
  score,
  timeSpent,
  isCompleted
}: UseGrandTestResultsProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, refreshUserProfile } = useAuth();
  
  // Record grand test results
  useEffect(() => {
    const recordResults = async () => {
      if (!isCompleted || questions.length === 0) return;
      
      setIsSubmitting(true);
      
      try {
        // Only submit if user is authenticated
        if (isAuthenticated) {
          await submitGrandTestResult(
            Math.round((score / questions.length) * 100),
            timeSpent,
            questions.length,
            score
          );
          
          // Refresh user profile to update UI with latest progress
          await refreshUserProfile();
          
          toast.success("Grand test results saved successfully!");
        } else {
          // Store in local storage for non-authenticated users
          localStorage.setItem('lastGrandTest', JSON.stringify({
            date: new Date().toISOString(),
            score: Math.round((score / questions.length) * 100),
            timeSpent,
            questionsAttempted: questions.length,
            correctAnswers: score
          }));
        }
      } catch (error) {
        console.error("Error saving grand test results:", error);
        toast.error("Failed to save results. Please try again later.");
      } finally {
        setIsSubmitting(false);
      }
    };

    if (isCompleted) {
      recordResults();
    }
  }, [isCompleted, questions, score, timeSpent, isAuthenticated, refreshUserProfile]);

  return {
    isSubmitting
  };
};
