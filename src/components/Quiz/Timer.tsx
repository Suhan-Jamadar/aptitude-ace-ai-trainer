
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface TimerProps {
  initialSeconds: number;
  isRunning?: boolean;
  onTimeout?: () => void;
  className?: string;
}

const Timer = ({ 
  initialSeconds,
  isRunning = true,
  onTimeout,
  className = ""
}: TimerProps) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;
    
    if (isRunning && seconds > 0) {
      timerId = setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds <= 1) {
            if (timerId) clearInterval(timerId);
            if (onTimeout) onTimeout();
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isRunning, seconds, onTimeout]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const timeRemaining = formatTime(seconds);
  const isLowTime = seconds < 30;

  return (
    <div className={`flex items-center text-sm font-medium ${isLowTime ? 'text-red-500 animate-pulse' : 'text-gray-500'} ${className}`}>
      <Clock className={`h-4 w-4 mr-1 ${isLowTime ? 'text-red-500' : ''}`} />
      <span>Time remaining: {timeRemaining}</span>
    </div>
  );
};

export default Timer;
