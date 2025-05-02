
import { useEffect } from "react";
import { useQuizStorage } from "./useQuizStorage";
import { submitQuizResult } from "@/services/questionService";
import { updateTopicProgress } from "@/services/progressService";
import { toast } from "sonner";
import { Question } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

interface UseQuizResultsProps {
  topicId: string;
  questions: Question[];
  userId?: string;
  score: number;
  timeSpent: number;
  performance: {
    questionId: string;
    correct: boolean;
    timeSpent: number;
  }[];
  streak: number;
  isCompleted: boolean;
}

/**
 * Hook for managing quiz result submission
 */
export const useQuizResults = ({
  topicId, 
  questions, 
  userId,
  score,
  timeSpent,
  performance,
  streak,
  isCompleted
}: UseQuizResultsProps) => {
  const { 
    isSubmitting, 
    setIsSubmitting, 
    saveLocalResults,
    queuePendingSubmission 
  } = useQuizStorage({ topicId });
  
  const { refreshUserProfile } = useAuth();

  // Record quiz results to backend and local storage
  useEffect(() => {
    const recordQuizResults = async () => {
      if (!isCompleted) return;
      
      setIsSubmitting(true);
      
      // Calculate final score
      const finalScore = Math.round((score / questions.length) * 100);
      
      // Save to local storage and get updated stats
      const { newAttempts, newAvgTime } = saveLocalResults(
        finalScore, 
        timeSpent, 
        score, 
        questions.length, 
        performance,
        streak
      );
      
      // If user is authenticated, save to backend
      if (userId) {
        try {
          // Submit quiz result
          await submitQuizResult(
            userId,
            topicId,
            finalScore,
            timeSpent,
            questions.length,
            score
          );
          
          // Update topic progress
          await updateTopicProgress(
            userId,
            topicId,
            score, // completed questions is equal to correct answers
            questions.length,
            finalScore
          );
          
          // Refresh user profile to update UI
          await refreshUserProfile();
          
          toast.success("Quiz results saved successfully!");
        } catch (error) {
          console.error("Error saving quiz results:", error);
          
          // Store in pending submissions queue for later retry
          queuePendingSubmission({
            userId,
            topicId,
            score: finalScore,
            timeSpent,
            questions: questions.length,
            correctAnswers: score,
            date: new Date().toISOString(),
            performance
          });
        }
      }
      
      setIsSubmitting(false);
    };

    if (isCompleted && questions.length > 0) {
      recordQuizResults();
    }
  }, [isCompleted, questions, topicId, userId, score, timeSpent, performance, streak, setIsSubmitting, refreshUserProfile]);

  return {
    isSubmitting
  };
};
