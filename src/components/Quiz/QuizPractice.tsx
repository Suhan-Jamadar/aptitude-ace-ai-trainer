
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Question, QuizResult } from "@/types";
import QuizQuestion from "./QuizQuestion";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { submitQuizResult, updateTopicProgress } from "@/services/questionService";

// Mock questions data
const questionsData: Record<string, Question[]> = {
  "1": [
    {
      id: "n1",
      topicId: "1",
      question: "What comes next in the sequence: 2, 5, 10, 17, 26, ?",
      options: ["37", "36", "35", "38"],
      correctAnswer: "37",
      explanation: "The pattern is n² + 1. So the next number is 6² + 1 = 37."
    },
    {
      id: "n2",
      topicId: "1",
      question: "Find the missing number in the series: 5, 10, 20, 40, ____, 160",
      options: ["60", "80", "100", "120"],
      correctAnswer: "80",
      explanation: "Each number is multiplied by 2 to get the next number. 40 × 2 = 80."
    },
    {
      id: "n3",
      topicId: "1",
      question: "What is the next number in the series: 3, 6, 11, 18, 27, ?",
      options: ["38", "36", "42", "33"],
      correctAnswer: "38",
      explanation: "The differences between consecutive terms are 3, 5, 7, 9, 11. Adding 11 to 27 gives 38."
    }
  ],
  "2": [
    {
      id: "tw1",
      topicId: "2",
      question: "If 8 workers can build a wall in 10 days, how many days will it take 5 workers to build the same wall?",
      options: ["12", "16", "14", "18"],
      correctAnswer: "16",
      explanation: "Using the formula (W₁ × D₁) = (W₂ × D₂), we get (8 × 10) = (5 × D₂), so D₂ = 16 days."
    },
    {
      id: "tw2",
      topicId: "2",
      question: "A can do a piece of work in 12 days and B can do it in 15 days. How long will it take if they work together?",
      options: ["6.67 days", "7.5 days", "6 days", "8 days"],
      correctAnswer: "6.67 days",
      explanation: "A's work per day = 1/12, B's work per day = 1/15. Together they do (1/12 + 1/15) = (5+4)/60 = 9/60 = 3/20 work per day. Total time = 20/3 = 6.67 days."
    }
  ],
  "3": [
    {
      id: "p1",
      topicId: "3",
      question: "If the price of a book increases by 25%, what is the percentage decrease in the number of books that can be purchased with the same amount of money?",
      options: ["20%", "25%", "30%", "15%"],
      correctAnswer: "20%",
      explanation: "When price increases by 25%, the quantity decreases by 20% because 1/(1+0.25) = 0.8, which is a 20% decrease."
    }
  ],
  "4": [
    {
      id: "prob1",
      topicId: "4",
      question: "A bag contains 5 red and 7 blue balls. If 2 balls are drawn at random, what is the probability that both are red?",
      options: ["5/33", "10/33", "5/12", "10/12"],
      correctAnswer: "10/33",
      explanation: "P(both red) = (5C2)/(12C2) = 10/66 = 5/33."
    }
  ],
  "5": [
    {
      id: "di1",
      topicId: "5",
      question: "Based on the pie chart showing market share of smartphones, if Samsung has 25% and Apple has 20%, what is the combined market share of these two companies?",
      options: ["45%", "35%", "55%", "40%"],
      correctAnswer: "45%",
      explanation: "Samsung (25%) + Apple (20%) = 45%"
    }
  ]
};

interface QuizPracticeProps {
  topicId: string;
  topicName: string;
  onClose: () => void;
}

const QuizPractice = ({ topicId, topicName, onClose }: QuizPracticeProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const [attempts, setAttempts] = useState(0);
  const [avgTime, setAvgTime] = useState(0);

  useEffect(() => {
    // Fetch questions for the topic
    const topicQuestions = questionsData[topicId] || [];
    setQuestions(topicQuestions);
    setStartTime(Date.now());
    
    // Get previous attempts data if available
    const attemptData = localStorage.getItem(`${topicId}_attempts`);
    if (attemptData) {
      const data = JSON.parse(attemptData);
      setAttempts(data.attempts || 0);
      setAvgTime(data.avgTime || 0);
    }

    // Update time spent
    timerRef.current = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [topicId, startTime]);

  const handleAnswerSubmit = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
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
    if (user) {
      try {
        await submitQuizResult(
          user.id,
          topicId,
          finalScore,
          finalTimeSpent,
          questions.length,
          score
        );
        
        await updateTopicProgress(
          user.id,
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

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{topicName} Practice</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {questions.length > 0 ? (
          <>
            {!isCompleted ? (
              <div>
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                  <span>Time: {formatTime(timeSpent)}</span>
                </div>

                <QuizQuestion
                  question={questions[currentQuestionIndex]}
                  onAnswerSubmit={(isCorrect) => {
                    handleAnswerSubmit(isCorrect);
                    setTimeout(handleNextQuestion, 1500);
                  }}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={questions.length}
                />
              </div>
            ) : (
              <div className="text-center py-6">
                <h3 className="text-xl font-semibold mb-2">Practice Complete!</h3>
                <p className="mb-2">You scored {score} out of {questions.length}</p>
                <p className="text-gray-500 mb-4">Time taken: {formatTime(timeSpent)}</p>
                {isSubmitting && <p className="text-blue-500 mb-4">Saving results...</p>}
                <Button onClick={onClose}>Close</Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-6">
            <p>No practice questions available for this topic yet.</p>
            <Button onClick={onClose} className="mt-4">Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuizPractice;
