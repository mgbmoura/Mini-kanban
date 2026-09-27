import { useState } from 'react';
import { ModalTarefa } from '../../components/ModalTarefa';
import { QuadroKanban } from '../../components/QuadroKanban';
import { SkeletonQuadro } from '../../components/SkeletonQuadro';
import { useQuadro } from '../../hooks/useQuadro';
import { StatusTarefa, Tarefa } from '../../types/quadro';

export function PaginaQuadro() {
  const {
    tarefas,
    carregando,
    moverTarefa,
    reordenarCartao,
    atualizarQuantidadeComentarios,
    salvarTarefa,
    excluirTarefa,
  } = useQuadro();

  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaSelecionada, setTarefaSelecionada] = useState<Tarefa>();
  const [statusNovaTarefa, setStatusNovaTarefa] = useState<StatusTarefa>('TODO');

  const abrirCriacao = (status: StatusTarefa) => {
    setStatusNovaTarefa(status);
    setTarefaSelecionada(undefined);
    setModalAberto(true);
  };

  const abrirEdicao = (tarefa: Tarefa) => {
    setTarefaSelecionada(tarefa);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setTarefaSelecionada(undefined);
  };

  const salvar = async (dados: Partial<Tarefa>) => {
    await salvarTarefa(dados);
    fecharModal();
  };

  const excluir = async (tarefaId: string) => {
    await excluirTarefa(tarefaId);
    fecharModal();
  };

  if (carregando) return <SkeletonQuadro />;

  return (
    <>
      <QuadroKanban
        tarefas={tarefas}
        aoAdicionarTarefa={abrirCriacao}
        aoClicarTarefa={abrirEdicao}
        aoMoverTarefa={moverTarefa}
        aoReordenarCartao={reordenarCartao}
      />

      {modalAberto && (
        <ModalTarefa
          key={tarefaSelecionada?.id ?? `nova-${statusNovaTarefa}`}
          tarefa={tarefaSelecionada}
          aberto={modalAberto}
          statusPadrao={statusNovaTarefa}
          aoFechar={fecharModal}
          aoSalvar={salvar}
          aoExcluir={excluir}
          aoAlterarQuantidadeComentarios={atualizarQuantidadeComentarios}
        />
      )}
    </>
  );
}
