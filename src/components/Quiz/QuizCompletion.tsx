
import { Button } from "@/components/ui/button";
import { formatTime } from "@/utils/timeUtils";
import { Trophy, Clock, Activity, Check, ArrowRight } from "lucide-react";

interface PerformanceData {
  averageTimePerQuestion: number;
  fastestQuestion: number;
  slowestQuestion: number;
  streak?: number; // Added streak as optional property
}

interface QuizCompletionProps {
  score: number;
  totalQuestions: number;
  timeSpent: number;
  onClose: () => void;
  isSubmitting?: boolean;
  recommendation?: string | null;
  performanceData?: PerformanceData;
  isAuthenticated?: boolean;
  onAuthRequired?: () => void;
}

const QuizCompletion = ({
  score,
  totalQuestions,
  timeSpent,
  onClose,
  isSubmitting = false,
  recommendation,
  performanceData,
  isAuthenticated,
  onAuthRequired
}: QuizCompletionProps) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const isPassed = percentage >= 70;
  
  const getScoreColor = () => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };
  
  return (
    <div className="flex flex-col items-center py-6">
      <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
        isPassed ? "bg-green-100" : "bg-red-100"
      }`}>
        <Trophy className={`h-12 w-12 ${isPassed ? "text-green-500" : "text-red-500"}`} />
      </div>
      
      <h3 className="text-2xl font-bold mb-2">
        {isPassed ? "Congratulations!" : "Quiz Completed"}
      </h3>
      
      <p className="text-gray-700 mb-6">
        You scored <span className={`font-bold ${getScoreColor()}`}>{percentage}%</span> 
        ({score} out of {totalQuestions} correct)
      </p>
      
      <div className="w-full max-w-md grid grid-cols-1 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg flex items-start">
          <Clock className="h-5 w-5 text-blue-600 mt-1 mr-2" />
          <div>
            <h4 className="font-medium text-blue-800 mb-1">Time Performance</h4>
            <p className="text-sm text-gray-700">Total time: {formatTime(timeSpent)}</p>
            
            {performanceData && (
              <>
                <p className="text-sm text-gray-700 mt-2">
                  Average time per question: {Math.round(performanceData.averageTimePerQuestion)} seconds
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="bg-blue-100 p-2 rounded">
                    <p className="text-xs text-blue-700">Fastest: {performanceData.fastestQuestion}s</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded">
                    <p className="text-xs text-blue-700">Slowest: {performanceData.slowestQuestion}s</p>
                  </div>
                </div>
                
                {/* Display streak if it exists */}
                {performanceData.streak && performanceData.streak > 0 && (
                  <div className="mt-2 bg-amber-100 p-2 rounded">
                    <p className="text-xs text-amber-700">🔥 Streak: {performanceData.streak}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg flex items-start">
          <Activity className="h-5 w-5 text-green-600 mt-1 mr-2" />
          <div>
            <h4 className="font-medium text-green-800 mb-1">Performance Summary</h4>
            <div className="flex items-center mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    percentage >= 80 ? "bg-green-600" : 
                    percentage >= 60 ? "bg-yellow-500" : "bg-red-600"
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm font-medium">{percentage}%</span>
            </div>
            
            <div className="mt-3 flex items-center">
              {isPassed ? (
                <div className="flex items-center text-green-700">
                  <Check className="h-4 w-4 mr-1" /> 
                  <span className="text-sm">You've mastered this topic!</span>
                </div>
              ) : (
                <p className="text-sm text-orange-700">
                  More practice needed to master this topic
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {recommendation && (
        <div className="w-full max-w-md bg-yellow-50 p-4 rounded-lg mb-6">
          <div className="flex items-center mb-2">
            <ArrowRight className="h-5 w-5 text-yellow-600 mr-2" />
            <h4 className="font-medium text-yellow-800">Recommendation</h4>
          </div>
          <p className="text-sm text-gray-700">{recommendation}</p>
        </div>
      )}

      {!isAuthenticated && (
        <div className="w-full max-w-md bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex items-center mb-2">
            <ArrowRight className="h-5 w-5 text-blue-600 mr-2" />
            <h4 className="font-medium text-blue-800">Save Your Progress</h4>
          </div>
          <p className="text-sm text-gray-700">
            <button 
              onClick={onAuthRequired} 
              className="font-medium underline cursor-pointer"
            >
              Sign in
            </button> to track your progress and get personalized recommendations.
          </p>
        </div>
      )}

      <div className="flex gap-4">
        <Button
          className="bg-custom-darkBlue1 hover:bg-custom-darkBlue2 text-white"
          onClick={onClose}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Close"}
        </Button>
      </div>
    </div>
  );
};

export default QuizCompletion;
