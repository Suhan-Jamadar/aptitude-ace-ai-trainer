
import { useState, useEffect } from "react";
import { Question } from "@/types";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { shuffleArray } from "@/utils/arrayUtils";
import Timer from "./Timer";

interface QuizQuestionProps {
  question: Question;
  onAnswerSubmit: (isCorrect: boolean, timeSpent: number) => void;
  questionNumber: number;
  totalQuestions: number;
}

const QuizQuestion = ({
  question,
  onAnswerSubmit,
  questionNumber,
  totalQuestions,
}: QuizQuestionProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [randomizedOptions, setRandomizedOptions] = useState<string[]>([]);
  const [startTime] = useState<number>(Date.now());
  
  useEffect(() => {
    // Reset state when question changes
    setSelectedOption(null);
    setHasSubmitted(false);
    setTimeSpent(0);
    
    // Randomize options when question changes
    setRandomizedOptions(shuffleArray(question.options));
    
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setTimeSpent(elapsed);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [question.id, startTime]); // Reset timer and randomize options when question changes

  const handleOptionSelect = (option: string) => {
    if (!hasSubmitted) {
      setSelectedOption(option);
    }
  };

  const handleSubmit = () => {
    if (selectedOption) {
      setHasSubmitted(true);
      const isCorrect = selectedOption === question.correctAnswer;
      onAnswerSubmit(isCorrect, timeSpent);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setHasSubmitted(false);
    setTimeSpent(0);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm font-medium text-gray-500">
          Question {questionNumber} of {totalQuestions}
        </div>
        <div className="flex items-center text-sm font-medium text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span>{timeSpent} seconds</span>
        </div>
      </div>

      <h3 className="text-xl md:text-2xl font-semibold text-custom-darkBlue1 mb-6">
        {question.question}
      </h3>

      <div className="space-y-3 mb-8">
        {randomizedOptions.map((option, index) => (
          <button
            key={index}
            className={`
              w-full text-left p-4 rounded-lg border-2 transition-all duration-200
              ${
                selectedOption === option
                  ? hasSubmitted
                    ? selectedOption === question.correctAnswer
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                    : "border-custom-gold bg-custom-gold/10"
                  : "border-gray-200 hover:border-custom-gold"
              }
              ${
                hasSubmitted && option === question.correctAnswer
                  ? "border-green-500 bg-green-50"
                  : ""
              }
              ${hasSubmitted ? "cursor-default" : "cursor-pointer"}
            `}
            onClick={() => handleOptionSelect(option)}
            disabled={hasSubmitted}
          >
            <div className="flex items-center justify-between">
              <span>{option}</span>
              {hasSubmitted && option === question.correctAnswer && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {hasSubmitted && selectedOption === option && option !== question.correctAnswer && (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
          </button>
        ))}
      </div>

      {hasSubmitted ? (
        <div>
          <div className={`p-4 rounded-lg mb-6 ${selectedOption === question.correctAnswer ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
            <div className="font-semibold mb-2 flex items-center">
              {selectedOption === question.correctAnswer ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-green-700">Correct Answer!</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-red-700">Incorrect Answer</span>
                </>
              )}
            </div>
            <p className={selectedOption === question.correctAnswer ? "text-green-700" : "text-red-700"}>
              {question.explanation}
            </p>
          </div>
          <Button 
            className="w-full bg-custom-darkBlue1 hover:bg-custom-darkBlue2 text-white"
            onClick={handleNext}
          >
            Next Question
          </Button>
        </div>
      ) : (
        <Button
          className="w-full bg-custom-gold text-custom-darkBlue1 hover:bg-custom-gold/90"
          onClick={handleSubmit}
          disabled={!selectedOption}
        >
          Submit Answer
        </Button>
      )}
    </div>
  );
};

export default QuizQuestion;
