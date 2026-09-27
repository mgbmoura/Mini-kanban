export type StatusTarefa = 'TODO' | 'DOING' | 'DONE';
export type PrioridadeTarefa = 'Baixa' | 'Média' | 'Alta';
export type EstiloCartao = 'SPIRAL' | 'TAPE' | 'BINDER';

export interface Tarefa {
  id: string;
  titulo: string;
  descricao?: string;
  status: StatusTarefa;
  prioridade?: PrioridadeTarefa;
  estiloCartao?: EstiloCartao;
  etiquetas?: string[];
  imagemAnexa?: string;
  posicao: number;
  criadoEm?: string;
  atualizadoEm?: string;
  quantidadeComentarios?: number;
}

export interface CriarTarefaDto {
  titulo: string;
  descricao?: string;
  status?: StatusTarefa;
  prioridade?: PrioridadeTarefa;
  estiloCartao?: EstiloCartao;
  etiquetas?: string[];
  imagemAnexa?: string;
  posicao?: number;
}

export type AtualizarTarefaDto = Partial<CriarTarefaDto>;

export interface Comentario {
  id: string;
  conteudo: string;
  usuarioId: string;
  nomeUsuario: string;
  avatarUsuario?: string;
  criadoEm: string;
  tarefaId: string;
}
