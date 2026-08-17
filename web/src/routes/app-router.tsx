
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { User } from '../types/user';
import { MainLayout } from '../components/MainLayout';
import LoginPage from '../app/pages/LoginPage';
import { ForgotPasswordPage } from '../app/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../app/pages/ResetPasswordPage';
import { BoardPage } from '../app/pages/BoardPage';
import { SettingsPage } from '../app/pages/SettingsPage';
import { LoginSkeleton } from '../components/LoginSkeleton';

export function createAppRouter(
  user: User | null, 
  loading: boolean, 
  onLogin: () => void, 
  onLogout: () => void, 
  onProfileUpdate: () => void
) {
  if (loading) {
    return createBrowserRouter([{ path: '*', element: <LoginSkeleton /> }]);
  }

  return createBrowserRouter([
    {
      path: '/',
      element: <Navigate to={user ? "/app" : "/login"} replace />,
    },
    {
      path: '/login',
      element: !user ? <LoginPage onLogin={onLogin} /> : <Navigate to="/app" replace />,
    },
    {
      path: '/register',
      element: !user ? <LoginPage onLogin={onLogin} /> : <Navigate to="/app" replace />,
    },
    {
      path: '/app',
      element: user ? <MainLayout user={user} onLogout={onLogout} onProfileUpdate={onProfileUpdate} /> : <Navigate to="/login" replace />,
      children: [
        { index: true, element: <BoardPage /> },
        { path: 'settings', element: <SettingsPage /> },
      ]
    },
    { path: '/forgot-password', element: <ForgotPasswordPage /> },
    { path: '/reset-password', element: <ResetPasswordPage /> },
    { path: '*', element: <Navigate to="/" replace /> }
  ]);
}
