
import { useState } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import AuthModal from "@/components/Auth/AuthModal";
import AptitudeFeature3D from "@/components/Home/AptitudeFeature3D";
import HomeFeatures from "@/components/Home/HomeFeatures";
import HomeActions from "@/components/Home/HomeActions";
import HomeSectionCard from "@/components/Home/HomeSectionCard";

const HomePage = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<"login" | "signup">("signup");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleOpenAuthModal = (view: "login" | "signup") => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => setIsAuthModalOpen(false);
  const handleAuthenticated = () => setIsAuthenticated(true);

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-5rem)] flex items-center px-2 sm:px-4">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Content */}
          <div className="order-2 lg:order-1">
            <div className="bg-white/80 backdrop-blur-md p-3 sm:p-6 md:p-8 rounded-2xl shadow-xl animate-fade-in"
              style={{ animationDelay: "0.1s" }}>
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-3 md:mb-6 text-custom-darkBlue1 animate-fade-in"
                style={{ animationDelay: "0.21s" }}>
                <span className="text-custom-gold">Aptitude</span>
                <span className="ml-2">Ace</span>
              </h1>

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

              {/* Features List */}
              <HomeFeatures />

              {/* Call to Action */}
              <HomeActions
                onSignUp={() => handleOpenAuthModal("signup")}
                onLogin={() => handleOpenAuthModal("login")}
              />
            </div>
          </div>

          {/* Right side - 3D Animation */}
          <div className="order-1 lg:order-2">
            <AptitudeFeature3D />
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        onAuthenticated={handleAuthenticated}
        defaultView={authModalView}
      />
    </MainLayout>
  );
};

export default HomePage;
