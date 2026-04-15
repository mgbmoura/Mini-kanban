import { KanbanBoard } from '../../components/KanbanBoard';
import { TaskModal } from '../../components/TaskModal';
import { useState, useEffect } from 'react';
import taskService, { Task, TaskStatus } from '../../services/taskService';
import { KanbanSkeleton } from '../../components/KanbanSkeleton';

/**
 * BoardPage: Página principal do Quadro Kanban.
 * Gerencia o estado das tarefas, a lógica de movimentação entre colunas 
 * e a integração com o backend via taskService.
 */
export function BoardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>('TODO');
  const [loading, setLoading] = useState(true);

  // Carrega as tarefas assim que o componente é montado.
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

  /**
   * handleTaskMove: Lógica de arrastar uma tarefa entre colunas.
   * Implementamos uma lógica de posição numérica dinâmica para evitar reordenar todo o banco.
   * Calculamos a média da posição entre a tarefa de cima e a de baixo.
   */
  const handleTaskMove = async (taskId: string, newStatus: TaskStatus, destinationIndex: number) => {
    const originalTasks = [...tasks];
    const movedTask = tasks.find(t => t.id === taskId);
    if (!movedTask) return;

    // Filtra tarefas da coluna de destino e ordena para achar os vizinhos.
    const tasksInNewColumn = originalTasks
        .filter(t => t.status === newStatus)
        .sort((a, b) => a.position - b.position);

    const taskBefore = tasksInNewColumn[destinationIndex - 1];
    const taskAfter = tasksInNewColumn[destinationIndex];

    // Cálculo da Nova Posição:
    let newPosition;
    if (!taskBefore && taskAfter) { newPosition = taskAfter.position / 2; } 
    else if (taskBefore && !taskAfter) { newPosition = taskBefore.position + 1; } 
    else if (taskBefore && taskAfter) { newPosition = (taskBefore.position + taskAfter.position) / 2; }
    else { newPosition = 1; }

    // Atualização OTIMISTA: Atualizamos a UI antes da resposta do servidor para maior fluidez.
    const optimisticState = originalTasks.map(task =>
      task.id === taskId
        ? { ...task, status: newStatus, position: newPosition }
        : task
    );
    
    setTasks(optimisticState);

    try {
      // Envia a mudança para o backend em segundo plano.
      const updatedTaskFromApi = await taskService.updateTask(taskId, { status: newStatus, position: newPosition });
      
      // Sincroniza o estado final com os dados reais do servidor.
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
      // ROLLBACK: Em caso de erro, voltamos as tarefas para o estado original.
      setTasks(originalTasks); 
      alert("Ocorreu um erro ao mover a tarefa. Tente novamente.");
    }
  };

  /**
   * handleMoveCard: Lógica de reordenação dentro da MESMA coluna.
   * Segue a mesma lógica de cálculo de posição por média.
   */
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

  /**
   * handleSaveTask: Salva uma tarefa nova ou editada.
   */
  const handleSaveTask = async (taskData: Partial<Task> & { commentCount?: number }) => {
    try {
      if (taskData.id) {
        const taskId = taskData.id;
        const { commentCount, ...updatePayload } = taskData;
        const updatedTaskFromApi = await taskService.updateTask(taskId, updatePayload);

        setTasks(currentTasks =>
          currentTasks.map(t =>
            t.id === taskId
              ? { ...t, ...updatedTaskFromApi, commentCount: commentCount }
              : t
          )
        );

      } else {
        // Para novas tarefas, colocamos elas sempre no final da lista.
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
