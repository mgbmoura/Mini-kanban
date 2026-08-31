import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const incluirAutor = {
  user: {
    select: { name: true, avatarUrl: true },
  },
} as const;

@Injectable()
export class ComentariosService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(tarefaId: string, usuarioId: string, conteudo: string) {
    await this.validarAcessoTarefa(tarefaId, usuarioId);

    const comentario = await this.prisma.comment.create({
      data: {
        content: conteudo,
        taskId: tarefaId,
        userId: usuarioId,
      },
      include: incluirAutor,
    });

    return this.formatarResposta(comentario);
  }

  async listarPorTarefa(tarefaId: string, usuarioId: string) {
    await this.validarAcessoTarefa(tarefaId, usuarioId);

    const comentarios = await this.prisma.comment.findMany({
      where: { taskId: tarefaId },
      include: incluirAutor,
      orderBy: { createdAt: 'asc' },
    });

    return comentarios.map((comentario) => this.formatarResposta(comentario));
  }

  async remover(id: string, usuarioId: string) {
    const comentario = await this.prisma.comment.findUnique({ where: { id } });

    if (!comentario) {
      throw new NotFoundException('Comentário não encontrado.');
    }

    if (comentario.userId !== usuarioId) {
      throw new ForbiddenException('Permissão negada. Apenas o autor pode excluir este comentário.');
    }

    return this.prisma.comment.delete({ where: { id } });
  }

  private async validarAcessoTarefa(tarefaId: string, usuarioId: string) {
    const tarefa = await this.prisma.task.findUnique({
      where: { id: tarefaId },
      select: { userId: true },
    });

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
