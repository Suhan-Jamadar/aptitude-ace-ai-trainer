
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { GraduationCap, Book, BarChart } from "lucide-react";

const ProfilePage = () => {
  const { user, isAuthenticated, isLoading, logout, refreshUserProfile } = useAuth();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refresh user profile on page load
  useEffect(() => {
    if (isAuthenticated) {
      refreshUserProfile();
    }
  }, [isAuthenticated, refreshUserProfile]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
      toast.error("Please log in to view your profile");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleRefreshProfile = async () => {
    setIsRefreshing(true);
    try {
      await refreshUserProfile();
      toast.success("Profile refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh profile");
      console.error("Error refreshing profile:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to log out");
      console.error("Logout error:", error);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container max-w-4xl mx-auto py-8">
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-60 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-4 text-custom-darkBlue1">
            My Profile
          </h1>
          
          {user && (
            <div className="space-y-6">
              {/* User Info Card */}
              <Card className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-custom-darkBlue2">Account Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Current Streak</p>
                      <p className="font-medium">{user.streak || 0} days</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium">
                        {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Progress Card */}
              <Card className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-custom-darkBlue2">Learning Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                      <GraduationCap className="h-8 w-8 text-custom-gold" />
                      <div>
                        <p className="text-sm text-gray-500">Topics Completed</p>
                        <p className="font-medium text-lg">{user.progress?.topicsCompleted || 0}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                      <Book className="h-8 w-8 text-custom-peach" />
                      <div>
                        <p className="text-sm text-gray-500">Grand Test Status</p>
                        <p className="font-medium text-lg">
                          {user.progress?.grandTestUnlocked ? "Unlocked" : "Locked"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                      <BarChart className="h-8 w-8 text-custom-darkBlue2" />
                      <div>
                        <p className="text-sm text-gray-500">Average Score</p>
                        <p className="font-medium text-lg">Coming soon</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleRefreshProfile}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? "Refreshing..." : "Refresh Profile"}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-custom-darkBlue1 text-custom-darkBlue1 hover:bg-custom-darkBlue1 hover:text-white"
                  onClick={() => navigate("/aptitude")}
                >
                  Continue Training
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  onClick={handleLogout}
                >
                  Log Out
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
