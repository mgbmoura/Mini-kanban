
import { KanbanBoard } from '../../components/KanbanBoard';
import { TaskModal } from '../../components/TaskModal';
import { useState, useEffect } from 'react';
import taskService, { Task, TaskStatus } from '../../services/taskService';
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
    setLoading(true);
    try {
      const userTasks = await taskService.getTasks();
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
      task.id === taskId
        ? { ...task, status: newStatus, position: newPosition }
        : task
    );
    
    setTasks(optimisticState);

    try {
      const updatedTaskFromApi = await taskService.updateTask(taskId, { status: newStatus, position: newPosition });
      
      setTasks(currentTasks => {
        const taskInState = currentTasks.find(t => t.id === taskId);
        return currentTasks.map(t => 
          t.id === taskId 
          ? { ...t, ...updatedTaskFromApi, commentCount: taskInState?.commentCount }
          : t
        );
      });
    } catch (error) {
      console.error('Erro ao mover task:', error);
      setTasks(originalTasks); 
      alert("Ocorreu um erro ao mover a tarefa. Tente novamente.");
    }
  };

  const handleMoveCard = async (dragIndex: number, hoverIndex: number, dragStatus: TaskStatus) => {
    const originalTasks = [...tasks];

    const tasksInColumn = tasks
      .filter(task => task.status === dragStatus)
      .sort((a, b) => a.position - b.position);
    
    const [draggedItem] = tasksInColumn.splice(dragIndex, 1);
    tasksInColumn.splice(hoverIndex, 0, draggedItem);

    const taskBefore = tasksInColumn[hoverIndex - 1];
    const taskAfter = tasksInColumn[hoverIndex + 1];

    let newPosition;
    if (!taskBefore && taskAfter) { newPosition = taskAfter.position / 2; } 
    else if (taskBefore && !taskAfter) { newPosition = taskBefore.position + 1; } 
    else if (taskBefore && taskAfter) { newPosition = (taskBefore.position + taskAfter.position) / 2; } 
    else { newPosition = 1; }
    
    const optimisticState = originalTasks.map(task => 
      task.id === draggedItem.id 
        ? { ...task, position: newPosition }
        : task
    );
    
    setTasks(optimisticState);

    try {
      const updatedTaskFromApi = await taskService.updateTask(draggedItem.id, { position: newPosition });

      setTasks(currentTasks => {
        const taskInState = currentTasks.find(t => t.id === draggedItem.id);
        return currentTasks.map(t => 
          t.id === draggedItem.id 
          ? { ...t, ...updatedTaskFromApi, commentCount: taskInState?.commentCount }
          : t
        );
      });
    } catch (error) {
      console.error('Erro ao reordenar a tarefa:', error);
      setTasks(originalTasks);
      alert("Ocorreu um erro ao reordenar a tarefa. Tente novamente.");
    }
  };

  // SOLUÇÃO: A função agora aceita a contagem de comentários vinda do modal
  const handleSaveTask = async (taskData: Partial<Task> & { commentCount?: number }) => {
    try {
      if (taskData.id) {
        const taskId = taskData.id;
        // Separa o commentCount do resto dos dados a serem enviados para a API
        const { commentCount, ...updatePayload } = taskData;
        const updatedTaskFromApi = await taskService.updateTask(taskId, updatePayload);

        // Atualiza o estado usando o commentCount que veio do modal, não da API
        setTasks(currentTasks =>
          currentTasks.map(t =>
            t.id === taskId
              ? { ...t, ...updatedTaskFromApi, commentCount: commentCount }
              : t
          )
        );

      } else {
        const tasksInStatus = tasks.filter(t => t.status === (taskData.status || newTaskStatus));
        const maxPosition = Math.max(0, ...tasksInStatus.map(t => t.position));
        taskData.position = maxPosition + 1;

        const newTask = await taskService.createTask({
            title: taskData.title!,
            description: taskData.description,
            status: taskData.status || newTaskStatus,
            priority: taskData.priority,
            tags: taskData.tags,
            attachmentImage: taskData.attachmentImage,
            position: taskData.position,
        });
        setTasks(currentTasks => [...currentTasks, newTask]);
      }
      setIsModalOpen(false);
      setSelectedTask(undefined);
    } catch (error) {
      console.error('Erro ao salvar task:', error);
      alert('Erro ao salvar tarefa. Verifique os dados e tente novamente.');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
      setIsModalOpen(false);
      setSelectedTask(undefined);
    } catch (error) {
      console.error('Erro ao deletar task:', error);
      alert('Erro ao deletar tarefa.');
    }
  };

  if (loading) {
    return <KanbanSkeleton />;
  }

  return (
    <>
      <KanbanBoard 
        tasks={[...tasks].sort((a,b) => a.position - b.position)} 
        onAddTask={handleAddTask}
        onTaskClick={handleTaskClick}
        onTaskMove={handleTaskMove}
        onMoveCard={handleMoveCard}
      />

      {/* SOLUÇÃO: A propriedade onCommentCountUpdate foi removida */}
      <TaskModal
        task={selectedTask}
        isOpen={isModalOpen}
        defaultStatus={newTaskStatus}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(undefined);
        }}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />
    </>
  );
}
