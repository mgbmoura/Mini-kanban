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
    <header className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={aoAbrirMenu}
          aria-label="Abrir menu"
          className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center justify-center transition-transform hover:scale-105">
          <IconeMascote className="w-9 h-9 drop-shadow-xs" />
        </div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Mini Kanban</h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => definirTema(tema === 'light' ? 'dark' : 'light')}
          aria-label={tema === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'}
          className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {tema === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
        <div className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-200 dark:border-slate-700 overflow-hidden">
          {usuario?.urlAvatar ? (
            <img
              src={usuario.urlAvatar}
              alt={usuario.nome || 'Avatar'}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">
              {obterIniciais(usuario?.nome || 'U')}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
