import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../../api/auth-api';

const inputClassName = 'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground bg-background text-foreground border-input flex h-11 w-full min-w-0 rounded-md border px-3 py-2 text-sm transition-[color,box-shadow,border-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:opacity-50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive';
const buttonClassName = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] bg-primary text-primary-foreground hover:bg-primary/90 w-full h-11 px-4 py-2 shadow-md active:scale-[0.98]';
const linkButtonClassName = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 mt-8 w-full h-9 px-4 py-2';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
      toast.success('Se uma conta com o endereço existir, um link para redefinição foi enviado.');
    } catch (error) {
      toast.success('Se uma conta com o endereço existir, um link para redefinição foi enviado.');
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 transition-colors">
        <div className="w-full max-w-md text-center bg-card rounded-xl p-8 border border-border shadow-xl">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">Verifique seu E-mail</h1>
            <p className="text-muted-foreground leading-relaxed">
                Se uma conta com o endereço <strong>{email}</strong> existir, 
                um link para redefinição foi enviado.
            </p>
            <Link to="/login" className={linkButtonClassName}>Voltar para o login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-bold text-2xl">M</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Recuperar Senha</h1>
          <p className="text-muted-foreground mt-2">Digite seu e-mail para receber o link de acesso.</p>
        </div>
        <div className="bg-card rounded-xl p-8 border border-border shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">E-mail</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className={inputClassName}
              />
            </div>
            <button type="submit" disabled={loading} className={buttonClassName}>
              {loading ? 'Enviando...' : 'Enviar Link de Redefinição'}
            </button>
            <div className="text-center pt-2">
              <Link to="/login" className="text-sm font-medium text-primary hover:underline">
                Lembrou a senha? Faça login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
