import { KanbanBoard } from '@/components/kanban/Board';

export default function Home() {
  return (
    <main className="min-h-screen bg-background overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 h-screen flex flex-col">
        <KanbanBoard />
      </div>
    </main>
  );
}