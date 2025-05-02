
import { useState } from "react";
import { Question } from "@/types";

interface UseQuizProgressProps {
  questions: Question[];
}

/**
 * Hook for managing quiz navigation and progress
 */
export const useQuizProgress = ({ questions }: UseQuizProgressProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [waitingForNextQuestion, setWaitingForNextQuestion] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Handle moving to next question
  const handleNextQuestion = () => {
    setWaitingForNextQuestion(false);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  return {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    waitingForNextQuestion,
    setWaitingForNextQuestion,
    isCompleted,
    setIsCompleted,
    handleNextQuestion
  };
};
