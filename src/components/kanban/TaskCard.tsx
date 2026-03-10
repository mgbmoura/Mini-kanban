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
  Image as ImageIcon,
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
import Image from 'next/image';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onMove: (id: string, columnId: ColumnId) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export function TaskCard({ task, onDelete, onEdit, onMove, onToggleSubtask }: TaskCardProps) {
  const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const priorityStyles = {
    'Baixa': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Média': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Alta': 'bg-red-500/10 text-red-400 border-red-500/20'
  };

  const priorityBorder = {
    'Baixa': 'priority-low',
    'Média': 'priority-medium',
    'Alta': 'priority-high'
  };

  return (
    <Card className={cn(
      "group relative border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-card/60 backdrop-blur-sm overflow-hidden",
      priorityBorder[task.priority]
    )}>
      {task.attachmentImage && (
        <div className="relative w-full h-32 overflow-hidden border-b border-border/50">
          <Image 
            src={task.attachmentImage} 
            alt={task.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      
      <CardHeader className="p-4 pb-2 space-y-0 flex flex-row items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={cn("text-[10px] px-2 py-0.5 font-black uppercase tracking-tighter", priorityStyles[task.priority])}>
              {task.priority}
            </Badge>
            {task.tags?.map(tag => (
              <Badge key={tag} variant="secondary" className="text-[9px] px-1.5 py-0 h-4 bg-primary/10 text-primary border-none font-bold">
                {tag}
              </Badge>
            ))}
          </div>
          <CardTitle className="text-sm font-bold leading-tight group-hover:text-primary transition-colors">
            {task.title}
          </CardTitle>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-card border-border">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Edit3 className="mr-2 h-4 w-4" /> Editar
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
              <Trash2 className="mr-2 h-4 w-4" /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-4">
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 font-medium">
            {task.description}
          </p>
        )}

        {totalSubtasks > 0 && (
          <div className="space-y-2 pt-2 border-t border-border/30">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">
              <span>Progresso</span>
              <span>{completedSubtasks}/{totalSubtasks}</span>
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all duration-700 ease-in-out",
                  progress === 100 ? "bg-green-500" : "bg-primary"
                )}
                style={{ width: `${progress}%` }} 
              />
            </div>
            <div className="space-y-1.5 pt-1">
              {task.subtasks.slice(0, 3).map(st => (
                <div key={st.id} className="flex items-center gap-2">
                  <Checkbox 
                    id={st.id} 
                    checked={st.completed}
                    onCheckedChange={() => onToggleSubtask(task.id, st.id)}
                    className="w-3.5 h-3.5 border-primary/40 data-[state=checked]:bg-primary"
                  />
                  <label 
                    htmlFor={st.id}
                    className={cn(
                      "text-[10px] font-medium cursor-pointer transition-colors",
                      st.completed ? "text-muted-foreground/50 line-through" : "text-foreground/80"
                    )}
                  >
                    {st.title}
                  </label>
                </div>
              ))}
              {totalSubtasks > 3 && (
                <p className="text-[9px] text-muted-foreground text-center font-bold">
                  + {totalSubtasks - 3} mais subtarefas
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}