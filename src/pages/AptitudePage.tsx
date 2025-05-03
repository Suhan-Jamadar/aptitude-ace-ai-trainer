
import { useState, useEffect } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import { motion } from "framer-motion";
import DailyChallenge from "@/components/Quiz/DailyChallenge";
import { TopicList } from "@/components/Aptitude/TopicList";
import { DailyChallengeCard } from "@/components/Aptitude/DailyChallengeCard";
import { GrandTestBanner } from "@/components/Aptitude/GrandTestBanner";
import { defaultTopics } from "@/data/defaultTopics";
import { Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getTopics } from "@/services/questionService";
import { Topic } from "@/types";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/Auth/AuthModal";
import { toast } from "sonner";

const AptitudePage = () => {
  const [showDailyChallenge, setShowDailyChallenge] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [topics, setTopics] = useState<Topic[]>(defaultTopics);
  const { user, isAuthenticated, refreshUserProfile } = useAuth();
  
  // Filter out any duplicates based on the topic id
  const uniqueTopics = topics.filter(
    (topic, index, self) => index === self.findIndex(t => t.id === topic.id)
  );
  
  // Calculate completed topics based on user progress
  const completedTopics = uniqueTopics.filter(topic => topic.completedQuestions > 0).length;
  const totalTopics = uniqueTopics.length;
  
  // Grand test is unlocked if user has completed all topics with at least 70% score
  const isGrandTestUnlocked = uniqueTopics.every(topic => {
    // Topic must be unlocked AND have a score of at least 70%
    // AND must have completed questions (progress > 0)
    return topic.isUnlocked && 
           topic.score >= 70 && 
           topic.completedQuestions > 0;
  });
  
  // Fetch user-specific topics data
  useEffect(() => {
    const fetchUserTopics = async () => {
      if (isAuthenticated && user) {
        try {
          const fetchedTopics = await getTopics();
          if (fetchedTopics && fetchedTopics.length > 0) {
            // Ensure we have only the 6 core topics we need
            const coreTopics = fetchedTopics.filter(topic => 
              ["Quantitative Aptitude", "Time & Work", "Time, Speed & Distance", 
               "Percentages", "Profit & Loss", "Data Interpretation"].includes(topic.name)
            );
            setTopics(coreTopics);
          }
        } catch (error) {
          console.error("Failed to fetch topics:", error);
        }
      }
    };
    
    fetchUserTopics();
  }, [isAuthenticated, user]);
  
  // Handle auth modal authentication success
  const handleAuthenticated = async () => {
    setShowAuthModal(false);
    await refreshUserProfile();
    toast.success("Successfully signed in! Your progress is now being tracked.");
  };

  return (
    <MainLayout showSidebar={true}>
      <motion.div 
        className="container mx-auto px-4 py-8 transition-all duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-custom-darkBlue1 mb-2">Aptitude Training</h1>
          <p className="text-gray-600">
            Master each topic to unlock the Grand Test and track your progress.
            {!isAuthenticated && (
              <Button 
                variant="link" 
                className="text-custom-gold p-0 ml-1" 
                onClick={() => setShowAuthModal(true)}
              >
                Sign in to save your progress
              </Button>
            )}
          </p>
        </div>
        
        <DailyChallengeCard onStartChallenge={() => {
          if (!isAuthenticated) {
            toast.info("Sign in to save your daily challenge results");
            setShowAuthModal(true);
          } else {
            setShowDailyChallenge(true);
          }
        }} />
        
        {/* Grand Test Banner */}
        <div className="mb-8">
          {isGrandTestUnlocked ? (
            <GrandTestBanner />
          ) : (
            <motion.div 
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl z-10">
                <div className="text-center text-white">
                  <Lock className="w-12 h-12 mx-auto mb-2 text-custom-gold animate-pulse" />
                  <p className="text-lg font-semibold">Complete all topics with 70% or higher to unlock</p>
                </div>
              </div>
              <div className="blur-sm">
                <GrandTestBanner />
              </div>
            </motion.div>
          )}
        </div>
        
        <TopicList topics={uniqueTopics} />
      </motion.div>

      {showDailyChallenge && (
        <DailyChallenge onClose={() => setShowDailyChallenge(false)} />
      )}
      
      {/* Auth modal for sign-in/signup */}
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthenticated={handleAuthenticated}
        />
      )}
    </MainLayout>
  );
};

export default AptitudePage;
