export type ColumnId = 'todo' | 'in-progress' | 'done';
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
}

export interface Column {
  id: ColumnId;
  title: string;
}

export const COLUMNS: Column[] = [
  { id: 'todo', title: 'A Fazer' },
  { id: 'in-progress', title: 'Em Andamento' },
  { id: 'done', title: 'Concluído' },
];