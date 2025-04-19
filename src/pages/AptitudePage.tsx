
import { useState } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import { motion } from "framer-motion";
import DailyChallenge from "@/components/Quiz/DailyChallenge";
import { TopicList } from "@/components/Aptitude/TopicList";
import { DailyChallengeCard } from "@/components/Aptitude/DailyChallengeCard";
import { GrandTestBanner } from "@/components/Aptitude/GrandTestBanner";
import { mockTopics } from "@/services/mockData";

const AptitudePage = () => {
  const [showDailyChallenge, setShowDailyChallenge] = useState(false);
  const completedTopics = mockTopics.filter(topic => topic.completedQuestions > 0).length;
  const totalTopics = mockTopics.length;
  const allTopicsPassed = mockTopics.every(topic => topic.score >= 70 || !topic.isUnlocked);
  
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
        
        {allTopicsPassed && <GrandTestBanner />}
        
        <TopicList topics={mockTopics} />
      </motion.div>

      {showDailyChallenge && (
        <DailyChallenge onClose={() => setShowDailyChallenge(false)} />
      )}
    </MainLayout>
  );
};

export default AptitudePage;
