
import { useState, useEffect } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import { Flashcard } from "@/types";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { 
  getFlashcards,
  updateFlashcardStatus,
  deleteFlashcard
} from "@/services/flashcardService";
import { useAuth } from "@/contexts/AuthContext";
import FlashcardCreator from "@/components/Flashcards/FlashcardCreator";
import FlashcardControls from "@/components/Flashcards/FlashcardControls";
import FlashcardGrid from "@/components/Flashcards/FlashcardGrid";
import FlashcardDetail from "@/components/Flashcards/FlashcardDetail";

const FlashcardsPage = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortByDateAsc, setSortByDateAsc] = useState(true);
  const [filterReadOnly, setFilterReadOnly] = useState(false);
  const [selectedFlashcard, setSelectedFlashcard] = useState<Flashcard | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAuthenticated } = useAuth();

  // Fetch user's flashcards when component mounts
  useEffect(() => {
    const fetchUserFlashcards = async () => {
      if (isAuthenticated && user) {
        try {
          setIsLoading(true);
          const userFlashcards = await getFlashcards(user.id);
          setFlashcards(userFlashcards);
        } catch (error) {
          console.error("Failed to fetch flashcards:", error);
          toast.error("Failed to load your flashcards");
        } finally {
          setIsLoading(false);
        }
      } else {
        // Use mock data when not authenticated
        setIsLoading(false);
      }
    };

    fetchUserFlashcards();
  }, [isAuthenticated, user]);

  const handleCheckFlashcard = async (id: string) => {
    if (!isAuthenticated || !user) {
      toast.error("Please sign in to save your progress");
      return;
    }

    try {
      const flashcard = flashcards.find(card => card.id === id);
      if (flashcard) {
        await updateFlashcardStatus(user.id, id, !flashcard.isRead);
        setFlashcards(flashcards.map(card => 
          card.id === id ? { ...card, isRead: !card.isRead } : card
        ));
        toast.success(flashcard.isRead ? "Marked as unread" : "Marked as read");
      }
    } catch (error) {
      console.error("Failed to update flashcard status:", error);
      toast.error("Failed to update flashcard status");
    }
  };

  const handleDeleteFlashcard = async (id: string) => {
    if (!isAuthenticated || !user) {
      toast.error("Please sign in to delete flashcards");
      return;
    }
    
    try {
      await deleteFlashcard(user.id, id);
      setFlashcards(flashcards.filter(card => card.id !== id));
      if (selectedFlashcard?.id === id) {
        setSelectedFlashcard(null);
      }
      toast.success("Flashcard deleted");
    } catch (error) {
      toast.error("Failed to delete flashcard");
    }
  };

  const handleAddFlashcard = (newFlashcard: Flashcard) => {
    setFlashcards([...flashcards, newFlashcard]);
  };

  const sortFlashcards = () => {
    setSortByDateAsc(!sortByDateAsc);
    
    const sorted = [...flashcards].sort((a, b) => {
      const dateA = a.dateCreated instanceof Date ? a.dateCreated : new Date(a.dateCreated);
      const dateB = b.dateCreated instanceof Date ? b.dateCreated : new Date(b.dateCreated);
      const comparison = dateA.getTime() - dateB.getTime();
      return sortByDateAsc ? comparison : -comparison;
    });
    
    setFlashcards(sorted);
    toast.success(`Sorted by date: ${sortByDateAsc ? 'oldest first' : 'newest first'}`);
  };

  const toggleFilterReadOnly = () => {
    setFilterReadOnly(!filterReadOnly);
    toast.success(filterReadOnly ? "Showing all flashcards" : "Showing only read flashcards");
  };

  const viewFlashcard = (flashcard: Flashcard) => {
    setSelectedFlashcard(flashcard);
  };

  // Filter flashcards based on read status
  const readFilteredFlashcards = filterReadOnly 
    ? flashcards.filter(card => card.isRead) 
    : flashcards;

  // Apply search filter on top of read filter
  const displayedFlashcards = readFilteredFlashcards.filter(card => 
    card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <motion.div 
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-custom-darkBlue1 mb-2">Flashcards</h1>
          <p className="text-gray-600">
            Upload your notes and generate AI-powered flashcards for effective learning.
            {!isAuthenticated && (
              <span className="ml-1 text-custom-gold">
                Sign in to save your flashcards.
              </span>
            )}
          </p>
        </div>

        <FlashcardCreator onFlashcardCreated={handleAddFlashcard} />

        <div>
          <FlashcardControls
            onSearchChange={setSearchQuery}
            onSort={sortFlashcards}
            onFilterToggle={toggleFilterReadOnly}
            sortByDateAsc={sortByDateAsc}
            filterReadOnly={filterReadOnly}
          />

          <FlashcardGrid
            flashcards={displayedFlashcards}
            isLoading={isLoading}
            isAuthenticated={isAuthenticated}
            onCheckFlashcard={handleCheckFlashcard}
            onViewFlashcard={viewFlashcard}
          />
        </div>
      </motion.div>

      <FlashcardDetail
        flashcard={selectedFlashcard}
        onClose={() => setSelectedFlashcard(null)}
        onDelete={handleDeleteFlashcard}
        onMarkRead={handleCheckFlashcard}
      />
    </MainLayout>
  );
};

export default FlashcardsPage;
