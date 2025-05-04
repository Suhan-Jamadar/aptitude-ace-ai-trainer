
import { Flashcard } from "@/types";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatDate } from "@/utils/flashcardUtils";

interface FlashcardDetailProps {
  flashcard: Flashcard | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onMarkRead: (id: string) => void;
}

const FlashcardDetail = ({ flashcard, onClose, onDelete, onMarkRead }: FlashcardDetailProps) => {
  if (!flashcard) return null;

  const handleClose = () => {
    if (!flashcard.isRead) {
      onMarkRead(flashcard.id);
    } else {
      onClose();
    }
  };

  return (
    <Sheet open={!!flashcard} onOpenChange={onClose}>
      <SheetContent className="w-[90vw] sm:max-w-[600px] p-6">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold text-custom-darkBlue1">{flashcard.title}</SheetTitle>
        </SheetHeader>
        <div className="space-y-4">
          <p className="text-gray-700 whitespace-pre-line">{flashcard.content}</p>
          <div className="flex items-center text-sm text-gray-500 mt-6">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Created on {formatDate(flashcard.dateCreated)}</span>
          </div>
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              className="border-red-500 text-red-500 hover:bg-red-50"
              onClick={() => onDelete(flashcard.id)}
            >
              Delete Flashcard
            </Button>
            <Button 
              className="bg-custom-gold text-custom-darkBlue1 hover:bg-custom-gold/90"
              onClick={handleClose}
            >
              {flashcard.isRead ? 'Close' : 'Mark as Read & Close'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FlashcardDetail;
