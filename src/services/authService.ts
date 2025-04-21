
import { User } from "@/types";

// This service will be used to connect to your MongoDB backend
// These are just placeholder functions for now

export const login = async (email: string, password: string): Promise<User> => {
  // This will be replaced with actual MongoDB API calls
  try {
    // Simulate API call
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Login error:', error);
    // For now, return mock data
    return {
      id: "1",
      name: "John Doe",
      email: email,
      streak: 3,
      joinDate: new Date(2023, 0, 15)
    };
  }
};

export const signup = async (
  name: string, 
  email: string, 
  password: string
): Promise<User> => {
  // This will be replaced with actual MongoDB API calls
  try {
    // Simulate API call
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Signup failed');
    }
    
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Signup error:', error);
    // For now, return mock data
    return {
      id: (Math.random() * 1000).toString(),
      name: name,
      email: email,
      streak: 0,
      joinDate: new Date()
    };
  }
};

export const logout = async (): Promise<void> => {
  // This will be replaced with actual MongoDB API calls
  try {
    // Simulate API call
    await fetch('/api/auth/logout', {
      method: 'POST',
    });
    
    // Clear local storage or cookies if needed
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const getCurrentUser = (): User | null => {
  // This will be replaced with actual MongoDB API calls
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

export const setCurrentUser = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user));
};
