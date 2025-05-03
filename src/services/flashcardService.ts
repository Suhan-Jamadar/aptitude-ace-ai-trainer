
import { Flashcard } from "@/types";

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
    const errorData = await response.json().catch(() => ({ message: 'API request failed' }));
    throw new Error(errorData.message || 'API request failed');
  }
  
  return response.json();
};

/**
 * Upload and generate a flashcard from a file
 */
export const uploadAndGenerateFlashcard = async (
  userId: string,
  file: File,
  title: string
): Promise<Flashcard> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/users/${userId}/flashcards/generate`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Generate flashcard failed' }));
      throw new Error(errorData.message || 'Generate flashcard failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Generate flashcard error:', error);
    throw error;
  }
};

/**
 * Get all flashcards for a user
 */
export const getFlashcards = async (userId: string): Promise<Flashcard[]> => {
  try {
    const result = await apiRequest(`/users/${userId}/flashcards`);
    // Convert string dates to Date objects
    return result.map((card: any) => ({
      ...card,
      dateCreated: new Date(card.dateCreated)
    }));
  } catch (error) {
    console.error('Get flashcards error:', error);
    throw error;
  }
};

/**
 * Create a new flashcard
 */
export const createFlashcard = async (
  userId: string,
  title: string,
  content: string
): Promise<Flashcard> => {
  try {
    const result = await apiRequest(`/users/${userId}/flashcards`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        content,
      }),
    });
    
    return {
      ...result,
      dateCreated: new Date(result.dateCreated)
    };
  } catch (error) {
    console.error('Create flashcard error:', error);
    throw error;
  }
};

/**
 * Update flashcard read status
 */
export const updateFlashcardStatus = async (
  userId: string,
  flashcardId: string,
  isRead: boolean
): Promise<void> => {
  try {
    await apiRequest(`/users/${userId}/flashcards/${flashcardId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        isRead
      }),
    });
  } catch (error) {
    console.error('Update flashcard status error:', error);
    throw error;
  }
};

/**
 * Delete a flashcard
 */
export const deleteFlashcard = async (
  userId: string,
  flashcardId: string
): Promise<void> => {
  try {
    await apiRequest(`/users/${userId}/flashcards/${flashcardId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Delete flashcard error:', error);
    throw error;
  }
};

/**
 * Update flashcard content
 */
export const updateFlashcardContent = async (
  userId: string,
  flashcardId: string,
  content: string,
  title?: string
): Promise<Flashcard> => {
  try {
    const updateData: Record<string, string> = { content };
    if (title) updateData.title = title;
    
    const result = await apiRequest(`/users/${userId}/flashcards/${flashcardId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
    
    return {
      ...result,
      dateCreated: new Date(result.dateCreated)
    };
  } catch (error) {
    console.error('Update flashcard content error:', error);
    throw error;
  }
};
