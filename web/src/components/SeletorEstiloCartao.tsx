import { EstiloCartao } from '../types/quadro';
import { Check } from 'lucide-react';

interface SeletorEstiloCartaoProps {
  valor: EstiloCartao;
  aoAlterar: (estilo: EstiloCartao) => void;
}

interface OpcaoEstilo {
  id: EstiloCartao;
  rotulo: string;
  descricao: string;
  selo: string;
}

const OPCOES: OpcaoEstilo[] = [
  {
    id: 'SPIRAL',
    rotulo: 'Espiral',
    descricao: 'Bloco com anéis metálicos e pauta sutil',
    selo: 'Anéis de Caderno',
  },
  {
    id: 'TAPE',
    rotulo: 'Fita Adesiva',
    descricao: 'Bilhete preso com fita washi tape',
    selo: 'Washi Tape',
  },
  {
    id: 'BINDER',
    rotulo: 'Fichário',
    descricao: 'Folha com furos e margem lateral',
    selo: 'Margem & Furos',
  },
];

export function SeletorEstiloCartao({ valor, aoAlterar }: SeletorEstiloCartaoProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Estilo do cartão
        </label>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          Escolha como o cartão será exibido
        </span>
      </div>

      <div
        role="radiogroup"
        aria-label="Escolha o estilo do cartão"
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        {OPCOES.map((opcao) => {
          const selecionado = valor === opcao.id;

          return (
            <button
              key={opcao.id}
              type="button"
              role="radio"
              aria-checked={selecionado}
              onClick={() => aoAlterar(opcao.id)}
              onKeyDown={(evento) => {
                if (evento.key === ' ' || evento.key === 'Enter') {
                  evento.preventDefault();
                  aoAlterar(opcao.id);
                }
              }}
              className={`relative flex flex-col text-left p-3 rounded-xl border-2 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                selecionado
                  ? 'border-emerald-600 dark:border-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/40 shadow-sm ring-1 ring-emerald-500/30'
                  : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-xs'
              }`}
            >
              {selecionado && (
                <span className="absolute -top-2 -right-2 bg-emerald-600 text-white rounded-full p-0.5 shadow-xs flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </span>
              )}

              <div className="w-full h-16 rounded-lg mb-2 relative overflow-hidden bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-center px-3 py-2 shadow-2xs">
                {opcao.id === 'SPIRAL' && (
                  <>
                    <div className="absolute top-0 left-0 right-0 h-2 flex justify-around px-2 pointer-events-none">
                      <span className="w-1.5 h-3 bg-gradient-to-b from-slate-400 to-slate-600 dark:from-slate-500 dark:to-slate-700 rounded-full -mt-1 shadow-xs border border-slate-300 dark:border-slate-600" />
                      <span className="w-1.5 h-3 bg-gradient-to-b from-slate-400 to-slate-600 dark:from-slate-500 dark:to-slate-700 rounded-full -mt-1 shadow-xs border border-slate-300 dark:border-slate-600" />
                      <span className="w-1.5 h-3 bg-gradient-to-b from-slate-400 to-slate-600 dark:from-slate-500 dark:to-slate-700 rounded-full -mt-1 shadow-xs border border-slate-300 dark:border-slate-600" />
                      <span className="w-1.5 h-3 bg-gradient-to-b from-slate-400 to-slate-600 dark:from-slate-500 dark:to-slate-700 rounded-full -mt-1 shadow-xs border border-slate-300 dark:border-slate-600" />
                    </div>
                    <div className="mt-2 space-y-1.5">
                      <div className="h-1.5 bg-slate-300/80 dark:bg-slate-700 rounded-full w-4/5" />
                      <div className="h-1.5 bg-slate-200/90 dark:bg-slate-800 rounded-full w-3/5" />
                    </div>
                  </>
                )}

                {opcao.id === 'TAPE' && (
                  <>
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-3.5 bg-amber-200/90 dark:bg-amber-500/60 border border-amber-300/80 dark:border-amber-400/50 rounded-xs shadow-xs -rotate-2 backdrop-blur-2xs" />
                    <div className="mt-2.5 space-y-1.5">
                      <div className="h-1.5 bg-slate-300/80 dark:bg-slate-700 rounded-full w-3/4" />
                      <div className="h-1.5 bg-slate-200/90 dark:bg-slate-800 rounded-full w-1/2" />
                    </div>
                  </>
                )}

                {opcao.id === 'BINDER' && (
                  <div className="flex items-center gap-2.5 h-full">
                    <div className="flex flex-col justify-between h-4/5 py-0.5 border-r border-rose-300/70 dark:border-rose-500/50 pr-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 border border-slate-400/70 dark:border-slate-500" />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 border border-slate-400/70 dark:border-slate-500" />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 border border-slate-400/70 dark:border-slate-500" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="h-1.5 bg-slate-300/80 dark:bg-slate-700 rounded-full w-4/5" />
                      <div className="h-1.5 bg-slate-200/90 dark:bg-slate-800 rounded-full w-3/5" />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between w-full mb-1">
                <span
                  className={`text-xs font-semibold ${
                    selecionado
                      ? 'text-emerald-950 dark:text-emerald-200'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {opcao.rotulo}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300 font-medium">
                  {opcao.selo}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                {opcao.descricao}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
