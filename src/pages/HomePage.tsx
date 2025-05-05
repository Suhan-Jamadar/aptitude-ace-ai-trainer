
import { useState } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import AuthModal from "@/components/Auth/AuthModal";
import AptitudeFeature3D from "@/components/Home/AptitudeFeature3D";
import HomeFeatures from "@/components/Home/HomeFeatures";
import HomeActions from "@/components/Home/HomeActions";
import HomeSectionCard from "@/components/Home/HomeSectionCard";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserIcon } from "lucide-react";

const HomePage = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<"login" | "signup">("signup");
  const { isAuthenticated, user } = useAuth();

  const handleOpenAuthModal = (view: "login" | "signup") => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => setIsAuthModalOpen(false);

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-5rem)] flex items-center px-2 sm:px-4 mb-16">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Content */}
          <div className="order-2 lg:order-1 min-h-[400px] flex flex-col justify-center">
            <div className="bg-white/80 backdrop-blur-md p-3 sm:p-6 md:p-8 rounded-2xl shadow-xl animate-fade-in h-full"
              style={{ animationDelay: "0.1s" }}>
              {/* Title */}
              <div className="flex justify-between items-center mb-3 md:mb-6">
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-custom-darkBlue1 animate-fade-in"
                  style={{ animationDelay: "0.21s" }}>
                  <span className="text-custom-gold">Aptitude</span>
                  <span className="ml-2">Ace</span>
                </h1>
                
                {isAuthenticated && (
                  <Link to="/profile" className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2 border-custom-darkBlue1 text-custom-darkBlue1"
                    >
                      <UserIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">Profile</span>
                    </Button>
                  </Link>
                )}
              </div>

              <p className="text-lg sm:text-xl mb-6 md:mb-8 text-custom-darkBlue2 max-w-2xl animate-fade-in"
                style={{ animationDelay: "0.3s" }}>
                Master aptitude skills with AI-powered training, personalized recommendations,
                and interactive quizzes to prepare for technical interviews.
              </p>

              {/* Main Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-12">
                <HomeSectionCard
                  title="Aptitude Training"
                  description="Practice with topic-specific quizzes, track your progress, and unlock the Grand Test."
                  link="/aptitude"
                  buttonText="Start Training"
                  borderColor="border-custom-gold"
                  animationDelay="0.5s"
                />
                <HomeSectionCard
                  title="Flashcards"
                  description="Upload your notes and generate AI-powered flashcards to enhance your learning."
                  link="/flashcards"
                  buttonText="Create Flashcards"
                  borderColor="border-custom-peach"
                  animationDelay="0.6s"
                />
              </div>

              {/* Call to Action */}
              {!isAuthenticated && (
                <HomeActions
                  onSignUp={() => handleOpenAuthModal("signup")}
                  onLogin={() => handleOpenAuthModal("login")}
                />
              )}
              
              {isAuthenticated && (
                <div className="mt-6 animate-fade-in" style={{ animationDelay: "0.8s" }}>
                  <p className="text-center text-custom-darkBlue2 mb-2">
                    Welcome back, {user?.name || "User"}!
                  </p>
                  <Link to="/aptitude" className="w-full block">
                    <Button className="w-full bg-custom-gold text-custom-darkBlue1 hover:bg-custom-gold/90 py-6 text-lg font-semibold">
                      Continue Training
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right side - 3D Animation */}
          <div className="order-1 lg:order-2 min-h-[400px]">
            <AptitudeFeature3D />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <HomeFeatures />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        onAuthenticated={() => {}}
        defaultView={authModalView}
      />
    </MainLayout>
  );
};

export default HomePage;
