import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { taskApi, Task, TaskStatus } from '../../api/task-api';
import { BoardPage } from './BoardPage';

interface KanbanBoardMockProps {
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
  onTaskClick: (task: Task) => void;
  onTaskMove: (taskId: string, status: TaskStatus, index: number) => void;
}

interface TaskModalMockProps {
  task?: Task;
  isOpen: boolean;
  onSave: (task: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
}

vi.mock('../../api/task-api', () => ({
  taskApi: {
    getTasks: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
  },
}));

vi.mock('../../components/KanbanBoard', () => ({
  KanbanBoard: ({ tasks, onAddTask, onTaskClick, onTaskMove }: KanbanBoardMockProps) => (
    <div>
      <button onClick={() => onAddTask('TODO')}>Adicionar tarefa</button>
      <button onClick={() => onTaskMove(tasks[0].id, 'DOING', 0)}>Mover tarefa</button>
      {tasks.map((task: Task) => (
        <button key={task.id} onClick={() => onTaskClick(task)}>
          {task.title}-{task.status}
        </button>
      ))}
    </div>
  ),
}));

vi.mock('../../components/TaskModal', () => ({
  TaskModal: ({ task, isOpen, onSave, onDelete }: TaskModalMockProps) => {
    if (!isOpen) return null;

    return (
      <div data-testid="task-modal">
        <button onClick={() => onSave({ id: task?.id, title: task ? 'Tarefa Atualizada' : 'Nova Tarefa', status: task?.status ?? 'TODO' })}>
          Salvar tarefa
        </button>
        {task && <button onClick={() => onDelete(task.id)}>Excluir tarefa</button>}
      </div>
    );
  },
}));

describe('BoardPage', () => {
  let storedTasks: Task[];

  beforeEach(() => {
    storedTasks = [{
      id: 'task-1',
      title: 'Tarefa Teste',
      description: 'Descrição inicial',
      status: 'TODO',
      priority: 'Alta',
      position: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }];

    vi.clearAllMocks();
    vi.mocked(taskApi.getTasks).mockImplementation(async () => [...storedTasks]);
    vi.mocked(taskApi.createTask).mockImplementation(async data => {
      const created: Task = {
        ...data,
        id: 'task-2',
        position: data.position ?? 1,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      };
      storedTasks.push(created);
      return created;
    });
    vi.mocked(taskApi.updateTask).mockImplementation(async (id, data) => {
      const index = storedTasks.findIndex(task => task.id === id);
      storedTasks[index] = { ...storedTasks[index], ...data };
      return storedTasks[index];
    });
    vi.mocked(taskApi.deleteTask).mockImplementation(async id => {
      storedTasks = storedTasks.filter(task => task.id !== id);
    });
  });

  it('carrega as tarefas do usuário', async () => {
    render(<BoardPage />);

    expect(await screen.findByText('Tarefa Teste-TODO')).toBeInTheDocument();
    expect(taskApi.getTasks).toHaveBeenCalledOnce();
  });

  it('cria uma tarefa e recarrega o quadro', async () => {
    render(<BoardPage />);
    await screen.findByText('Tarefa Teste-TODO');

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar tarefa' }));
    fireEvent.click(screen.getByRole('button', { name: 'Salvar tarefa' }));

    await waitFor(() => expect(taskApi.createTask).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Nova Tarefa',
      status: 'TODO',
      position: 2,
    })));
    expect(await screen.findByText('Nova Tarefa-TODO')).toBeInTheDocument();
  });

  it('atualiza e exclui uma tarefa', async () => {
    render(<BoardPage />);
    fireEvent.click(await screen.findByText('Tarefa Teste-TODO'));
    fireEvent.click(screen.getByRole('button', { name: 'Salvar tarefa' }));

    await waitFor(() => expect(taskApi.updateTask).toHaveBeenCalledWith(
      'task-1',
      expect.objectContaining({ title: 'Tarefa Atualizada' })
    ));
    fireEvent.click(await screen.findByText('Tarefa Atualizada-TODO'));
    fireEvent.click(screen.getByRole('button', { name: 'Excluir tarefa' }));

    await waitFor(() => expect(taskApi.deleteTask).toHaveBeenCalledWith('task-1'));
    await waitFor(() => expect(screen.queryByText('Tarefa Atualizada-TODO')).not.toBeInTheDocument());
  });

  it('move uma tarefa usando atualização otimista', async () => {
    render(<BoardPage />);
    await screen.findByText('Tarefa Teste-TODO');

    fireEvent.click(screen.getByRole('button', { name: 'Mover tarefa' }));

    expect(await screen.findByText('Tarefa Teste-DOING')).toBeInTheDocument();
    expect(taskApi.updateTask).toHaveBeenCalledWith('task-1', { status: 'DOING', position: 1 });
  });
});
