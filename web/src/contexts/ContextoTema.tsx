import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Tema = 'dark' | 'light';

interface ProvedorTemaProps {
  children: ReactNode;
  temaPadrao?: Tema;
  chaveArmazenamento?: string;
}

interface ContextoTemaValor {
  tema: Tema;
  definirTema: (tema: Tema) => void;
}

const ContextoTema = createContext<ContextoTemaValor | undefined>(undefined);

export function ProvedorTema({
  children,
  temaPadrao = 'light',
  chaveArmazenamento = 'vite-ui-theme',
}: ProvedorTemaProps) {
  const [tema, setTema] = useState<Tema>(
    () => (localStorage.getItem(chaveArmazenamento) as Tema) || temaPadrao,
  );

  useEffect(() => {
    const raiz = window.document.documentElement;
    raiz.classList.remove('light', 'dark');
    raiz.classList.add(tema);
  }, [tema]);

  const definirTema = (novoTema: Tema) => {
    localStorage.setItem(chaveArmazenamento, novoTema);
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
