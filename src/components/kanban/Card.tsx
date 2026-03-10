'use client';

import { Task } from '@/hooks/use-kanban';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Tag, Image as ImageIcon, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { TaskModal } from './TaskModal';

interface KanbanCardProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export function KanbanCard({ task, onUpdate, onDelete }: KanbanCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const priorityClass = {
    'Alta': 'priority-alta',
    'Média': 'priority-media',
    'Baixa': 'priority-baixa',
  }[task.priority];

  return (
    <>
      <Card className={`bg-card/50 border-border hover:border-primary/50 transition-colors group cursor-pointer ${priorityClass}`}>
        <CardContent className="p-4 space-y-3">
          {task.attachmentImage && (
            <div className="relative aspect-video rounded-md overflow-hidden bg-muted">
              <img 
                src={task.attachmentImage} 
                alt={task.title}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-sm leading-tight">{task.title}</h3>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setIsEditOpen(true)}>
                <Edit className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => onDelete(task.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
          )}

          <div className="flex flex-wrap gap-1.5">
            {task.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] py-0 px-1.5 h-4 bg-primary/10 text-primary border-none">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{task.createdAt?.toDate().toLocaleDateString('pt-BR')}</span>
            </div>
            <Badge variant="outline" className="text-[10px] h-4">
              {task.priority}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <TaskModal 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen} 
        onSave={(updates) => onUpdate(task.id, updates)}
        task={task}
      />
    </>
  );
}