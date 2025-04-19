
import { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Topic } from "@/types";

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

// Mock user progress
const mockUserProgress = {
  streak: 3,
  topicsCompleted: 2,
  totalTopics: mockTopics.length
};

const MainLayout = ({ children, showSidebar = false }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-custom-lightGray">
      <Header />
      <div className="flex flex-1">
        {showSidebar && (
          <Sidebar topics={mockTopics} userProgress={mockUserProgress} />
        )}
        <main className={`flex-1 ${showSidebar ? "pl-20 lg:pl-64" : ""} pt-20`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
