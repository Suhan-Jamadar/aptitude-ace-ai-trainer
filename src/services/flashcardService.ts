import { Flashcard } from "@/types";

// API base URL that will come from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
};

export const uploadAndGenerateFlashcard = async (
  userId: string,
  file: File,
  title: string,
  apiKey: string
): Promise<Flashcard> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('apiKey', apiKey);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/users/${userId}/flashcards/generate`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
      credentials: 'include',
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Generate flashcard error:', error);
    throw error;
  }
};

export const getFlashcards = async (userId: string): Promise<Flashcard[]> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/users/${userId}/flashcards`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      credentials: 'include',
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Get flashcards error:', error);
    throw error;
  }
};

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
 * Create a new flashcard
 */
export const createFlashcard = async (
  userId: string,
  title: string,
  content: string
): Promise<Flashcard> => {
  try {
    return await apiRequest(`/users/${userId}/flashcards`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        content,
        dateCreated: new Date(),
        isRead: false
      }),
    });
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
 * Upload a document to be converted to flashcards
 */
export const uploadDocument = async (
  userId: string,
  file: File,
  title: string
): Promise<Flashcard> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/users/${userId}/documents`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Upload failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Upload document error:', error);
    throw error;
  }
};
