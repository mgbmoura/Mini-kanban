export type ColumnId = 'todo' | 'doing' | 'done';
export type Priority = 'Baixa' | 'Média' | 'Alta';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  columnId: ColumnId;
  priority: Priority;
  tags: string[];
  attachmentImage?: string;
  createdAt: number;
  subtasks: SubTask[];
  userId?: string;
}

export interface Column {
  id: ColumnId;
  title: string;
}

export const COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'doing', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];