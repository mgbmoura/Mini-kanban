import { Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { StatusTarefa, Tarefa } from '../types/quadro';
import { CartaoTarefa } from './CartaoTarefa';

interface ColunaKanbanProps {
  status: StatusTarefa;
  tarefas: Tarefa[];
  aoAdicionarTarefa: (status: StatusTarefa) => void;
  aoClicarTarefa: (tarefa: Tarefa) => void;
}

const CONFIGURACAO_COLUNAS: Record<
  StatusTarefa,
  { rotulo: string; badge: string; borda: string; ponto: string }
> = {
  TODO: {
    rotulo: 'A Fazer',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/80',
    borda: 'border-t-amber-400 dark:border-t-amber-500',
    ponto: 'bg-amber-500',
  },
  DOING: {
    rotulo: 'Em Andamento',
    badge: 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800/80',
    borda: 'border-t-sky-400 dark:border-t-sky-500',
    ponto: 'bg-sky-500',
  },
  DONE: {
    rotulo: 'Concluído',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80',
    borda: 'border-t-emerald-400 dark:border-t-emerald-500',
    ponto: 'bg-emerald-500',
  },
};

export function ColunaKanban({ status, tarefas, aoAdicionarTarefa, aoClicarTarefa }: ColunaKanbanProps) {
  const configuracao = CONFIGURACAO_COLUNAS[status];

  return (
    <div
      data-testid={`kanban-column-${status}`}
      className={`flex flex-col w-full sm:w-1/3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 border-t-4 ${configuracao.borda} surface-shadow relative`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-2 left-6 right-6 flex justify-around px-2"
      >
        {[...Array(6)].map((_, indice) => (
          <span
            key={indice}
            className="w-2 h-3.5 rounded-full bg-gradient-to-b from-slate-400 to-slate-500 dark:from-slate-600 dark:to-slate-700 shadow-xs border border-slate-300 dark:border-slate-600"
          />
        ))}
      </div>

      <div className="flex items-center justify-between mt-1 mb-4 pb-2.5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${configuracao.ponto}`} />
          <h3 className="font-semibold text-base text-slate-800 dark:text-slate-100">
            {configuracao.rotulo}
          </h3>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${configuracao.badge}`}>
          {tarefas.length}
        </span>
      </div>

      <Droppable droppableId={status}>
        {(fornecido, estadoArraste) => (
          <div
            ref={fornecido.innerRef}
            {...fornecido.droppableProps}
            className={`flex-1 min-h-[160px] p-1 rounded-lg transition-colors ${
              estadoArraste.isDraggingOver
                ? 'bg-emerald-50/60 dark:bg-emerald-950/30 ring-1 ring-emerald-400/50'
                : 'bg-transparent'
            }`}
          >
            {tarefas.map((tarefa, indice) => (
              <CartaoTarefa
                key={tarefa.id}
                tarefa={tarefa}
                indice={indice}
                aoClicar={aoClicarTarefa}
              />
            ))}
            {fornecido.placeholder}
          </div>
        )}
      </Droppable>

      <button
        onClick={() => aoAdicionarTarefa(status)}
        className="mt-3 w-full flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 transition-all hover:border-emerald-500 dark:hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Adicionar tarefa
      </button>
    </div>
  );
}
