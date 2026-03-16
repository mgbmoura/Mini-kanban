
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

  const handleTaskMove = async (taskId: string, newStatus: TaskStatus) => {
    const originalTasks = tasks;
    const movedTask = tasks.find(t => t.id === taskId);
    if (!movedTask) return;

    // Atualização otimista da UI
    const optimisticTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(optimisticTasks);

    try {
        // Encontra a última tarefa na nova coluna para calcular a posição
        const tasksInNewColumn = optimisticTasks
            .filter(t => t.status === newStatus && t.id !== taskId)
            .sort((a, b) => a.position - b.position);
        const lastTask = tasksInNewColumn[tasksInNewColumn.length - 1];
        const newPosition = lastTask ? lastTask.position + 1 : 1;

        await taskService.updateTask(taskId, { status: newStatus, position: newPosition });

        // Recarrega as tarefas para garantir a consistência total, incluindo a nova posição
        loadTasks(); 
    } catch (error) {
      console.error('Erro ao mover task:', error);
      // Reverte em caso de erro
      setTasks(originalTasks); 
      alert("Ocorreu um erro ao mover a tarefa. Tente novamente.")
    }
  };

  const handleMoveCard = async (dragIndex: number, hoverIndex: number, dragStatus: TaskStatus) => {
    const originalTasks = tasks;
    
    // Lógica para reordenar a lista de tarefas para a UI (atualização otimista)
    const reorderedTasks = [...tasks];
    const tasksInColumn = reorderedTasks.filter(task => task.status === dragStatus).sort((a,b) => a.position - b.position);
    const otherTasks = reorderedTasks.filter(task => task.status !== dragStatus);
    
    const [draggedItem] = tasksInColumn.splice(dragIndex, 1);
    tasksInColumn.splice(hoverIndex, 0, draggedItem);

    const optimisticState = [...otherTasks, ...tasksInColumn].sort((a, b) => {
        if (a.status !== b.status) return 0; // Não reordena entre colunas
        return a.position - b.position;
    });

    setTasks(optimisticState);

    // Calcula a nova posição e atualiza no backend
    try {
        const taskBefore = tasksInColumn[hoverIndex - 1];
        const taskAfter = tasksInColumn[hoverIndex + 1];

        let newPosition;
        if (!taskBefore && taskAfter) { // Movido para o início da lista
            newPosition = taskAfter.position / 2;
        } else if (taskBefore && !taskAfter) { // Movido para o final da lista
            newPosition = taskBefore.position + 1;
        } else if (taskBefore && taskAfter) { // Movido entre duas tarefas
            newPosition = (taskBefore.position + taskAfter.position) / 2;
        } else { // Única tarefa na coluna
            newPosition = 1;
        }
        
        const updatedTask = await taskService.updateTask(draggedItem.id, { position: newPosition });

        // Atualiza o estado final com a posição retornada pela API para garantir consistência
        setTasks(currentTasks => 
            currentTasks.map(t => (t.id === updatedTask.id ? { ...t, ...updatedTask } : t))
        );

    } catch (error) {
        console.error('Erro ao reordenar a tarefa:', error);
        // Reverte a UI em caso de falha
        setTasks(originalTasks);
        alert("Ocorreu um erro ao reordenar a tarefa. Tente novamente.");
    }
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    try {
      if (taskData.id) {
        const updatedTask = await taskService.updateTask(taskData.id, taskData);
        setTasks(currentTasks => 
          currentTasks.map(t => (t.id === updatedTask.id ? { ...t, ...updatedTask } : t))
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

  const handleCommentCountUpdate = (taskId: string, count: number) => {
      setTasks(prevTasks => prevTasks.map(t => 
        t.id === taskId ? { ...t, commentCount: count } : t
      ));
  };

  if (loading) {
    return <KanbanSkeleton />;
  }

  return (
    <>
      <KanbanBoard 
        tasks={tasks.sort((a,b) => a.position - b.position)} // Garante que as tarefas são sempre passadas ordenadas
        onAddTask={handleAddTask}
        onTaskClick={handleTaskClick}
        onTaskMove={handleTaskMove}
        onMoveCard={handleMoveCard}
      />

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
        onCommentCountUpdate={handleCommentCountUpdate}
      />
    </>
  );
}
