import React, { createContext, useContext, useState } from 'react';
import { servicoAutenticacao } from '../services/servicoAutenticacao';
import { Usuario } from '../types/usuario';

interface ContextoAutenticacaoValor {
  usuario: Usuario | null;
  entrar: (credenciais: { email: string; senha: string }) => Promise<Usuario>;
  cadastrar: (nome: string, email: string, senha: string) => Promise<void>;
  sair: () => void;
  atualizarPerfil: (dados: { nome?: string; urlAvatar?: string }) => Promise<Usuario>;
}

const ContextoAutenticacao = createContext<ContextoAutenticacaoValor | undefined>(undefined);

export function ProvedorAutenticacao({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(() => servicoAutenticacao.obterUsuario());

  const entrar = async (credenciais: { email: string; senha: string }) => {
    const usuarioAutenticado = await servicoAutenticacao.entrar(credenciais);
    setUsuario(usuarioAutenticado);
    return usuarioAutenticado;
  };

  const cadastrar = (nome: string, email: string, senha: string) =>
    servicoAutenticacao.cadastrar(nome, email, senha);

  const sair = () => {
    servicoAutenticacao.sair();
    setUsuario(null);
  };

  const atualizarPerfil = async (dados: { nome?: string; urlAvatar?: string }) => {
    const usuarioAtualizado = await servicoAutenticacao.atualizarPerfil(dados);
    setUsuario(usuarioAtualizado);
    return usuarioAtualizado;
  };

  return (
    <ContextoAutenticacao.Provider
      value={{ usuario, entrar, cadastrar, sair, atualizarPerfil }}
    >
      {children}
    </ContextoAutenticacao.Provider>
  );
}

export function useAutenticacao() {
  const contexto = useContext(ContextoAutenticacao);

  if (!contexto) {
    throw new Error('useAutenticacao deve ser usado dentro de ProvedorAutenticacao.');
  }

  return contexto;
}
