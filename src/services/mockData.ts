
import { Topic, Question, Flashcard, User, Progress } from "@/types";

// Mock user data
export const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  streak: 3,
  joinDate: new Date(2023, 0, 15)
};

// Mock topics data
export const mockTopics: Topic[] = [
  {
    id: "1",
    name: "Number Series",
    description: "Identify patterns and predict the next number in a sequence",
    icon: "trending-up",
    totalQuestions: 20,
    completedQuestions: 15,
    score: 80,
    isUnlocked: true,
    recommendation: "Check out GeeksforGeeks for number series patterns: https://www.geeksforgeeks.org/number-series-formulas/"
  },
  {
    id: "2",
    name: "Time & Work",
    description: "Calculate work efficiency and time required for tasks",
    icon: "calendar",
    totalQuestions: 20,
    completedQuestions: 10,
    score: 75,
    isUnlocked: true,
    recommendation: "Practice more on time and work problems at Medium: https://medium.com/tag/aptitude"
  },
  {
    id: "3",
    name: "Percentages",
    description: "Master percentage calculations and applications",
    icon: "percent",
    totalQuestions: 20,
    completedQuestions: 5,
    score: 60,
    isUnlocked: true,
    recommendation: "Review percentage shortcuts at GeeksforGeeks: https://www.geeksforgeeks.org/percentages-formulas/"
  },
  {
    id: "4",
    name: "Probability",
    description: "Understand and calculate probability of events",
    icon: "bar-chart-2",
    totalQuestions: 20,
    completedQuestions: 0,
    score: 0,
    isUnlocked: true
  },
  {
    id: "5",
    name: "Data Interpretation",
    description: "Analyze charts, graphs and tables to extract information",
    icon: "pie-chart",
    totalQuestions: 20,
    completedQuestions: 0,
    score: 0,
    isUnlocked: false
  }
];

// Mock questions data
export const mockQuestions: Record<string, Question[]> = {
  "1": [
    {
      id: "1-1",
      topicId: "1",
      question: "What comes next in the series: 2, 5, 10, 17, 26, ?",
      options: ["37", "35", "39", "42"],
      correctAnswer: "37",
      explanation: "The pattern is n² + 1. So for n=6, the answer is 6² + 1 = 36 + 1 = 37."
    },
    {
      id: "1-2",
      topicId: "1",
      question: "Find the next number in the sequence: 1, 4, 9, 16, 25, ?",
      options: ["30", "36", "49", "64"],
      correctAnswer: "36",
      explanation: "These are perfect squares: 1², 2², 3², 4², 5², and the next is 6² = 36."
    }
  ],
  "2": [
    {
      id: "2-1",
      topicId: "2",
      question: "If 8 people can complete a work in 20 days, how many days will it take for 10 people to complete the same work?",
      options: ["16 days", "25 days", "18 days", "22 days"],
      correctAnswer: "16 days",
      explanation: "Work done is inversely proportional to the number of days. Using the formula (P₁ × D₁ = P₂ × D₂), we get (8 × 20 = 10 × D₂), so D₂ = (8 × 20) ÷ 10 = 16 days."
    },
    {
      id: "2-2",
      topicId: "2",
      question: "A can complete a job in 12 days, and B can complete it in 15 days. How many days will they take to complete the job working together?",
      options: ["6.67 days", "7.5 days", "6 days", "9 days"],
      correctAnswer: "6.67 days",
      explanation: "A's work per day = 1/12, B's work per day = 1/15. Combined work per day = 1/12 + 1/15 = (5+4)/60 = 9/60 = 3/20. Time to complete = 20/3 = 6.67 days."
    }
  ]
};

// Mock flashcards data
export const mockFlashcards: Flashcard[] = [
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

// Mock progress data
export const mockProgress: Progress = {
  topicsCompleted: 2,
  totalTopics: 5,
  averageScore: 72,
  grandTestUnlocked: false
};

// Mock functions to simulate API calls
export const getTopics = (): Promise<Topic[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockTopics), 500);
  });
};

export const getQuestions = (topicId: string): Promise<Question[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockQuestions[topicId] || []), 500);
  });
};

export const getFlashcards = (): Promise<Flashcard[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockFlashcards), 500);
  });
};

export const getUserProgress = (): Promise<Progress> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockProgress), 500);
  });
};

export const updateFlashcardStatus = (id: string, isRead: boolean): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 300);
  });
};

export const uploadDocument = (file: File, title: string): Promise<Flashcard> => {
  return new Promise((resolve) => {
    // Simulate processing delay
    setTimeout(() => {
      const newFlashcard: Flashcard = {
        id: (mockFlashcards.length + 1).toString(),
        title,
        content: "This is an AI-generated summary of the uploaded document. It contains key information and important concepts extracted from your notes.",
        dateCreated: new Date(),
        isRead: false
      };
      resolve(newFlashcard);
    }, 2000);
  });
};
