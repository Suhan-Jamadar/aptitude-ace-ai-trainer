
import { useState } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import { Topic } from "@/types";
import { 
  BarChart2, 
  BookOpen, 
  TrendingUp, 
  Calendar,
  ArrowRight,
  Clock,
  Percent,
  PieChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import QuizPractice from "@/components/Quiz/QuizPractice";
import DailyChallenge from "@/components/Quiz/DailyChallenge";

// Mock topics data
const mockTopics: Topic[] = [
  {
    id: "1",
    name: "Number Series",
    description: "Identify patterns and predict the next number in a sequence",
    icon: "trending-up",
    totalQuestions: 20,
    completedQuestions: 15,
    score: 80,
    isUnlocked: true,
    recommendation: "Check out GeeksforGeeks for number series patterns: https://www.geeksforgeeks.org/number-series-formulas/",
    attempts: 3,
    avgTime: 45 // in seconds
  },
  {
    id: "2",
    name: "Time & Work",
    description: "Calculate work efficiency and time required for tasks",
    icon: "calendar",
    totalQuestions: 20,
    completedQuestions: 10,
    score: 75,
    isUnlocked: true,
    recommendation: "Practice more on time and work problems at Medium: https://medium.com/tag/aptitude",
    attempts: 2,
    avgTime: 60
  },
  {
    id: "3",
    name: "Percentages",
    description: "Master percentage calculations and applications",
    icon: "percent",
    totalQuestions: 20,
    completedQuestions: 5,
    score: 60,
    isUnlocked: true,
    recommendation: "Review percentage shortcuts at GeeksforGeeks: https://www.geeksforgeeks.org/percentages-formulas/",
    attempts: 1,
    avgTime: 55
  },
  {
    id: "4",
    name: "Probability",
    description: "Understand and calculate probability of events",
    icon: "bar-chart-2",
    totalQuestions: 20,
    completedQuestions: 0,
    score: 0,
    isUnlocked: true,
    attempts: 0,
    avgTime: 0
  },
  {
    id: "5",
    name: "Data Interpretation",
    description: "Analyze charts, graphs and tables to extract information",
    icon: "pie-chart",
    totalQuestions: 20,
    completedQuestions: 0,
    score: 0,
    isUnlocked: true, // Changed to true so the topic is functional
    attempts: 0,
    avgTime: 0
  }
];

const TopicCard = ({ topic }: { topic: Topic }) => {
  const progress = (topic.completedQuestions / topic.totalQuestions) * 100;
  const iconMap = {
    "trending-up": <TrendingUp className="h-6 w-6" />,
    "calendar": <Calendar className="h-6 w-6" />,
    "percent": <Percent className="h-6 w-6" />,
    "bar-chart-2": <BarChart2 className="h-6 w-6" />,
    "pie-chart": <PieChart className="h-6 w-6" />
  };

  const [showPractice, setShowPractice] = useState(false);

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
        
        <p className="text-gray-600 mb-4">
          {topic.description}
        </p>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{topic.completedQuestions}/{topic.totalQuestions}</span>
          </div>
          <Progress 
            value={progress} 
            className="h-2 bg-gray-200" 
          />
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

const AptitudePage = () => {
  const [showDailyChallenge, setShowDailyChallenge] = useState(false);
  const completedTopics = mockTopics.filter(topic => topic.completedQuestions > 0).length;
  const totalTopics = mockTopics.length;
  const progress = (completedTopics / totalTopics) * 100;
  const allTopicsPassed = mockTopics.every(topic => topic.score >= 70 || !topic.isUnlocked);
  
  return (
    <MainLayout showSidebar={true}>
      <motion.div 
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-custom-darkBlue1 mb-2">Aptitude Training</h1>
          <p className="text-gray-600">
            Master each topic to unlock the Grand Test and track your progress.
          </p>
        </div>
        
        <motion.div 
          className="mb-8 p-6 rounded-xl border shadow-sm bg-white"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-custom-darkBlue1 mb-2">
                Daily Challenge
              </h2>
              <p className="text-gray-600 mb-4 md:mb-0">
                Test your knowledge with a mixed set of questions from all topics.
                Complete the daily challenge to maintain your streak!
              </p>
            </div>
            <Button 
              className="bg-custom-darkBlue1 text-white hover:bg-custom-darkBlue2 min-w-[180px]"
              onClick={() => setShowDailyChallenge(true)}
            >
              Start Today's Challenge
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
        
        {allTopicsPassed && (
          <motion.div 
            className="mb-8 bg-gradient-to-r from-custom-gold/20 to-custom-peach/20 p-6 rounded-xl border border-custom-gold/30"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-custom-darkBlue1 mb-2">
                  🎉 Grand Test Unlocked!
                </h2>
                <p className="text-gray-600 mb-4 md:mb-0">
                  Congratulations! You've scored at least 70% in all available topics.
                  Take the 45-minute Grand Test to prove your mastery.
                </p>
              </div>
              <Link to="/aptitude/grand-test">
                <Button className="bg-custom-gold text-custom-darkBlue1 hover:bg-custom-gold/90 min-w-[150px]">
                  Start Grand Test
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTopics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </motion.div>

      {showDailyChallenge && (
        <DailyChallenge onClose={() => setShowDailyChallenge(false)} />
      )}
    </MainLayout>
  );
};

export default AptitudePage;
