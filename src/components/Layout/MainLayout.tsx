import { ReactNode, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Topic } from "@/types";
import { cn } from "@/lib/utils";

// Mock topics data with subtopics
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
    subtopics: [
      {
        id: "1-1",
        name: "Prime Series",
        link: "https://www.geeksforgeeks.org/prime-numbers/"
      },
      {
        id: "1-2",
        name: "Square and Cube Series",
        link: "https://www.geeksforgeeks.org/square-and-cube-series/"
      },
      {
        id: "1-3",
        name: "Fibonacci Series",
        link: "https://www.geeksforgeeks.org/fibonacci-series/"
      }
    ]
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
    subtopics: [
      {
        id: "2-1",
        name: "Time and Work Basics",
        link: "https://www.geeksforgeeks.org/time-and-work-formula/"
      },
      {
        id: "2-2",
        name: "Efficiency Problems",
        link: "https://www.geeksforgeeks.org/efficiency-problems/"
      }
    ]
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-custom-lightGray">
      <Header />
      <div className="flex flex-1">
        {showSidebar && (
          <Sidebar 
            topics={mockTopics} 
            userProgress={mockUserProgress} 
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        )}
        <main 
          className={cn(
            "flex-1 pt-20 transition-all duration-300 ease-in-out",
            showSidebar && (isSidebarCollapsed ? "pl-20" : "pl-64")
          )}
        >
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
