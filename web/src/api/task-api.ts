
import api from './axios-config';

/**
 * TIPAGEM: Define o formato de uma Tarefa (Task) no sistema.
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  tags?: string[];
  attachmentImage?: string;
  position: number;
  createdAt: string;
  updatedAt: string;
  commentCount?: number;
}

export type TaskStatus = 'TODO' | 'DOING' | 'DONE';
export type TaskPriority = 'Baixa' | 'Média' | 'Alta';

export interface CreateTaskDTO {
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  tags?: string[];
  attachmentImage?: string;
  position?: number;
}

/**
 * API SERVICE: Tasks
 * Centraliza todas as operações de banco de dados relacionadas a tarefas.
 */
export const taskApi = {
  // Lista todas as tarefas do usuário logado
  async getTasks(): Promise<Task[]> {
    const response = await api.get('/tasks');
    // Mapeamos a resposta para facilitar o acesso à contagem de comentários
    return response.data.map((task: any) => ({
      ...task,
      commentCount: task._count?.comments || 0,
    }));
  },

  // Cria uma nova tarefa
  async createTask(data: Partial<CreateTaskDTO>): Promise<Task> {
    const response = await api.post('/tasks', data);
    return {
      ...response.data,
      commentCount: response.data._count?.comments || 0,
    };
  },

  // Atualiza uma tarefa existente (título, status, posição, etc.)
  async updateTask(id: string, data: Partial<CreateTaskDTO>): Promise<Task> {
    const response = await api.patch(`/tasks/${id}`, data);
    return {
      ...response.data,
      commentCount: response.data._count?.comments || 0,
    };
  },

  // Remove uma tarefa permanentemente
  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};
