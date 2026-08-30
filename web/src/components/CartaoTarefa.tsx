import { Draggable } from '@hello-pangea/dnd';
import { MessageSquare, Paperclip } from 'lucide-react';
import { Tarefa } from '../types/quadro';

interface CartaoTarefaProps {
  tarefa: Tarefa;
  indice: number;
  aoClicar: (tarefa: Tarefa) => void;
}

const ESTILOS_PRIORIDADE: Record<string, { fundo: string; texto: string; ponto: string }> = {
  Alta: {
    fundo: 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60',
    texto: 'text-rose-700 dark:text-rose-300',
    ponto: 'bg-rose-500',
  },
  Média: {
    fundo: 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60',
    texto: 'text-amber-700 dark:text-amber-300',
    ponto: 'bg-amber-500',
  },
  Baixa: {
    fundo: 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60',
    texto: 'text-emerald-700 dark:text-emerald-300',
    ponto: 'bg-emerald-500',
  },
};

function obterClassesDoEstilo(estilo: string) {
  if (estilo === 'SPIRAL') {
    return 'ruled-background pt-5 px-4 pb-3.5';
  }

  if (estilo === 'TAPE') {
    return 'pt-4 px-4 pb-3.5';
  }

  return 'py-3.5 pr-4 pl-7';
}

export function CartaoTarefa({ tarefa, indice, aoClicar }: CartaoTarefaProps) {
  const estilo = tarefa.estiloCartao || 'SPIRAL';
  const prioridade = tarefa.prioridade || 'Média';
  const estiloPrioridade = ESTILOS_PRIORIDADE[prioridade] || ESTILOS_PRIORIDADE.Média;
  const classesDoEstilo = obterClassesDoEstilo(estilo);
  const quantidadeComentarios = tarefa.quantidadeComentarios ?? 0;

  return (
    <Draggable draggableId={tarefa.id} index={indice}>
      {(fornecido, estadoArraste) => {
        const classesDoArraste = estadoArraste.isDragging
          ? 'ring-2 ring-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/80 scale-[1.02] rotate-1 shadow-lg'
          : 'bg-white dark:bg-slate-800/95 border-slate-200/80 dark:border-slate-700/70 hover:border-slate-300 dark:hover:border-slate-600';

        return (
          <div
            ref={fornecido.innerRef}
            {...fornecido.draggableProps}
            {...fornecido.dragHandleProps}
            onClick={() => aoClicar(tarefa)}
            className="mb-3.5 outline-none cursor-pointer"
          >
            <div
              className={`relative rounded-xl border transition-all duration-200 surface-shadow surface-shadow-hover overflow-hidden ${classesDoArraste} ${classesDoEstilo}`}
            >
              {estilo === 'SPIRAL' && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 left-0 right-0 h-3.5 flex justify-evenly px-3 bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700"
                >
                  {[...Array(6)].map((_, indiceAnel) => (
                    <span
                      key={indiceAnel}
                      className="w-1.5 h-3 -mt-1 rounded-full bg-gradient-to-b from-slate-400 to-slate-500 dark:from-slate-500 dark:to-slate-600 shadow-xs border border-slate-300 dark:border-slate-700"
                    />
                  ))}
                </div>
              )}

              {estilo === 'TAPE' && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-1.5 left-1/2 -translate-x-1/2 w-14 h-4 bg-amber-200/85 dark:bg-amber-500/40 border border-amber-300/80 dark:border-amber-400/30 rounded-xs shadow-xs rotate-[-1.5deg] backdrop-blur-xs z-10"
                />
              )}

              {estilo === 'BINDER' && (
                <>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0 bottom-0 left-2 w-2 flex flex-col justify-around py-3"
                  >
                    {[0, 1, 2].map((indiceFuro) => (
                      <span
                        key={indiceFuro}
                        className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-inner"
                      />
                    ))}
                  </div>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0 bottom-0 left-5 w-[1.5px] bg-rose-300/40 dark:bg-rose-500/25"
                  />
                </>
              )}

              {tarefa.imagemAnexa && (
                <div className="relative mb-2.5 rounded-lg overflow-hidden border border-slate-200/80 dark:border-slate-700">
                  <img
                    src={tarefa.imagemAnexa}
                    alt={tarefa.titulo}
                    className="w-full h-32 object-cover"
                  />
                </div>
              )}

              <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-100 mb-1.5 leading-snug break-words">
                {tarefa.titulo}
              </h4>

              {tarefa.descricao && (
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-2.5 leading-relaxed">
                  {tarefa.descricao}
                </p>
              )}

              {tarefa.etiquetas && tarefa.etiquetas.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {tarefa.etiquetas.map((etiqueta, indiceEtiqueta) => (
                    <span
                      key={indiceEtiqueta}
                      className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-600 rounded-md text-[11px] font-medium tracking-tight"
                    >
                      #{etiqueta}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-2.5">
                  {tarefa.imagemAnexa && (
                    <span title="Possui imagem anexa" className="flex items-center text-slate-400">
                      <Paperclip className="w-3.5 h-3.5" />
                    </span>
                  )}
                  <div
                    title={`${quantidadeComentarios} comentários`}
                    className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="text-[11px]">{quantidadeComentarios}</span>
                  </div>
                </div>

                <div
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${estiloPrioridade.fundo} ${estiloPrioridade.texto}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${estiloPrioridade.ponto}`} />
                  <span>{prioridade}</span>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </Draggable>
  );
}
