import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DndProvider } from 'react-dnd';
import { TestBackend } from 'react-dnd-test-backend';
import { BoardPage } from './BoardPage';
import taskService, { Task } from '../../services/taskService';
import { authService } from '../../services/authService';

// Mocks for the services
vi.mock('../../services/taskService');
vi.mock('../../services/authService');

describe('BoardPage', () => {
  const mockUser = { id: 'user-1', name: 'Test User', email: 'user@test.com' };
  let initialTasks: Task[];

  // Setup before each test
  beforeEach(() => {
    initialTasks = [
      { id: '1', title: 'Tarefa Teste', status: 'TODO', priority: 'Alta', description: 'Descrição inicial' },
    ];
    vi.clearAllMocks();
    window.confirm = vi.fn(() => true);
    vi.mocked(authService.getUser).mockReturnValue(mockUser);
    vi.mocked(taskService.getTasks).mockResolvedValue([...initialTasks]);

    vi.mocked(taskService.createTask).mockImplementation(async (data) => {
      const created = { id: String(Date.now()), ...data } as Task;
      initialTasks.push(created);
      vi.mocked(taskService.getTasks).mockResolvedValue([...initialTasks]);
      return created;
    });

    vi.mocked(taskService.updateTask).mockImplementation(async (taskId, data) => {
      const taskIndex = initialTasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return initialTasks[0];
      const updatedTask = { ...initialTasks[taskIndex], ...data } as Task;
      initialTasks[taskIndex] = updatedTask;
      vi.mocked(taskService.getTasks).mockResolvedValue([...initialTasks]);
      return updatedTask;
    });

    vi.mocked(taskService.deleteTask).mockImplementation(async (taskId) => {
      initialTasks = initialTasks.filter(t => t.id !== taskId);
      vi.mocked(taskService.getTasks).mockResolvedValue([...initialTasks]);
    });
  });

  it('deve abrir o modal, criar uma nova tarefa e exibi-la na coluna correta', async () => {
    render(
      <DndProvider backend={TestBackend}>
        <BoardPage />
      </DndProvider>
    );
    await screen.findByText('Tarefa Teste');
    const todoColumn = await screen.findByTestId('kanban-column-TODO');
    const addButton = todoColumn.querySelector('button[class*="border-dashed"]');
    fireEvent.click(addButton!);
    
    await screen.findByText('Nova Tarefa');
    fireEvent.change(screen.getByPlaceholderText('Digite o título da tarefa'), { target: { value: 'Nova Tarefa Criada' } });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Criar' }));
    });
    
    await waitFor(() => expect(taskService.createTask).toHaveBeenCalledWith(expect.objectContaining({ title: 'Nova Tarefa Criada' })));
    expect(await screen.findByText('Nova Tarefa Criada')).toBeInTheDocument();
  });

  it('deve abrir o modal de edição, atualizar a tarefa e exibir os dados atualizados', async () => {
    render(
      <DndProvider backend={TestBackend}>
        <BoardPage />
      </DndProvider>
    );
    fireEvent.click(await screen.findByText('Tarefa Teste'));
    
    await screen.findByText('Editar Tarefa');
    fireEvent.change(screen.getByDisplayValue('Tarefa Teste'), { target: { value: 'Tarefa Atualizada' } });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));
    });
    
    await waitFor(() => expect(taskService.updateTask).toHaveBeenCalledWith('1', expect.objectContaining({ title: 'Tarefa Atualizada' })));
    expect(await screen.findByText('Tarefa Atualizada')).toBeInTheDocument();
  });

  it('deve deletar uma tarefa existente e removê-la da tela', async () => {
    render(
      <DndProvider backend={TestBackend}>
        <BoardPage />
      </DndProvider>
    );
    fireEvent.click(await screen.findByText('Tarefa Teste'));
    
    await screen.findByText('Editar Tarefa');
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /excluir/i }));
    });
    
    expect(window.confirm).toHaveBeenCalledWith('Tem certeza que deseja excluir esta tarefa?');
    await waitFor(() => expect(taskService.deleteTask).toHaveBeenCalledWith('1'));
    expect(screen.queryByText('Tarefa Teste')).not.toBeInTheDocument();
  });
});