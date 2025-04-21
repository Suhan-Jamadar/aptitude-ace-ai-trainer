import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/Layout/MainLayout";
import AuthModal from "@/components/Auth/AuthModal";
import { ArrowRight } from "lucide-react";
import Aptitude3DScene from "@/components/Aptitude/Aptitude3DScene";

const HomePage = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<"login" | "signup">("signup");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleOpenAuthModal = (view: "login" | "signup") => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  return (
    <MainLayout>
      <Aptitude3DScene />
      <div className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-4xl w-full bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-custom-darkBlue1">
            <span className="text-custom-gold animate-fade-in" style={{ animationDelay: "0.2s" }}>Aptitude</span> <span className="animate-fade-in" style={{ animationDelay: "0.3s" }}>Ace</span>
          </h1>
          <p className="text-xl mb-8 text-custom-darkBlue2 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
            Master aptitude skills with AI-powered training, personalized recommendations, 
            and interactive quizzes to prepare for technical interviews.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-2xl mx-auto">
            <div className="bg-white/80 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-custom-gold animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <h2 className="text-xl font-semibold mb-3 text-custom-darkBlue1">Aptitude Training</h2>
              <p className="text-custom-darkBlue2 mb-4">
                Practice with topic-specific quizzes, track your progress, and unlock the Grand Test.
              </p>
              <Link to="/aptitude">
                <Button className="w-full bg-custom-darkBlue1 hover:bg-custom-darkBlue2 text-white">
                  Start Training
                </Button>
              </Link>
            </div>
            <div className="bg-white/80 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-custom-peach animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <h2 className="text-xl font-semibold mb-3 text-custom-darkBlue1">Flashcards</h2>
              <p className="text-custom-darkBlue2 mb-4">
                Upload your notes and generate AI-powered flashcards to enhance your learning.
              </p>
              <Link to="/flashcards">
                <Button className="w-full bg-custom-darkBlue1 hover:bg-custom-darkBlue2 text-white">
                  Create Flashcards
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-center animate-fade-in" style={{ animationDelay: "0.7s" }}>
            <div className="bg-custom-darkBlue1/5 rounded-lg p-6 mb-8 max-w-3xl">
              <h3 className="text-xl font-semibold text-custom-darkBlue1 mb-3">What makes Aptitude Ace special?</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <li className="flex items-start">
                  <div className="mr-3 bg-custom-gold/20 p-1 rounded-full mt-1">
                    <CheckIcon className="h-4 w-4 text-custom-gold" />
                  </div>
                  <span className="text-custom-darkBlue2">AI-driven personalized recommendations</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 bg-custom-gold/20 p-1 rounded-full mt-1">
                    <CheckIcon className="h-4 w-4 text-custom-gold" />
                  </div>
                  <span className="text-custom-darkBlue2">Topic-specific quizzes with detailed explanations</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 bg-custom-gold/20 p-1 rounded-full mt-1">
                    <CheckIcon className="h-4 w-4 text-custom-gold" />
                  </div>
                  <span className="text-custom-darkBlue2">Daily challenges to build learning habits</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 bg-custom-gold/20 p-1 rounded-full mt-1">
                    <CheckIcon className="h-4 w-4 text-custom-gold" />
                  </div>
                  <span className="text-custom-darkBlue2">AI-generated flashcards from your notes</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.8s" }}>
            <Button 
              className="bg-custom-gold text-custom-darkBlue1 hover:bg-custom-gold/90 px-8 py-6 text-lg font-semibold"
              onClick={() => handleOpenAuthModal("signup")}
            >
              Sign Up Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              className="border-custom-darkBlue1 text-custom-darkBlue1 hover:bg-custom-darkBlue1 hover:text-white px-8 py-6 text-lg font-semibold"
              onClick={() => handleOpenAuthModal("login")}
            >
              Log In
            </Button>
          </div>
        </div>
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        onAuthenticated={handleAuthenticated}
        defaultView={authModalView}
      />
    </MainLayout>
  );
};

const CheckIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default HomePage;
