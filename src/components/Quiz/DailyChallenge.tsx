
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Question } from "@/types";
import QuizQuestion from "./QuizQuestion";
import { X, Trophy } from "lucide-react";
import { toast } from "sonner";

// Mock daily challenge questions
const dailyChallengeQuestions: Question[] = [
  {
    id: "dc1",
    topicId: "1", // Number Series
    question: "Find the next number in the sequence: 2, 6, 12, 20, 30, ?",
    options: ["42", "40", "36", "48"],
    correctAnswer: "42",
    explanation: "The sequence follows the pattern of adding consecutive even numbers: 2, +4, +6, +8, +10, +12. So 30 + 12 = 42."
  },
  {
    id: "dc2",
    topicId: "2", // Time & Work
    question: "If 5 men can complete a work in 8 days, then in how many days can 10 men complete the same work?",
    options: ["4 days", "5 days", "6 days", "3 days"],
    correctAnswer: "4 days",
    explanation: "Using the formula (M₁ × D₁) = (M₂ × D₂), we get (5 × 8) = (10 × D₂). So D₂ = 4 days."
  },
  {
    id: "dc3",
    topicId: "3", // Percentages
    question: "A shirt is discounted by 20% and then by 25%. What is the total discount percentage?",
    options: ["40%", "45%", "35%", "50%"],
    correctAnswer: "40%",
    explanation: "After a 20% discount, the price is 80% of original. After another 25% discount, the price is 75% of 80%, which is 60% of original price. So the total discount is 40%."
  },
  {
    id: "dc4",
    topicId: "4", // Probability
    question: "A jar contains 4 red balls and 6 blue balls. If two balls are drawn at random without replacement, what is the probability that both are red?",
    options: ["2/15", "1/3", "2/5", "1/10"],
    correctAnswer: "2/15",
    explanation: "P(both red) = (4C2)/(10C2) = 6/45 = 2/15."
  },
  {
    id: "dc5",
    topicId: "5", // Data Interpretation
    question: "Based on the pie chart, if Company A has 25% market share and Company B has 35%, what is the difference in their market shares?",
    options: ["10%", "5%", "15%", "20%"],
    correctAnswer: "10%",
    explanation: "The difference in market share is 35% - 25% = 10%."
  }
];

interface DailyChallengeProps {
  onClose: () => void;
}

const DailyChallenge = ({ onClose }: DailyChallengeProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);
  const [streakIncreased, setStreakIncreased] = useState(false);

  useEffect(() => {
    setStartTime(Date.now());

    // Update time spent
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const handleAnswerSubmit = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < dailyChallengeQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsCompleted(true);
      if (score >= 3) {
        setStreakIncreased(true);
        toast.success("Daily streak increased!");
      }
    }
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
            <DialogTitle className="text-xl">Daily Challenge</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {!isCompleted ? (
          <div>
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Question {currentQuestionIndex + 1} of {dailyChallengeQuestions.length}</span>
              <span>Time: {formatTime(timeSpent)}</span>
            </div>

            <QuizQuestion
              question={dailyChallengeQuestions[currentQuestionIndex]}
              onAnswerSubmit={(isCorrect) => {
                handleAnswerSubmit(isCorrect);
                setTimeout(handleNextQuestion, 1500);
              }}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={dailyChallengeQuestions.length}
            />
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-custom-gold/20 flex items-center justify-center mb-4">
              <Trophy className="h-10 w-10 text-custom-gold" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Challenge Complete!</h3>
            <p className="mb-2">You scored {score} out of {dailyChallengeQuestions.length}</p>
            <p className="text-gray-500 mb-2">Time taken: {formatTime(timeSpent)}</p>
            
            {streakIncreased && (
              <div className="bg-custom-gold/20 p-3 rounded-lg mb-4 animate-pulse">
                <p className="text-custom-gold font-medium">🔥 Daily streak increased!</p>
              </div>
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
