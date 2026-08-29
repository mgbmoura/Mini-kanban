import { Menu, Moon, Sun } from 'lucide-react';
import { useTema } from '../contexts/ContextoTema';
import { Usuario } from '../types/usuario';
import { IconeMascote } from './IconeMascote';

interface CabecalhoProps {
  aoAbrirMenu: () => void;
  usuario: Usuario | null;
}

function obterIniciais(nome: string) {
  return nome
    .split(' ')
    .map((parte) => parte[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function Cabecalho({ aoAbrirMenu, usuario }: CabecalhoProps) {
  const { tema, definirTema } = useTema();

  return (
    <header className="flex items-center justify-between p-4 bg-card border-b border-border shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={aoAbrirMenu}
          aria-label="Abrir menu"
          className="p-2 rounded-full text-muted-foreground hover:bg-accent"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center justify-center transition-transform hover:scale-105">
          <IconeMascote className="w-9 h-9 drop-shadow-xs" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Mini-Kanban</h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => definirTema(tema === 'light' ? 'dark' : 'light')}
          aria-label={tema === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'}
          className="p-2 rounded-full text-muted-foreground hover:bg-accent"
        >
          {tema === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
        <div className="w-9 h-9 bg-muted rounded-full flex items-center justify-center border-2 border-border overflow-hidden">
          {usuario?.urlAvatar ? (
            <img
              src={usuario.urlAvatar}
              alt={usuario.nome || 'Avatar'}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-semibold text-sm text-foreground">
              {obterIniciais(usuario?.nome || 'U')}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
