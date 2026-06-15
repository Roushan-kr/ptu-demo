import { useEffect, useState } from 'react';
import axiosClient from '@/lib/axios-client';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  campus?: { id: string; name: string } | null;
  modules?: string[];
}

export function useAdminAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/api/admin/me');
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axiosClient.post('/api/admin/logout');
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      setUser(null);
      window.location.href = '/admin/auth/login';
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading, logout, refetch: fetchUser };
}