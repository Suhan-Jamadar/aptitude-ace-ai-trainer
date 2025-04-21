
import { Question, Topic } from "@/types";
import { mockQuestions, mockTopics } from "./mockData";

// This service will be used to connect to your MongoDB backend
// These are just placeholder functions for now

export const getTopics = async (): Promise<Topic[]> => {
  // This will be replaced with actual MongoDB API calls
  try {
    const response = await fetch('/api/topics');
    if (!response.ok) {
      throw new Error('Failed to fetch topics');
    }
    return await response.json();
  } catch (error) {
    console.error('Get topics error:', error);
    // Return mock data for now
    return mockTopics;
  }
};

export const getQuestionsByTopic = async (topicId: string): Promise<Question[]> => {
  // This will be replaced with actual MongoDB API calls
  try {
    const response = await fetch(`/api/topics/${topicId}/questions`);
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }
    return await response.json();
  } catch (error) {
    console.error('Get questions error:', error);
    // Return mock data for now
    return mockQuestions[topicId] || [];
  }
};

export const submitQuizResult = async (
  userId: string,
  topicId: string,
  score: number,
  timeSpent: number,
  questionsAttempted: number,
  correctAnswers: number
): Promise<void> => {
  // This will be replaced with actual MongoDB API calls
  try {
    await fetch('/api/quiz-results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
  }
};

export const updateTopicProgress = async (
  userId: string,
  topicId: string,
  completedQuestions: number,
  score: number
): Promise<void> => {
  // This will be replaced with actual MongoDB API calls
  try {
    await fetch(`/api/users/${userId}/topics/${topicId}/progress`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        completedQuestions,
        score
      }),
    });
  } catch (error) {
    console.error('Update topic progress error:', error);
  }
};

export const getDailyChallenge = async (): Promise<Question[]> => {
  // This will be replaced with actual MongoDB API calls
  try {
    const response = await fetch('/api/daily-challenge');
    if (!response.ok) {
      throw new Error('Failed to fetch daily challenge');
    }
    return await response.json();
  } catch (error) {
    console.error('Get daily challenge error:', error);
    // Return sample questions for now
    return Object.values(mockQuestions).flat().slice(0, 5);
  }
};
