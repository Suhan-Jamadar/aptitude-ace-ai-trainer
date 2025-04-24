import { ReactNode, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Topic } from "@/types";
import { cn } from "@/lib/utils";

// Define MainLayoutProps interface
interface MainLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

// Updated mockTopics with new structure
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
      },
      {
        id: "1-4",
        name: "Arithmetic Series",
        link: "https://www.geeksforgeeks.org/arithmetic-progression/"
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
      },
      {
        id: "2-3",
        name: "Time Reduction Problems",
        link: "https://www.geeksforgeeks.org/time-reduction-problems/"
      },
      {
        id: "2-4",
        name: "Pipes and Cisterns",
        link: "https://www.geeksforgeeks.org/pipes-and-cisterns/"
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
    isUnlocked: true,
    subtopics: [
      {
        id: "3-1",
        name: "Basic Percentage Concepts",
        link: "https://www.geeksforgeeks.org/percentages-basic-concepts/"
      },
      {
        id: "3-2",
        name: "Percentage Change",
        link: "https://www.geeksforgeeks.org/percentage-change/"
      },
      {
        id: "3-3",
        name: "Successive Percentages",
        link: "https://www.geeksforgeeks.org/successive-percentage/"
      },
      {
        id: "3-4",
        name: "Mixed Percentages",
        link: "https://www.geeksforgeeks.org/mixed-percentage-problems/"
      }
    ]
  },
  {
    id: "4",
    name: "Profit & Loss",
    description: "Calculate profit, loss, and percentages in business scenarios",
    icon: "trending-up",
    totalQuestions: 20,
    completedQuestions: 0,
    score: 0,
    isUnlocked: true,
    subtopics: [
      {
        id: "4-1",
        name: "Basic Concepts",
        link: "https://www.geeksforgeeks.org/profit-and-loss-basics/"
      },
      {
        id: "4-2",
        name: "Marked Price & Discount",
        link: "https://www.geeksforgeeks.org/marked-price-and-discount/"
      },
      {
        id: "4-3",
        name: "Successive Transactions",
        link: "https://www.geeksforgeeks.org/successive-transactions/"
      },
      {
        id: "4-4",
        name: "Partnership Problems",
        link: "https://www.geeksforgeeks.org/partnership-problems/"
      }
    ]
  },
  {
    id: "5",
    name: "Ratio & Proportion",
    description: "Understand and solve problems based on ratios and proportions",
    icon: "bar-chart-2",
    totalQuestions: 20,
    completedQuestions: 0,
    score: 0,
    isUnlocked: true,
    subtopics: [
      {
        id: "5-1",
        name: "Basic Ratio Concepts",
        link: "https://www.geeksforgeeks.org/ratio-basics/"
      },
      {
        id: "5-2",
        name: "Direct Proportion",
        link: "https://www.geeksforgeeks.org/direct-proportion/"
      },
      {
        id: "5-3",
        name: "Inverse Proportion",
        link: "https://www.geeksforgeeks.org/inverse-proportion/"
      },
      {
        id: "5-4",
        name: "Compound Proportion",
        link: "https://www.geeksforgeeks.org/compound-proportion/"
      }
    ]
  }
];

// Mock user progress with updated total topics
const mockUserProgress = {
  streak: 3,
  topicsCompleted: 2,
  totalTopics: 5, // Updated to match new total
  username: "John Doe"
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
