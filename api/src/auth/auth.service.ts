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

  async login(data: LoginDto) {
    const user = await this.usersService.findByEmail(data.email);

    if (user && (await bcrypt.compare(data.password, user.password))) {
      const payload = { sub: user.id, email: user.email, name: user.name };
      return {
        accessToken: this.jwtService.sign(payload),
        user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
      };
    }
    throw new UnauthorizedException('Credenciais inválidas');
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const { email } = forgotPasswordDto;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      this.logger.warn(`Tentativa de redefinição para e-mail não registrado: ${email}`);
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await this.prisma.user.update({
      where: { email },
      data: { 
        passwordResetToken: hashedToken, 
        passwordResetExpires: expires 
      },
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    this.logger.log('================================================');
    this.logger.log(`SOLICITAÇÃO DE SENHA PARA: ${email}`);
    this.logger.log(`LINK DE ACESSO: ${resetUrl}`);
    this.logger.log('================================================');

    await this.mailerService.sendMail({
        to: email,
        subject: 'Redefinição de Senha - Mini Kanban',
        template: './reset-password',
        context: {
          name: user.name,
          link: resetUrl,
        },
    });
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { token, password } = resetPasswordDto;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { gte: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });
  }
}
