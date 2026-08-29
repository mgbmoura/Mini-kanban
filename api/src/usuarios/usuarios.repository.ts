import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsuariosRepository {
  constructor(private readonly prisma: PrismaService) {}

  criar(dados: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data: dados });
  }

  buscarPorId(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  buscarPorEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  buscarPorTokenRedefinicaoValido(token: string) {
    return this.prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: { gte: new Date() },
      },
    });
  }

  atualizar(id: string, dados: Prisma.UserUpdateInput) {
    return this.prisma.user.update({ where: { id }, data: dados });
  }

  atualizarPorEmail(email: string, dados: Prisma.UserUpdateInput) {
    return this.prisma.user.update({ where: { email }, data: dados });
  }

  remover(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
