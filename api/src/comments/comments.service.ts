import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(taskId: string, userId: string, content: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Tarefa não encontrada');

    const comment = await this.prisma.comment.create({
      data: {
        content,
        taskId,
        userId,
      },
      include: {
        user: {
          select: { name: true, avatarUrl: true }
        }
      }
    });

    return {
      id: comment.id,
      content: comment.content,
      userId: comment.userId,
      userName: comment.user.name,
      userAvatar: comment.user.avatarUrl,
      createdAt: comment.createdAt,
      taskId: comment.taskId,
    };
  }

  async findAllByTask(taskId: string) {
    const comments = await this.prisma.comment.findMany({
      where: { taskId },
      include: {
        user: {
          select: { name: true, avatarUrl: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return comments.map(c => ({
      id: c.id,
      content: c.content,
      userId: c.userId,
      userName: c.user.name,
      userAvatar: c.user.avatarUrl,
      createdAt: c.createdAt,
      taskId: c.taskId,
    }));
  }

  async remove(id: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Comentário não encontrado');
    if (comment.userId !== userId) throw new UnauthorizedException('Permissão negada');

    return this.prisma.comment.delete({ where: { id } });
  }
}
