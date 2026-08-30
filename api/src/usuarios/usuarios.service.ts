import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, type User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto';
import { CriarUsuarioDto } from './dto/criar-usuario.dto';
import { UsuariosRepository } from './usuarios.repository';

@Injectable()
export class UsuariosService {
  constructor(private readonly usuariosRepository: UsuariosRepository) {}

  async criar(dados: CriarUsuarioDto) {
    const usuarioExistente = await this.usuariosRepository.buscarPorEmail(dados.email);

    if (usuarioExistente) {
      throw new ConflictException('Este e-mail já está em uso.');
    }

    const senhaCriptografada = await bcrypt.hash(dados.password, 10);

    const usuario = await this.usuariosRepository.criar({
      name: dados.name,
      email: dados.email,
      password: senhaCriptografada,
      avatarUrl: this.gerarUrlGravatar(dados.email),
    });

    return this.removerDadosSensiveis(usuario);
  }

  async buscarPorId(id: string) {
    const usuario = await this.usuariosRepository.buscarPorId(id);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return this.removerDadosSensiveis(usuario);
  }

  async buscarPorEmail(email: string) {
    let usuario = await this.usuariosRepository.buscarPorEmail(email);

    if (usuario && !usuario.avatarUrl) {
      usuario = await this.usuariosRepository.atualizar(usuario.id, {
        avatarUrl: this.gerarUrlGravatar(usuario.email),
      });
    }

    return usuario;
  }

  async atualizar(id: string, dados: AtualizarUsuarioDto) {
    const atualizacao: Prisma.UserUpdateInput = { ...dados };

    if (dados.password) {
      atualizacao.password = await bcrypt.hash(dados.password, 10);
    }

    const usuario = await this.usuariosRepository.atualizar(id, atualizacao);
    return this.removerDadosSensiveis(usuario);
  }

  async remover(id: string) {
    const usuario = await this.usuariosRepository.remover(id);
    return this.removerDadosSensiveis(usuario);
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
