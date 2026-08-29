import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAutenticacao } from '../contexts/ContextoAutenticacao';
import { BarraLateral } from './BarraLateral';
import { Cabecalho } from './Cabecalho';

export function LayoutPrincipal() {
  const { usuario, sair } = useAutenticacao();
  const [menuAberto, setMenuAberto] = useState(false);

  if (!usuario) return null;

  return (
    <div className="flex h-screen bg-background">
      <BarraLateral
        aberta={menuAberto}
        aoFechar={() => setMenuAberto(false)}
        aoSair={sair}
        usuario={usuario}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Cabecalho aoAbrirMenu={() => setMenuAberto(true)} usuario={usuario} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
