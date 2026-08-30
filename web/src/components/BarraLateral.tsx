import type { ElementType } from 'react';
import { LayoutDashboard, LogOut, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Usuario } from '../types/usuario';
import { IconeMascote } from './IconeMascote';

interface ItemNavegacao {
  icone: ElementType;
  rotulo: string;
  caminho: string;
}

interface BarraLateralProps {
  aberta: boolean;
  aoFechar: () => void;
  aoSair: () => void;
  usuario: Usuario;
}

const ITENS_NAVEGACAO: ItemNavegacao[] = [
  { icone: LayoutDashboard, rotulo: 'Quadro', caminho: '/app' },
  { icone: Settings, rotulo: 'Configurações', caminho: '/app/settings' },
];

export function BarraLateral({ aberta, aoFechar, aoSair, usuario }: BarraLateralProps) {
  const navegar = useNavigate();
  const localizacao = useLocation();

  const abrirPagina = (caminho: string) => {
    navegar(caminho);
    aoFechar();
  };

  const sair = () => {
    aoSair();
    aoFechar();
  };

  return (
    <>
      {aberta && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
          onClick={aoFechar}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 w-64 bg-card border-r border-border
          transform transition-transform duration-300 ease-in-out z-50
          flex flex-col shadow-lg
          ${aberta ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center p-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <IconeMascote className="w-7 h-7 drop-shadow-2xs" />
            <h2 className="font-bold text-base text-foreground">Mini Kanban</h2>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3">
          {ITENS_NAVEGACAO.map((item) => {
            const Icone = item.icone;
            const ativo = localizacao.pathname === item.caminho;

            return (
              <button
                key={item.rotulo}
                onClick={() => abrirPagina(item.caminho)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors mb-1 ${
                  ativo
                    ? 'bg-accent text-accent-foreground font-semibold'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icone className="w-5 h-5" />
                <span>{item.rotulo}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border bg-muted/5">
          <div className="flex flex-col mb-4 px-1">
            <span className="text-sm font-bold text-foreground truncate">{usuario.nome}</span>
            <span className="text-xs text-muted-foreground truncate">{usuario.email}</span>
          </div>
          <button
            onClick={sair}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-destructive hover:bg-destructive/90 transition-all active:scale-95 shadow-md shadow-destructive/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}
