"use client";

import { Task, ColumnId, COLUMNS } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  MoreVertical, 
  Trash2, 
  Edit3, 
  ArrowRightLeft,
  Clock,
  Tag
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onMove: (id: string, columnId: ColumnId) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export function TaskCard({ task, onDelete, onEdit, onMove, onToggleSubtask }: TaskCardProps) {
  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  const totalSubtasks = task.subtasks.length;
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const priorityColors = {
    'Baixa': 'bg-green-100 text-green-700 border-green-200',
    'Média': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Alta': 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <Card className="group relative border-none shadow-sm hover:shadow-md transition-all duration-200 bg-card overflow-hidden task-card-enter">
      <div className={cn(
        "absolute top-0 left-0 w-1 h-full",
        task.columnId === 'done' ? "bg-accent" : "bg-primary/20"
      )} />
      
      <CardHeader className="p-4 pb-2 space-y-0 flex flex-row items-start justify-between">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 font-bold uppercase", priorityColors[task.priority])}>
              {task.priority}
            </Badge>
            {task.tags?.map(tag => (
              <Badge key={tag} variant="secondary" className="text-[9px] px-1 py-0 h-4 bg-muted/50 text-muted-foreground">
                #{tag}
              </Badge>
            ))}
          </div>
          <CardTitle className="text-sm font-semibold leading-tight group-hover:text-primary transition-colors">
            {task.title}
          </CardTitle>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Edit3 className="mr-2 h-4 w-4" /> Editar Tarefa
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Mover para</DropdownMenuLabel>
            {COLUMNS.filter(c => c.id !== task.columnId).map(col => (
              <DropdownMenuItem key={col.id} onClick={() => onMove(task.id, col.id)}>
                <ArrowRightLeft className="mr-2 h-4 w-4" /> {col.title}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(task.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Excluir Tarefa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-3">
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        {totalSubtasks > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-medium text-muted-foreground">
              <span>Subtarefas</span>
              <span>{completedSubtasks}/{totalSubtasks}</span>
            </div>
            <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all duration-500",
                  progress === 100 ? "bg-accent" : "bg-primary"
                )}
                style={{ width: `${progress}%` }} 
              />
            </div>
            <div className="space-y-1 pt-1">
              {task.subtasks.map(st => (
                <div key={st.id} className="flex items-center gap-2">
                  <Checkbox 
                    id={st.id} 
                    checked={st.completed}
                    onCheckedChange={() => onToggleSubtask(task.id, st.id)}
                    className="w-3 h-3"
                  />
                  <label 
                    htmlFor={st.id}
                    className={cn(
                      "text-[11px] cursor-pointer transition-colors",
                      st.completed ? "text-muted-foreground line-through" : "text-foreground"
                    )}
                  >
                    {st.title}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}