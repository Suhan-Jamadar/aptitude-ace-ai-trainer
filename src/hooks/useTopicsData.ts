
import { useState, useEffect } from 'react';
import { Topic } from '@/types';
import { getTopics } from '@/services/questionService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { defaultTopics } from '@/data/defaultTopics';

export const useTopicsData = () => {
  const [topics, setTopics] = useState<Topic[]>(defaultTopics);
  const { user, isAuthenticated } = useAuth();

  // Fetch user-specific topic data when authenticated
  useEffect(() => {
    const fetchUserTopics = async () => {
      if (isAuthenticated && user) {
        try {
          const userTopics = await getTopics();
          if (userTopics && userTopics.length > 0) {
            setTopics(userTopics);
          }
        } catch (error) {
          console.error("Failed to fetch user topics:", error);
          toast.error("Failed to load your progress data");
        }
      } else {
        // Reset to default topics for non-authenticated users
        setTopics(defaultTopics);
      }
    };

    fetchUserTopics();
  }, [isAuthenticated, user]);

  return { topics };
};
