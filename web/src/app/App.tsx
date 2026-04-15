
import { useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Toaster } from '../components/ui/sonner';
import { useAuth } from '../hooks/use-auth';
import { createAppRouter } from '../routes/app-router';

/**
 * APP: O ponto de entrada unificado.
 * Agora ele é limpo e apenas orquestra os Hooks e as Rotas.
 */
export default function App() {
  // Toda a lógica de autenticação foi para um Hook Customizado
  const { user, loading, login, logout, refreshProfile } = useAuth();

  // Toda a lógica de rotas foi para um arquivo separado
  const router = useMemo(() => 
    createAppRouter(user, loading, login, logout, refreshProfile),
    [user, loading, login, logout, refreshProfile]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster richColors position="top-right" />
      <RouterProvider router={router} />
    </DndProvider>
  );
}
