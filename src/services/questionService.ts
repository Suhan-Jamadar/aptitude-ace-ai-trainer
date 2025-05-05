import { Question, Topic } from "@/types";

// API base URL that will come from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Helper function to handle API requests with authentication
 * Automatically includes auth token and handles error responses
 */
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
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorData.message || 'API request failed');
  }
  
  return response.json();
};

/**
 * Get all available topics
 * @returns {Promise<Topic[]>} Array of topic objects
 */
export const getTopics = async (): Promise<Topic[]> => {
  try {
    // This will get user-specific topics with their progress
    return await apiRequest('/topics');
  } catch (error) {
    console.error('Get topics error:', error);
    throw error;
  }
};

/**
 * Get questions for a specific topic
 * @param {string} topicId - The topic identifier
 * @returns {Promise<Question[]>} Array of question objects for the topic
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
 * @returns {Promise<Question[]>} Array of daily challenge questions
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
 * @returns {Promise<Question[]>} Array of grand test questions
 */
export const getGrandTestQuestions = async (): Promise<Question[]> => {
  try {
    return await apiRequest('/grand-test/questions');
  } catch (error) {
    console.error('Get grand test error:', error);
    throw error;
  }
};

/**
 * Submit quiz results for a user
 * @param {string} userId - The user identifier
 * @param {string} topicId - The topic identifier
 * @param {number} score - The score percentage (0-100)
 * @param {number} timeSpent - Time spent in seconds
 * @param {number} questionsAttempted - Number of questions attempted
 * @param {number} correctAnswers - Number of correct answers
 * @returns {Promise<void>}
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
        date: new Date().toISOString(),
        questionsAttempted,
        correctAnswers,
        performance: JSON.parse(localStorage.getItem(`${topicId}_lastPerformance`) || '{}')
      }),
    });
  } catch (error) {
    console.error('Submit quiz result error:', error);
    throw error;
  }
};

/**
 * Submit daily challenge results
 * @param {number} score - The score percentage (0-100)
 * @param {number} timeSpent - Time spent in seconds
 * @param {number} questionsAttempted - Number of questions attempted
 * @param {number} correctAnswers - Number of correct answers
 * @returns {Promise<void>}
 */
export const submitDailyChallengeResult = async (
  score: number,
  timeSpent: number,
  questionsAttempted: number,
  correctAnswers: number
): Promise<void> => {
  try {
    await apiRequest('/daily-challenge/results', {
      method: 'POST',
      body: JSON.stringify({
        score,
        timeSpent,
        questionsAttempted,
        correctAnswers
      }),
    });
  } catch (error) {
    console.error('Submit daily challenge result error:', error);
    throw error;
  }
};

/**
 * Submit grand test results
 * @param {number} score - The score percentage (0-100)
 * @param {number} timeSpent - Time spent in seconds
 * @param {number} questionsAttempted - Number of questions attempted
 * @param {number} correctAnswers - Number of correct answers
 * @returns {Promise<void>}
 */
export const submitGrandTestResult = async (
  score: number,
  timeSpent: number,
  questionsAttempted: number,
  correctAnswers: number
): Promise<void> => {
  try {
    await apiRequest('/grand-test/results', {
      method: 'POST',
      body: JSON.stringify({
        score,
        timeSpent,
        questionsAttempted,
        correctAnswers
      }),
    });
  } catch (error) {
    console.error('Submit grand test result error:', error);
    throw error;
  }
};

/**
 * Update user's progress for a specific topic
 * @param {string} userId - The user identifier
 * @param {string} topicId - The topic identifier
 * @param {number} completedQuestions - Number of completed questions (correct answers)
 * @param {number} totalQuestions - Total number of questions
 * @param {number} score - The score percentage (0-100)
 * @returns {Promise<void>}
 */
export const updateTopicProgress = async (
  userId: string,
  topicId: string,
  completedQuestions: number,
  totalQuestions: number,
  score: number
): Promise<void> => {
  try {
    await apiRequest(`/users/${userId}/topics/${topicId}/progress`, {
      method: 'PUT',
      body: JSON.stringify({
        completedQuestions,
        totalQuestions,
        score,
        lastUpdated: new Date().toISOString()
      }),
    });
  } catch (error) {
    console.error('Update topic progress error:', error);
    throw error;
  }
};

/**
 * Get recommendations based on user performance
 * @param {string} topicId - The topic identifier
 * @param {number} timeSpent - Time spent in seconds
 * @param {number} attempts - Number of attempts
 * @param {number} score - The score percentage (0-100)
 * @returns {Promise<string>} Recommendation text
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
        score,
        userId: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).id : null
      }),
    });
    return response.recommendation;
  } catch (error) {
    console.error('Get recommendations error:', error);
    return "Practice more questions on topics you find challenging.";
  }
};

/**
 * Get user's quiz history for a topic
 * @param {string} userId - The user identifier
 * @param {string} topicId - The topic identifier
 * @returns {Promise<any[]>} Array of quiz attempt data
 */
export const getQuizHistory = async (userId: string, topicId: string): Promise<any[]> => {
  try {
    return await apiRequest(`/users/${userId}/topics/${topicId}/history`);
  } catch (error) {
    console.error('Get quiz history error:', error);
    throw error;
  }
};
