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
  createdAt: string; // Adicionado para corresponder aos dados da API
  updatedAt: string; // Adicionado para corresponder aos dados da API
  commentCount?: number; // Campo para a contagem de comentários
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

const getTasks = async (): Promise<Task[]> => {
  const response = await api.get('/tasks');
  // Mapeia a resposta para mover _count.comments para commentCount
  return response.data.map((task: any) => ({
    ...task,
    commentCount: task._count?.comments || 0,
  }));
};

const createTask = async (data: Partial<CreateTaskDTO>): Promise<Task> => {
  const response = await api.post('/tasks', data);
  return {
    ...response.data,
    commentCount: response.data._count?.comments || 0,
  };
};

const updateTask = async (id: string, data: Partial<CreateTaskDTO>): Promise<Task> => {
  const response = await api.patch(`/tasks/${id}`, data);
  return {
    ...response.data,
    commentCount: response.data._count?.comments || 0,
  };
};

const deleteTask = async (id: string): Promise<void> => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

const taskService = { getTasks, createTask, updateTask, deleteTask };

export default taskService;