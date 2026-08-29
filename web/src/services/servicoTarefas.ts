import {
  AtualizarTarefaDto,
  CriarTarefaDto,
  EstiloCartao,
  PrioridadeTarefa,
  StatusTarefa,
  Tarefa,
} from '../types/quadro';
import api from './api';

interface TarefaApi {
  id: string;
  title: string;
  description?: string;
  status: StatusTarefa;
  priority?: PrioridadeTarefa;
  cardStyle?: EstiloCartao;
  tags?: string[];
  attachmentImage?: string;
  position: number;
  createdAt?: string;
  updatedAt?: string;
  commentCount?: number;
  _count?: { comments?: number };
}

function converterTarefa(tarefa: TarefaApi): Tarefa {
  return {
    id: tarefa.id,
    titulo: tarefa.title,
    descricao: tarefa.description,
    status: tarefa.status,
    prioridade: tarefa.priority,
    estiloCartao: tarefa.cardStyle,
    etiquetas: tarefa.tags,
    imagemAnexa: tarefa.attachmentImage,
    posicao: tarefa.position,
    criadoEm: tarefa.createdAt,
    atualizadoEm: tarefa.updatedAt,
    quantidadeComentarios: tarefa._count?.comments ?? tarefa.commentCount ?? 0,
  };
}

function converterDadosParaApi(dados: CriarTarefaDto | AtualizarTarefaDto) {
  return {
    title: dados.titulo,
    description: dados.descricao,
    status: dados.status,
    priority: dados.prioridade,
    cardStyle: dados.estiloCartao,
    tags: dados.etiquetas,
    attachmentImage: dados.imagemAnexa,
    position: dados.posicao,
  };
}

export const servicoTarefas = {
  async listar(): Promise<Tarefa[]> {
    const resposta = await api.get<TarefaApi[]>('/tasks');
    return resposta.data.map(converterTarefa);
  },

  async criar(dados: CriarTarefaDto): Promise<Tarefa> {
    const resposta = await api.post<TarefaApi>('/tasks', converterDadosParaApi(dados));
    return converterTarefa(resposta.data);
  },

  async atualizar(id: string, dados: AtualizarTarefaDto): Promise<Tarefa> {
    const resposta = await api.patch<TarefaApi>(`/tasks/${id}`, converterDadosParaApi(dados));
    return converterTarefa(resposta.data);
  },

  async remover(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};
