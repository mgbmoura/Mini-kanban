
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Task, TaskStatus } from "../services/taskService";
import { KanbanColumn } from "./KanbanColumn";

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
  onTaskMove: (taskId: string, newStatus: TaskStatus, destinationIndex: number) => void;
  onMoveCard: (dragIndex: number, hoverIndex: number, dragStatus: TaskStatus) => void;
}

export function KanbanBoard({ tasks, onTaskClick, onAddTask, onTaskMove, onMoveCard }: KanbanBoardProps) {

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    const sourceStatus = source.droppableId as TaskStatus;
    const destinationStatus = destination.droppableId as TaskStatus;

    // Se o card foi movido para uma coluna diferente
    if (sourceStatus !== destinationStatus) {
      onTaskMove(draggableId, destinationStatus, destination.index);
    } else { // Se o card foi reordenado na mesma coluna
        // Se foi solto no mesmo lugar, não faz nada
        if (source.index === destination.index) {
            return;
        }
        onMoveCard(source.index, destination.index, sourceStatus);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col sm:flex-row gap-6 h-full">
          <KanbanColumn 
            status="TODO" 
            tasks={tasks.filter(t => t.status === 'TODO')} 
            onAddTask={onAddTask}
            onTaskClick={onTaskClick}
          />
          <KanbanColumn 
            status="DOING" 
            tasks={tasks.filter(t => t.status === 'DOING')} 
            onAddTask={onAddTask}
            onTaskClick={onTaskClick}
          />
          <KanbanColumn 
            status="DONE" 
            tasks={tasks.filter(t => t.status === 'DONE')} 
            onAddTask={onAddTask}
            onTaskClick={onTaskClick}
          />
        </div>
      </div>
    </DragDropContext>
  );
}
