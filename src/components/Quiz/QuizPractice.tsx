
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Question } from "@/types";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import QuizQuestion from "./QuizQuestion";
import QuizCompletion from "./QuizCompletion";
import { useQuizState } from "@/hooks/useQuizState";
import { formatTime } from "@/utils/timeUtils";

interface QuizPracticeProps {
  topicId: string;
  topicName: string;
  onClose: () => void;
}

const QuizPractice = ({ topicId, topicName, onClose }: QuizPracticeProps) => {
  const { user } = useAuth();
  const questions = questionsData[topicId] || [];

  const {
    currentQuestionIndex,
    score,
    isCompleted,
    timeSpent,
    isSubmitting,
    waitingForNextQuestion,
    handleAnswerSubmit,
    handleNextQuestion
  } = useQuizState({
    topicId,
    questions,
    userId: user?.id
  });

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
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                  <span>Time: {formatTime(timeSpent)}</span>
                </div>

                <QuizQuestion
                  question={questions[currentQuestionIndex]}
                  onAnswerSubmit={handleAnswerSubmit}
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
