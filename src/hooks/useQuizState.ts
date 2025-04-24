
import { useState, useEffect, useRef } from "react";
import { Question } from "@/types";
import { submitQuizResult, updateTopicProgress } from "@/services/questionService";
import { toast } from "sonner";

interface UseQuizStateProps {
  topicId: string;
  questions: Question[];
  userId?: string;
}

export const useQuizState = ({ topicId, questions, userId }: UseQuizStateProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [avgTime, setAvgTime] = useState(0);
  const [waitingForNextQuestion, setWaitingForNextQuestion] = useState(false);

  useEffect(() => {
    // Reset the state when the questions change
    if (questions.length > 0) {
      setCurrentQuestionIndex(0);
      setScore(0);
      setIsCompleted(false);
      setStartTime(Date.now());
      setTimeSpent(0);
      setWaitingForNextQuestion(false);
      
      // Get previous attempts data if available
      const attemptData = localStorage.getItem(`${topicId}_attempts`);
      if (attemptData) {
        const data = JSON.parse(attemptData);
        setAttempts(data.attempts || 0);
        setAvgTime(data.avgTime || 0);
      }

      // Update time spent
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      timerRef.current = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [topicId, startTime, questions]);

  const handleAnswerSubmit = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    setWaitingForNextQuestion(true);
  };

  const recordQuizResults = async () => {
    setIsSubmitting(true);
    
    // Calculate final score
    const finalScore = Math.round((score / questions.length) * 100);
    const finalTimeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    // Calculate new average time and update attempts
    const newAttempts = attempts + 1;
    const newAvgTime = Math.round(((avgTime * attempts) + finalTimeSpent) / newAttempts);
    
    // Save to local storage
    localStorage.setItem(`${topicId}_attempts`, JSON.stringify({
      attempts: newAttempts,
      avgTime: newAvgTime
    }));
    
    // If user is authenticated, save to backend
    if (userId) {
      try {
        await submitQuizResult(
          userId,
          topicId,
          finalScore,
          finalTimeSpent,
          questions.length,
          score
        );
        
        await updateTopicProgress(
          userId,
          topicId,
          Math.min(questions.length, questions.length),
          finalScore
        );
        
        toast.success("Quiz results saved successfully!");
      } catch (error) {
        console.error("Error saving quiz results:", error);
        toast.error("Failed to save quiz results");
      }
    }
    
    setIsSubmitting(false);
  };

  const handleNextQuestion = () => {
    setWaitingForNextQuestion(false);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Stop the timer when quiz is completed
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      setIsCompleted(true);
      recordQuizResults();
    }
  };

  return {
    currentQuestionIndex,
    score,
    isCompleted,
    timeSpent,
    isSubmitting,
    waitingForNextQuestion,
    attempts,
    handleAnswerSubmit,
    handleNextQuestion
  };
};
