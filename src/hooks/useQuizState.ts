
import { useState, useEffect } from "react";
import { Question } from "@/types";
import { useQuizProgress } from "./quiz/useQuizProgress";
import { useQuizTimer } from "./quiz/useQuizTimer";
import { useQuizScoring } from "./quiz/useQuizScoring";
import { useQuizResults } from "./quiz/useQuizResults";

interface UseQuizStateProps {
  topicId: string;
  questions: Question[];
  userId?: string;
}

/**
 * Main quiz state hook that integrates all quiz functionality
 */
export const useQuizState = ({ topicId, questions, userId }: UseQuizStateProps) => {
  const {
    currentQuestionIndex,
    waitingForNextQuestion,
    isCompleted,
    setIsCompleted,
    handleNextQuestion,
    setWaitingForNextQuestion
  } = useQuizProgress({ questions });

  const {
    timeSpent,
    questionStartTime,
    setQuestionStartTime,
    stopTimer
  } = useQuizTimer();

  const {
    score,
    streak,
    performance,
    handleAnswerSubmit: scoreAnswerSubmit
  } = useQuizScoring();

  // Handle quiz completion
  useEffect(() => {
    if (isCompleted) {
      stopTimer();
    }
  }, [isCompleted, stopTimer]);

  // Submit quiz results when completed
  const { isSubmitting } = useQuizResults({
    topicId,
    questions,
    userId,
    score,
    timeSpent,
    performance,
    streak,
    isCompleted
  });

  // Handle answer submission
  const handleAnswerSubmit = (isCorrect: boolean) => {
    if (questions.length > 0) {
      // Calculate time spent on this question
      const questionTimeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
      
      // Update scores and performance data
      scoreAnswerSubmit(questions[currentQuestionIndex].id, isCorrect, questionTimeSpent);
      
      // Reset timer for next question
      setQuestionStartTime(Date.now());
      
      // Set waiting state
      setWaitingForNextQuestion(true);
    }
  };

  return {
    currentQuestionIndex,
    score,
    isCompleted,
    setIsCompleted,
    timeSpent,
    isSubmitting,
    waitingForNextQuestion,
    attempts: 0, // This will be filled by the useQuizStorage hook in the component
    performance,
    streak,
    handleAnswerSubmit,
    handleNextQuestion
  };
};
