
import { Flashcard } from "@/types";
import { mockFlashcards } from "./mockData";

// This service will be used to connect to your MongoDB backend
// These are just placeholder functions for now

export const getFlashcards = async (userId: string): Promise<Flashcard[]> => {
  // This will be replaced with actual MongoDB API calls
  try {
    const response = await fetch(`/api/users/${userId}/flashcards`);
    if (!response.ok) {
      throw new Error('Failed to fetch flashcards');
    }
    return await response.json();
  } catch (error) {
    console.error('Get flashcards error:', error);
    // Return mock data for now
    return mockFlashcards;
  }
};

export const createFlashcard = async (
  userId: string,
  title: string,
  content: string
): Promise<Flashcard> => {
  // This will be replaced with actual MongoDB API calls
  try {
    const response = await fetch(`/api/users/${userId}/flashcards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        content,
        dateCreated: new Date(),
        isRead: false
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create flashcard');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Create flashcard error:', error);
    // Return mock data for now
    const newFlashcard: Flashcard = {
      id: (mockFlashcards.length + 1).toString(),
      title,
      content,
      dateCreated: new Date(),
      isRead: false
    };
    
    return newFlashcard;
  }
};

export const updateFlashcardStatus = async (
  userId: string,
  flashcardId: string,
  isRead: boolean
): Promise<void> => {
  // This will be replaced with actual MongoDB API calls
  try {
    await fetch(`/api/users/${userId}/flashcards/${flashcardId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isRead
      }),
    });
  } catch (error) {
    console.error('Update flashcard status error:', error);
  }
};

export const deleteFlashcard = async (
  userId: string,
  flashcardId: string
): Promise<void> => {
  // This will be replaced with actual MongoDB API calls
  try {
    await fetch(`/api/users/${userId}/flashcards/${flashcardId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Delete flashcard error:', error);
  }
};

export const uploadDocument = async (
  userId: string,
  file: File,
  title: string
): Promise<Flashcard> => {
  // This will be replaced with actual MongoDB API calls
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    
    const response = await fetch(`/api/users/${userId}/documents`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload document');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Upload document error:', error);
    // Return mock data for now
    const newFlashcard: Flashcard = {
      id: (mockFlashcards.length + 1).toString(),
      title,
      content: "This is an AI-generated summary of the uploaded document. It contains key information and important concepts extracted from your notes.",
      dateCreated: new Date(),
      isRead: false
    };
    
    return newFlashcard;
  }
};
