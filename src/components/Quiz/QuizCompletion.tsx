
import React from "react";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/utils/timeUtils";
import { BookOpen } from "lucide-react";

interface QuizCompletionProps {
  score: number;
  totalQuestions: number;
  timeSpent: number;
  isSubmitting: boolean;
  onClose: () => void;
  recommendation?: string | null;
}

const QuizCompletion = ({
  score,
  totalQuestions,
  timeSpent,
  isSubmitting,
  onClose,
  recommendation
}: QuizCompletionProps) => {
  const percentScore = Math.round((score / totalQuestions) * 100);
  
  return (
    <div className="text-center py-6">
      <h3 className="text-xl font-semibold mb-2">Practice Complete!</h3>
      <p className="mb-2">You scored {score} out of {totalQuestions} ({percentScore}%)</p>
      <p className="text-gray-500 mb-4">Time taken: {formatTime(timeSpent)}</p>
      
      {isSubmitting && <p className="text-blue-500 mb-4">Saving results...</p>}
      
      {recommendation && (
        <div className="mt-6 mb-6 bg-blue-50 p-4 rounded-lg text-left">
          <div className="flex items-center mb-2">
            <BookOpen className="h-5 w-5 text-custom-darkBlue1 mr-2" />
            <h4 className="font-medium text-custom-darkBlue1">Personalized Recommendation</h4>
          </div>
          <p className="text-gray-700">{recommendation}</p>
        </div>
      )}
      
      <Button onClick={onClose} className="mt-2">Close</Button>
    </div>
  );
};

export default QuizCompletion;
