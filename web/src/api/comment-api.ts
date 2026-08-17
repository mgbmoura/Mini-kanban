
import api from './axios-config';

export interface Comment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
  taskId: string;
}

export const commentApi = {
  async getComments(taskId: string): Promise<Comment[]> {
    const response = await api.get(`/tasks/${taskId}/comments`);
    return response.data;
  },

  async createComment(taskId: string, content: string): Promise<Comment> {
    const response = await api.post(`/tasks/${taskId}/comments`, { content });
    return response.data;
  },

  async deleteComment(commentId: string): Promise<void> {
    await api.delete(`/comments/${commentId}`);
  },
};
