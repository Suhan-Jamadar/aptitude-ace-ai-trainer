
import { useState, useRef, useEffect } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Flashcard } from "@/types";
import { Upload, File, FileText, Check, Calendar, Filter, ArrowUpDown, Search, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { isValidFile } from "@/utils/fileUtils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { 
  getFlashcards,
  uploadAndGenerateFlashcard, 
  createFlashcard,
  updateFlashcardStatus,
  deleteFlashcard
} from "@/services/flashcardService";
import { useAuth } from "@/contexts/AuthContext";

const FlashcardsPage = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [newFlashcardTitle, setNewFlashcardTitle] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortByDateAsc, setSortByDateAsc] = useState(true);
  const [filterReadOnly, setFilterReadOnly] = useState(false);
  const [selectedFlashcard, setSelectedFlashcard] = useState<Flashcard | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      
      setFlashcards([...flashcards, newFlashcard]);
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
      
      setFlashcards([...flashcards, newFlashcard]);
      setNewFlashcardTitle("");
      toast.success("Flashcard created successfully!");
    } catch (error) {
      toast.error("Failed to create flashcard");
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

  const handleBrowseFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatDate = (date: Date) => {
    if (!(date instanceof Date) && typeof date === 'string') {
      date = new Date(date);
    }
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
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
                <FileText className="h-8 w-8 text-blue-500 animate-pulse" />
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

        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-custom-darkBlue1">Your Flashcards</h2>
            <div className="flex items-center space-x-2">
              <div className="relative max-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search flashcards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                variant="outline" 
                className="text-custom-darkBlue1 border-custom-darkBlue1"
                onClick={sortFlashcards}
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort by Date
              </Button>
              <Button 
                variant="outline" 
                className={`${filterReadOnly ? 'bg-custom-gold/10 text-custom-gold border-custom-gold' : 'text-custom-darkBlue1 border-custom-darkBlue1'}`}
                onClick={toggleFilterReadOnly}
              >
                <Filter className="h-4 w-4 mr-2" />
                {filterReadOnly ? 'Read Only' : 'Filter'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // Loading state
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="h-20 bg-gray-100 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))
            ) : displayedFlashcards.length === 0 ? (
              // Empty state
              <div className="col-span-full text-center py-10 bg-gray-50 rounded-lg">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">
                  {isAuthenticated 
                    ? "No flashcards found. Create your first flashcard above!"
                    : "Sign in to create and view your flashcards."}
                </p>
              </div>
            ) : (
              // Flashcards grid
              displayedFlashcards.map((flashcard) => (
                <motion.div 
                  key={flashcard.id} 
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
                          onCheckedChange={() => handleCheckFlashcard(flashcard.id)}
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
                        onClick={() => viewFlashcard(flashcard)}
                      >
                        View Full
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.div>

      {selectedFlashcard && (
        <Sheet open={!!selectedFlashcard} onOpenChange={() => setSelectedFlashcard(null)}>
          <SheetContent className="w-[90vw] sm:max-w-[600px] p-6">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-2xl font-bold text-custom-darkBlue1">{selectedFlashcard.title}</SheetTitle>
            </SheetHeader>
            <div className="space-y-4">
              <p className="text-gray-700 whitespace-pre-line">{selectedFlashcard.content}</p>
              <div className="flex items-center text-sm text-gray-500 mt-6">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Created on {formatDate(selectedFlashcard.dateCreated)}</span>
              </div>
              <div className="flex justify-between mt-6">
                <Button 
                  variant="outline" 
                  className="border-red-500 text-red-500 hover:bg-red-50"
                  onClick={() => {
                    handleDeleteFlashcard(selectedFlashcard.id);
                  }}
                >
                  Delete Flashcard
                </Button>
                <Button 
                  className="bg-custom-gold text-custom-darkBlue1 hover:bg-custom-gold/90"
                  onClick={() => {
                    if (!selectedFlashcard.isRead) {
                      handleCheckFlashcard(selectedFlashcard.id);
                    }
                    setSelectedFlashcard(null);
                  }}
                >
                  {selectedFlashcard.isRead ? 'Close' : 'Mark as Read & Close'}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </MainLayout>
  );
};

export default FlashcardsPage;
