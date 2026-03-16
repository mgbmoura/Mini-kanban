
import { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { authService } from '../services/authService';
import { User } from '../types/user';
import { Toaster } from './ui/sonner';

export function MainLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const handleProfileUpdate = useCallback(() => {
    const updatedUser = authService.getUser();
    setUser(updatedUser);
  }, []);

  useEffect(() => {
    handleProfileUpdate(); 
  }, [handleProfileUpdate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!user) {
    return null; 
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        user={user}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} user={user} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
          <Outlet context={{ onProfileUpdate: handleProfileUpdate }} />
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
