import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface DadosNovoComentario {
  content: string;
  taskId: string;
  userId: string;
}

const incluirAutor = {
  user: {
    select: { name: true, avatarUrl: true },
  },
} as const;

@Injectable()
export class ComentariosRepository {
  constructor(private readonly prisma: PrismaService) {}

  criar(dados: DadosNovoComentario) {
    return this.prisma.comment.create({ data: dados, include: incluirAutor });
  }

  listarPorTarefa(tarefaId: string) {
    return this.prisma.comment.findMany({
      where: { taskId: tarefaId },
      include: incluirAutor,
      orderBy: { createdAt: 'asc' },
    });
  }

  buscarPorId(id: string) {
    return this.prisma.comment.findUnique({ where: { id } });
  }

  remover(id: string) {
    return this.prisma.comment.delete({ where: { id } });
  }
}
