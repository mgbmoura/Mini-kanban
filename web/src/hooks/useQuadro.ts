import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { servicoTarefas } from '../services/servicoTarefas';
import { CriarTarefaDto, StatusTarefa, Tarefa } from '../types/quadro';

export function useQuadro() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarTarefas = async () => {
      setCarregando(true);

      try {
        const tarefasCarregadas = await servicoTarefas.listar();
        setTarefas(tarefasCarregadas);
      } catch (erro) {
        console.error('Erro ao carregar tarefas:', erro);
        toast.error('Não foi possível carregar as tarefas.');
      } finally {
        setCarregando(false);
      }
    };

    void carregarTarefas();
  }, []);

  // Usa uma posição entre os cartões vizinhos para evitar renumerar a coluna inteira.
  const calcularPosicao = (anterior?: Tarefa, proxima?: Tarefa) => {
    if (!anterior && proxima) return proxima.posicao / 2;
    if (anterior && !proxima) return anterior.posicao + 1;
    if (anterior && proxima) return (anterior.posicao + proxima.posicao) / 2;
    return 1;
  };

  const moverTarefa = async (
    tarefaId: string,
    novoStatus: StatusTarefa,
    indiceDestino: number,
  ) => {
    const estadoAnterior = [...tarefas];
    const tarefaMovida = tarefas.find((tarefa) => tarefa.id === tarefaId);

    if (!tarefaMovida) return;

    const tarefasDestino = estadoAnterior
      .filter((tarefa) => tarefa.status === novoStatus && tarefa.id !== tarefaId)
      .sort((a, b) => a.posicao - b.posicao);

    const posicao = calcularPosicao(
      tarefasDestino[indiceDestino - 1],
      tarefasDestino[indiceDestino],
    );

    setTarefas((atuais) =>
      atuais.map((tarefa) =>
        tarefa.id === tarefaId ? { ...tarefa, status: novoStatus, posicao } : tarefa,
      ),
    );

    try {
      const atualizada = await servicoTarefas.atualizar(tarefaId, {
        status: novoStatus,
        posicao,
      });

      setTarefas((atuais) =>
        atuais.map((tarefa) =>
          tarefa.id === tarefaId
            ? {
                ...tarefa,
                ...atualizada,
                quantidadeComentarios:
                  atualizada.quantidadeComentarios ?? tarefa.quantidadeComentarios ?? 0,
              }
            : tarefa,
        ),
      );
    } catch (erro) {
      console.error('Erro ao mover tarefa:', erro);
      setTarefas(estadoAnterior);
      toast.error('Erro ao mover tarefa. Revertendo alterações.');
    }
  };

  const reordenarCartao = async (
    indiceOrigem: number,
    indiceDestino: number,
    status: StatusTarefa,
  ) => {
    const estadoAnterior = [...tarefas];
    const tarefasDaColuna = tarefas
      .filter((tarefa) => tarefa.status === status)
      .sort((a, b) => a.posicao - b.posicao);

    const [tarefaMovida] = tarefasDaColuna.splice(indiceOrigem, 1);

    if (!tarefaMovida) return;

    tarefasDaColuna.splice(indiceDestino, 0, tarefaMovida);

    const posicao = calcularPosicao(
      tarefasDaColuna[indiceDestino - 1],
      tarefasDaColuna[indiceDestino + 1],
    );

    setTarefas((atuais) =>
      atuais.map((tarefa) =>
        tarefa.id === tarefaMovida.id ? { ...tarefa, posicao } : tarefa,
      ),
    );

    try {
      const atualizada = await servicoTarefas.atualizar(tarefaMovida.id, { posicao });

      setTarefas((atuais) =>
        atuais.map((tarefa) =>
          tarefa.id === tarefaMovida.id ? { ...tarefa, ...atualizada } : tarefa,
        ),
      );
    } catch (erro) {
      console.error('Erro ao reordenar tarefa:', erro);
      setTarefas(estadoAnterior);
      toast.error('Erro ao reordenar tarefa.');
    }
  };

  const atualizarQuantidadeComentarios = (tarefaId: string, quantidade: number) => {
    setTarefas((atuais) =>
      atuais.map((tarefa) =>
        tarefa.id === tarefaId ? { ...tarefa, quantidadeComentarios: quantidade } : tarefa,
      ),
    );
  };

  const salvarTarefa = async (
    dados: (Partial<Tarefa> | CriarTarefaDto) & { id?: string; quantidadeComentarios?: number },
  ) => {
    try {
      if (dados.id) {
        const { id, quantidadeComentarios, ...alteracoes } = dados;
        const atualizada = await servicoTarefas.atualizar(id, alteracoes);

        setTarefas((atuais) =>
          atuais.map((tarefa) =>
            tarefa.id === id
              ? {
                  ...tarefa,
                  ...atualizada,
                  quantidadeComentarios: quantidadeComentarios ?? tarefa.quantidadeComentarios,
                }
              : tarefa,
          ),
        );

        toast.success('Tarefa atualizada com sucesso!');
        return;
      }

      const titulo = dados.titulo?.trim();

      if (!titulo) {
        throw new Error('O título da tarefa é obrigatório.');
      }

      const status = dados.status ?? 'TODO';
      const tarefasDoStatus = tarefas.filter((tarefa) => tarefa.status === status);
      const maiorPosicao = Math.max(0, ...tarefasDoStatus.map((tarefa) => tarefa.posicao));

      const criada = await servicoTarefas.criar({
        titulo,
        descricao: dados.descricao,
        status,
        prioridade: dados.prioridade ?? 'Média',
        estiloCartao: dados.estiloCartao ?? 'SPIRAL',
        etiquetas: dados.etiquetas ?? [],
        imagemAnexa: dados.imagemAnexa,
        posicao: maiorPosicao + 1,
      });

      setTarefas((atuais) => [...atuais, criada]);
      toast.success('Tarefa criada com sucesso!');
    } catch (erro) {
      console.error('Erro ao salvar tarefa:', erro);
      toast.error('Erro ao salvar tarefa. Verifique os dados informados.');
      throw erro;
    }
  };

  const excluirTarefa = async (tarefaId: string) => {
    try {
      await servicoTarefas.remover(tarefaId);
      setTarefas((atuais) => atuais.filter((tarefa) => tarefa.id !== tarefaId));
      toast.success('Tarefa removida com sucesso!');
    } catch (erro) {
      console.error('Erro ao remover tarefa:', erro);
      toast.error('Erro ao remover tarefa.');
      throw erro;
    }
  };

  return {
    tarefas: [...tarefas].sort((a, b) => a.posicao - b.posicao),
    carregando,
    moverTarefa,
    reordenarCartao,
    atualizarQuantidadeComentarios,
    salvarTarefa,
    excluirTarefa,
  };
}
