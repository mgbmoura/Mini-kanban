import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AtualizarTarefaDto } from './dto/atualizar-tarefa.dto';
import { CriarTarefaDto } from './dto/criar-tarefa.dto';

const incluirContagemComentarios = {
  _count: {
    select: { comments: true },
  },
} as const;

@Injectable()
export class TarefasRepository {
  constructor(private readonly prisma: PrismaService) {}

  criar(dados: CriarTarefaDto, usuarioId: string) {
    return this.prisma.task.create({
      data: {
        ...dados,
        user: { connect: { id: usuarioId } },
      },
      include: incluirContagemComentarios,
    });
  }

  listarPorUsuario(usuarioId: string) {
    return this.prisma.task.findMany({
      where: { userId: usuarioId },
      include: incluirContagemComentarios,
      orderBy: { position: 'asc' },
    });
  }

  buscarPorId(id: string) {
    return this.prisma.task.findUnique({
      where: { id },
      include: incluirContagemComentarios,
    });
  }

  atualizar(id: string, dados: AtualizarTarefaDto) {
    return this.prisma.task.update({
      where: { id },
      data: dados,
      include: incluirContagemComentarios,
    });
  }

  remover(id: string) {
    return this.prisma.task.delete({ where: { id } });
  }
}
