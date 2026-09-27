import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { StatusTarefa, Tarefa } from '../types/quadro';
import { ColunaKanban } from './ColunaKanban';
import { MascoteQuadro } from './MascoteQuadro';

interface QuadroKanbanProps {
  tarefas: Tarefa[];
  aoClicarTarefa: (tarefa: Tarefa) => void;
  aoAdicionarTarefa: (status: StatusTarefa) => void;
  aoMoverTarefa: (tarefaId: string, novoStatus: StatusTarefa, indiceDestino: number) => void;
  aoReordenarCartao: (indiceOrigem: number, indiceDestino: number, status: StatusTarefa) => void;
}

const STATUS_COLUNAS: StatusTarefa[] = ['TODO', 'DOING', 'DONE'];

export function QuadroKanban({
  tarefas,
  aoClicarTarefa,
  aoAdicionarTarefa,
  aoMoverTarefa,
  aoReordenarCartao,
}: QuadroKanbanProps) {
  const finalizarArraste = (resultado: DropResult) => {
    const { source: origem, destination: destino, draggableId: idArrastado } = resultado;
    if (!destino) return;

    const statusOrigem = origem.droppableId as StatusTarefa;
    const statusDestino = destino.droppableId as StatusTarefa;

    if (statusOrigem !== statusDestino) {
      aoMoverTarefa(idArrastado, statusDestino, destino.index);
      return;
    }

    if (origem.index !== destino.index) {
      aoReordenarCartao(origem.index, destino.index, statusOrigem);
    }
  };

  return (
    <DragDropContext onDragEnd={finalizarArraste}>
      <div className="flex-1 p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-4rem)] app-grid-background relative">
        <div className="flex flex-col sm:flex-row gap-6 h-full pb-20">
          {STATUS_COLUNAS.map((status) => (
            <ColunaKanban
              key={status}
              status={status}
              tarefas={tarefas.filter((tarefa) => tarefa.status === status)}
              aoAdicionarTarefa={aoAdicionarTarefa}
              aoClicarTarefa={aoClicarTarefa}
            />
          ))}
        </div>

        <MascoteQuadro />
      </div>
    </DragDropContext>
  );
}
