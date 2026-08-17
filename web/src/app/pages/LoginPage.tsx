
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { authService } from '../../api/auth-api';
import { toast } from 'sonner';

interface LoginPageProps {
  onLogin: () => void;
}

const getModeFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('mode') === 'register' ? 'register' : 'login';
};

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [mode, setMode] = useState(getModeFromURL());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handlePopState = () => setMode(getModeFromURL());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const setView = (newMode: 'login' | 'register') => {
    const url = newMode === 'register' ? '/?mode=register' : '/';
    if (window.location.pathname + window.location.search !== url) {
      window.history.pushState({ mode: newMode }, '', url);
    }
    setMode(newMode);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await authService.login({ email, password });
        onLogin();
      } else {
        if (!name.trim()) {
          throw new Error('Nome é obrigatório');
        }
        if (password.length < 6) {
          throw new Error('A senha deve ter pelo menos 6 caracteres.');
        }
        await authService.register(name, email, password);
        toast.success('Conta criada com sucesso! Faça login para continuar.');
        
        setView('login');
        setName('');
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        const message = 'Email ou senha inválidos.';
        setError(message);
        toast.error(message);
      } else {
        const message = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido';
        setError(message);
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const isLogin = mode === 'login';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 transition-colors">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-bold text-3xl">M</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-1 tracking-tight">Mini Kanban</h1>
          <p className="text-muted-foreground">
            {isLogin ? 'Entre na sua conta para continuar' : 'Crie sua conta gratuitamente'}
          </p>
        </div>

        <div className="bg-card rounded-xl p-6 sm:p-8 border border-border shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">Nome</label>
                <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all" placeholder="Seu nome completo" required={!isLogin} />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all" placeholder="seu@email.com" required />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-foreground">Senha</label>
                {isLogin && (
                  <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline transition-all">
                    Esqueceu sua senha?
                  </Link>
                )}
              </div>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all" placeholder="••••••••" required minLength={6} />
            </div>
            {error && <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3"><p className="text-destructive text-sm font-medium">{error}</p></div>}
            <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-lg transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100">{loading ? 'Processando...' : isLogin ? 'Entrar' : 'Criar conta'}</button>
          </form>
          <div className="mt-6 text-center">
            <button onClick={() => setView(isLogin ? 'register' : 'login')} className="text-sm font-medium text-primary hover:underline transition-all">
              {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
            </button>
          </div>
        </div>
        <div className="mt-8 text-center"><p className="text-xs text-muted-foreground opacity-60">Mini Kanban © 2026 • Desenvolvido por Marcelo Giulian</p></div>
      </div>
    </div>
  );
}
