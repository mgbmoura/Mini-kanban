'use client';

import { useKanban, Status } from '@/hooks/use-kanban';
import { Column } from './Column';
import { Header } from '@/components/Header';
import { Loader2 } from 'lucide-react';

const COLUMNS: { id: Status; title: string }[] = [
  { id: 'TODO', title: 'A Fazer' },
  { id: 'DOING', title: 'Em Progresso' },
  { id: 'DONE', title: 'Concluído' },
];

export function KanbanBoard() {
  const { tasks, loading, addTask, updateTask, deleteTask } = useKanban();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-6">
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            id={col.id}
            title={col.title}
            tasks={tasks.filter((t) => t.status === col.id)}
            onAddTask={(task) => addTask({ ...task, status: col.id })}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        ))}
      </div>
    </div>
  );
}