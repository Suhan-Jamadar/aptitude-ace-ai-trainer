
// User types
export interface User {
  id: string;
  name: string;
  email: string;
  streak: number;
  joinDate: Date;
  progress?: {
    topicsCompleted: number;
    grandTestUnlocked: boolean;
    averageScore?: number;
  };
}

// Auth types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Topic types
export interface SubTopic {
  id: string;
  name: string;
  link: string;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string;
  totalQuestions: number;
  completedQuestions: number;
  score: number;
  isUnlocked: boolean;
  recommendation?: string;
  attempts?: number;
  avgTime?: number;
  subtopics?: SubTopic[];
}

// Quiz types
export interface Question {
  id: string;
  topicId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizResult {
  topicId: string;
  userId: string;
  score: number;
  timeSpent: number;
  date: Date;
  questionsAttempted: number;
  correctAnswers: number;
}

// Flashcard types
export interface Flashcard {
  id: string;
  title: string;
  content: string;
  dateCreated: Date;
  isRead: boolean;
}

// Progress types
export interface Progress {
  topicsCompleted: number;
  totalTopics: number;
  averageScore: number;
  grandTestUnlocked: boolean;
}
