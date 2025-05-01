
import { useState, useEffect } from "react";
import { Question } from "@/types";
import { mockQuestions } from "@/services/mockData";
import { Button } from "@/components/ui/button";
import { getQuestionsByTopic } from "@/services/questionService";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, HelpCircle } from "lucide-react";

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
    return (
      <div className="space-y-8">
        <div className="animate-pulse h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="animate-pulse h-32 bg-gray-200 rounded w-full mb-8"></div>
        <div className="animate-pulse h-32 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="text-4xl mb-4">📝</div>
        <h3 className="text-xl font-medium mb-2">No practice questions available yet</h3>
        <p className="text-gray-500">We're still working on questions for this topic. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-custom-darkBlue1 mb-6">Practice Questions</h2>
      
      {questions.map((question, index) => (
        <Card key={question.id} className="p-6 border-l-4 border-green-500 shadow-md hover:shadow-lg transition-shadow">
          <div className="pb-6">
            <div className="flex items-start">
              <div className="bg-green-100 text-green-800 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                {index + 1}
              </div>
              <h3 className="text-xl font-medium text-gray-800">{question.question}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
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
                      ${isSelected ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:border-gray-300"}
                      ${isCorrect ? "border-green-500 bg-green-50" : ""}
                      ${isIncorrect ? "border-red-500 bg-red-50" : ""}
                      ${showAnswers[question.id] ? "cursor-default" : "hover:bg-gray-50"}
                    `}
                    disabled={showAnswers[question.id]}
                  >
                    <div className={`
                      flex items-center justify-center w-8 h-8 rounded-full mr-3 shrink-0
                      ${isSelected ? "bg-blue-100 text-blue-800 border-blue-300" : "border border-gray-300 bg-gray-50"}
                      ${isCorrect ? "bg-green-100 text-green-800 border-green-300" : ""}
                      ${isIncorrect ? "bg-red-100 text-red-800 border-red-300" : ""}
                    `}>
                      {letter}
                    </div>
                    <span>{option}</span>
                    {showAnswers[question.id] && (
                      <div className="ml-auto">
                        {isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                        {isIncorrect && <XCircle className="h-5 w-5 text-red-600" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            
            {showAnswers[question.id] && (
              <div className="mt-6 p-4 rounded-lg bg-blue-50 border-l-4 border-blue-400">
                <h4 className="font-bold mb-2 flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-blue-600" />
                  Explanation:
                </h4>
                <p className="text-gray-700">{question.explanation}</p>
              </div>
            )}
            
            <div className="flex justify-end mt-6">
              <Button 
                onClick={() => toggleShowAnswer(question.id)}
                variant={showAnswers[question.id] ? "outline" : "default"}
                className={showAnswers[question.id] 
                  ? "border-blue-300 text-blue-700 hover:bg-blue-50" 
                  : "bg-blue-600 hover:bg-blue-700 text-white"}
              >
                {showAnswers[question.id] ? "Hide Explanation" : "View Explanation"}
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TopicQuestionsList;
