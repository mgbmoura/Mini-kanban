import { useState } from 'react';
import { EsqueletoQuadro } from '../../components/EsqueletoQuadro';
import { ModalTarefa } from '../../components/ModalTarefa';
import { QuadroKanban } from '../../components/QuadroKanban';
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

  const salvar = async (dados: Partial<Tarefa> & { quantidadeComentarios?: number }) => {
    await salvarTarefa(dados);
    fecharModal();
  };

  const excluir = async (tarefaId: string) => {
    await excluirTarefa(tarefaId);
    fecharModal();
  };

  if (carregando) return <EsqueletoQuadro />;

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
