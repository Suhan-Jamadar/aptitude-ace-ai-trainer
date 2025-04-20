import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import { Question } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Timer from "@/components/Quiz/GrandTest/Timer";
import QuestionView from "@/components/Quiz/GrandTest/QuestionView";
import ResultView from "@/components/Quiz/GrandTest/ResultView";

// Mock grand test questions - mix of different topics
const grandTestQuestions: Question[] = [
  // Number Series
  {
    id: "gt1",
    topicId: "mix",
    question: "What comes next in the sequence: 3, 8, 15, 24, 35, ?",
    options: ["48", "46", "50", "52"],
    correctAnswer: "48",
    explanation: "The sequence follows the pattern n² + 2n. For n = 6, we get 36 + 12 = 48."
  },
  // Time & Work
  {
    id: "gt2",
    topicId: "mix",
    question: "A and B can complete a work in 15 days and 10 days respectively. They started working together but B left 5 days before the completion of the work. In how many days will the work be completed?",
    options: ["9", "10", "11", "12"],
    correctAnswer: "11",
    explanation: "In one day, A and B together complete (1/15 + 1/10) = (2+3)/30 = 5/30 = 1/6 of the work. If B leaves 5 days before completion, then A works alone for 5 days at 1/15 per day. Let's say the total time taken is x days. For (x-5) days both work, and for 5 days only A works. So (x-5)/6 + 5/15 = 1. Solving for x gives us 11 days."
  },
  // Percentages
  {
    id: "gt3",
    topicId: "mix",
    question: "A shopkeeper sells an item at a 10% discount and still makes a 20% profit. If the discounted selling price is $108, what was the original cost price?",
    options: ["$90", "$100", "$108", "$120"],
    correctAnswer: "$100",
    explanation: "If the selling price after 10% discount is $108, then the original selling price was $108 ÷ 0.9 = $120. If the profit is 20%, then cost price = selling price ÷ 1.2 = $120 ÷ 1.2 = $100."
  },
  // Additional questions would be added here
];

const GrandTestPage = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(45 * 60); // 45 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTestCompletion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
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
    
    if (currentQuestionIndex < grandTestQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handleTestCompletion = () => {
    setIsTestCompleted(true);
    clearInterval(timeRemaining as unknown as number);
    
    const finalScore = (score / (grandTestQuestions.length * 2)) * 100;
    const isPassed = finalScore >= 70;
    
    toast({
      title: isPassed ? "Congratulations!" : "Test Completed",
      description: isPassed 
        ? `You passed the Grand Test with a score of ${finalScore.toFixed(1)}%!` 
        : `You scored ${finalScore.toFixed(1)}%. Try again to improve your score.`,
      variant: isPassed ? "default" : "destructive"
    });
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
          />
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
