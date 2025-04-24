
import React from "react";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/utils/timeUtils";

interface QuizCompletionProps {
  score: number;
  totalQuestions: number;
  timeSpent: number;
  isSubmitting: boolean;
  onClose: () => void;
}

const QuizCompletion = ({
  score,
  totalQuestions,
  timeSpent,
  isSubmitting,
  onClose,
}: QuizCompletionProps) => {
  return (
    <div className="text-center py-6">
      <h3 className="text-xl font-semibold mb-2">Practice Complete!</h3>
      <p className="mb-2">You scored {score} out of {totalQuestions}</p>
      <p className="text-gray-500 mb-4">Time taken: {formatTime(timeSpent)}</p>
      {isSubmitting && <p className="text-blue-500 mb-4">Saving results...</p>}
      <Button onClick={onClose}>Close</Button>
    </div>
  );
};

export default QuizCompletion;
