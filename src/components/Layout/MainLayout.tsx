
import { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Topic } from "@/types";
import { GrandTestBanner } from "../Aptitude/GrandTestBanner";
import { Lock } from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

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
    isUnlocked: true
  },
  {
    id: "2",
    name: "Time & Work",
    description: "Calculate work efficiency and time required for tasks",
    icon: "calendar",
    totalQuestions: 20,
    completedQuestions: 10,
    score: 75,
    isUnlocked: true
  },
  {
    id: "3",
    name: "Percentages",
    description: "Master percentage calculations and applications",
    icon: "percent",
    totalQuestions: 20,
    completedQuestions: 5,
    score: 60,
    isUnlocked: true
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

// Mock user progress with username
const mockUserProgress = {
  streak: 3,
  topicsCompleted: 2,
  totalTopics: mockTopics.length,
  username: "John Doe" // Added username
};

const MainLayout = ({ children, showSidebar = false }: MainLayoutProps) => {
  const isGrandTestUnlocked = mockTopics.every(topic => 
    topic.isUnlocked && (topic.score >= 70 || topic.score === 0)
  );

  return (
    <div className="min-h-screen flex flex-col bg-custom-lightGray">
      <Header />
      <div className="flex flex-1">
        {showSidebar && (
          <Sidebar topics={mockTopics} userProgress={mockUserProgress} />
        )}
        <main className={`flex-1 ${showSidebar ? "pl-20 lg:pl-64" : ""} pt-20`}>
          {/* Daily Challenge Section */}
          <div className="mb-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-custom-darkBlue1">Daily Challenge</h2>
                <div className="flex items-center">
                  <span className="text-custom-gold font-semibold mr-2">
                    🔥 {mockUserProgress.streak} day streak
                  </span>
                </div>
              </div>
              {/* Daily Challenge content goes here */}
            </div>
          </div>

          {/* Grand Test Banner */}
          <div className="mb-8">
            {isGrandTestUnlocked ? (
              <GrandTestBanner />
            ) : (
              <div className="relative group">
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl z-10">
                  <div className="text-center text-white">
                    <Lock className="w-12 h-12 mx-auto mb-2 text-custom-gold animate-pulse" />
                    <p className="text-lg font-semibold">Complete all topics with 70% or higher to unlock</p>
                  </div>
                </div>
                <div className="blur-sm">
                  <GrandTestBanner />
                </div>
              </div>
            )}
          </div>

          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
