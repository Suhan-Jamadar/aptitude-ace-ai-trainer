
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '@/types';
import * as authService from '@/services/authService';
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check token validity and auto-refresh on expiration
  useEffect(() => {
    const checkTokenValidity = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Get the stored user and check if token is valid by fetching profile
        await refreshUserProfile();
      } catch (error) {
        // Token is invalid, attempt to refresh it
        console.error("Token validation error:", error);
        const refreshed = await authService.refreshToken();
        
        if (!refreshed) {
          // If refresh failed, clear user data
          setUser(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    checkTokenValidity();
    
    // Set up periodic check every hour
    const tokenCheckInterval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token) {
        authService.refreshToken();
      }
    }, 60 * 60 * 1000); // 1 hour
    
    return () => clearInterval(tokenCheckInterval);
  }, []);
  
  // Check if user is logged in on initial load
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const refreshUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      setIsLoading(true);
      const userData = await authService.getUserProfile();
      setUser(userData);
      authService.setCurrentUser(userData);
    } catch (error) {
      console.error("Get profile error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
      authService.setCurrentUser(userData);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const userData = await authService.signup(name, email, password);
      setUser(userData);
      authService.setCurrentUser(userData);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        login, 
        signup, 
        logout,
        refreshUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
