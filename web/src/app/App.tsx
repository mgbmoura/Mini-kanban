
import { CSSProperties, useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuth } from '../hooks/use-auth';
import { useTheme } from '../contexts/ThemeContext';
import { createAppRouter } from '../routes/app-router';

export default function App() {
  const { user, loading, login, logout, refreshProfile } = useAuth();
  const { theme } = useTheme();

  const router = useMemo(
    () => createAppRouter(user, loading, login, logout, refreshProfile),
    [user, loading, login, logout, refreshProfile]
  );

  return (
    <>
      <Toaster
        richColors
        position="top-right"
        theme={theme}
        style={{
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as CSSProperties}
      />
      <RouterProvider router={router} />
    </>
  );
}
