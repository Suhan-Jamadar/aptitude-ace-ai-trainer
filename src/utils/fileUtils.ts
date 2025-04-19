
// Maximum file size in bytes (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024; 

// Supported file types
export const SUPPORTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain"
];

export const generateFlashcardContent = (fileName: string): string => {
  // This would be replaced with actual AI processing in a real app
  const topics = [
    "This flashcard contains key information about data structures and algorithms. It covers topics like binary search trees, dynamic programming, and graph traversal techniques.",
    "This flashcard summarizes important database concepts including normalization, indexing strategies, and transaction isolation levels.",
    "This flashcard explains networking fundamentals such as TCP/IP protocols, OSI model layers, and common security practices.",
    "This flashcard covers software design patterns including Singleton, Factory, Observer, and their practical applications in modern software development."
  ];
  
  return topics[Math.floor(Math.random() * topics.length)];
};

export const isValidFile = (file: File): { valid: boolean; error?: string } => {
  if (!file) {
    return { valid: false, error: "No file selected" };
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File size exceeds 10MB limit" };
  }
  
  if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
    return { valid: false, error: "Unsupported file type. Please upload PDF, DOC, DOCX, or TXT files." };
  }
  
  return { valid: true };
};
