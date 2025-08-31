import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/user';
import { UserService } from '@/services/userService';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '@/types/user';

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUserProfile = async (): Promise<void> => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        // Decode token to get user ID with proper typing
        const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
        const userId = decoded.userId;

        const response = await UserService.getUserProfile(userId, token);
        
        if (response.success && response.data) {
          setUserProfile(response.data);
        } else {
          setError(response.message || 'Failed to load profile');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return { userProfile, loading, error };
};