import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { type User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto';
import { CriarUsuarioDto } from './dto/criar-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dados: CriarUsuarioDto) {
    const usuarioExistente = await this.prisma.user.findUnique({ where: { email: dados.email } });

    if (usuarioExistente) {
      throw new ConflictException('Este e-mail já está em uso.');
    }

    const senhaCriptografada = await bcrypt.hash(dados.password, 10);

    const usuario = await this.prisma.user.create({
      data: {
        name: dados.name,
        email: dados.email,
        password: senhaCriptografada,
        avatarUrl: this.gerarUrlGravatar(dados.email),
      },
    });

    return this.removerDadosSensiveis(usuario);
  }

  async buscarPorId(id: string) {
    const usuario = await this.prisma.user.findUnique({ where: { id } });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return this.removerDadosSensiveis(usuario);
  }

  buscarPorEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async atualizar(id: string, dados: AtualizarUsuarioDto) {
    const usuario = await this.prisma.user.update({
      where: { id },
      data: { name: dados.name },
    });

    return this.removerDadosSensiveis(usuario);
  }

  salvarTokenRedefinicao(email: string, token: string, expiraEm: Date) {
    return this.prisma.user.update({
      where: { email },
      data: {
        passwordResetToken: token,
        passwordResetExpires: expiraEm,
      },
    });
  }

  buscarPorTokenRedefinicaoValido(token: string) {
    return this.prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: { gte: new Date() },
      },
    });
  }

  async redefinirSenha(id: string, novaSenha: string) {
    const senhaCriptografada = await bcrypt.hash(novaSenha, 10);

    await this.prisma.user.update({
      where: { id },
      data: {
        password: senhaCriptografada,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });
  }

  private gerarUrlGravatar(email: string) {
    const emailNormalizado = email.trim().toLowerCase();
    const hash = crypto.createHash('md5').update(emailNormalizado).digest('hex');
    return `https://www.gravatar.com/avatar/${hash}?d=retro`;
  }

  private removerDadosSensiveis(usuario: User) {
    const {
      password: _senha,
      passwordResetToken: _tokenRedefinicao,
      passwordResetExpires: _expiracaoRedefinicao,
      ...usuarioSeguro
    } = usuario;

    return usuarioSeguro;
  }
}
