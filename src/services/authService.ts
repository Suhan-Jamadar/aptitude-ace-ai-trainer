
import { User } from "@/types";

// API base URL that will come from environment variables when you set up your backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Login a user with email and password
 */
export const login = async (email: string, password: string): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include', // Important for cookies
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }
    
    const userData = await response.json();
    
    // Store the JWT token in localStorage
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
    
    // Store user info
    setCurrentUser(userData.user);
    
    return userData.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Register a new user
 */
export const signup = async (
  name: string, 
  email: string, 
  password: string
): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
      credentials: 'include', // Important for cookies
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Signup failed');
    }
    
    const userData = await response.json();
    
    // Store the JWT token in localStorage
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
    
    // Store user info
    setCurrentUser(userData.user);
    
    return userData.user;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

/**
 * Logout the current user
 */
export const logout = async (): Promise<void> => {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include',
    });
    
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

/**
 * Get the current authenticated user
 */
export const getCurrentUser = (): User | null => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

/**
 * Store user in localStorage
 */
export const setCurrentUser = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Get the current user's profile from the API
 */
export const getUserProfile = async (): Promise<User> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const userData = await response.json();
    return userData.user;
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
};
