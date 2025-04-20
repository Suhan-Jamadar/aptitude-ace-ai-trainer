
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ResultViewProps {
  score: number;
  totalQuestions: number;
  onRetry: () => void;
}

const ResultView = ({ score, totalQuestions, onRetry }: ResultViewProps) => {
  const navigate = useNavigate();
  const finalScore = Math.round((score / totalQuestions) * 100);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
      <h2 className="text-2xl font-bold mb-4 text-custom-darkBlue1">Test Completed!</h2>
      <p className="text-lg mb-2">
        Your score: <span className="font-bold">{finalScore}%</span>
      </p>
      <p className="text-gray-600 mb-6">
        You answered {score} out of {totalQuestions} questions correctly.
      </p>
      
      <div className="flex justify-center">
        <Button 
          className="bg-custom-gold text-custom-darkBlue1 hover:bg-custom-gold/90 mr-4"
          onClick={() => navigate("/aptitude")}
        >
          Back to Topics
        </Button>
        <Button 
          variant="outline"
          className="border-custom-darkBlue1 text-custom-darkBlue1 hover:bg-custom-darkBlue1 hover:text-white"
          onClick={onRetry}
        >
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default ResultView;
