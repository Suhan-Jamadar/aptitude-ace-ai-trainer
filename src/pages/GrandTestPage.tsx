
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import { Question } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Timer from "@/components/Quiz/GrandTest/Timer";
import QuestionView from "@/components/Quiz/GrandTest/QuestionView";
import ResultView from "@/components/Quiz/GrandTest/ResultView";
import { useAuth } from "@/contexts/AuthContext";
import { submitGrandTestResult } from "@/services/progressService";
import { getGrandTestQuestions, getRecommendations } from "@/services/questionService";

const GrandTestPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(45 * 60); // 45 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [startTime] = useState(Date.now());
  const [grandTestQuestions, setGrandTestQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  
  // Fetch grand test questions
  useEffect(() => {
    const fetchGrandTestQuestions = async () => {
      try {
        setIsLoading(true);
        const fetchedQuestions = await getGrandTestQuestions();
        setGrandTestQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Error fetching grand test questions:", error);
        toast({
          title: "Error",
          description: "Failed to load grand test questions. Using sample questions instead.",
          variant: "destructive"
        });
        
        // Use mock data as fallback
        // Note: In a real implementation, you should provide mock grand test questions
        // This is a placeholder for now
        const mockGrandTestQuestions = [
          {
            id: "gt1",
            topicId: "mix",
            question: "What comes next in the sequence: 3, 8, 15, 24, 35, ?",
            options: ["48", "46", "50", "52"],
            correctAnswer: "48",
            explanation: "The sequence follows the pattern n² + 2n. For n = 6, we get 36 + 12 = 48."
          },
          {
            id: "gt2",
            topicId: "mix",
            question: "A and B can complete a work in 15 days and 10 days respectively. They started working together but B left 5 days before the completion of the work. In how many days will the work be completed?",
            options: ["9", "10", "11", "12"],
            correctAnswer: "11",
            explanation: "In one day, A and B together complete (1/15 + 1/10) = (2+3)/30 = 5/30 = 1/6 of the work. If B leaves 5 days before completion, then A works alone for 5 days at 1/15 per day. Let's say the total time taken is x days. For (x-5) days both work, and for 5 days only A works. So (x-5)/6 + 5/15 = 1. Solving for x gives us 11 days."
          },
          {
            id: "gt3",
            topicId: "mix",
            question: "A shopkeeper sells an item at a 10% discount and still makes a 20% profit. If the discounted selling price is $108, what was the original cost price?",
            options: ["$90", "$100", "$108", "$120"],
            correctAnswer: "$100",
            explanation: "If the selling price after 10% discount is $108, then the original selling price was $108 ÷ 0.9 = $120. If the profit is 20%, then cost price = selling price ÷ 1.2 = $120 ÷ 1.2 = $100."
          }
        ];
        
        setGrandTestQuestions(mockGrandTestQuestions);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGrandTestQuestions();
  }, []);
  
  useEffect(() => {
    if (!isLoading && grandTestQuestions.length > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            handleTestCompletion();
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
  }, [isLoading, grandTestQuestions]);
  
  const handleAnswerSubmit = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 2);
      toast({
        title: "Correct!",
        description: "+2 points",
      });
    } else {
      setScore(Math.max(0, score - 1));
      toast({
        title: "Incorrect",
        description: "-1 point",
        variant: "destructive"
      });
    }
  };
  
  const handleTestCompletion = async () => {
    if (isTestCompleted) return; // Prevent multiple submissions
    
    // Stop the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsTestCompleted(true);
    
    const finalScore = (score / (grandTestQuestions.length * 2)) * 100;
    const isPassed = finalScore >= 70;
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    toast({
      title: isPassed ? "Congratulations!" : "Test Completed",
      description: isPassed 
        ? `You passed the Grand Test with a score of ${finalScore.toFixed(1)}%!` 
        : `You scored ${finalScore.toFixed(1)}%. Try again to improve your score.`,
      variant: isPassed ? "default" : "destructive"
    });
    
    // Submit test results to backend if user is authenticated
    if (user) {
      try {
        await submitGrandTestResult(
          user.id,
          Math.round(finalScore),
          timeSpent,
          grandTestQuestions.length,
          Math.round(score / 2) // Convert score to number of correct answers
        );
        
        // Get recommendation based on performance
        try {
          const fetchedRecommendation = await getRecommendations(
            "grandTest",
            timeSpent,
            1, // Grand test is one attempt
            Math.round(finalScore) // Score percentage
          );
          setRecommendation(fetchedRecommendation);
        } catch (error) {
          console.error("Error fetching recommendations:", error);
        }
      } catch (error) {
        console.error("Error submitting test results:", error);
      }
    }
  };
  
  const handleFinishTest = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      handleTestCompletion();
      setIsSubmitting(false);
    }, 1000);
  };

  const handleRetry = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setIsTestCompleted(false);
    setTimeRemaining(45 * 60);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < grandTestQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  if (isLoading) {
    return (
      <MainLayout showSidebar={true}>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-4 flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/aptitude")}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-custom-darkBlue1">Grand Test</h1>
          </div>
          
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-custom-darkBlue1" />
            <p className="mt-6 text-gray-600 text-lg">Loading Grand Test questions...</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout showSidebar={true}>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/aptitude")}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-custom-darkBlue1">Grand Test</h1>
        </div>
        
        {!isTestCompleted ? (
          <QuestionView
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={grandTestQuestions.length}
            question={grandTestQuestions[currentQuestionIndex]}
            timeRemaining={timeRemaining}
            onAnswerSubmit={handleAnswerSubmit}
            onFinishTest={handleFinishTest}
            isSubmitting={isSubmitting}
          />
        ) : (
          <ResultView
            score={score}
            totalQuestions={grandTestQuestions.length}
            onRetry={handleRetry}
            recommendation={recommendation}
          />
        )}
        
        {!isTestCompleted && (
          <div className="mt-4 flex justify-center">
            <Button 
              className="bg-custom-darkBlue1 hover:bg-custom-darkBlue2 text-white"
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === grandTestQuestions.length - 1}
            >
              Next Question
            </Button>
          </div>
        )}
        
        {timeRemaining < 300 && !isTestCompleted && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white p-3 rounded-lg shadow-lg animate-pulse flex items-center max-w-xs">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <div>
              <p className="font-bold">Less than 5 minutes left!</p>
              <p className="text-sm">Please complete your test soon.</p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default GrandTestPage;
