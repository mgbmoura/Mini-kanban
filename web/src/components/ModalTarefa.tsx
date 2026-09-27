import { BookOpen, Calendar, Image as ImageIcon, Tag, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { EstiloCartao, PrioridadeTarefa, StatusTarefa, Tarefa } from '../types/quadro';
import { PainelComentarios } from './PainelComentarios';
import { SeletorEstiloCartao } from './SeletorEstiloCartao';

interface ModalTarefaProps {
  tarefa?: Tarefa;
  aberto: boolean;
  aoFechar: () => void;
  aoSalvar: (dadosTarefa: Partial<Tarefa>) => void;
  aoExcluir?: (tarefaId: string) => void;
  aoAlterarQuantidadeComentarios?: (tarefaId: string, quantidade: number) => void;
  statusPadrao?: StatusTarefa;
}

const INDICADORES_STATUS: Record<
  StatusTarefa,
  { rotulo: string; fundo: string; texto: string; ponto: string }
> = {
  TODO: {
    rotulo: 'A Fazer',
    fundo: 'bg-amber-100 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
    texto: 'text-amber-800 dark:text-amber-300',
    ponto: 'bg-amber-500',
  },
  DOING: {
    rotulo: 'Em Andamento',
    fundo: 'bg-sky-100 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800',
    texto: 'text-sky-800 dark:text-sky-300',
    ponto: 'bg-sky-500',
  },
  DONE: {
    rotulo: 'Concluído',
    fundo: 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
    texto: 'text-emerald-800 dark:text-emerald-300',
    ponto: 'bg-emerald-500',
  },
};

export function ModalTarefa({
  tarefa,
  aberto,
  aoFechar,
  aoSalvar,
  aoExcluir,
  aoAlterarQuantidadeComentarios,
  statusPadrao = 'TODO',
}: ModalTarefaProps) {
  const referenciaTitulo = useRef<HTMLInputElement>(null);

  const [titulo, setTitulo] = useState(tarefa?.titulo || '');
  const [descricao, setDescricao] = useState(tarefa?.descricao || '');
  const [status, setStatus] = useState<StatusTarefa>(tarefa?.status || statusPadrao);
  const [prioridade, setPrioridade] = useState<PrioridadeTarefa>(tarefa?.prioridade || 'Média');
  const [estiloCartao, setEstiloCartao] = useState<EstiloCartao>(tarefa?.estiloCartao || 'SPIRAL');
  const [etiquetas, setEtiquetas] = useState<string[]>(tarefa?.etiquetas || []);
  const [entradaEtiqueta, setEntradaEtiqueta] = useState('');
  const [imagemAnexa, setImagemAnexa] = useState(tarefa?.imagemAnexa || '');
  const [entradaImagem, setEntradaImagem] = useState('');

  useEffect(() => {
    if (tarefa) {
      setTitulo(tarefa.titulo || '');
      setDescricao(tarefa.descricao || '');
      setStatus(tarefa.status || statusPadrao);
      setPrioridade(tarefa.prioridade || 'Média');
      setEstiloCartao(tarefa.estiloCartao || 'SPIRAL');
      setEtiquetas(tarefa.etiquetas || []);
      setImagemAnexa(tarefa.imagemAnexa || '');
      return;
    }

    setTitulo('');
    setDescricao('');
    setStatus(statusPadrao);
    setPrioridade('Média');
    setEstiloCartao('SPIRAL');
    setEtiquetas([]);
    setImagemAnexa('');
  }, [tarefa, statusPadrao, aberto]);

  useEffect(() => {
    if (!aberto) return;

    const tratarTecla = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') {
        aoFechar();
      }
    };

    window.addEventListener('keydown', tratarTecla);
    return () => window.removeEventListener('keydown', tratarTecla);
  }, [aberto, aoFechar]);

  useEffect(() => {
    if (!aberto) return;

    const temporizador = window.setTimeout(() => {
      referenciaTitulo.current?.focus();
    }, 50);

    return () => window.clearTimeout(temporizador);
  }, [aberto]);

  const enviarFormulario = (evento: FormEvent) => {
    evento.preventDefault();

    aoSalvar({
      id: tarefa?.id,
      titulo,
      descricao,
      status,
      prioridade,
      estiloCartao,
      etiquetas,
      imagemAnexa,
    });
  };

  const adicionarEtiqueta = () => {
    const novaEtiqueta = entradaEtiqueta.trim();

    if (!novaEtiqueta) return;
    if (etiquetas.includes(novaEtiqueta)) return;

    setEtiquetas([...etiquetas, novaEtiqueta]);
    setEntradaEtiqueta('');
  };

  const removerEtiqueta = (etiquetaParaRemover: string) => {
    setEtiquetas(etiquetas.filter((etiqueta) => etiqueta !== etiquetaParaRemover));
  };

  const adicionarImagem = () => {
    const urlImagem = entradaImagem.trim();

    if (!urlImagem) return;

    setImagemAnexa(urlImagem);
    setEntradaImagem('');
  };

  const excluirTarefa = () => {
    if (!tarefa || !aoExcluir) return;

    const confirmouExclusao = window.confirm('Tem certeza que deseja excluir esta tarefa?');

    if (confirmouExclusao) {
      aoExcluir(tarefa.id);
    }
  };

  if (!aberto) return null;

  const indicadorStatusAtual = INDICADORES_STATUS[status];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tarefa-modal-titulo"
      className="fixed inset-0 bg-slate-950/65 dark:bg-black/80 backdrop-blur-xs z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto"
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) {
          aoFechar();
        }
      }}
    >
      <div className="relative bg-[#FCFBF7] dark:bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-amber-950/15 dark:border-slate-800 shadow-2xl flex flex-col surface-shadow my-auto">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-3 left-10 right-10 flex justify-around px-2 z-20"
        >
          {[...Array(8)].map((_, indice) => (
            <span
              key={indice}
              className="w-2.5 h-4.5 rounded-full bg-gradient-to-b from-slate-400 via-slate-500 to-slate-600 dark:from-slate-600 dark:to-slate-800 shadow-xs border border-slate-300 dark:border-slate-700"
            />
          ))}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/90 dark:border-slate-800 sticky top-0 bg-[#FCFBF7]/95 dark:bg-slate-900/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300/80 dark:border-emerald-800/80 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shadow-2xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="tarefa-modal-titulo"
                  className="text-lg font-bold text-slate-800 dark:text-slate-100"
                >
                  {tarefa ? 'Editar Tarefa' : 'Nova Tarefa'}
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${indicadorStatusAtual.fundo} ${indicadorStatusAtual.texto}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${indicadorStatusAtual.ponto}`} />
                  {indicadorStatusAtual.rotulo}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {tarefa
                  ? 'Atualize os detalhes da tarefa'
                  : 'Preencha os dados para criar uma nova tarefa'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={aoFechar}
            aria-label="Fechar modal"
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100/80 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 p-2 rounded-xl transition-all cursor-pointer border border-slate-200 dark:border-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 flex-1">
          <div className="lg:col-span-2 space-y-5">
            <form onSubmit={enviarFormulario} className="space-y-5 flex flex-col h-full">
              <div className="flex-grow space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Título da Tarefa <span className="text-rose-500">*</span>
                  </label>
                  <input
                    ref={referenciaTitulo}
                    type="text"
                    value={titulo}
                    onChange={(evento) => setTitulo(evento.target.value)}
                    className="w-full px-4 py-2.5 bg-white/90 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 dark:focus:border-emerald-500 shadow-2xs transition-all"
                    placeholder="Digite o título da tarefa"
                    required
                  />
                </div>

                <SeletorEstiloCartao valor={estiloCartao} aoAlterar={setEstiloCartao} />

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Descrição
                  </label>
                  <textarea
                    value={descricao}
                    onChange={(evento) => setDescricao(evento.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-white/90 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 dark:focus:border-emerald-500 shadow-2xs resize-none transition-all"
                    placeholder="Adicione observações, checklist ou detalhes desta tarefa (opcional)"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(evento) => setStatus(evento.target.value as StatusTarefa)}
                      className="w-full px-4 py-2.5 bg-white/90 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 dark:focus:border-emerald-500 shadow-2xs transition-all cursor-pointer"
                    >
                      <option value="TODO">A Fazer</option>
                      <option value="DOING">Em Andamento</option>
                      <option value="DONE">Concluído</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Prioridade
                    </label>
                    <select
                      value={prioridade}
                      onChange={(evento) => setPrioridade(evento.target.value as PrioridadeTarefa)}
                      className="w-full px-4 py-2.5 bg-white/90 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 dark:focus:border-emerald-500 shadow-2xs transition-all cursor-pointer"
                    >
                      <option value="Baixa">Baixa</option>
                      <option value="Média">Média</option>
                      <option value="Alta">Alta</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Etiquetas
                  </label>
                  <div className="flex gap-2 mb-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={entradaEtiqueta}
                        onChange={(evento) => setEntradaEtiqueta(evento.target.value)}
                        onKeyDown={(evento) => {
                          if (evento.key === 'Enter') {
                            evento.preventDefault();
                            adicionarEtiqueta();
                          }
                        }}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/90 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 dark:focus:border-emerald-500 shadow-2xs text-sm"
                        placeholder="Ex: Urgente, Estudo, Design"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={adicionarEtiqueta}
                      className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl border border-slate-300/80 dark:border-slate-700 transition-colors cursor-pointer text-sm shadow-2xs"
                    >
                      Adicionar
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[28px]">
                    {etiquetas.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">Nenhuma etiqueta adicionada</span>
                    ) : (
                      etiquetas.map((etiqueta, indice) => (
                        <span
                          key={indice}
                          className="px-3 py-1 bg-white/90 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full text-xs font-medium flex items-center gap-1.5 border border-slate-300/80 dark:border-slate-700 shadow-2xs"
                        >
                          <span className="text-emerald-600 dark:text-emerald-400">#</span>
                          {etiqueta}
                          <button
                            type="button"
                            onClick={() => removerEtiqueta(etiqueta)}
                            aria-label={`Remover etiqueta ${etiqueta}`}
                            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Imagem Anexa (URL)
                  </label>
                  {imagemAnexa ? (
                    <div className="space-y-2">
                      <div className="relative rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                        <img
                          src={imagemAnexa}
                          alt="Anexo da Tarefa"
                          className="w-full h-44 object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setImagemAnexa('')}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remover imagem anexa
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <ImageIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="url"
                          value={entradaImagem}
                          onChange={(evento) => setEntradaImagem(evento.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-white/90 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 dark:focus:border-emerald-500 shadow-2xs text-sm"
                          placeholder="https://exemplo.com/imagem.png"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={adicionarImagem}
                        className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl border border-slate-300/80 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer text-sm shadow-2xs"
                      >
                        Adicionar
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="sticky bottom-0 z-10 mt-auto space-y-4 pt-4 pb-1 border-t border-slate-200 dark:border-slate-800 bg-[#FCFBF7]/95 dark:bg-slate-900/95 backdrop-blur-xs">
                {tarefa?.criadoEm && (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-between gap-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Criada em: {new Date(tarefa.criadoEm).toLocaleString('pt-BR')}
                    </span>
                    {tarefa.atualizadoEm && (
                      <span>
                        Última atualização: {new Date(tarefa.atualizadoEm).toLocaleString('pt-BR')}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <div>
                    {tarefa && aoExcluir && (
                      <button
                        type="button"
                        onClick={excluirTarefa}
                        className="px-4 py-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl transition-all flex items-center gap-1.5 text-sm font-semibold cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        Excluir
                      </button>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={aoFechar}
                      className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300/80 dark:border-slate-700 rounded-xl transition-colors text-sm font-semibold cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl shadow-xs transition-all text-sm font-semibold cursor-pointer"
                    >
                      {tarefa ? 'Salvar' : 'Criar'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {tarefa && (
            <PainelComentarios
              tarefaId={tarefa.id}
              aoAlterarQuantidade={aoAlterarQuantidadeComentarios}
            />
          )}
        </div>
      </div>
    </div>
  );
}
