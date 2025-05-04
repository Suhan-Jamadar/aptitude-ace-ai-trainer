
import { Flashcard } from "@/types";
import { FileText } from "lucide-react";
import FlashcardItem from "./FlashcardItem";

interface FlashcardGridProps {
  flashcards: Flashcard[];
  isLoading: boolean;
  isAuthenticated: boolean;
  onCheckFlashcard: (id: string) => void;
  onViewFlashcard: (flashcard: Flashcard) => void;
}

const FlashcardGrid = ({ 
  flashcards, 
  isLoading, 
  isAuthenticated,
  onCheckFlashcard,
  onViewFlashcard
}: FlashcardGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
            <div className="h-5 bg-gray-200 rounded mb-4 w-3/4"></div>
            <div className="h-20 bg-gray-100 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="col-span-full text-center py-10 bg-gray-50 rounded-lg">
        <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
        <p className="text-gray-500">
          {isAuthenticated 
            ? "No flashcards found. Create your first flashcard above!"
            : "Sign in to create and view your flashcards."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {flashcards.map((flashcard) => (
        <FlashcardItem
          key={flashcard.id}
          flashcard={flashcard}
          onCheckFlashcard={onCheckFlashcard}
          onViewFlashcard={onViewFlashcard}
        />
      ))}
    </div>
  );
};

export default FlashcardGrid;
