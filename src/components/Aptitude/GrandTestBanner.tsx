
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const GrandTestBanner = () => {
  return (
    <motion.div 
      className="mb-8 bg-gradient-to-r from-custom-gold/20 to-custom-peach/20 p-6 rounded-xl border border-custom-gold/30"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-custom-darkBlue1 mb-2">
            🎉 Grand Test Unlocked!
          </h2>
          <p className="text-gray-600 mb-4 md:mb-0">
            Congratulations! You've scored at least 70% in all available topics.
            Take the 45-minute Grand Test to prove your mastery.
          </p>
        </div>
        <Link to="/aptitude/grand-test">
          <Button className="bg-custom-gold text-custom-darkBlue1 hover:bg-custom-gold/90 min-w-[150px]">
            Start Grand Test
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};
