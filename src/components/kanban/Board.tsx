"use client";

import { useState } from 'react';
import { useKanban } from '@/hooks/use-kanban';
import { COLUMNS, Task, Priority, ColumnId } from '@/lib/types';
import { TaskCard } from './TaskCard';
import { TaskDialog } from './TaskDialog';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, Kanban as KanbanIcon, LogOut, User } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function KanbanBoard() {
  const { 
    tasks, 
    isLoaded, 
    addTask, 
    updateTask, 
    deleteTask, 
    moveTask, 
    toggleSubtask 
  } = useKanban();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const handleSaveTask = (title: string, description: string, subtasks: string[], priority: Priority, tags: string[], attachmentImage?: string) => {
    if (editingTask) {
      updateTask(editingTask.id, { 
        title, 
        description, 
        priority,
        tags,
        attachmentImage,
        subtasks: subtasks.map(s => {
          const existing = editingTask.subtasks.find(est => est.title === s);
          return existing || { id: crypto.randomUUID(), title: s, completed: false };
        })
      });
    } else {
      addTask(title, description, subtasks, priority, tags, attachmentImage);
    }
  };

  if (!isLoaded) return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-sm font-medium text-muted-foreground">Iniciando Mini-Kanban...</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full gap-6">
      <header className="flex items-center justify-between py-4 border-b border-border/50 bg-card/30 px-6 -mx-8 md:-mx-12 lg:-mx-16 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <KanbanIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Mini-Kanban
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Workspace Principal</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={handleAddNew} className="bg-primary hover:bg-primary/90 shadow-md gap-2 h-9 px-4">
            <Plus className="w-4 h-4" /> Nova Tarefa
          </Button>
          <div className="h-8 w-px bg-border mx-2" />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold">Usuário Demo</p>
              <p className="text-[10px] text-muted-foreground">demo@kanban.com</p>
            </div>
            <Avatar className="h-9 w-9 border-2 border-primary/20">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback><User /></AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <ScrollArea className="w-full h-full">
        <div className="flex gap-6 pb-6 min-w-max">
          {COLUMNS.map(column => {
            const columnTasks = tasks.filter(t => t.columnId === column.id);
            return (
              <div 
                key={column.id} 
                className="flex flex-col w-[350px] bg-secondary/20 rounded-2xl border border-border/40 p-4 gap-4"
              >
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <span className={column.id === 'done' ? "text-green-500" : "text-primary"}>●</span>
                    {column.title}
                    <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-md text-[10px] font-bold">
                      {columnTasks.length}
                    </span>
                  </h2>
                </div>

                <div className="flex flex-col gap-4 kanban-column-scroll overflow-y-auto max-h-[calc(100vh-250px)] pr-2">
                  {columnTasks.map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      onDelete={deleteTask}
                      onEdit={handleEditTask}
                      onMove={moveTask}
                      onToggleSubtask={toggleSubtask}
                    />
                  ))}
                  {columnTasks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 px-4 border-2 border-dashed border-border/40 rounded-2xl bg-muted/5 opacity-50">
                      <LayoutGrid className="w-10 h-10 text-muted mb-3" />
                      <p className="text-xs text-muted-foreground text-center font-medium">Nenhuma tarefa pendente</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <TaskDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        task={editingTask}
        onSave={handleSaveTask}
      />
    </div>
  );
}