import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AtualizarTarefaDto } from './dto/atualizar-tarefa.dto';
import { CriarTarefaDto } from './dto/criar-tarefa.dto';

const incluirContagemComentarios = {
  _count: {
    select: { comments: true },
  },
} as const;

@Injectable()
export class TarefasService {
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

  listar(usuarioId: string) {
    return this.prisma.task.findMany({
      where: { userId: usuarioId },
      include: incluirContagemComentarios,
      orderBy: { position: 'asc' },
    });
  }

  async atualizar(id: string, usuarioId: string, dados: AtualizarTarefaDto) {
    await this.validarAcesso(id, usuarioId, 'editar');

    return this.prisma.task.update({
      where: { id },
      data: dados,
      include: incluirContagemComentarios,
    });
  }

  async remover(id: string, usuarioId: string) {
    await this.validarAcesso(id, usuarioId, 'remover');
    return this.prisma.task.delete({ where: { id } });
  }

  private async validarAcesso(id: string, usuarioId: string, acao: 'editar' | 'remover') {
    const tarefa = await this.prisma.task.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!tarefa) {
      throw new NotFoundException('Tarefa não encontrada.');
    }

    if (tarefa.userId !== usuarioId) {
      throw new ForbiddenException(`Você não tem permissão para ${acao} esta tarefa.`);
    }
  }
}
