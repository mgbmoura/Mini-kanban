// Importa decoradores e classes de exceção do NestJS.
import { Injectable, ConflictException } from '@nestjs/common';
// Importa o serviço do Prisma para interagir com o banco de dados.
import { PrismaService } from '../prisma/prisma.service';
// Importa os DTOs para validação e tipagem dos dados de entrada.
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// Importa a biblioteca bcrypt para hashing de senhas.
import * as bcrypt from 'bcrypt';

// Marca a classe como um provedor que pode ser injetado em outras partes da aplicação.
@Injectable()
export class UsersService {
  // Injeta o PrismaService para permitir a comunicação com o banco de dados.
  constructor(private prisma: PrismaService) {}

  /**
   * Cria um novo usuário no banco de dados.
   * @param data - Os dados do usuário a serem criados (nome, email, senha).
   * @returns O usuário criado (sem a senha).
   */
  async create(data: CreateUserDto) {
    // Verifica se já existe um usuário com o mesmo e-mail para evitar duplicatas.
    const exists = await this.prisma.user.findUnique({ where: { email: data.email } });
    // Se o e-mail já estiver em uso, lança uma exceção de conflito (HTTP 409).
    if (exists) throw new ConflictException('E-mail já cadastrado');

    // Gera um hash da senha do usuário para armazenamento seguro. O `10` é o "salt round".
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Extrai os campos do DTO para garantir que apenas os dados esperados sejam passados ao Prisma.
    const { name, email, avatarUrl } = data;

    // Cria o novo usuário no banco de dados com a senha hasheada.
    return this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        avatarUrl: avatarUrl || null, // Garante que o valor seja `null` se `avatarUrl` for `undefined`.
      },
      // Usa a cláusula `select` para retornar apenas os dados não sensíveis do usuário.
      select: { id: true, email: true, name: true, avatarUrl: true },
    });
  }

  /**
   * Busca um usuário pelo seu endereço de e-mail.
   * Este método é crucial para o processo de login.
   * @param email - O e-mail do usuário a ser encontrado.
   * @returns O objeto completo do usuário (incluindo a senha hasheada) ou `null` se não for encontrado.
   */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  /**
   * Atualiza os dados de um usuário existente.
   * @param id - O ID do usuário a ser atualizado.
   * @param data - Os novos dados para o usuário.
   * @returns Os dados atualizados do usuário (sem a senha).
   */
  async update(id: string, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id }, // Especifica qual usuário atualizar.
      data,         // Fornece os novos dados.
      // Retorna apenas os campos não sensíveis após a atualização.
      select: { id: true, email: true, name: true, avatarUrl: true },
    });
  }
}
