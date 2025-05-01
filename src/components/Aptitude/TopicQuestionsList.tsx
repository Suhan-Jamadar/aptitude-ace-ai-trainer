
import { useState, useEffect } from "react";
import { Question } from "@/types";
import { mockQuestions } from "@/services/mockData";
import { Button } from "@/components/ui/button";
import { getQuestionsByTopic } from "@/services/questionService";
import { toast } from "sonner";

interface TopicQuestionsListProps {
  topicId: string;
}

const TopicQuestionsList = ({ topicId }: TopicQuestionsListProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const fetchedQuestions = await getQuestionsByTopic(topicId);
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
        toast.error("Failed to load questions. Using mock data instead.");
        // Fallback to mock data
        setQuestions(mockQuestions[topicId] || []);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [topicId]);

  const handleSelectAnswer = (questionId: string, option: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const toggleShowAnswer = (questionId: string) => {
    setShowAnswers(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  if (loading) {
    return <div className="flex justify-center p-12">Loading questions...</div>;
  }

  if (questions.length === 0) {
    return <div>No practice questions available for this topic.</div>;
  }

  return (
    <div className="space-y-12">
      {questions.map((question, index) => (
        <div key={question.id} className="pb-8 border-b border-gray-200 last:border-0">
          <div className="flex">
            <div className="font-bold text-xl text-custom-darkBlue1 mr-4">Q{index + 1}</div>
            <h3 className="text-xl font-semibold text-custom-darkBlue1 mb-6">{question.question}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {question.options.map((option, optIndex) => {
              const letters = ['A', 'B', 'C', 'D'];
              const letter = letters[optIndex];
              const isSelected = selectedAnswers[question.id] === option;
              const isCorrect = showAnswers[question.id] && option === question.correctAnswer;
              const isIncorrect = showAnswers[question.id] && isSelected && option !== question.correctAnswer;
              
              return (
                <button
                  key={optIndex}
                  onClick={() => handleSelectAnswer(question.id, option)}
                  className={`
                    flex items-start p-4 rounded-lg border-2 text-left transition-all duration-200
                    ${isSelected ? "border-custom-gold bg-custom-gold/10" : "border-gray-200"}
                    ${isCorrect ? "border-green-500 bg-green-50" : ""}
                    ${isIncorrect ? "border-red-500 bg-red-50" : ""}
                    ${!showAnswers[question.id] ? "hover:border-custom-gold" : ""}
                  `}
                  disabled={showAnswers[question.id]}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-3 shrink-0">
                    {letter}
                  </div>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>
          
          {showAnswers[question.id] && (
            <div className="p-4 rounded-lg bg-blue-50 mb-4">
              <h4 className="font-bold mb-1">Explanation:</h4>
              <p>{question.explanation}</p>
            </div>
          )}
          
          <div className="flex justify-end">
            <Button 
              onClick={() => toggleShowAnswer(question.id)}
              variant="outline"
              className="bg-black text-white hover:bg-gray-800"
            >
              {showAnswers[question.id] ? "Hide Answer" : "View Answer"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopicQuestionsList;
