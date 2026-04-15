import { Injectable, UnauthorizedException, Logger, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from '../prisma/prisma.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
    private prisma: PrismaService,
  ) {}

  /**
   * Realiza o login do usuário.
   * 1. Busca o usuário pelo e-mail.
   * 2. Compara a senha enviada com o hash salvo no banco usando bcrypt.
   * 3. Se estiver correto, gera um Token JWT com os dados básicos do usuário.
   */
  async login(data: LoginDto) {
    const user = await this.usersService.findByEmail(data.email);

    if (user && (await bcrypt.compare(data.password, user.password))) {
      // O Payload é o "recheio" do token que será validado nas rotas protegidas
      const payload = { sub: user.id, email: user.email, name: user.name };
      return {
        accessToken: this.jwtService.sign(payload),
        user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
      };
    }
    throw new UnauthorizedException('Credenciais inválidas');
  }

  /**
   * Solicita a recuperação de senha.
   * 1. Gera um token aleatório (segredo temporário).
   * 2. Cria um HASH desse token para salvar no banco (por segurança, nunca salvamos o token puro).
   * 3. Define uma validade de 1 hora.
   * 4. Envia o link para o usuário (via log e e-mail).
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const { email } = forgotPasswordDto;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      this.logger.warn(`Tentativa de redefinição para e-mail não registrado: ${email}`);
      return;
    }

    // Gerando o segredo aleatório
    const resetToken = crypto.randomBytes(32).toString('hex');
    // Criando o Hash (SHA-256) para persistência segura
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expires = new Date(Date.now() + 3600000); // Expira em 1 hora

    // Atualiza o usuário no banco com o segredo hasheado
    await this.prisma.user.update({
      where: { email },
      data: { 
        passwordResetToken: hashedToken, 
        passwordResetExpires: expires 
      },
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    // Exibição no log para facilitar testes sem precisar abrir o e-mail
    this.logger.log('================================================');
    this.logger.log(`SOLICITAÇÃO DE SENHA PARA: ${email}`);
    this.logger.log(`LINK DE ACESSO: ${resetUrl}`);
    this.logger.log('================================================');

    try {
      await this.mailerService.sendMail({
          to: email,
          subject: 'Redefinição de Senha - Mini Kanban',
          template: './reset-password',
          context: {
            name: user.name,
            link: resetUrl,
          },
      });
    } catch (error) {
      this.logger.error('Erro ao enviar e-mail, mas o fluxo continuará pelo log.', error);
    }
  }

  /**
   * Conclui a redefinição de senha.
   * 1. Cria o hash do token recebido na URL para comparar com o banco.
   * 2. Verifica se o usuário existe e se o token ainda é válido (não expirou).
   * 3. Se ok, criptografa a nova senha e limpa os campos de reset.
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { token, password } = resetPasswordDto;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    // Busca o usuário que possui esse hash e que a data de expiração seja MAIOR que agora
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { gte: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    // Nova senha sendo hasheada antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null, // Limpa o token para não ser usado de novo
        passwordResetExpires: null,
      },
    });
  }
}
