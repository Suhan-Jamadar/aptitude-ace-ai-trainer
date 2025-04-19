
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface DailyChallengeCardProps {
  onStartChallenge: () => void;
}

export const DailyChallengeCard = ({ onStartChallenge }: DailyChallengeCardProps) => {
  return (
    <motion.div 
      className="mb-8 p-6 rounded-xl border shadow-sm bg-white"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-custom-darkBlue1 mb-2">
            Daily Challenge
          </h2>
          <p className="text-gray-600 mb-4 md:mb-0">
            Test your knowledge with a mixed set of questions from all topics.
            Complete the daily challenge to maintain your streak!
          </p>
        </div>
        <Button 
          className="bg-custom-darkBlue1 text-white hover:bg-custom-darkBlue2 min-w-[180px]"
          onClick={onStartChallenge}
        >
          Start Today's Challenge
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};
