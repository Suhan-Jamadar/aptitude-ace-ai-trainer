import { User } from "@/types";

// API base URL that will come from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Handle API request with proper error handling
 */
const apiRequest = async (endpoint: string, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorData.message || 'API request failed');
  }
  
  return response.json();
};

/**
 * Login a user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<User>} Authenticated user data
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
      
      // Set token refresh timer (if token expires in 7 days)
      const refreshTime = 6 * 24 * 60 * 60 * 1000; // 6 days in milliseconds
      setTimeout(() => refreshToken(), refreshTime);
    }
    
    // Store user info
    setCurrentUser(userData.user);
    
    // Update last login timestamp
    localStorage.setItem('lastLogin', new Date().toISOString());
    
    return userData.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Register a new user
 * @param {string} name - User's full name
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<User>} Registered user data
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
    
    // Set initial user preferences
    localStorage.setItem('userPreferences', JSON.stringify({
      theme: 'light',
      notifications: true,
      lastActive: new Date().toISOString()
    }));
    
    return userData.user;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

/**
 * Refresh the authentication token
 * @returns {Promise<boolean>} Success status
 */
export const refreshToken = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    localStorage.setItem('token', data.token);
    return true;
  } catch (error) {
    console.error('Token refresh error:', error);
    return false;
  }
};

/**
 * Logout the current user
 * @returns {Promise<void>}
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
    
    // Keep user preferences but mark as logged out
    const preferences = localStorage.getItem('userPreferences');
    if (preferences) {
      const updatedPreferences = JSON.parse(preferences);
      updatedPreferences.isLoggedIn = false;
      localStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
};

/**
 * Get the current authenticated user from localStorage
 * @returns {User|null} Current user or null if not authenticated
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
 * @param {User} user - User object to store
 */
export const setCurrentUser = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user));
  
  // Update user preferences
  const preferences = localStorage.getItem('userPreferences');
  if (preferences) {
    const updatedPreferences = JSON.parse(preferences);
    updatedPreferences.isLoggedIn = true;
    updatedPreferences.lastActive = new Date().toISOString();
    localStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
  } else {
    localStorage.setItem('userPreferences', JSON.stringify({
      theme: 'light',
      notifications: true,
      isLoggedIn: true,
      lastActive: new Date().toISOString()
    }));
  }
};

/**
 * Get the current user's profile from the API
 * @returns {Promise<User>} User profile data
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
    
    // Update stored user data with any new information
    setCurrentUser(userData.user);
    
    return userData.user;
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
};

/**
 * Update user profile information
 * @param {string} userId - User identifier
 * @param {Object} profileData - Updated profile information
 * @returns {Promise<User>} Updated user data
 */
export const updateUserProfile = async (userId: string, profileData: Partial<User>): Promise<User> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to update user profile');
    }

    const userData = await response.json();
    
    // Update stored user data with new information
    setCurrentUser(userData.user);
    
    return userData.user;
  } catch (error) {
    console.error('Update user profile error:', error);
    throw error;
  }
};
