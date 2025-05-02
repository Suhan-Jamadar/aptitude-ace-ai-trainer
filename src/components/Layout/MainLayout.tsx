
import { ReactNode, useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Topic } from "@/types";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { getTopics } from "@/services/questionService";
import { toast } from "sonner";

interface MainLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

// Default topics with correct icons for the 6 required categories - updated and fixed
const defaultTopics: Topic[] = [
  {
    id: "1",
    name: "Quantitative Aptitude",
    description: "Master mathematical concepts and numerical reasoning",
    icon: "calculator",
    totalQuestions: 20,
    completedQuestions: 0,
    score: 0,
    isUnlocked: true,
    subtopics: [
      {
        id: "1-1",
        name: "Number Systems",
        link: "https://www.geeksforgeeks.org/number-system/"
      },
      {
        id: "1-2",
        name: "Arithmetic Operations",
        link: "https://www.geeksforgeeks.org/arithmetic-operations/"
      }
    ]
  },
  {
    id: "2",
    name: "Time & Work",
    description: "Calculate work efficiency and time required for tasks",
    icon: "clock",
    totalQuestions: 20,
    completedQuestions: 0,
    score: 0,
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
    name: "Time, Speed & Distance",
    description: "Solve problems related to time, speed and distance calculations",
    icon: "clock",
    totalQuestions: 20,
    completedQuestions: 0,
    score: 0,
    isUnlocked: true,
    subtopics: [
      {
        id: "3-1",
        name: "Speed Concepts",
        link: "https://www.geeksforgeeks.org/speed-concepts/"
      },
      {
        id: "3-2",
        name: "Relative Speed",
        link: "https://www.geeksforgeeks.org/relative-speed/"
      }
    ]
  },
  {
    id: "4",
    name: "Percentages",
    description: "Master percentage calculations and applications",
    icon: "percent",
    totalQuestions: 20,
    completedQuestions: 0,
    score: 0,
    isUnlocked: true,
    subtopics: [
      {
        id: "4-1",
        name: "Basic Percentage Concepts",
        link: "https://www.geeksforgeeks.org/percentages-basic-concepts/"
      },
      {
        id: "4-2",
        name: "Percentage Change",
        link: "https://www.geeksforgeeks.org/percentage-change/"
      }
    ]
  },
  {
    id: "5",
    name: "Profit & Loss",
    description: "Calculate profit, loss, and percentages in business scenarios",
    icon: "dollar-sign",
    totalQuestions: 20,
    completedQuestions: 0,
    score: 0,
    isUnlocked: true,
    subtopics: [
      {
        id: "5-1",
        name: "Basic Concepts",
        link: "https://www.geeksforgeeks.org/profit-and-loss-basics/"
      },
      {
        id: "5-2",
        name: "Marked Price & Discount",
        link: "https://www.geeksforgeeks.org/marked-price-and-discount/"
      }
    ]
  },
  {
    id: "6",
    name: "Data Interpretation",
    description: "Analyze and interpret data from charts, graphs and tables",
    icon: "bar-chart",
    totalQuestions: 20,
    completedQuestions: 0,
    score: 0,
    isUnlocked: true,
    subtopics: [
      {
        id: "6-1",
        name: "Tables Analysis",
        link: "https://www.geeksforgeeks.org/data-interpretation-tables/"
      },
      {
        id: "6-2",
        name: "Bar Graphs",
        link: "https://www.geeksforgeeks.org/data-interpretation-bar-graphs/"
      }
    ]
  }
];

const MainLayout = ({ children, showSidebar = false }: MainLayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [topics, setTopics] = useState<Topic[]>(defaultTopics);
  const { user, isAuthenticated } = useAuth();
  
  // Update mock user progress with the correct number of topics
  const userProgress = {
    streak: user?.streak || 0,
    topicsCompleted: topics.filter(topic => topic.completedQuestions > 0).length,
    totalTopics: topics.length,
    username: user?.name || "Guest"
  };

  // Fetch user-specific topic data when authenticated
  useEffect(() => {
    const fetchUserTopics = async () => {
      if (isAuthenticated && user) {
        try {
          const userTopics = await getTopics();
          if (userTopics && userTopics.length > 0) {
            setTopics(userTopics);
          }
        } catch (error) {
          console.error("Failed to fetch user topics:", error);
          toast.error("Failed to load your progress data");
        }
      } else {
        // Reset to default topics for non-authenticated users
        setTopics(defaultTopics);
      }
    };

    fetchUserTopics();
  }, [isAuthenticated, user]);

  return (
    <div className="min-h-screen flex flex-col bg-custom-lightGray">
      <Header />
      <div className="flex flex-1">
        {showSidebar && (
          <Sidebar 
            topics={topics} 
            userProgress={userProgress} 
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
