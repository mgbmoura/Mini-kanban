"use client";

import { useState } from 'react';
import { useKanban } from '@/hooks/use-kanban';
import { COLUMNS, Task, Priority } from '@/lib/types';
import { TaskCard } from './TaskCard';
import { TaskDialog } from './TaskDialog';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, Kanban as KanbanIcon } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

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

  const handleSaveTask = (title: string, description: string, subtasks: string[], priority: Priority, tags: string[]) => {
    if (editingTask) {
      updateTask(editingTask.id, { 
        title, 
        description, 
        priority,
        tags,
        subtasks: subtasks.map(s => {
          const existing = editingTask.subtasks.find(est => est.title === s);
          return existing || { id: crypto.randomUUID(), title: s, completed: false };
        })
      });
    } else {
      addTask(title, description, subtasks, priority, tags);
    }
  };

  if (!isLoaded) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-sm font-medium text-muted-foreground">Carregando seu quadro...</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full gap-6">
      <header className="flex items-center justify-between px-2">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2 text-primary">
            <KanbanIcon className="w-8 h-8" />
            Mini Kanban
          </h1>
          <p className="text-sm text-muted-foreground font-medium">Gestão simplificada de tarefas.</p>
        </div>
        <Button onClick={handleAddNew} className="bg-primary hover:bg-primary/90 shadow-sm gap-2">
          <Plus className="w-4 h-4" /> Nova Tarefa
        </Button>
      </header>

      <ScrollArea className="w-full h-full pb-4">
        <div className="flex gap-6 min-h-[650px] min-w-max md:min-w-0">
          {COLUMNS.map(column => {
            const columnTasks = tasks.filter(t => t.columnId === column.id);
            return (
              <div 
                key={column.id} 
                className="flex flex-col w-[320px] bg-secondary/30 rounded-xl border border-secondary p-3 gap-4"
              >
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-primary/80 flex items-center gap-2">
                    {column.title}
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px]">
                      {columnTasks.length}
                    </span>
                  </h2>
                </div>

                <div className="flex flex-col gap-3 kanban-column-scroll overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
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
                    <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-muted rounded-xl bg-muted/5">
                      <LayoutGrid className="w-8 h-8 text-muted mb-2 opacity-40" />
                      <p className="text-xs text-muted-foreground text-center">Nenhuma tarefa aqui.</p>
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