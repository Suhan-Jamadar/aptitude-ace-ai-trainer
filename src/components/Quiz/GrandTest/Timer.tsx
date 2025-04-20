
import { Clock } from "lucide-react";

interface TimerProps {
  timeRemaining: number;
  className?: string;
}

const Timer = ({ timeRemaining, className = "" }: TimerProps) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center text-sm font-medium ${timeRemaining < 300 ? 'text-red-500 animate-pulse' : 'text-gray-500'} ${className}`}>
      <Clock className={`h-4 w-4 mr-1 ${timeRemaining < 300 ? 'text-red-500' : ''}`} />
      <span>Time remaining: {formatTime(timeRemaining)}</span>
    </div>
  );
};

export default Timer;
