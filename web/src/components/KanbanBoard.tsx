
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Task, TaskStatus } from "../api/task-api";
import { KanbanColumn } from "./KanbanColumn";

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
  onTaskMove: (taskId: string, newStatus: TaskStatus, destinationIndex: number) => void;
}

export function KanbanBoard({ tasks, onTaskClick, onAddTask, onTaskMove }: KanbanBoardProps) {
  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    const sourceStatus = source.droppableId as TaskStatus;
    const destinationStatus = destination.droppableId as TaskStatus;

    if (sourceStatus === destinationStatus && source.index === destination.index) return;
    onTaskMove(draggableId, destinationStatus, destination.index);
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
