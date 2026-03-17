// Importa decoradores e classes de exceção do NestJS.
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
// Importa o serviço do Prisma para interação com o banco de dados.
import { PrismaService } from '../prisma/prisma.service';
// Importa os DTOs (Data Transfer Objects) para tipagem dos dados de entrada.
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

// Marca a classe como um provedor que pode ser injetado em outras partes da aplicação.
@Injectable()
export class TasksService {
  // Injeta o PrismaService no construtor para que seus métodos possam ser usados aqui.
  constructor(private prisma: PrismaService) {}

  /**
   * Cria uma nova tarefa no banco de dados.
   * @param data - Os dados para a criação da nova tarefa (título, descrição, etc.).
   * @param userId - O ID do usuário que está criando a tarefa.
   * @returns A tarefa recém-criada.
   */
  async create(data: CreateTaskDto, userId: string) {
    // Utiliza o cliente Prisma para criar um novo registro de tarefa.
    return this.prisma.task.create({
      data: {
        ...data, // Espalha os dados do DTO (título, descrição, etc.).
        user: {   // Cria a relação com o usuário.
          connect: { // Conecta a tarefa a um usuário existente pelo ID.
            id: userId,
          },
        },
      },
    });
  }

  /**
   * Busca todas as tarefas associadas a um ID de usuário específico.
   * Utilizamos o `_count` para trazer o número de comentários sem precisar carregar todos eles.
   * Ordenamos pela `position` para manter a ordem do Kanban definida pelo usuário.
   */
  async findAll(userId: string) {
    return this.prisma.task.findMany({
      where: { userId },
      include: {
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        position: 'asc', // Importante para o Drag and Drop funcionar corretamente
      },
    });
  }

  /**
   * Atualiza uma tarefa existente.
   * Realiza uma verificação de segurança (Ownership) para garantir que apenas o dono da tarefa possa editá-la.
   */
  async update(id: string, userId: string, data: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) throw new NotFoundException('Tarefa não encontrada');

    // Validação de Segurança: Se o usuário logado não for o dono da tarefa, barramos a ação.
    if (task.userId !== userId) throw new UnauthorizedException('Você não tem permissão para editar esta tarefa');

    return this.prisma.task.update({ where: { id }, data });
  }

  /**
   * Remove uma tarefa do banco de dados.
   * Também verifica a propriedade da tarefa antes de deletar.
   */
  async remove(id: string, userId: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) throw new NotFoundException('Tarefa não encontrada');

    if (task.userId !== userId) throw new UnauthorizedException('Você não tem permissão para remover esta tarefa');

    return this.prisma.task.delete({ where: { id } });
  }
}
