import { Comentario } from '../types/quadro';
import api from './api';

interface ComentarioApi {
  id: string;
  content: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
  taskId: string;
}

function converterComentario(comentario: ComentarioApi): Comentario {
  return {
    id: comentario.id,
    conteudo: comentario.content,
    usuarioId: comentario.userId,
    nomeUsuario: comentario.userName,
    avatarUsuario: comentario.userAvatar,
    criadoEm: comentario.createdAt,
    tarefaId: comentario.taskId,
  };
}

export const servicoComentarios = {
  async listar(tarefaId: string): Promise<Comentario[]> {
    const resposta = await api.get<ComentarioApi[]>(`/tasks/${tarefaId}/comments`);
    return resposta.data.map(converterComentario);
  },

  async criar(tarefaId: string, conteudo: string): Promise<Comentario> {
    const resposta = await api.post<ComentarioApi>(`/tasks/${tarefaId}/comments`, {
      content: conteudo,
    });
    return converterComentario(resposta.data);
  },

  async remover(comentarioId: string): Promise<void> {
    await api.delete(`/comments/${comentarioId}`);
  },
};
