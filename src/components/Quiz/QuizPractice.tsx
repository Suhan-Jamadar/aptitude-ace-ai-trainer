
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Question } from "@/types";
import { X, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import QuizQuestion from "./QuizQuestion";
import QuizCompletion from "./QuizCompletion";
import { useQuizState } from "@/hooks/useQuizState";
import { formatTime } from "@/utils/timeUtils";
import { mockQuestions } from "@/services/mockData"; // Keep temporarily for fallback
import { getQuestionsByTopic, getRecommendations } from "@/services/questionService";
import Timer from "./Timer";
import { toast } from "sonner";

interface QuizPracticeProps {
  topicId: string;
  topicName: string;
  onClose: () => void;
}

const QuizPractice = ({ topicId, topicName, onClose }: QuizPracticeProps) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [timeLimitSeconds] = useState(300); // 5 minutes time limit
  const [questionTimeData, setQuestionTimeData] = useState<{questionId: string, timeSpent: number}[]>([]);

  // Fetch questions from the API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const fetchedQuestions = await getQuestionsByTopic(topicId);
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
        toast.error("Failed to load questions. Using mock data instead.");
        // Fallback to mock data if API fails
        setQuestions(mockQuestions[topicId] || []);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [topicId]);

  const {
    currentQuestionIndex,
    score,
    isCompleted,
    timeSpent,
    isSubmitting,
    waitingForNextQuestion,
    attempts,
    handleAnswerSubmit,
    handleNextQuestion
  } = useQuizState({
    topicId,
    questions,
    userId: user?.id
  });

  // Track time spent on each question
  const handleQuestionSubmit = (isCorrect: boolean, questionTimeSpent: number) => {
    // Record time data for analytics
    setQuestionTimeData(prev => [
      ...prev,
      { 
        questionId: questions[currentQuestionIndex].id, 
        timeSpent: questionTimeSpent 
      }
    ]);
    
    // Call the original submit handler
    handleAnswerSubmit(isCorrect);
  };

  // Get recommendations when quiz is completed
  useEffect(() => {
    const getQuizRecommendations = async () => {
      if (isCompleted && user && !recommendation) {
        try {
          const fetchedRecommendation = await getRecommendations(
            topicId,
            timeSpent,
            attempts,
            Math.round((score / questions.length) * 100)
          );
          setRecommendation(fetchedRecommendation);
        } catch (error) {
          console.error("Error fetching recommendations:", error);
        }
      }
    };

    getQuizRecommendations();
  }, [isCompleted, user, topicId, timeSpent, attempts, score, questions.length, recommendation]);

  if (isLoading) {
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
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-custom-darkBlue1" />
            <p className="mt-4 text-gray-600">Loading questions...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                  <Timer 
                    initialSeconds={timeLimitSeconds} 
                    onTimeout={() => {
                      toast.warning("Time's up! Completing the quiz now.");
                      // Handle quiz completion due to timeout
                      setIsCompleted(true);
                    }}
                  />
                </div>

                <QuizQuestion
                  question={questions[currentQuestionIndex]}
                  onAnswerSubmit={handleQuestionSubmit}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={questions.length}
                />

                {waitingForNextQuestion && (
                  <div className="mt-4 flex justify-center">
                    <Button 
                      onClick={handleNextQuestion}
                      className="bg-custom-darkBlue1 hover:bg-custom-darkBlue2 text-white"
                    >
                      {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <QuizCompletion
                score={score}
                totalQuestions={questions.length}
                timeSpent={timeSpent}
                isSubmitting={isSubmitting}
                onClose={onClose}
                recommendation={recommendation}
                performanceData={questionTimeData.length > 0 ? {
                  averageTimePerQuestion: questionTimeData.reduce((sum, item) => sum + item.timeSpent, 0) / questionTimeData.length,
                  fastestQuestion: Math.min(...questionTimeData.map(item => item.timeSpent)),
                  slowestQuestion: Math.max(...questionTimeData.map(item => item.timeSpent)),
                } : undefined}
              />
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
