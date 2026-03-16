import { useState, useEffect, useCallback, useMemo } from 'react';
import { authService } from '../services/authService';
import { User } from '../types/user';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/MainLayout';
import LoginPage from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { BoardPage } from './pages/BoardPage';
import { SettingsPage } from './pages/SettingsPage';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Toaster } from '../components/ui/sonner';
import { LoginSkeleton } from '../components/LoginSkeleton';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(() => {
    const loggedInUser = authService.getUser();
    setUser(loggedInUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleLogin = useCallback(() => {
    loadUser();
  }, [loadUser]);

  const handleLogout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const handleProfileUpdate = useCallback(() => {
    const updatedUser = authService.getUser();
    setUser(updatedUser);
  }, []);

  const router = useMemo(() => {
    if (loading) return createBrowserRouter([{ path: '*', element: <LoginSkeleton /> }]);

    return createBrowserRouter([
      {
        path: '/',
        element: <Navigate to={user ? "/app" : "/login"} replace />,
      },
      {
        path: '/login',
        element: !user ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/app" replace />,
      },
      {
        path: '/register',
        element: !user ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/app" replace />,
      },
      {
        path: '/app',
        element: user ? <MainLayout user={user} onLogout={handleLogout} onProfileUpdate={handleProfileUpdate} /> : <Navigate to="/login" replace />,
        children: [
          { index: true, element: <BoardPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ]
      },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
      { path: '*', element: <Navigate to="/" replace /> }
    ]);
  }, [user, loading, handleLogin, handleLogout, handleProfileUpdate]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster richColors position="top-right" />
      <RouterProvider router={router} />
    </DndProvider>
  );
}
