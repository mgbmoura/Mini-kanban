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
   * @param userId - O ID do usuário cujas tarefas serão buscadas.
   * @returns Uma lista de tarefas.
   */
  async findAll(userId: string) {
    // Busca todas as tarefas que correspondem ao `userId` fornecido.
    return this.prisma.task.findMany({ where: { userId } });
  }

  /**
   * Atualiza uma tarefa existente.
   * @param id - O ID da tarefa a ser atualizada.
   * @param userId - O ID do usuário que está tentando atualizar a tarefa (para verificação de permissão).
   * @param data - Os novos dados para a tarefa.
   * @returns A tarefa atualizada.
   */
  async update(id: string, userId: string, data: UpdateTaskDto) {
    // Primeiro, busca a tarefa pelo ID para garantir que ela existe.
    const task = await this.prisma.task.findUnique({ where: { id } });

    // Se a tarefa não for encontrada, lança uma exceção HTTP 404.
    if (!task) throw new NotFoundException('Tarefa não encontrada');

    // Se o ID do usuário da tarefa for diferente do ID do usuário que fez a requisição, lança uma exceção de não autorizado.
    if (task.userId !== userId) throw new UnauthorizedException('Você não tem permissão para editar esta tarefa');

    // Se tudo estiver correto, atualiza a tarefa com os novos dados.
    return this.prisma.task.update({ where: { id }, data });
  }

  /**
   * Remove uma tarefa do banco de dados.
   * @param id - O ID da tarefa a ser removida.
   * @param userId - O ID do usuário que está tentando remover a tarefa (para verificação de permissão).
   * @returns A tarefa que foi removida.
   */
  async remove(id: string, userId: string) {
    // Busca a tarefa para garantir que ela existe antes de tentar removê-la.
    const task = await this.prisma.task.findUnique({ where: { id } });

    // Se não encontrar a tarefa, lança um erro 404.
    if (!task) throw new NotFoundException('Tarefa não encontrada');

    // Verifica se o usuário tem permissão para remover a tarefa.
    if (task.userId !== userId) throw new UnauthorizedException('Você não tem permissão para remover esta tarefa');

    // Se as verificações passarem, remove a tarefa do banco de dados.
    return this.prisma.task.delete({ where: { id } });
  }
}
