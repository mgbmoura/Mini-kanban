
import { Draggable } from "react-beautiful-dnd";
import { Task } from "../services/taskService";
import { Paperclip, MessageSquare } from "lucide-react";

interface KanbanCardProps {
  task: Task;
  index: number;
  onClick: (task: Task) => void;
}

export function KanbanCard({ task, index, onClick }: KanbanCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(task)}
          className={`p-4 mb-3 rounded-lg shadow-sm cursor-pointer transition-colors ${
            snapshot.isDragging
              ? 'bg-emerald-50 dark:bg-emerald-900/60'
              : 'bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700'
          }`}
        >
          {task.attachmentImage && (
            <img
              src={task.attachmentImage}
              alt={task.title}
              className="w-full h-32 object-cover rounded-md mb-3"
            />
          )}

          <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 mb-2">
            {task.title}
          </h4>

          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {task.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              {task.attachmentImage && <Paperclip className="w-4 h-4" />}
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                {/* Corrigido para usar a nova propriedade commentCount */}
                <span>{task.commentCount || 0}</span>
              </div>
            </div>

            <div
              className={`px-2 py-1 rounded-full text-white text-xs font-medium ${{
                'Alta': 'bg-red-500',
                'Média': 'bg-yellow-500',
                'Baixa': 'bg-green-500'
              }[task.priority || 'Média']}`}>
              {task.priority}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
