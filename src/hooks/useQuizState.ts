
import { useState, useEffect, useRef } from "react";
import { Question } from "@/types";
import { submitQuizResult } from "@/services/questionService";
import { toast } from "sonner";

interface UseQuizStateProps {
  topicId: string;
  questions: Question[];
  userId?: string;
}

interface QuestionPerformance {
  questionId: string;
  correct: boolean;
  timeSpent: number;
}

/**
 * Custom hook to manage quiz state, progress tracking and results submission
 */
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
  const [performance, setPerformance] = useState<QuestionPerformance[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [streak, setStreak] = useState(0);

  // Initialize quiz state and timer
  useEffect(() => {
    // Reset the state when the questions change
    if (questions.length > 0) {
      setCurrentQuestionIndex(0);
      setScore(0);
      setIsCompleted(false);
      setStartTime(Date.now());
      setQuestionStartTime(Date.now());
      setTimeSpent(0);
      setWaitingForNextQuestion(false);
      setPerformance([]);
      
      // Get previous attempts data if available
      const attemptData = localStorage.getItem(`${topicId}_attempts`);
      if (attemptData) {
        try {
          const data = JSON.parse(attemptData);
          setAttempts(data.attempts || 0);
          setAvgTime(data.avgTime || 0);
          // If user has a streak, retrieve it
          setStreak(data.streak || 0);
        } catch (e) {
          console.error("Error parsing stored attempt data:", e);
        }
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

  // Handle answer submission
  const handleAnswerSubmit = (isCorrect: boolean) => {
    if (questions.length > 0) {
      // Calculate time spent on this question
      const questionTimeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
      
      // Record performance for this question
      setPerformance(prev => [
        ...prev, 
        {
          questionId: questions[currentQuestionIndex].id,
          correct: isCorrect,
          timeSpent: questionTimeSpent
        }
      ]);
      
      if (isCorrect) {
        setScore(score + 1);
        // If correct, increment streak
        setStreak(streak + 1);
      } else {
        // If incorrect, reset streak
        setStreak(0);
      }
      
      setWaitingForNextQuestion(true);
    }
  };

  // Record quiz results to backend and local storage
  const recordQuizResults = async () => {
    setIsSubmitting(true);
    
    // Calculate final score
    const finalScore = Math.round((score / questions.length) * 100);
    const finalTimeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    // Calculate new average time and update attempts
    const newAttempts = attempts + 1;
    const newAvgTime = Math.round(((avgTime * attempts) + finalTimeSpent) / newAttempts);
    
    // Prepare performance data for storage
    const performanceData = {
      date: new Date().toISOString(),
      score: finalScore,
      timeSpent: finalTimeSpent,
      questions: questions.length,
      correctAnswers: score,
      performance: performance,
      streak: streak
    };
    
    // Save to local storage
    localStorage.setItem(`${topicId}_attempts`, JSON.stringify({
      attempts: newAttempts,
      avgTime: newAvgTime,
      lastScore: finalScore,
      performance: performance,
      streak: streak
    }));
    
    // Save performance data for analytics
    localStorage.setItem(`${topicId}_lastPerformance`, JSON.stringify(performanceData));
    
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
        
        toast.success("Quiz results saved successfully!");
      } catch (error) {
        console.error("Error saving quiz results:", error);
        toast.error("Failed to save quiz results. Will retry when connection is restored.");
        
        // Store in pending submissions queue for later retry
        const pendingSubmissions = JSON.parse(localStorage.getItem('pendingSubmissions') || '[]');
        pendingSubmissions.push({
          type: 'quizResult',
          data: {
            userId,
            topicId,
            score: finalScore,
            timeSpent: finalTimeSpent,
            questions: questions.length,
            correctAnswers: score,
            date: new Date().toISOString(),
            performance: performance
          }
        });
        localStorage.setItem('pendingSubmissions', JSON.stringify(pendingSubmissions));
      }
    }
    
    setIsSubmitting(false);
  };

  // Handle moving to next question
  const handleNextQuestion = () => {
    setWaitingForNextQuestion(false);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestionStartTime(Date.now()); // Reset timer for new question
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
    setIsCompleted, // Expose the setIsCompleted function
    timeSpent,
    isSubmitting,
    waitingForNextQuestion,
    attempts,
    performance,
    streak,
    handleAnswerSubmit,
    handleNextQuestion
  };
};
