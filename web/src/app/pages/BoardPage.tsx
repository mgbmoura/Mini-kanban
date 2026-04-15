
import { KanbanBoard } from '../../components/KanbanBoard';
import { TaskModal } from '../../components/TaskModal';
import { useState, useEffect } from 'react';
import { taskApi, Task, TaskStatus } from '../../api/task-api';
import { KanbanSkeleton } from '../../components/KanbanSkeleton';

export function BoardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>('TODO');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    // Não precisa de setLoading(true) aqui para evitar piscar a tela em reloads
    try {
      const userTasks = await taskApi.getTasks();
      setTasks(userTasks);
    } catch (error) {
      console.error('Erro ao carregar tasks:', error);
    } finally {
      if (loading) setLoading(false); // Só desativa o skeleton inicial uma vez
    }
  };

  const handleAddTask = (status: TaskStatus) => {
    setNewTaskStatus(status);
    setSelectedTask(undefined);
    setIsModalOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleTaskMove = async (taskId: string, newStatus: TaskStatus, destinationIndex: number) => {
    const originalTasks = [...tasks];
    const movedTask = tasks.find(t => t.id === taskId);
    if (!movedTask) return;

    const tasksInNewColumn = originalTasks
        .filter(t => t.status === newStatus)
        .sort((a, b) => a.position - b.position);

    const taskBefore = tasksInNewColumn[destinationIndex - 1];
    const taskAfter = tasksInNewColumn[destinationIndex];

    let newPosition;
    if (!taskBefore && taskAfter) { newPosition = taskAfter.position / 2; } 
    else if (taskBefore && !taskAfter) { newPosition = taskBefore.position + 1; } 
    else if (taskBefore && taskAfter) { newPosition = (taskBefore.position + taskAfter.position) / 2; }
    else { newPosition = 1; }

    const optimisticState = originalTasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus, position: newPosition } : task
    );
    setTasks(optimisticState);

    try {
      await taskApi.updateTask(taskId, { status: newStatus, position: newPosition });
      // Não precisa recarregar aqui, a atualização otimista já foi suficiente
    } catch (error) {
      setTasks(originalTasks);
      alert("Ocorreu um erro ao mover a tarefa.");
    }
  };

  const handleMoveCard = async (dragIndex: number, hoverIndex: number, dragStatus: TaskStatus) => {
    const originalTasks = [...tasks];
    const tasksInColumn = tasks.filter(task => task.status === dragStatus).sort((a, b) => a.position - b.position);
    const [draggedItem] = tasksInColumn.splice(dragIndex, 1);
    tasksInColumn.splice(hoverIndex, 0, draggedItem);

    const taskBefore = tasksInColumn[hoverIndex - 1];
    const taskAfter = tasksInColumn[hoverIndex + 1];

    let newPosition;
    if (!taskBefore && taskAfter) { newPosition = taskAfter.position / 2; } 
    else if (taskBefore && !taskAfter) { newPosition = taskBefore.position + 1; } 
    else if (taskBefore && taskAfter) { newPosition = (taskBefore.position + taskAfter.position) / 2; } 
    else { newPosition = 1; }
    
    setTasks(originalTasks.map(t => t.id === draggedItem.id ? { ...t, position: newPosition } : t));

    try {
      await taskApi.updateTask(draggedItem.id, { position: newPosition });
    } catch (error) {
      setTasks(originalTasks);
    }
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    try {
      if (taskData.id) {
        await taskApi.updateTask(taskData.id, taskData);
      } else {
        const tasksInStatus = tasks.filter(t => t.status === (taskData.status || newTaskStatus));
        const maxPosition = Math.max(0, ...tasksInStatus.map(t => t.position));
        await taskApi.createTask({ ...taskData, position: maxPosition + 1 });
      }
      // Após salvar, fecha o modal e recarrega TODAS as tarefas para garantir consistência
      setIsModalOpen(false);
      await loadTasks();
    } catch (error) {
      alert('Erro ao salvar tarefa.');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskApi.deleteTask(taskId);
       // Após deletar, fecha o modal e recarrega TODAS as tarefas
      setIsModalOpen(false);
      await loadTasks();
    } catch (error) {
      alert('Erro ao deletar tarefa.');
    }
  };

  if (loading) return <KanbanSkeleton />;

  return (
    <>
      <KanbanBoard 
        tasks={[...tasks].sort((a,b) => a.position - b.position)} 
        onAddTask={handleAddTask}
        onTaskClick={handleTaskClick}
        onTaskMove={handleTaskMove}
        onMoveCard={handleMoveCard}
      />
      <TaskModal
        task={selectedTask}
        isOpen={isModalOpen}
        defaultStatus={newTaskStatus}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />
    </>
  );
}
