import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { UsuariosRepository } from '../usuarios/usuarios.repository';
import { UsuariosService } from '../usuarios/usuarios.service';
import { EntrarDto } from './dto/entrar.dto';
import { EsqueciSenhaDto } from './dto/esqueci-senha.dto';
import { RedefinirSenhaDto } from './dto/redefinir-senha.dto';

@Injectable()
export class AutenticacaoService {
  private readonly logger = new Logger(AutenticacaoService.name);

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly usuariosRepository: UsuariosRepository,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async entrar(credenciais: EntrarDto) {
    const usuario = await this.usuariosService.buscarPorEmail(credenciais.email);

    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const senhaValida = await bcrypt.compare(credenciais.password, usuario.password);

    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const payload = {
      sub: usuario.id,
      email: usuario.email,
      name: usuario.name,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
        avatarUrl: usuario.avatarUrl,
      },
    };
  }

  async solicitarRedefinicaoSenha(dados: EsqueciSenhaDto): Promise<void> {
    const usuario = await this.usuariosService.buscarPorEmail(dados.email);

    if (!usuario) {
      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiraEm = new Date(Date.now() + 60 * 60 * 1000);

    await this.usuariosRepository.atualizarPorEmail(dados.email, {
      passwordResetToken: tokenHash,
      passwordResetExpires: expiraEm,
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const link = `${frontendUrl}/reset-password?token=${token}`;

    try {
      await this.mailerService.sendMail({
        to: dados.email,
        subject: 'Redefinição de Senha - Mini Kanban',
        template: './reset-password',
        context: { name: usuario.name, link },
      });
    } catch (erro) {
      this.logger.error('Não foi possível enviar o e-mail de redefinição de senha.', erro);
    }
  }

  async redefinirSenha(dados: RedefinirSenhaDto): Promise<void> {
    const tokenHash = crypto.createHash('sha256').update(dados.token).digest('hex');
    const usuario = await this.usuariosRepository.buscarPorTokenRedefinicaoValido(tokenHash);

    if (!usuario) {
      throw new BadRequestException('Token de recuperação inválido ou expirado.');
    }

    const senhaCriptografada = await bcrypt.hash(dados.password, 10);

    await this.usuariosRepository.atualizar(usuario.id, {
      password: senhaCriptografada,
      passwordResetToken: null,
      passwordResetExpires: null,
    });
  }
}
