
import { User } from '../types/user';
import api from './axios-config'; 

const USER_STORAGE_KEY = 'mini-kanban-user';

export const authService = {
  async login(credentials: { email: string; password:string }): Promise<User> {
    const response = await api.post('/auth/login', credentials);
    const { accessToken, user } = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

    return user;
  },

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem(USER_STORAGE_KEY);
  },

  getUser(): User | null {
    const userJson = localStorage.getItem(USER_STORAGE_KEY);
    if (!userJson || userJson === 'undefined') return null;
    return JSON.parse(userJson);
  },

  async updateProfile(data: { name?: string; avatarUrl?: string }): Promise<User> {
    const response = await api.patch('/users/me', data);
    const updatedUser = response.data;
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  },

  async register(name: string, email: string, password: string): Promise<void> {
    await api.post('/auth/register', { name, email, password });
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await api.post('/auth/reset-password', { token, password });
  },
};
