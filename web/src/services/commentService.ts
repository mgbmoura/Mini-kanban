import api from './api';

export interface Comment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
  taskId: string;
}

export interface CreateCommentDTO {
  content: string;
}

export const commentService = {
  // GET /tasks/:taskId/comments - Lista comentários de uma task
  async getComments(taskId: string): Promise<Comment[]> {
    const response = await api.get(`/tasks/${taskId}/comments`);
    return response.data;
  },

  // POST /tasks/:taskId/comments - Cria um comentário
  async createComment(
    taskId: string,
    content: string
  ): Promise<Comment> {
    const response = await api.post(`/tasks/${taskId}/comments`, { content });
    return response.data;
  },

  // DELETE /comments/:id - Deleta um comentário
  async deleteComment(commentId: string): Promise<void> {
    await api.delete(`/comments/${commentId}`);
  },
};