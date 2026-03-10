import { KanbanBoard } from '@/components/kanban/Board';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 h-screen flex flex-col">
        <KanbanBoard />
      </div>
    </main>
  );
}