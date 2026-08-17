
import api from './axios-config';

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

type TaskApiResponse = Omit<Task, 'commentCount'> & {
  _count?: { comments?: number };
};

function mapTask(task: TaskApiResponse): Task {
  const { _count, ...data } = task;
  return { ...data, commentCount: _count?.comments ?? 0 };
}

export const taskApi = {
  async getTasks(): Promise<Task[]> {
    const response = await api.get('/tasks');
    return response.data.map(mapTask);
  },

  async createTask(data: CreateTaskDTO): Promise<Task> {
    const response = await api.post('/tasks', data);
    return mapTask(response.data);
  },

  async updateTask(id: string, data: Partial<CreateTaskDTO>): Promise<Task> {
    const response = await api.patch(`/tasks/${id}`, data);
    return mapTask(response.data);
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};
