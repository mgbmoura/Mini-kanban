
import { useState, useEffect, useCallback } from 'react';
import { authService } from '../api/auth-api';
import { User } from '../types/user';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(() => {
    const loggedInUser = authService.getUser();
    setUser(loggedInUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(() => {
    loadUser();
  }, [loadUser]);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const refreshProfile = useCallback(() => {
    const updatedUser = authService.getUser();
    setUser(updatedUser);
  }, []);

  return { user, loading, login, logout, refreshProfile };
}
