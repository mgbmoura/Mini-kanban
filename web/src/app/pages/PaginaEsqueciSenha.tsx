import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { servicoAutenticacao } from '../../services/servicoAutenticacao';
import { IconeMascote } from '../../components/IconeMascote';
import { Mail, CheckCircle2, ArrowLeft, Send } from 'lucide-react';

export function PaginaEsqueciSenha() {
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const enviar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setCarregando(true);
    try {
      await servicoAutenticacao.solicitarRedefinicaoSenha(email);
      setEnviado(true);
      toast.success('Se o e-mail existir, um link foi enviado!');
    } catch {
      toast.error('Ocorreu um erro. Por favor, tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  if (enviado) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 app-grid-background flex items-center justify-center p-4 sm:p-6 transition-colors relative overflow-hidden">
        <div className="w-full max-w-md relative z-10">
          <div className="relative bg-[#FCFBF7] dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-amber-950/15 dark:border-slate-800 shadow-2xl surface-shadow text-center">
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

            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-300 dark:border-emerald-800 flex items-center justify-center mx-auto mb-5 shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">
              Verifique seu E-mail
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Se uma conta com o endereço <strong className="text-slate-900 dark:text-slate-200 font-semibold">{email}</strong> existir, um link para redefinição foi enviado.
            </p>

            <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800">
              <Link
                to="/login"
                className="w-full h-11 bg-white/90 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold shadow-2xs flex items-center justify-center gap-2 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para o login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            className="absolute -top-2.5 -right-2.5 w-16 h-5 bg-sky-200/85 dark:bg-sky-500/40 border border-sky-300/80 dark:border-sky-400/40 rounded-xs shadow-2xs rotate-12 pointer-events-none"
          />

          <div className="text-center mb-6 pt-1">
            <div className="inline-flex items-center justify-center mb-3 transition-transform hover:scale-105">
              <IconeMascote className="w-14 h-14 drop-shadow-sm" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              Recuperar Senha
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Digite seu e-mail para receber o link de acesso.
            </p>
          </div>

          <form onSubmit={enviar} className="space-y-4">
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
                  placeholder="seu@email.com"
                  required
                  className="w-full min-w-0 px-3 py-2 outline-none transition-[color,box-shadow,border-color] pl-10 h-11 bg-white/90 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 text-sm shadow-2xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold rounded-xl shadow-xs text-sm cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              {carregando ? (
                'Enviando...'
              ) : (
                <>
                  <span>Enviar Link de Redefinição</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            <div className="text-center pt-4 border-t border-slate-200/90 dark:border-slate-800">
              <Link
                to="/login"
                className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline transition-all inline-flex items-center gap-1"
              >
                Lembrou a senha? Faça login
              </Link>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 opacity-75">
            Mini Kanban © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
