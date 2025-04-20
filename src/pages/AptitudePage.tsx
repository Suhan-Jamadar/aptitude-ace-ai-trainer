
import { useState } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import { motion } from "framer-motion";
import DailyChallenge from "@/components/Quiz/DailyChallenge";
import { TopicList } from "@/components/Aptitude/TopicList";
import { DailyChallengeCard } from "@/components/Aptitude/DailyChallengeCard";
import { GrandTestBanner } from "@/components/Aptitude/GrandTestBanner";
import { mockTopics } from "@/services/mockData";
import { Lock } from "lucide-react";

const AptitudePage = () => {
  const [showDailyChallenge, setShowDailyChallenge] = useState(false);
  const completedTopics = mockTopics.filter(topic => topic.completedQuestions > 0).length;
  const totalTopics = mockTopics.length;
  const isGrandTestUnlocked = mockTopics.every(topic => 
    topic.isUnlocked && (topic.score >= 70 || topic.score === 0)
  );
  
  return (
    <MainLayout showSidebar={true}>
      <motion.div 
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-custom-darkBlue1 mb-2">Aptitude Training</h1>
          <p className="text-gray-600">
            Master each topic to unlock the Grand Test and track your progress.
          </p>
        </div>
        
        <DailyChallengeCard onStartChallenge={() => setShowDailyChallenge(true)} />
        
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
        
        <TopicList topics={mockTopics} />
      </motion.div>

      {showDailyChallenge && (
        <DailyChallenge onClose={() => setShowDailyChallenge(false)} />
      )}
    </MainLayout>
  );
};

export default AptitudePage;
