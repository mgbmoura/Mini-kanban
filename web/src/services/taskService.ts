import api from './api';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  tags?: string[];
  attachmentImage?: string;
  position: number;
  _count?: {
    comments: number;
  };
}

// REVERTIDO: De volta aos status corretos que o backend espera.
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

const getTasks = async (): Promise<Task[]> => {
  const response = await api.get('/tasks');
  return response.data;
};

const createTask = async (data: Partial<CreateTaskDTO>): Promise<Task> => {
  const response = await api.post('/tasks', data);
  return response.data;
};

const updateTask = async (id: string, data: Partial<CreateTaskDTO>): Promise<Task> => {
  const response = await api.patch(`/tasks/${id}`, data);
  return response.data;
};

const deleteTask = async (id: string): Promise<void> => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

const taskService = { getTasks, createTask, updateTask, deleteTask };

export default taskService;