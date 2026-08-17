
import { KanbanBoard } from '../../components/KanbanBoard';
import { TaskModal } from '../../components/TaskModal';
import { useState, useEffect } from 'react';
import { taskApi, Task, TaskStatus } from '../../api/task-api';
import { KanbanSkeleton } from '../../components/KanbanSkeleton';

function getPosition(tasks: Task[], destinationIndex: number) {
  const previous = tasks[destinationIndex - 1];
  const next = tasks[destinationIndex];

  if (!previous && next) return next.position / 2;
  if (previous && !next) return previous.position + 1;
  if (previous && next) return (previous.position + next.position) / 2;
  return 1;
}

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
    try {
      const userTasks = await taskApi.getTasks();
      setTasks(userTasks);
    } catch (error) {
      console.error('Erro ao carregar tasks:', error);
    } finally {
      setLoading(false);
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
    const movedTask = tasks.find(task => task.id === taskId);
    if (!movedTask) return;

    const destinationTasks = originalTasks
      .filter(task => task.status === newStatus && task.id !== taskId)
      .sort((a, b) => a.position - b.position);
    const newPosition = getPosition(destinationTasks, destinationIndex);

    setTasks(originalTasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus, position: newPosition } : task
    ));

    try {
      await taskApi.updateTask(taskId, { status: newStatus, position: newPosition });
    } catch (error) {
      setTasks(originalTasks);
      alert('Ocorreu um erro ao mover a tarefa.');
    }
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    try {
      const { id, ...data } = taskData;

      if (id) {
        await taskApi.updateTask(id, data);
      } else {
        const status = data.status ?? newTaskStatus;
        const tasksInStatus = tasks.filter(task => task.status === status);
        const maxPosition = Math.max(0, ...tasksInStatus.map(task => task.position));

        await taskApi.createTask({
          title: data.title ?? '',
          description: data.description,
          status,
          priority: data.priority,
          tags: data.tags,
          attachmentImage: data.attachmentImage,
          position: maxPosition + 1,
        });
      }

      setIsModalOpen(false);
      await loadTasks();
    } catch (error) {
      alert('Erro ao salvar tarefa.');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskApi.deleteTask(taskId);
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
        tasks={[...tasks].sort((a, b) => a.position - b.position)}
        onAddTask={handleAddTask}
        onTaskClick={handleTaskClick}
        onTaskMove={handleTaskMove}
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
