import { useEffect, useState, type FormEvent } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { servicoAutenticacao } from '../../services/servicoAutenticacao';
import { IconeMascote } from '../../components/IconeMascote';
import { KeyRound, Lock, Check } from 'lucide-react';

export function PaginaRedefinirSenha() {
  const navegar = useNavigate();
  const [parametrosBusca] = useSearchParams();

  const [token, setToken] = useState<string | null>(null);
  const [senha, setSenha] = useState('');
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const tokenDaUrl = parametrosBusca.get('token');
    if (tokenDaUrl) {
      setToken(tokenDaUrl);
    } else {
      toast.error('Token de redefinição não encontrado.');
      navegar('/login');
    }
  }, [parametrosBusca, navegar]);

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault();
    setErro('');

    if (senha !== confirmacaoSenha) {
      setErro('As senhas não coincidem.');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (!token) {
      setErro('Token de segurança ausente.');
      return;
    }

    setCarregando(true);
    try {
      await servicoAutenticacao.redefinirSenha(token, senha);
      toast.success('Senha redefinida com sucesso!');
      navegar('/login');
    } catch (erroCapturado) {
      const mensagem = erroCapturado instanceof Error ? erroCapturado.message : 'Erro ao redefinir senha.';
      setErro(mensagem);
      toast.error(mensagem);
    } finally {
      setCarregando(false);
    }
  };

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
            className="absolute -top-2.5 -right-2.5 w-16 h-5 bg-emerald-200/85 dark:bg-emerald-500/40 border border-emerald-300/80 dark:border-emerald-400/40 rounded-xs shadow-2xs rotate-12 pointer-events-none"
          />

          <div className="text-center mb-6 pt-1">
            <div className="inline-flex items-center justify-center mb-3 transition-transform hover:scale-105">
              <IconeMascote className="w-14 h-14 drop-shadow-sm" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              Nova Senha
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Crie uma senha forte para sua conta.
            </p>
          </div>

          <form onSubmit={enviar} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Nova Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  value={senha}
                  onChange={(evento) => setSenha(evento.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full min-w-0 px-3 py-2 outline-none transition-[color,box-shadow,border-color] pl-10 h-11 bg-white/90 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 text-sm shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Confirme a Nova Senha
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmacaoSenha}
                  onChange={(evento) => setConfirmacaoSenha(evento.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full min-w-0 px-3 py-2 outline-none transition-[color,box-shadow,border-color] pl-10 h-11 bg-white/90 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 text-sm shadow-2xs"
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
              disabled={carregando || !token}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold rounded-xl shadow-xs text-sm cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              {carregando ? (
                'Salvando...'
              ) : (
                <>
                  <span>Salvar Nova Senha</span>
                  <Check className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-4 border-t border-slate-200/90 dark:border-slate-800">
              <Link
                to="/login"
                className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline transition-all inline-flex items-center gap-1"
              >
                Cancelar e voltar
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
