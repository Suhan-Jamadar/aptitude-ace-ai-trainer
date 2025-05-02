
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Question } from "@/types";
import { X, Loader2, Shield, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import QuizQuestion from "./QuizQuestion";
import QuizCompletion from "./QuizCompletion";
import { useQuizState } from "@/hooks/useQuizState";
import { mockQuestions } from "@/services/mockData"; // Keep temporarily for fallback
import { getQuestionsByTopic, getRecommendations } from "@/services/questionService";
import Timer from "./Timer";
import { toast } from "sonner";
import AuthModal from "../Auth/AuthModal";

interface QuizPracticeProps {
  topicId: string;
  topicName: string;
  onClose: () => void;
}

const QuizPractice = ({ topicId, topicName, onClose }: QuizPracticeProps) => {
  // Authentication state
  const { user, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Quiz state
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
    
    // Track quiz start for analytics
    if (user?.id) {
      const analyticsData = {
        event: 'quiz_started',
        userId: user.id,
        topicId: topicId,
        timestamp: new Date().toISOString()
      };
      
      // Store analytics locally and try to send to backend
      try {
        const storedEvents = JSON.parse(localStorage.getItem('analyticsEvents') || '[]');
        storedEvents.push(analyticsData);
        localStorage.setItem('analyticsEvents', JSON.stringify(storedEvents));
        
        // In a real app, we would send this to the backend
        // sendAnalyticsEvent(analyticsData);
      } catch (e) {
        console.error("Error storing analytics:", e);
      }
    }
  }, [topicId, user?.id]);

  const {
    currentQuestionIndex,
    score,
    isCompleted,
    timeSpent,
    isSubmitting,
    waitingForNextQuestion,
    attempts,
    handleAnswerSubmit,
    handleNextQuestion,
    setIsCompleted, // Extract setIsCompleted from the hook
    streak
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
      if (isCompleted && !recommendation) {
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
  }, [isCompleted, topicId, timeSpent, attempts, score, questions.length, recommendation]);

  // Handle authentication for result saving
  const handleAuthRequired = () => {
    if (!isAuthenticated) {
      toast.info("Sign in to save your progress and view personalized recommendations", {
        duration: 5000,
        icon: <Shield className="h-4 w-4" />
      });
      setShowAuthModal(true);
    }
  };

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
    <>
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
                    <div className="flex items-center space-x-2">
                      <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                      {streak > 2 && (
                        <div className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium flex items-center">
                          🔥 Streak: {streak}
                        </div>
                      )}
                    </div>
                    <Timer 
                      initialSeconds={timeLimitSeconds} 
                      onTimeout={() => {
                        toast.warning("Time's up! Completing the quiz now.");
                        // Use setIsCompleted function from the hook
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
                  
                  {!isAuthenticated && currentQuestionIndex === 0 && (
                    <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
                      <Shield className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-blue-700">
                          <button 
                            onClick={handleAuthRequired} 
                            className="font-medium underline cursor-pointer"
                          >
                            Sign in
                          </button> to save your progress and track your improvements over time.
                        </p>
                      </div>
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
                    streak: streak
                  } : undefined}
                  isAuthenticated={isAuthenticated}
                  onAuthRequired={handleAuthRequired}
                />
              )}
            </>
          ) : (
            <div className="text-center py-6">
              <p>No practice questions available for this topic yet.</p>
              <Button onClick={onClose} className="mt-4">Close</Button>
            </div>
          )}
          
          {timeSpent > 240 && !isCompleted && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-amber-700">
                  You've been on this quiz for a while. Remember to complete it before the timer runs out!
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Authentication modal */}
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthenticated={() => {
            setShowAuthModal(false);
            toast.success("Successfully signed in! Your progress will now be saved.");
          }}
        />
      )}
    </>
  );
};

export default QuizPractice;
