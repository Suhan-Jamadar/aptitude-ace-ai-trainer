
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
      if (!isCompleted || questions.length === 0) return;
      
      console.log(`Recording quiz results for topic ${topicId}`);
      setIsSubmitting(true);
      
      // Calculate final score
      const finalScore = Math.round((score / questions.length) * 100);
      console.log(`Quiz completed with score: ${finalScore}%, correct answers: ${score}/${questions.length}`);
      
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
          console.log(`Submitting quiz result to backend for user ${userId}`);
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('Authentication token not found');
          }
          
          // Submit quiz result
          await submitQuizResult(
            userId,
            topicId,
            finalScore,
            timeSpent,
            questions.length,
            score
          );
          
          console.log(`Updating topic progress for user ${userId}`);
          // Update topic progress
          await updateTopicProgress(
            userId,
            topicId,
            score, // completed questions is equal to correct answers
            questions.length,
            finalScore
          );
          
          // Refresh user profile to update UI
          console.log('Refreshing user profile after quiz submission');
          await refreshUserProfile();
          
          toast.success("Quiz results saved successfully!");
        } catch (error) {
          console.error("Error saving quiz results:", error);
          
          // Store in pending submissions queue for later retry
          console.log('Queueing quiz result for later submission');
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
          
          toast.error("Failed to save results to server. They will be submitted when you're back online.");
        }
      } else {
        console.log('User not authenticated, quiz results saved only locally');
      }
      
      setIsSubmitting(false);
    };

    if (isCompleted && questions.length > 0) {
      recordQuizResults();
    }
  }, [isCompleted, questions, topicId, userId, score, timeSpent, performance, streak, setIsSubmitting, saveLocalResults, queuePendingSubmission, refreshUserProfile]);

  return {
    isSubmitting
  };
};
