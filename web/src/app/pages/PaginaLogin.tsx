import axios from 'axios';
import { ArrowRight, Lock, Mail, User as IconeUsuario } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { IconeMascote } from '../../components/IconeMascote';
import { useAutenticacao } from '../../contexts/ContextoAutenticacao';

type ModoAcesso = 'login' | 'register';

function obterModoAtual(): ModoAcesso {
  const parametros = new URLSearchParams(window.location.search);
  return window.location.pathname === '/register' || parametros.get('mode') === 'register'
    ? 'register'
    : 'login';
}

export default function PaginaLogin() {
  const { entrar, cadastrar } = useAutenticacao();
  const navegar = useNavigate();
  const [modo, setModo] = useState<ModoAcesso>(obterModoAtual());
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const atualizarModo = () => setModo(obterModoAtual());
    window.addEventListener('popstate', atualizarModo);
    return () => window.removeEventListener('popstate', atualizarModo);
  }, []);

  const definirModo = (novoModo: ModoAcesso) => {
    const url = novoModo === 'register' ? '/register' : '/login';
    window.history.pushState({ mode: novoModo }, '', url);
    setModo(novoModo);
    setErro('');
  };

  const enviar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      if (modo === 'login') {
        await entrar({ email, senha });
        navegar('/app');
        return;
      }

      if (!nome.trim()) throw new Error('Nome é obrigatório.');
      if (senha.length < 6) throw new Error('A senha deve ter pelo menos 6 caracteres.');

      await cadastrar(nome, email, senha);
      toast.success('Conta criada com sucesso! Faça login para continuar.');
      definirModo('login');
      setNome('');
      setEmail('');
      setSenha('');
    } catch (erroCapturado) {
      const mensagem = axios.isAxiosError(erroCapturado)
        ? erroCapturado.response?.data?.message || 'Não foi possível concluir a operação.'
        : erroCapturado instanceof Error
          ? erroCapturado.message
          : 'Ocorreu um erro desconhecido.';

      setErro(mensagem);
      toast.error(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  const login = modo === 'login';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 app-grid-background flex items-center justify-center p-4 sm:p-6 transition-colors relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        <div className="relative bg-[#FCFBF7] dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-amber-950/15 dark:border-slate-800 shadow-2xl surface-shadow">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-3 left-8 right-8 flex justify-around px-2 z-20"
          >
            {[...Array(6)].map((_, indice) => (
              <span
                key={indice}
                className="w-2.5 h-4.5 rounded-full bg-gradient-to-b from-slate-400 via-slate-500 to-slate-600 dark:from-slate-600 dark:to-slate-800 shadow-xs border border-slate-300 dark:border-slate-700"
              />
            ))}
          </div>

          <div
            aria-hidden="true"
            className="absolute -top-2.5 -right-2.5 w-16 h-5 bg-amber-200/85 dark:bg-amber-500/50 border border-amber-300/80 dark:border-amber-400/40 rounded-xs shadow-2xs rotate-12 pointer-events-none"
          />

          <div className="text-center mb-6 pt-1">
            <div className="inline-flex items-center justify-center mb-3 transition-transform hover:scale-105">
              <IconeMascote className="w-16 h-16 drop-shadow-sm" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              Mini Kanban
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              {login ? 'Entre na sua conta para continuar' : 'Crie sua conta gratuitamente'}
            </p>
          </div>

          <form onSubmit={enviar} className="space-y-4">
            {!login && (
              <div>
                <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Nome
                </label>
                <div className="relative">
                  <IconeUsuario className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="name"
                    type="text"
                    value={nome}
                    onChange={(evento) => setNome(evento.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/90 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 dark:focus:border-emerald-500 shadow-2xs text-sm transition-all"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                E-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(evento) => setEmail(evento.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/90 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 dark:focus:border-emerald-500 shadow-2xs text-sm transition-all"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Senha
                </label>
                {login && (
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline transition-all"
                  >
                    Esqueceu sua senha?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  value={senha}
                  onChange={(evento) => setSenha(evento.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/90 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 dark:focus:border-emerald-500 shadow-2xs text-sm transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {erro && (
              <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl p-3">
                <p className="text-rose-700 dark:text-rose-300 text-xs font-medium">{erro}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold py-2.5 rounded-xl transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer text-sm flex items-center justify-center gap-2"
            >
              <span>{carregando ? 'Processando...' : login ? 'Entrar' : 'Criar conta'}</span>
              {!carregando && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 text-center pt-4 border-t border-slate-200/90 dark:border-slate-800">
            <button
              onClick={() => definirModo(login ? 'register' : 'login')}
              className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline transition-all cursor-pointer"
            >
              {login ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 opacity-75">
            Mini Kanban © 2026 • Desenvolvido por Marcelo Giulian
          </p>
        </div>
      </div>
    </div>
  );
}
