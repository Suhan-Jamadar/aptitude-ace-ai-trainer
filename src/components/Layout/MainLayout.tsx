
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import MainContent from "./MainContent";
import { useTopicsData } from "@/hooks/useTopicsData";
import { useAuth } from "@/contexts/AuthContext";

interface MainLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const MainLayout = ({ children, showSidebar = false }: MainLayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { topics } = useTopicsData();
  const { user } = useAuth();
  
  // Update user progress with the correct number of topics
  const userProgress = {
    streak: user?.streak || 0,
    topicsCompleted: topics.filter(topic => topic.completedQuestions > 0).length,
    totalTopics: topics.length,
    username: user?.name || "Guest"
  };

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
        <MainContent 
          showSidebar={showSidebar} 
          isSidebarCollapsed={isSidebarCollapsed}
        >
          {children}
        </MainContent>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
