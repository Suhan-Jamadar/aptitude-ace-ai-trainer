
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  BookOpen,
  BarChart2,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Topic } from "@/types";

interface SidebarProps {
  topics: Topic[];
  userProgress: {
    streak: number;
    topicsCompleted: number;
    totalTopics: number;
  };
}

const Sidebar = ({ topics, userProgress }: SidebarProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const progressPercentage = (userProgress.topicsCompleted / userProgress.totalTopics) * 100;

  return (
    <div
      className={`h-screen bg-sidebar flex flex-col transition-all duration-300 ${
        isSidebarOpen ? "w-64" : "w-20"
      } bg-custom-darkBlue1 text-white fixed left-0 top-0 pt-20 shadow-xl`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white hover:text-custom-gold"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <span className="text-xl">←</span>
        ) : (
          <span className="text-xl">→</span>
        )}
      </Button>

      {/* Profile Section */}
      <div className="px-4 py-6 flex flex-col items-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-custom-gold/20 flex items-center justify-center">
            <User className="h-8 w-8 text-custom-gold" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-custom-gold text-custom-darkBlue1 flex items-center justify-center text-xs font-bold">
            {userProgress.streak}
          </div>
        </div>
        {isSidebarOpen && (
          <div className="mt-4 text-center">
            <p className="text-sm font-medium text-white">Daily Streak</p>
            <p className="text-xs text-custom-gold">Keep it going!</p>
          </div>
        )}
      </div>

      {/* Daily Challenge */}
      {isSidebarOpen && (
        <div className="px-4 py-3 flex flex-col animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-custom-gold" />
            <h3 className="font-medium">Daily Challenge</h3>
          </div>
          <Button className="w-full bg-custom-gold/20 hover:bg-custom-gold/30 text-white border border-custom-gold/30">
            Start Today's Challenge
          </Button>
        </div>
      )}

      {/* Progress Section */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          {isSidebarOpen ? (
            <>
              <TrendingUp className="h-5 w-5 text-custom-gold" />
              <h3 className="font-medium">Progress</h3>
            </>
          ) : (
            <TrendingUp className="h-5 w-5 text-custom-gold mx-auto" />
          )}
        </div>
        <div className="w-full bg-custom-darkBlue2 rounded-full h-2.5 mb-2">
          <div 
            className="bg-gradient-to-r from-custom-gold to-custom-peach h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        {isSidebarOpen && (
          <p className="text-xs text-center">
            {userProgress.topicsCompleted} of {userProgress.totalTopics} Topics Completed
          </p>
        )}
      </div>

      {/* Topics Section */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          {isSidebarOpen ? (
            <>
              <BookOpen className="h-5 w-5 text-custom-gold" />
              <h3 className="font-medium">Topics</h3>
            </>
          ) : (
            <BookOpen className="h-5 w-5 text-custom-gold mx-auto" />
          )}
        </div>
        <div className="space-y-2">
          {topics.map((topic) => (
            <Link 
              key={topic.id} 
              to={`/aptitude/topic/${topic.id}`}
              className={`flex items-center gap-2 p-2 rounded-md hover:bg-custom-darkBlue2 transition-colors ${
                !topic.isUnlocked ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <div className="bg-custom-gold/20 p-1.5 rounded-md">
                <BarChart2 className="h-4 w-4 text-custom-gold" />
              </div>
              {isSidebarOpen && (
                <span className="text-sm truncate">{topic.name}</span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Grand Test Link */}
      <div className="px-4 py-3">
        <Link 
          to="/aptitude/grand-test"
          className={`block p-3 bg-gradient-to-r from-custom-gold to-custom-gold/90 text-custom-darkBlue1 font-medium rounded-lg text-center transition-transform hover:scale-[1.02] ${
            progressPercentage < 70 ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          {isSidebarOpen ? (
            "Grand Test"
          ) : (
            <span className="block text-center">GT</span>
          )}
        </Link>
        {isSidebarOpen && progressPercentage < 70 && (
          <p className="text-xs text-center mt-1">
            Complete 70% of topics to unlock
          </p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
