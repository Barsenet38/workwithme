// Example hook 
// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface UserData {
  userId: string;
  role: string;
  companyId: string;
  name: string;
  companySubdomain: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<UserData>(token);
        setUser(decoded);
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
    setLoading(false);
  }, []);

  return { user, loading };
};