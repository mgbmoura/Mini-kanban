import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { TarefasRepository } from '../tarefas/tarefas.repository';
import { ComentariosRepository } from './comentarios.repository';

@Injectable()
export class ComentariosService {
  constructor(
    private readonly comentariosRepository: ComentariosRepository,
    private readonly tarefasRepository: TarefasRepository,
  ) {}

  async criar(tarefaId: string, usuarioId: string, conteudo: string) {
    await this.validarAcessoTarefa(tarefaId, usuarioId);

    const comentario = await this.comentariosRepository.criar({
      content: conteudo,
      taskId: tarefaId,
      userId: usuarioId,
    });

    return this.formatarResposta(comentario);
  }

  async listarPorTarefa(tarefaId: string, usuarioId: string) {
    await this.validarAcessoTarefa(tarefaId, usuarioId);
    const comentarios = await this.comentariosRepository.listarPorTarefa(tarefaId);
    return comentarios.map((comentario) => this.formatarResposta(comentario));
  }

  async remover(id: string, usuarioId: string) {
    const comentario = await this.comentariosRepository.buscarPorId(id);

    if (!comentario) {
      throw new NotFoundException('Comentário não encontrado.');
    }

    if (comentario.userId !== usuarioId) {
      throw new ForbiddenException('Permissão negada. Apenas o autor pode excluir este comentário.');
    }

    return this.comentariosRepository.remover(id);
  }

  private async validarAcessoTarefa(tarefaId: string, usuarioId: string) {
    const tarefa = await this.tarefasRepository.buscarPorId(tarefaId);

    if (!tarefa || tarefa.userId !== usuarioId) {
      throw new NotFoundException('Tarefa não encontrada.');
    }
  }

  private formatarResposta(comentario: {
    id: string;
    content: string;
    userId: string;
    createdAt: Date;
    taskId: string;
    user: { name: string; avatarUrl: string | null };
  }) {
    return {
      id: comentario.id,
      content: comentario.content,
      userId: comentario.userId,
      userName: comentario.user.name,
      userAvatar: comentario.user.avatarUrl,
      createdAt: comentario.createdAt,
      taskId: comentario.taskId,
    };
  }
}
