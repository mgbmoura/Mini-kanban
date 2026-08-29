import { Info, Loader2, Palette, Save, User as IconeUsuario } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { EsqueletoConfiguracoes } from '../../components/EsqueletoConfiguracoes';
import { IconeMascote } from '../../components/IconeMascote';
import { useAutenticacao } from '../../contexts/ContextoAutenticacao';
import { useTema } from '../../contexts/ContextoTema';

export function PaginaConfiguracoes() {
  const { usuario, atualizarPerfil, carregando } = useAutenticacao();
  const { tema, definirTema } = useTema();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!usuario) return;
    setNome(usuario.nome);
    setEmail(usuario.email);
    setAvatar(usuario.urlAvatar || '');
  }, [usuario]);

  const salvar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setSalvando(true);

    try {
      await atualizarPerfil({ nome: nome.trim() });
      toast.success('Perfil atualizado com sucesso!');
    } catch (erro) {
      console.error('Erro ao atualizar perfil:', erro);
      toast.error('Erro ao salvar perfil.');
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) return <EsqueletoConfiguracoes />;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 p-4 sm:p-6">
      <div className="relative bg-[#FCFBF7] dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-amber-950/15 dark:border-slate-800 shadow-sm surface-shadow flex items-center gap-3.5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-2.5 left-10 right-10 flex justify-around px-4"
        >
          {[...Array(8)].map((_, indice) => (
            <span
              key={indice}
              className="w-2 h-3.5 rounded-full bg-gradient-to-b from-slate-400 via-slate-500 to-slate-600 dark:from-slate-600 dark:to-slate-800 shadow-2xs border border-slate-300 dark:border-slate-700"
            />
          ))}
        </div>

        <div className="p-1.5 bg-sky-100 dark:bg-sky-950/60 rounded-xl border border-sky-200 dark:border-sky-800/80 shrink-0">
          <IconeMascote className="w-10 h-10 drop-shadow-2xs" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
            Configurações
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Gerencie seu perfil e a aparência da interface.
          </p>
        </div>
      </div>

      <section className="relative bg-[#FCFBF7] dark:bg-slate-900 rounded-2xl shadow-sm border border-amber-950/15 dark:border-slate-800 surface-shadow overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -top-2.5 right-6 w-20 h-5 bg-amber-200/85 dark:bg-amber-500/40 border border-amber-300/80 dark:border-amber-400/40 rounded-xs shadow-2xs rotate-3 pointer-events-none z-10"
        />

        <div className="p-4 sm:p-5 border-b border-amber-950/10 dark:border-slate-800/80 flex items-center gap-2.5 bg-amber-50/40 dark:bg-slate-900/40">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
            <IconeUsuario className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Perfil</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Informações da sua conta</p>
          </div>
        </div>

        <form onSubmit={salvar}>
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="relative group">
                <div className="bg-white dark:bg-slate-800 p-2 pb-4 rounded-xl border border-slate-300 dark:border-slate-700 shadow-md transform -rotate-2 group-hover:rotate-0 transition-transform">
                  <div className="w-24 h-24 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                    {avatar ? (
                      <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <IconeUsuario className="w-10 h-10 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center sm:text-left space-y-2 flex-1">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Foto de perfil</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  A imagem é vinculada automaticamente ao seu e-mail via Gravatar.
                </p>
                <div className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-300/80 dark:border-slate-700 font-medium">
                  <Info className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    Para alterar seu avatar, acesse{' '}
                    <a
                      href="https://gravatar.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800"
                    >
                      Gravatar.com
                    </a>
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="settings-name" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Nome completo
                </label>
                <input
                  id="settings-name"
                  type="text"
                  value={nome}
                  onChange={(evento) => setNome(evento.target.value)}
                  className="w-full px-4 py-2.5 bg-white/90 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 text-slate-900 dark:text-slate-100 text-sm outline-none transition-all shadow-2xs font-medium"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="settings-email" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  E-mail
                </label>
                <input
                  id="settings-email"
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed text-sm font-medium opacity-80"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-100/50 dark:bg-slate-800/30 p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={salvando}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-xs cursor-pointer"
            >
              {salvando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{salvando ? 'Salvando...' : 'Salvar alterações'}</span>
            </button>
          </div>
        </form>
      </section>

      <section className="relative bg-[#FCFBF7] dark:bg-slate-900 rounded-2xl shadow-sm border border-amber-950/15 dark:border-slate-800 surface-shadow overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -top-2.5 right-6 w-20 h-5 bg-sky-200/85 dark:bg-sky-500/40 border border-sky-300/80 dark:border-sky-400/40 rounded-xs shadow-2xs -rotate-2 pointer-events-none z-10"
        />

        <div className="p-4 sm:p-5 border-b border-amber-950/10 dark:border-slate-800/80 flex items-center gap-2.5 bg-amber-50/40 dark:bg-slate-900/40">
          <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800 flex items-center justify-center text-sky-700 dark:text-sky-400">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Aparência</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Escolha entre tema claro e escuro</p>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => definirTema('light')}
              className={`p-4 rounded-xl text-left transition-all border-2 flex items-start gap-4 cursor-pointer ${
                tema === 'light'
                  ? 'bg-amber-50/80 dark:bg-amber-950/20 border-emerald-600 shadow-sm ring-2 ring-emerald-500/20'
                  : 'bg-white/80 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-xl shrink-0">☀️</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-100">Claro</span>
                  {tema === 'light' && <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-600 text-white">Ativo</span>}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Fundo claro e alto contraste para uso durante o dia.</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => definirTema('dark')}
              className={`p-4 rounded-xl text-left transition-all border-2 flex items-start gap-4 cursor-pointer ${
                tema === 'dark'
                  ? 'bg-slate-800/90 border-emerald-600 shadow-sm ring-2 ring-emerald-500/20'
                  : 'bg-white/80 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xl shrink-0">🌙</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-100">Escuro</span>
                  {tema === 'dark' && <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-600 text-white">Ativo</span>}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Fundo escuro para reduzir o brilho em ambientes com pouca luz.</p>
              </div>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
