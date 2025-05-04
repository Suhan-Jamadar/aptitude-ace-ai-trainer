
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, File, Plus } from "lucide-react";
import { toast } from "sonner";
import { isValidFile } from "@/utils/fileUtils";
import { uploadAndGenerateFlashcard, createFlashcard } from "@/services/flashcardService";
import { useAuth } from "@/contexts/AuthContext";
import { Flashcard } from "@/types";

interface FlashcardCreatorProps {
  onFlashcardCreated: (flashcard: Flashcard) => void;
}

const FlashcardCreator = ({ onFlashcardCreated }: FlashcardCreatorProps) => {
  const [newFlashcardTitle, setNewFlashcardTitle] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, isAuthenticated } = useAuth();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    if (!isAuthenticated || !user) {
      toast.error("Please sign in to create flashcards");
      return;
    }
    
    const validation = isValidFile(file);
    
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }
    
    if (!newFlashcardTitle) {
      toast.error("Please provide a name for your flashcard");
      return;
    }
    
    setIsUploading(true);

    try {
      const newFlashcard = await uploadAndGenerateFlashcard(
        user.id,
        file,
        newFlashcardTitle
      );
      
      onFlashcardCreated(newFlashcard);
      setNewFlashcardTitle("");
      toast.success("Flashcard created successfully!");
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error("Failed to generate flashcard. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateManualFlashcard = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Please sign in to create flashcards");
      return;
    }
    
    if (!newFlashcardTitle) {
      toast.error("Please provide a title for your flashcard");
      return;
    }
    
    try {
      const newFlashcard = await createFlashcard(
        user.id, 
        newFlashcardTitle, 
        "Click to edit your flashcard content"
      );
      
      onFlashcardCreated(newFlashcard);
      setNewFlashcardTitle("");
      toast.success("Flashcard created successfully!");
    } catch (error) {
      toast.error("Failed to create flashcard");
    }
  };

  const handleBrowseFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div 
      className={`
        mb-10 border-2 border-dashed rounded-xl p-8 text-center
        transition-all duration-300 bg-white
        ${isDragging ? 'border-custom-gold bg-custom-gold/5' : 'border-gray-300'}
        ${isUploading ? 'border-blue-500 bg-blue-50' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isUploading ? (
        <div className="animate-pulse">
          <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <File className="h-8 w-8 text-blue-500 animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold text-blue-700 mb-2">Processing Your Document</h3>
          <p className="text-blue-600">
            Our AI is analyzing your notes and generating flashcards...
          </p>
        </div>
      ) : (
        <>
          <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Upload className="h-8 w-8 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Upload Your Notes</h3>
          <p className="text-gray-500 mb-6">
            Drag and drop your PDF, DOC, or TXT files here
          </p>
          <div className="max-w-sm mx-auto space-y-4">
            <Input
              type="text"
              placeholder="Name your flashcard (e.g., Keys in DBMS)"
              value={newFlashcardTitle}
              onChange={(e) => setNewFlashcardTitle(e.target.value)}
            />
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt"
            />
            <div className="flex gap-2">
              <Button 
                className="bg-custom-darkBlue1 hover:bg-custom-darkBlue2 text-white flex-1"
                onClick={handleBrowseFiles}
                disabled={!isAuthenticated}
              >
                <File className="h-4 w-4 mr-2" />
                Browse Files
              </Button>
              <Button
                variant="outline"
                className="border-custom-darkBlue1 text-custom-darkBlue1 flex-1"
                onClick={handleCreateManualFlashcard}
                disabled={!isAuthenticated}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Blank
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Supported formats: PDF, DOC, DOCX, TXT (Max size: 10MB)
          </p>
        </>
      )}
    </div>
  );
};

export default FlashcardCreator;
