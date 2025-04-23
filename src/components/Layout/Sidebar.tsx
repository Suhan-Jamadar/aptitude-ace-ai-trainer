import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  BookOpen,
  BarChart2,
  Calendar,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Topic } from "@/types";
import { cn } from "@/lib/utils";

interface SidebarProps {
  topics: Topic[];
  userProgress: {
    streak: number;
    topicsCompleted: number;
    totalTopics: number;
    username?: string;
  };
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

const Sidebar = ({ topics, userProgress, isSidebarCollapsed, onToggleSidebar }: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);

  const progressPercentage = (userProgress.topicsCompleted / userProgress.totalTopics) * 100;

  const filteredTopics = topics.filter(topic =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  return (
    <div
      className={cn(
        "h-screen bg-sidebar flex flex-col transition-all duration-300 fixed left-0 top-0 pt-20 z-20 shadow-xl bg-custom-darkBlue1 text-white",
        isSidebarCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Collapse/Expand Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-2 text-white hover:text-custom-gold focus:outline-none"
        onClick={onToggleSidebar}
      >
        {isSidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </Button>

      {/* Profile Section */}
      <div className={cn("px-1 py-6 flex flex-col items-center", isSidebarCollapsed && "px-0")}>
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-custom-gold/20 flex items-center justify-center">
            <User className="h-5 w-5 text-custom-gold" />
          </div>
        </div>
        {!isSidebarCollapsed && userProgress.username && (
          <div className="mt-2 text-center">
            <p className="text-xs sm:text-sm font-medium text-white">{userProgress.username}</p>
            <div className="mt-1 flex items-center justify-center text-custom-gold">
              <span className="text-xs">🔥 {userProgress.streak} day streak</span>
            </div>
          </div>
        )}
      </div>

      {/* Search Bar */}
      {!isSidebarCollapsed && (
        <div className="px-3 py-2">
          <Input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-custom-darkBlue2 border-custom-gold/30 text-white placeholder:text-gray-400"
          />
        </div>
      )}

      {/* Progress Section with Gradient */}
      <div className={cn("px-3 py-3", isSidebarCollapsed && "px-2")}>
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="h-5 w-5 text-custom-gold" />
          {!isSidebarCollapsed && <h3 className="font-medium">Progress</h3>}
        </div>
        <Progress 
          value={progressPercentage} 
          className="h-2 bg-custom-darkBlue2"
          style={{
            background: 'linear-gradient(90deg, hsla(46, 73%, 75%, 1) 0%, hsla(176, 73%, 88%, 1) 100%)'
          }}
        />
      </div>

      {/* Topics Section with Expandable Subtopics */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="h-5 w-5 text-custom-gold" />
          {!isSidebarCollapsed && <h3 className="font-medium">Topics</h3>}
        </div>
        <div className="space-y-1">
          {filteredTopics.map((topic) => (
            <Collapsible
              key={topic.id}
              open={expandedTopics.includes(topic.id)}
              onOpenChange={() => toggleTopic(topic.id)}
            >
              <CollapsibleTrigger
                className={cn(
                  "flex items-center gap-2 p-2 rounded-md hover:bg-custom-darkBlue2 transition-colors w-full",
                  !topic.isUnlocked && "opacity-50 pointer-events-none"
                )}
              >
                <div className="bg-custom-gold/20 p-1.5 rounded-md">
                  <BarChart2 className="h-4 w-4 text-custom-gold" />
                </div>
                {!isSidebarCollapsed && (
                  <>
                    <span className="text-sm truncate flex-1 text-left">{topic.name}</span>
                    <ChevronDown className="h-4 w-4 transform transition-transform duration-200" />
                  </>
                )}
              </CollapsibleTrigger>
              
              {!isSidebarCollapsed && topic.subtopics && (
                <CollapsibleContent>
                  <div className="ml-9 space-y-1 mt-1">
                    {topic.subtopics.map((subtopic) => (
                      <a
                        key={subtopic.id}
                        href={subtopic.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm py-1 px-2 rounded-md hover:bg-custom-darkBlue2 transition-colors text-gray-300 hover:text-white"
                      >
                        {subtopic.name}
                      </a>
                    ))}
                  </div>
                </CollapsibleContent>
              )}
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
