
import { Progress } from "@/types";

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
 * Get user progress data
 */
export const getUserProgress = async (userId: string): Promise<Progress> => {
  try {
    return await apiRequest(`/users/${userId}/progress`);
  } catch (error) {
    console.error('Get user progress error:', error);
    throw error;
  }
};

/**
 * Update user streak count
 */
export const updateUserStreak = async (
  userId: string,
  newStreak: number
): Promise<void> => {
  try {
    await apiRequest(`/users/${userId}/streak`, {
      method: 'PATCH',
      body: JSON.stringify({
        streak: newStreak
      }),
    });
  } catch (error) {
    console.error('Update user streak error:', error);
    throw error;
  }
};

/**
 * Unlock the Grand Test for a user
 */
export const unlockGrandTest = async (userId: string): Promise<void> => {
  try {
    await apiRequest(`/users/${userId}/unlock-grand-test`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Unlock grand test error:', error);
    throw error;
  }
};

/**
 * Get questions for the Grand Test
 */
export const getGrandTestQuestions = async (): Promise<any[]> => {
  try {
    return await apiRequest('/grand-test/questions');
  } catch (error) {
    console.error('Get grand test questions error:', error);
    throw error;
  }
};

/**
 * Submit Grand Test results
 */
export const submitGrandTestResult = async (
  userId: string,
  score: number,
  timeSpent: number,
  questionsAttempted: number,
  correctAnswers: number
): Promise<void> => {
  try {
    await apiRequest('/grand-test/results', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        score,
        timeSpent,
        date: new Date(),
        questionsAttempted,
        correctAnswers
      }),
    });
  } catch (error) {
    console.error('Submit grand test result error:', error);
    throw error;
  }
};
