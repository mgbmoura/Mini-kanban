import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private generateGravatarUrl(email: string): string {
    const trimmedEmail = email.trim().toLowerCase();
    const hash = crypto.createHash('md5').update(trimmedEmail).digest('hex');
    return `https://www.gravatar.com/avatar/${hash}?d=retro`;
  }

  async create(data: CreateUserDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (exists) {
      throw new BadRequestException('Este e-mail já está em uso.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const gravatarUrl = this.generateGravatarUrl(data.email);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        avatarUrl: gravatarUrl,
      },
    });

    // Para o método create, nós retornamos o usuário sem a senha.
    const { password, ...result } = user;
    return result;
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    // Mapeia para remover a senha de todos os usuários retornados.
    return users.map(user => {
      const { password, ...result } = user;
      return result;
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new BadRequestException('Utilizador não encontrado.');
    }
    // Retorna o usuário sem a senha.
    const { password, ...result } = user;
    return result;
  }

  /**
   * Busca um usuário pelo e-mail para o fluxo de autenticação.
   * CORREÇÃO: Esta função DEVE retornar o objeto de usuário completo, incluindo a senha,
   * para que o AuthService possa comparar a senha fornecida com a senha hasheada.
   * O AuthService será responsável por não expor a senha na resposta final da API.
   */
  async findByEmail(email: string) {
    let user = await this.prisma.user.findUnique({ where: { email } });

    // Se o usuário existir, mas não tiver um avatar, gera um Gravatar e atualiza.
    if (user && !user.avatarUrl) {
      const gravatarUrl = this.generateGravatarUrl(user.email);
      user = await this.prisma.user.update({
        where: { email: user.email },
        data: { avatarUrl: gravatarUrl },
      });
    }

    // Retorna o objeto de usuário completo (com senha) para o AuthService.
    return user;
  }

  async update(id: string, data: UpdateUserDto) {
    // DIAGNÓSTICO: Vamos ver os dados do usuário ANTES de qualquer atualização.
    const userBeforeUpdate = await this.prisma.user.findUnique({ where: { id } });
    console.log('--- DIAGNÓSTICO: DADOS DO USUÁRIO ANTES DA ATUALIZAÇÃO ---');
    console.log(userBeforeUpdate);
    console.log('---------------------------------------------------------');

    if ((data as any).password) {
      (data as any).password = await bcrypt.hash((data as any).password, 10);
    }
    
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    // Retorna o usuário atualizado sem a senha.
    const { password, ...result } = user;
    return result;
  }

  async remove(id: string) {
    const user = await this.prisma.user.delete({ where: { id } });
    // Retorna o usuário removido sem a senha.
    const { password, ...result } = user;
    return result;
  }
}
