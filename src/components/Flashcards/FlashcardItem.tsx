
import { Flashcard } from "@/types";
import { Calendar, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { formatDate } from "@/utils/flashcardUtils";

interface FlashcardItemProps {
  flashcard: Flashcard;
  onCheckFlashcard: (id: string) => void;
  onViewFlashcard: (flashcard: Flashcard) => void;
}

const FlashcardItem = ({ flashcard, onCheckFlashcard, onViewFlashcard }: FlashcardItemProps) => {
  return (
    <motion.div 
      className={`
        bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300
        ${flashcard.isRead ? 'border-l-4 border-custom-gold' : ''}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-custom-darkBlue1">{flashcard.title}</h3>
          <div className="flex items-center">
            <Checkbox 
              id={`read-${flashcard.id}`} 
              checked={flashcard.isRead}
              onCheckedChange={() => onCheckFlashcard(flashcard.id)}
              className="text-custom-gold border-custom-gold focus:ring-custom-gold"
            />
            <label 
              htmlFor={`read-${flashcard.id}`}
              className="ml-2 text-sm text-gray-500"
            >
              {flashcard.isRead ? (
                <span className="flex items-center text-custom-gold">
                  <Check className="h-3 w-3 mr-1" /> Read
                </span>
              ) : "Mark read"}
            </label>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4 line-clamp-4">
          {flashcard.content}
        </p>
        
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(flashcard.dateCreated)}
          </span>
          <Button 
            variant="link" 
            className="text-custom-gold p-0 h-auto"
            onClick={() => onViewFlashcard(flashcard)}
          >
            View Full
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default FlashcardItem;
