
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, BookOpen } from 'lucide-react';

interface ResultViewProps {
  score: number;
  totalQuestions: number;
  onRetry: () => void;
  recommendation?: string | null;
}

const ResultView = ({ score, totalQuestions, onRetry, recommendation }: ResultViewProps) => {
  const maxScore = totalQuestions * 2; // Each question is worth 2 points
  const percentage = Math.round((score / maxScore) * 100);
  const isPassed = percentage >= 70;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="text-center">
        <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
          isPassed ? 'bg-green-100' : 'bg-amber-100'
        }`}>
          {isPassed ? (
            <Check className="h-10 w-10 text-green-600" />
          ) : (
            <X className="h-10 w-10 text-amber-600" />
          )}
        </div>

        <h2 className="text-2xl font-bold mb-2">
          {isPassed ? 'Congratulations!' : 'Test Completed'}
        </h2>
        
        <p className="text-lg mb-1">
          You scored <span className="font-bold">{score}</span> out of {maxScore} points
        </p>
        
        <p className="text-2xl font-bold mb-6">
          {percentage}%
        </p>
        
        <div className="mb-8 px-6">
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${isPassed ? 'bg-green-500' : 'bg-amber-500'}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span>0%</span>
            <span className={isPassed ? 'text-green-600 font-bold' : ''}>70% (Pass)</span>
            <span>100%</span>
          </div>
        </div>

        {recommendation && (
          <div className="mb-8 bg-blue-50 p-4 rounded-lg text-left">
            <div className="flex items-center mb-2">
              <BookOpen className="h-5 w-5 text-custom-darkBlue1 mr-2" />
              <h4 className="font-medium text-custom-darkBlue1">Performance Analysis & Recommendation</h4>
            </div>
            <p className="text-gray-700">{recommendation}</p>
          </div>
        )}
        
        <Button onClick={onRetry} className="w-full bg-custom-darkBlue1 hover:bg-custom-darkBlue2">
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default ResultView;
