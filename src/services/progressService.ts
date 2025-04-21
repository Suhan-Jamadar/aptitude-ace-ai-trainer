
import { Progress } from "@/types";
import { mockProgress } from "./mockData";

// This service will be used to connect to your MongoDB backend
// These are just placeholder functions for now

export const getUserProgress = async (userId: string): Promise<Progress> => {
  // This will be replaced with actual MongoDB API calls
  try {
    const response = await fetch(`/api/users/${userId}/progress`);
    if (!response.ok) {
      throw new Error('Failed to fetch user progress');
    }
    return await response.json();
  } catch (error) {
    console.error('Get user progress error:', error);
    // Return mock data for now
    return mockProgress;
  }
};

export const updateUserStreak = async (
  userId: string,
  newStreak: number
): Promise<void> => {
  // This will be replaced with actual MongoDB API calls
  try {
    await fetch(`/api/users/${userId}/streak`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        streak: newStreak
      }),
    });
  } catch (error) {
    console.error('Update user streak error:', error);
  }
};

export const unlockGrandTest = async (userId: string): Promise<void> => {
  // This will be replaced with actual MongoDB API calls
  try {
    await fetch(`/api/users/${userId}/unlock-grand-test`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Unlock grand test error:', error);
  }
};

export const getGrandTestQuestions = async (): Promise<any[]> => {
  // This will be replaced with actual MongoDB API calls
  try {
    const response = await fetch('/api/grand-test/questions');
    if (!response.ok) {
      throw new Error('Failed to fetch grand test questions');
    }
    return await response.json();
  } catch (error) {
    console.error('Get grand test questions error:', error);
    // Return sample data for now
    return [];
  }
};

export const submitGrandTestResult = async (
  userId: string,
  score: number,
  timeSpent: number,
  questionsAttempted: number,
  correctAnswers: number
): Promise<void> => {
  // This will be replaced with actual MongoDB API calls
  try {
    await fetch('/api/grand-test/results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
  }
};
