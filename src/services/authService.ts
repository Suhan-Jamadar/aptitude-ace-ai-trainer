
import { User } from "@/types";

// API base URL that will come from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Handle API request with proper error handling
 */
const apiRequest = async (endpoint: string, options = {}) => {
  try {
    console.log(`API Request to: ${API_BASE_URL}${endpoint}`);
    
    // Default fetch options
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include' as RequestCredentials,
      mode: 'cors' as RequestMode,
    };

    // Merge options
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...(options as any).headers,
      },
    };

    console.log('Request options:', JSON.stringify(mergedOptions));
    
    // Make the request
    const response = await fetch(`${API_BASE_URL}${endpoint}`, mergedOptions);
    
    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: `Error ${response.status}: ${response.statusText}` 
      }));
      console.error(`API Error (${response.status}):`, errorData);
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }
    
    // Return successful response data
    return await response.json();
  } catch (error) {
    console.error(`API Request failed for ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Login a user with email and password
 */
export const login = async (email: string, password: string): Promise<User> => {
  try {
    console.log('Login attempt for:', email);
    const userData = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    console.log('Login successful:', userData);
    
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
    console.log('Signup attempt for:', email);
    const userData = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    
    console.log('Signup successful:', userData);
    
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
    const token = localStorage.getItem('token');
    
    if (token) {
      await apiRequest('/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    }
    
    // Clear local storage data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Logout error:', error);
    // Still remove tokens on error to ensure user is logged out client-side
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

/**
 * Get the current authenticated user from localStorage
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

    console.log('Fetching user profile...');
    const userData = await apiRequest('/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    console.log('User profile received:', userData);
    
    // Update stored user data
    setCurrentUser(userData.user);
    
    return userData.user;
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
};
