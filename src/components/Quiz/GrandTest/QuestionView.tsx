
import { Question } from "@/types";
import QuizQuestion from "../QuizQuestion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Timer from "./Timer";

interface QuestionViewProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  question: Question;
  timeRemaining: number;
  onAnswerSubmit: (isCorrect: boolean) => void;
  onFinishTest: () => void;
  isSubmitting: boolean;
}

const QuestionView = ({
  currentQuestionIndex,
  totalQuestions,
  question,
  timeRemaining,
  onAnswerSubmit,
  onFinishTest,
  isSubmitting,
}: QuestionViewProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm font-medium text-gray-500">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </div>
        <Timer timeRemaining={timeRemaining} />
      </div>
      
      <div className="mb-6">
        <Progress 
          value={(currentQuestionIndex / totalQuestions) * 100} 
          className="h-2 bg-gray-200"
        />
      </div>
      
      <QuizQuestion
        question={{...question}} // Create a new object to ensure proper re-rendering
        onAnswerSubmit={onAnswerSubmit}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
      />
      
      <div className="mt-6 flex justify-center gap-4">
        {currentQuestionIndex === totalQuestions - 1 && (
          <Button 
            className="bg-custom-darkBlue1 hover:bg-custom-darkBlue2 text-white"
            onClick={onFinishTest}
            disabled={isSubmitting}
          >
            Submit Test
            {isSubmitting && <span className="ml-2 animate-spin">...</span>}
          </Button>
        )}
        <Button
          variant="outline"
          onClick={onFinishTest}
          className="border-custom-darkBlue1 text-custom-darkBlue1 hover:bg-custom-darkBlue1 hover:text-white"
        >
          Finish Quiz Early
        </Button>
      </div>
    </div>
  );
};

export default QuestionView;
