
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTaskDto, userId: string) {
    return this.prisma.task.create({
      data: {
        ...data,
        user: { connect: { id: userId } },
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.task.findMany({
      where: { userId },
      include: {
        _count: { select: { comments: true } },
      },
      orderBy: { position: 'asc' },
    });
  }

  async update(id: string, userId: string, data: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) throw new NotFoundException('Tarefa não encontrada');

    if (task.userId !== userId) throw new UnauthorizedException('Você não tem permissão para editar esta tarefa');

    return this.prisma.task.update({ where: { id }, data });
  }

  async remove(id: string, userId: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) throw new NotFoundException('Tarefa não encontrada');

    if (task.userId !== userId) throw new UnauthorizedException('Permissão negada');

    return this.prisma.task.delete({ where: { id } });
  }
}
