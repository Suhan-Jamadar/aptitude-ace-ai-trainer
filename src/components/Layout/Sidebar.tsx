import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  BookOpen,
  BarChart2,
  Calendar,
  TrendingUp,
  Search,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Topic } from "@/types";

interface SidebarProps {
  topics: Topic[];
  userProgress: {
    streak: number;
    topicsCompleted: number;
    totalTopics: number;
    username?: string;
  };
}

const Sidebar = ({ topics, userProgress }: SidebarProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const progressPercentage = (userProgress.topicsCompleted / userProgress.totalTopics) * 100;
  
  const filteredTopics = topics.filter(topic => 
    topic.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartChallenge = () => {
    navigate("/aptitude/daily-challenge");
  };

  return (
    <div
      className={`h-screen bg-sidebar flex flex-col transition-all duration-300 ${
        isSidebarOpen ? "w-64" : "w-20"
      } bg-custom-darkBlue1 text-white fixed left-0 top-0 pt-20 shadow-xl`}
    >
      {/* Collapse Button */}
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
        </div>
        {isSidebarOpen && userProgress.username && (
          <div className="mt-4 text-center">
            <p className="text-sm font-medium text-white">{userProgress.username}</p>
            <div className="mt-2 flex items-center justify-center text-custom-gold">
              <span className="text-sm">🔥 {userProgress.streak} day streak</span>
            </div>
          </div>
        )}
      </div>

      {/* Search Bar */}
      {isSidebarOpen && (
        <div className="px-4 py-2">
          <Input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-custom-darkBlue2 border-custom-gold/30 text-white placeholder:text-gray-400"
          />
        </div>
      )}

      {/* Daily Challenge */}
      {isSidebarOpen && (
        <div className="px-4 py-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-custom-gold/20 hover:bg-custom-gold/30 text-white border border-custom-gold/30">
                <Calendar className="h-5 w-5 text-custom-gold mr-2" />
                Daily Challenge
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Daily Challenge Instructions</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <p className="text-sm text-gray-600">
                  🎯 Challenge yourself with our daily quiz:
                </p>
                <ul className="list-disc pl-4 space-y-2 text-sm text-gray-600">
                  <li>5 minutes to answer as many questions as possible</li>
                  <li>+2 points for correct answers</li>
                  <li>-1 point for incorrect answers</li>
                  <li>Questions from various topics to test your knowledge</li>
                </ul>
                <Button 
                  className="w-full bg-custom-gold text-custom-darkBlue1 hover:bg-custom-gold/90"
                  onClick={handleStartChallenge}
                >
                  Start Challenge
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
          {filteredTopics.map((topic) => (
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
    </div>
  );
};

export default Sidebar;
