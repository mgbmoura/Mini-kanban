import { KanbanBoard } from '@/components/kanban/Board';

export const metadata = {
  title: 'Mini-Kanban | Gestão Ágil',
  description: 'Seu quadro Kanban moderno com IA.',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="h-screen flex flex-col p-4 md:p-8">
        <KanbanBoard />
      </div>
    </main>
  );
}
