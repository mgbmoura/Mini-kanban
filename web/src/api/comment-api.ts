
import api from './axios-config';

/**
 * TIPAGEM: Define o formato de um Comentário.
 */
export interface Comment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
  taskId: string;
}

/**
 * API SERVICE: Comments
 * Gerencia o envio e exclusão de comentários em tarefas específicas.
 */
export const commentApi = {
  // Busca todos os comentários vinculados a uma tarefa (taskId)
  async getComments(taskId: string): Promise<Comment[]> {
    const response = await api.get(`/tasks/${taskId}/comments`);
    return response.data;
  },

  // Envia um novo comentário para uma tarefa
  async createComment(taskId: string, content: string): Promise<Comment> {
    const response = await api.post(`/tasks/${taskId}/comments`, { content });
    return response.data;
  },

  // Remove um comentário (apenas o dono pode fazer isso, validado no backend)
  async deleteComment(commentId: string): Promise<void> {
    await api.delete(`/comments/${commentId}`);
  },
};
