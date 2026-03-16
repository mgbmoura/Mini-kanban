
import { Droppable } from "react-beautiful-dnd";
import { Task, TaskStatus } from "../services/taskService";
import { KanbanCard } from "./KanbanCard";
import { Plus } from "lucide-react";

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
  onTaskClick: (task: Task) => void;
}

const statusLabels: { [key in TaskStatus]: string } = {
  TODO: "A Fazer",
  DOING: "Em Andamento",
  DONE: "Concluído",
};

export function KanbanColumn({ status, tasks, onAddTask, onTaskClick }: KanbanColumnProps) {
  return (
    <div className="flex flex-col w-full sm:w-1/3 bg-slate-100 dark:bg-slate-900/50 rounded-lg p-4">
      <h3 className="font-bold text-lg text-slate-700 dark:text-slate-300 mb-4 pb-2 border-b-2 border-slate-200 dark:border-slate-700">
        {statusLabels[status]} ({tasks.length})
      </h3>
      
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto -mr-2 pr-2 transition-colors ${snapshot.isDraggingOver ? 'bg-emerald-50/50 dark:bg-emerald-900/20' : ''}`}
          >
            {tasks.map((task, index) => (
              <KanbanCard 
                key={task.id} 
                task={task} 
                index={index} 
                onClick={onTaskClick} 
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <button 
        onClick={() => onAddTask(status)}
        className="mt-4 w-full flex items-center justify-center gap-2 p-2.5 rounded-lg text-sm font-semibold text-emerald-600 hover:bg-emerald-100 dark:text-emerald-400 dark:hover:bg-emerald-900/50 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Adicionar cartão
      </button>
    </div>
  );
}
