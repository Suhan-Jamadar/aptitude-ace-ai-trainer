
import { useState } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import { Topic } from "@/types";
import { 
  BarChart2, 
  BookOpen, 
  TrendingUp, 
  Calendar,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
    recommendation: "Check out GeeksforGeeks for number series patterns: https://www.geeksforgeeks.org/number-series-formulas/"
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
    recommendation: "Practice more on time and work problems at Medium: https://medium.com/tag/aptitude"
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
    recommendation: "Review percentage shortcuts at GeeksforGeeks: https://www.geeksforgeeks.org/percentages-formulas/"
  },
  {
    id: "4",
    name: "Probability",
    description: "Understand and calculate probability of events",
    icon: "bar-chart-2",
    totalQuestions: 20,
    completedQuestions: 0,
    score: 0,
    isUnlocked: true
  },
  {
    id: "5",
    name: "Data Interpretation",
    description: "Analyze charts, graphs and tables to extract information",
    icon: "pie-chart",
    totalQuestions: 20,
    completedQuestions: 0,
    score: 0,
    isUnlocked: false
  }
];

const TopicCard = ({ topic }: { topic: Topic }) => {
  const progress = (topic.completedQuestions / topic.totalQuestions) * 100;
  const iconMap = {
    "trending-up": <TrendingUp className="h-6 w-6" />,
    "calendar": <Calendar className="h-6 w-6" />,
    "percent": <span className="text-xl font-bold">%</span>,
    "bar-chart-2": <BarChart2 className="h-6 w-6" />,
    "pie-chart": <BookOpen className="h-6 w-6" />
  };

  return (
    <div className={`
      bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl
      transition-all duration-300 transform hover:-translate-y-1
      ${!topic.isUnlocked ? "opacity-75 grayscale" : ""}
    `}>
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
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-custom-gold to-custom-peach transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        {topic.recommendation && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400 animate-fade-in">
            <p className="text-sm text-blue-800">
              <span className="font-medium">AI Recommendation:</span> {topic.recommendation}
            </p>
          </div>
        )}
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            className="text-custom-darkBlue1 border-custom-darkBlue1 hover:bg-custom-darkBlue1 hover:text-white"
            disabled={!topic.isUnlocked}
          >
            Practice
          </Button>
          <Button
            className="bg-custom-gold text-custom-darkBlue1 hover:bg-custom-gold/90"
            disabled={!topic.isUnlocked}
          >
            Start Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

const AptitudePage = () => {
  const completedTopics = mockTopics.filter(topic => topic.completedQuestions > 0).length;
  const totalTopics = mockTopics.length;
  const progress = (completedTopics / totalTopics) * 100;
  const allTopicsPassed = mockTopics.every(topic => topic.score >= 70 || !topic.isUnlocked);
  
  return (
    <MainLayout showSidebar={true}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-custom-darkBlue1 mb-2">Aptitude Training</h1>
          <p className="text-gray-600">
            Master each topic to unlock the Grand Test and track your progress.
          </p>
        </div>
        
        {allTopicsPassed && (
          <div className="mb-8 bg-gradient-to-r from-custom-gold/20 to-custom-peach/20 p-6 rounded-xl border border-custom-gold/30 animate-fade-in">
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
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTopics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
          
          {/* Add New Topic Card */}
          <div className="bg-white/50 backdrop-blur-sm rounded-xl overflow-hidden shadow border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6 text-center hover:bg-white/70 transition-all duration-300 cursor-pointer min-h-[320px]">
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center mb-4">
              <span className="text-3xl text-gray-500">+</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Add New Topic</h3>
            <p className="text-gray-500">
              Create a custom topic or add from our library
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AptitudePage;
