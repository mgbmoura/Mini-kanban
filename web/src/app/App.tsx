import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { EsqueletoLogin } from '../components/EsqueletoLogin';
import { LayoutPrincipal } from '../components/LayoutPrincipal';
import { Notificacoes } from '../components/Notificacoes';
import { ProvedorAutenticacao, useAutenticacao } from '../contexts/ContextoAutenticacao';
import { PaginaConfiguracoes } from './pages/PaginaConfiguracoes';
import { PaginaEsqueciSenha } from './pages/PaginaEsqueciSenha';
import PaginaLogin from './pages/PaginaLogin';
import { PaginaQuadro } from './pages/PaginaQuadro';
import { PaginaRedefinirSenha } from './pages/PaginaRedefinirSenha';

function RoteadorAplicacao() {
  const { usuario, carregando } = useAutenticacao();

  if (carregando) return <EsqueletoLogin />;

  const roteador = createBrowserRouter([
    { path: '/', element: <Navigate to={usuario ? '/app' : '/login'} replace /> },
    {
      path: '/login',
      element: !usuario ? <PaginaLogin /> : <Navigate to="/app" replace />,
    },
    {
      path: '/register',
      element: !usuario ? <PaginaLogin /> : <Navigate to="/app" replace />,
    },
    {
      path: '/app',
      element: usuario ? <LayoutPrincipal /> : <Navigate to="/login" replace />,
      children: [
        { index: true, element: <PaginaQuadro /> },
        { path: 'settings', element: <PaginaConfiguracoes /> },
      ],
    },
    { path: '/forgot-password', element: <PaginaEsqueciSenha /> },
    { path: '/reset-password', element: <PaginaRedefinirSenha /> },
    { path: '*', element: <Navigate to="/" replace /> },
  ]);

  return <RouterProvider router={roteador} />;
}

export default function App() {
  return (
    <ProvedorAutenticacao>
      <Notificacoes richColors position="top-right" />
      <RoteadorAplicacao />
    </ProvedorAutenticacao>
  );
}
