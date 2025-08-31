import { UserProfile } from '@/types/user';
import { ApiResponse } from '@/types/api';

export class UserService {
  private static baseUrl = 'http://localhost:5000/api';

  static async getUserProfile(userId: string, token: string): Promise<ApiResponse<UserProfile>> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<UserProfile> = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
  }
}