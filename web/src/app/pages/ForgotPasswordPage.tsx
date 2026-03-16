import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { authService } from '../../services/authService';

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
      toast.success('Se o e-mail existir, um link foi enviado!');
    } catch (error) {
      toast.error('Ocorreu um erro. Por favor, tente novamente.');
    } finally {
      setLoading(false);
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
            <Button variant="outline" asChild className="mt-8 w-full">
              <Link to="/login">Voltar para o login</Link>
            </Button>
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
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="bg-background h-11"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-11 shadow-md active:scale-[0.98]">
              {loading ? 'Enviando...' : 'Enviar Link de Redefinição'}
            </Button>
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
