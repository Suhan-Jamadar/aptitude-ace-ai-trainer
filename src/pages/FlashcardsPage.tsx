import { useState, useRef } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Flashcard } from "@/types";
import { Upload, File, FileText, Check, Calendar, Filter, ArrowUpDown, Search } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { isValidFile, generateFlashcardContent } from "@/utils/fileUtils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const mockFlashcards: Flashcard[] = [
  {
    id: "1",
    title: "Keys in DBMS",
    content: "Primary keys uniquely identify records in a table. Foreign keys establish relationships between tables. Candidate keys are potential primary keys. Super keys uniquely identify records but may include extra attributes. Composite keys use multiple attributes together.",
    dateCreated: new Date(2023, 3, 15),
    isRead: true
  },
  {
    id: "2",
    title: "Binary Search Algorithm",
    content: "Binary search is a fast search algorithm that works on sorted arrays. It repeatedly divides the search space in half, comparing the middle element to the target value. Time complexity is O(log n), making it very efficient for large datasets.",
    dateCreated: new Date(2023, 4, 2),
    isRead: false
  },
  {
    id: "3",
    title: "Big O Notation",
    content: "Big O notation describes the performance or complexity of an algorithm. O(1) represents constant time. O(n) represents linear time. O(log n) represents logarithmic time. O(n²) represents quadratic time. It focuses on the worst-case scenario as input size grows.",
    dateCreated: new Date(2023, 4, 10),
    isRead: false
  }
];

const FlashcardsPage = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(mockFlashcards);
  const [newFlashcardTitle, setNewFlashcardTitle] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [sortByDateAsc, setSortByDateAsc] = useState(true);
  const [filterReadOnly, setFilterReadOnly] = useState(false);
  const [selectedFlashcard, setSelectedFlashcard] = useState<Flashcard | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCheckFlashcard = (id: string) => {
    setFlashcards(flashcards.map(card => 
      card.id === id ? { ...card, isRead: !card.isRead } : card
    ));
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

  const processFile = (file: File) => {
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

    setTimeout(() => {
      setIsUploading(false);
      
      const newFlashcard: Flashcard = {
        id: (flashcards.length + 1).toString(),
        title: newFlashcardTitle,
        content: generateFlashcardContent(file.name),
        dateCreated: new Date(),
        isRead: false
      };
      
      setFlashcards([...flashcards, newFlashcard]);
      setNewFlashcardTitle("");
      toast.success("Flashcard created successfully!");
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, 2000);
  };

  const handleBrowseFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const sortFlashcards = () => {
    setSortByDateAsc(!sortByDateAsc);
    
    const sorted = [...flashcards].sort((a, b) => {
      const comparison = a.dateCreated.getTime() - b.dateCreated.getTime();
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

  const displayedFlashcards = filterReadOnly 
    ? flashcards.filter(card => card.isRead) 
    : flashcards;

  const filteredFlashcards = flashcards.filter(card => 
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
          </p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search flashcards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
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
              <div className="max-w-sm mx-auto">
                <Input
                  type="text"
                  placeholder="Name your flashcard (e.g., Keys in DBMS)"
                  value={newFlashcardTitle}
                  onChange={(e) => setNewFlashcardTitle(e.target.value)}
                  className="mb-4"
                />
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInput}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                />
                <Button 
                  className="bg-custom-darkBlue1 hover:bg-custom-darkBlue2 text-white w-full"
                  onClick={handleBrowseFiles}
                >
                  <File className="h-4 w-4 mr-2" />
                  Browse Files
                </Button>
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
            {filteredFlashcards.length === 0 ? (
              <div className="col-span-full text-center py-10 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No flashcards found.</p>
              </div>
            ) : (
              filteredFlashcards.map((flashcard) => (
                <motion.div 
                  key={flashcard.id} 
                  className={`
                    bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300
                    ${flashcard.isRead ? 'border-l-4 border-custom-gold' : ''}
                  `}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Number(flashcard.id) * 0.1 }}
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
              <div className="flex justify-end mt-6">
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
