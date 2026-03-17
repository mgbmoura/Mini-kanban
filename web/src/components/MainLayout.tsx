
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { User } from '../types/user';

interface MainLayoutProps {
  user: User;
  onLogout: () => void;
  onProfileUpdate: () => void;
}

export function MainLayout({ user, onLogout, onProfileUpdate }: MainLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={onLogout} // Corrigido: Passa a função de logout correta para a sidebar
        user={user}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Corrigido: O Header não precisa da função onLogout */}
        <Header onMenuClick={() => setSidebarOpen(true)} user={user} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
          {/* Passa a função onProfileUpdate através do contexto da Outlet */}
          <Outlet context={{ onProfileUpdate }} />
        </main>
      </div>
    </div>
  );
}
