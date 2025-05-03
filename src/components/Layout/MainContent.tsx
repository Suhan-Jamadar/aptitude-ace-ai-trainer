
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MainContentProps {
  children: ReactNode;
  showSidebar: boolean;
  isSidebarCollapsed: boolean;
}

const MainContent = ({ children, showSidebar, isSidebarCollapsed }: MainContentProps) => {
  return (
    <main 
      className={cn(
        "flex-1 pt-20 transition-all duration-300 ease-in-out",
        showSidebar && (isSidebarCollapsed ? "pl-20" : "pl-64")
      )}
    >
      {children}
    </main>
  );
};

export default MainContent;
