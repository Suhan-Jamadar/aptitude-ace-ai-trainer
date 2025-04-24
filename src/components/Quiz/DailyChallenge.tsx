
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Question } from "@/types";
import QuizQuestion from "./QuizQuestion";
import { Clock, X, Trophy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserStreak } from "@/services/progressService";
import { getDailyChallenge, getRecommendations } from "@/services/questionService";
import { mockQuestions } from "@/services/mockData"; // Keep temporarily for fallback

interface DailyChallengeProps {
  onClose: () => void;
}

const DailyChallenge = ({ onClose }: DailyChallengeProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(5 * 60); // 5 minutes in seconds
  const [streakIncreased, setStreakIncreased] = useState(false);
  const [startTime] = useState(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendation, setRecommendation] = useState<string | null>(null);

  // Fetch daily challenge questions from the API
  useEffect(() => {
    const fetchDailyChallengeQuestions = async () => {
      try {
        setIsLoading(true);
        const fetchedQuestions = await getDailyChallenge();
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Error fetching daily challenge questions:", error);
        toast.error("Failed to load daily challenge. Using mock data instead.");
        
        // Use the mock daily challenge questions as fallback
        const dailyChallengeQuestions = mockQuestions["dailyChallenge"] || [];
        if (dailyChallengeQuestions.length === 0) {
          // If there's no daily challenge mock data, pick random questions from mock topics
          const allMockQuestions: Question[] = [];
          Object.values(mockQuestions).forEach(topicQuestions => {
            if (Array.isArray(topicQuestions) && topicQuestions.length > 0) {
              allMockQuestions.push(...topicQuestions);
            }
          });
          
          // Select 5 random questions if available
          const randomQuestions: Question[] = [];
          for (let i = 0; i < 5 && allMockQuestions.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * allMockQuestions.length);
            randomQuestions.push(allMockQuestions[randomIndex]);
            allMockQuestions.splice(randomIndex, 1);
          }
          
          setQuestions(randomQuestions);
        } else {
          setQuestions(dailyChallengeQuestions);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyChallengeQuestions();
  }, []);

  useEffect(() => {
    if (!isLoading && questions.length > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            setIsCompleted(true);
            completeChallenge();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isLoading, questions]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSubmit = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 2); // +2 points for correct answer
      toast.success("+2 points!");
    } else {
      setScore(Math.max(0, score - 1)); // -1 point for incorrect answer, minimum 0
      toast.error("-1 point");
    }
  };

  const handleNextQuestion = () => {
    if (timeRemaining > 0) {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Loop back to the first question if we've gone through all questions
        setCurrentQuestionIndex(0);
      }
    } else {
      completeChallenge();
    }
  };

  // Complete challenge and record results
  const completeChallenge = async () => {
    if (isCompleted) return; // Prevent multiple submissions
    
    setIsCompleted(true);
    
    // Stop the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Check if score is enough to increase streak
    if (score >= 6) {
      setStreakIncreased(true);
      
      // If user is authenticated, update streak in backend
      if (user) {
        setIsSubmitting(true);
        try {
          const currentStreak = user.streak || 0;
          await updateUserStreak(user.id, currentStreak + 1);
          toast.success("Daily streak increased!");
          
          // Get recommendation based on performance
          try {
            const fetchedRecommendation = await getRecommendations(
              "dailyChallenge",
              300 - timeRemaining, // Time spent in seconds
              1, // Daily challenge is one attempt
              Math.round((score / (questions.length * 2)) * 100) // Score percentage
            );
            setRecommendation(fetchedRecommendation);
          } catch (error) {
            console.error("Error fetching recommendations:", error);
          }
        } catch (error) {
          console.error("Error updating streak:", error);
          toast.error("Failed to update streak");
        }
        setIsSubmitting(false);
      }
    }
    
    // Record completion in local storage to prevent multiple daily challenges
    localStorage.setItem('lastDailyChallenge', new Date().toISOString().slice(0, 10));
  };

  // Calculate time spent when challenge is completed
  const calculateTimeSpent = () => {
    const timeSpentInSeconds = Math.floor((Date.now() - startTime) / 1000);
    return formatTime(Math.min(timeSpentInSeconds, 5 * 60)); // Cap at 5 minutes
  };

  if (isLoading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl">Daily Challenge</DialogTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-custom-darkBlue1" />
            <p className="mt-4 text-gray-600">Loading daily challenge...</p>
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
            <DialogTitle className="text-xl">Daily Challenge</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {!isCompleted ? (
          <div>
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <div className={`flex items-center ${timeRemaining < 60 ? 'text-red-500 animate-pulse' : ''}`}>
                <Clock className={`h-4 w-4 mr-1 ${timeRemaining < 60 ? 'text-red-500' : ''}`} />
                <span>Time remaining: {formatTime(timeRemaining)}</span>
              </div>
            </div>

            {questions.length > 0 && (
              <QuizQuestion
                question={questions[currentQuestionIndex]}
                onAnswerSubmit={(isCorrect) => {
                  handleAnswerSubmit(isCorrect);
                  setTimeout(handleNextQuestion, 1500);
                }}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
              />
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-custom-gold/20 flex items-center justify-center mb-4">
              <Trophy className="h-10 w-10 text-custom-gold" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Challenge Complete!</h3>
            <p className="mb-2">You scored {score} points</p>
            <p className="text-gray-500 mb-2">Time taken: {calculateTimeSpent()}</p>
            
            {streakIncreased && (
              <div className="bg-custom-gold/20 p-3 rounded-lg mb-4 animate-pulse">
                <p className="text-custom-gold font-medium">🔥 Daily streak increased!</p>
              </div>
            )}
            
            {recommendation && (
              <div className="mt-4 mb-4 bg-blue-50 p-4 rounded-lg text-left">
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 text-custom-darkBlue1 mr-2" />
                  <h4 className="font-medium text-custom-darkBlue1">Today's Recommendation</h4>
                </div>
                <p className="text-gray-700">{recommendation}</p>
              </div>
            )}
            
            {isSubmitting && (
              <p className="text-blue-500 mb-2">Updating streak...</p>
            )}
            
            <div className="mt-6">
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DailyChallenge;
