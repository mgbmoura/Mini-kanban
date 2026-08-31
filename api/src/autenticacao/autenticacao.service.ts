import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { UsuariosService } from '../usuarios/usuarios.service';
import { EntrarDto } from './dto/entrar.dto';
import { EsqueciSenhaDto } from './dto/esqueci-senha.dto';
import { RedefinirSenhaDto } from './dto/redefinir-senha.dto';

@Injectable()
export class AutenticacaoService {
  private readonly logger = new Logger(AutenticacaoService.name);

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly configuracao: ConfigService,
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

    await this.usuariosService.salvarTokenRedefinicao(dados.email, tokenHash, expiraEm);

    const frontendUrl = this.configuracao.getOrThrow<string>('FRONTEND_URL');
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
    const usuario = await this.usuariosService.buscarPorTokenRedefinicaoValido(tokenHash);

    if (!usuario) {
      throw new BadRequestException('Token de recuperação inválido ou expirado.');
    }

    await this.usuariosService.redefinirSenha(usuario.id, dados.password);
  }
}
