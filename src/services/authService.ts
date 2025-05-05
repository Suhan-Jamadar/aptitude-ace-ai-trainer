import { User } from "@/types";

// API base URL that will come from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Handle API request with proper error handling
 */
const apiRequest = async (endpoint: string, options = {}) => {
  try {
    console.log(`API Request to: ${API_BASE_URL}${endpoint}`);
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include' as RequestCredentials, // Important for cookies
    };

    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...(options as any).headers,
      },
    };

    console.log('Request options:', JSON.stringify(mergedOptions));
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, mergedOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      console.error(`API Error (${response.status}):`, errorData);
      throw new Error(errorData.message || 'API request failed');
    }
    
    return response.json();
  } catch (error) {
    console.error(`API Request failed for ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Login a user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<User>} Authenticated user data
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
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    const data = await apiRequest('/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
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
    const token = localStorage.getItem('token');
    if (token) {
      await apiRequest('/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    }
    
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

    console.log('Fetching user profile...');
    const userData = await apiRequest('/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    console.log('User profile received:', userData);
    
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

    const userData = await apiRequest('/auth/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    
    // Update stored user data with new information
    setCurrentUser(userData.user);
    
    return userData.user;
  } catch (error) {
    console.error('Update user profile error:', error);
    throw error;
  }
};
