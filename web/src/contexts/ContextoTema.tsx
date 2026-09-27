import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Tema = 'dark' | 'light';

interface ContextoTemaValor {
  tema: Tema;
  definirTema: (tema: Tema) => void;
}

const CHAVE_TEMA = 'mini-kanban-theme';
const ContextoTema = createContext<ContextoTemaValor | undefined>(undefined);

function obterTemaSalvo(): Tema {
  const temaSalvo = localStorage.getItem(CHAVE_TEMA);
  return temaSalvo === 'dark' ? 'dark' : 'light';
}

export function ProvedorTema({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>(obterTemaSalvo);

  useEffect(() => {
    const raiz = window.document.documentElement;
    raiz.classList.remove('light', 'dark');
    raiz.classList.add(tema);
  }, [tema]);

  const definirTema = (novoTema: Tema) => {
    localStorage.setItem(CHAVE_TEMA, novoTema);
    setTema(novoTema);
  };

  return <ContextoTema.Provider value={{ tema, definirTema }}>{children}</ContextoTema.Provider>;
}

export function useTema() {
  const contexto = useContext(ContextoTema);

  if (!contexto) {
    throw new Error('useTema deve ser usado dentro de ProvedorTema.');
  }

  return contexto;
}
