
import { Question, Topic } from "@/types";

// API base URL that will come from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper function to handle API requests with authentication
const apiRequest = async (endpoint: string, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
    credentials: 'include' as RequestCredentials,
  };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'API request failed');
  }
  
  return response.json();
};

/**
 * Get all available topics
 */
export const getTopics = async (): Promise<Topic[]> => {
  try {
    return await apiRequest('/topics');
  } catch (error) {
    console.error('Get topics error:', error);
    throw error;
  }
};

/**
 * Get questions for a specific topic
 */
export const getQuestionsByTopic = async (topicId: string): Promise<Question[]> => {
  try {
    return await apiRequest(`/topics/${topicId}/questions`);
  } catch (error) {
    console.error('Get questions error:', error);
    throw error;
  }
};

/**
 * Get daily challenge questions
 */
export const getDailyChallenge = async (): Promise<Question[]> => {
  try {
    return await apiRequest('/daily-challenge');
  } catch (error) {
    console.error('Get daily challenge error:', error);
    throw error;
  }
};

/**
 * Get grand test questions
 */
export const getGrandTestQuestions = async (): Promise<Question[]> => {
  try {
    return await apiRequest('/grand-test');
  } catch (error) {
    console.error('Get grand test error:', error);
    throw error;
  }
};

/**
 * Submit quiz results
 */
export const submitQuizResult = async (
  userId: string,
  topicId: string,
  score: number,
  timeSpent: number,
  questionsAttempted: number,
  correctAnswers: number
): Promise<void> => {
  try {
    await apiRequest('/quiz-results', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        topicId,
        score,
        timeSpent,
        date: new Date(),
        questionsAttempted,
        correctAnswers
      }),
    });
  } catch (error) {
    console.error('Submit quiz result error:', error);
    throw error;
  }
};

/**
 * Get recommendations based on user performance
 */
export const getRecommendations = async (
  topicId: string,
  timeSpent: number,
  attempts: number,
  score: number
): Promise<string> => {
  try {
    const response = await apiRequest('/recommendations', {
      method: 'POST',
      body: JSON.stringify({
        topicId,
        timeSpent,
        attempts,
        score
      }),
    });
    return response.recommendation;
  } catch (error) {
    console.error('Get recommendations error:', error);
    throw error;
  }
};
