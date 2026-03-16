import { User } from '../types/user';
import api from './api'; 

const USER_STORAGE_KEY = 'mini-kanban-user';

export const authService = {

  async login(credentials: { email: string; password:string }): Promise<User> {
    const response = await api.post('/auth/login', credentials);
    const { accessToken, user } = response.data;

    if (!user || !user.email || !accessToken) {
      throw new Error('Resposta de login inválida do servidor.');
    }

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

    return user as User;
  },

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem(USER_STORAGE_KEY);
  },

  getUser(): User | null {
    const userJson = localStorage.getItem(USER_STORAGE_KEY);
    if (!userJson || userJson === 'undefined') {
      return null;
    }

    try {
      const user: User = JSON.parse(userJson);
      return user;
    } catch (error) {
      console.error("Erro ao processar usuário do localStorage:", error);
      this.logout(); 
      return null;
    }
  },

  async updateProfile(data: { name?: string; avatarUrl?: string }): Promise<User> {
    // CORRIGIDO: URL para bater com o UsersController do backend
    const response = await api.patch('/users/me', data);
    const updatedUser = response.data as User;

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  },

  async register(name: string, email: string, password: string): Promise<any> {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  async forgotPassword(email: string): Promise<void> {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token: string, password: string): Promise<void> {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },
};
