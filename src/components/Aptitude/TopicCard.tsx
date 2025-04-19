
import { useState } from "react";
import { Topic } from "@/types";
import { 
  TrendingUp, 
  Calendar,
  Percent,
  BarChart2,
  PieChart,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import QuizPractice from "@/components/Quiz/QuizPractice";

interface TopicCardProps {
  topic: Topic;
}

const iconMap = {
  "trending-up": <TrendingUp className="h-6 w-6" />,
  "calendar": <Calendar className="h-6 w-6" />,
  "percent": <Percent className="h-6 w-6" />,
  "bar-chart-2": <BarChart2 className="h-6 w-6" />,
  "pie-chart": <PieChart className="h-6 w-6" />
};

export const TopicCard = ({ topic }: TopicCardProps) => {
  const [showPractice, setShowPractice] = useState(false);
  const progress = (topic.completedQuestions / topic.totalQuestions) * 100;

  return (
    <motion.div 
      className={`
        bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl
        transition-all duration-300 transform hover:-translate-y-1
        ${!topic.isUnlocked ? "opacity-75 grayscale" : ""}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Number(topic.id) * 0.1 }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-custom-gold/10 text-custom-gold mr-4">
              {iconMap[topic.icon as keyof typeof iconMap]}
            </div>
            <h3 className="text-xl font-semibold text-custom-darkBlue1">{topic.name}</h3>
          </div>
          {topic.score > 0 && (
            <div className="bg-custom-gold/10 px-3 py-1 rounded-full">
              <span className="text-custom-gold font-medium">{topic.score}%</span>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 mb-4">{topic.description}</p>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{topic.completedQuestions}/{topic.totalQuestions}</span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-200" />
        </div>

        <div className="flex flex-wrap gap-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center bg-gray-100 px-2 py-1 rounded-md">
            <Clock className="h-3 w-3 mr-1 text-custom-darkBlue2" />
            <span>{topic.attempts > 0 ? `${topic.avgTime}s avg` : 'No attempts'}</span>
          </div>
          <div className="flex items-center bg-gray-100 px-2 py-1 rounded-md">
            <span className="font-medium mr-1">{topic.attempts}</span>
            <span>{topic.attempts === 1 ? 'attempt' : 'attempts'}</span>
          </div>
        </div>
        
        {topic.recommendation && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400 animate-fade-in">
            <p className="text-sm text-blue-800">
              <span className="font-medium">AI Recommendation:</span> {topic.recommendation}
            </p>
          </div>
        )}
        
        <div className="flex justify-center">
          <Button
            className="w-full bg-custom-gold text-custom-darkBlue1 hover:bg-custom-gold/90"
            disabled={!topic.isUnlocked}
            onClick={() => setShowPractice(true)}
          >
            Practice
          </Button>
        </div>
      </div>

      {showPractice && (
        <QuizPractice 
          topicId={topic.id} 
          topicName={topic.name} 
          onClose={() => setShowPractice(false)} 
        />
      )}
    </motion.div>
  );
};
