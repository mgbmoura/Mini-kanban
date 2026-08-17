
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

    const { password, ...result } = user;
    return result;
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
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
    const { password, ...result } = user;
    return result;
  }

  async findByEmail(email: string) {
    let user = await this.prisma.user.findUnique({ where: { email } });

    if (user && !user.avatarUrl) {
      const gravatarUrl = this.generateGravatarUrl(user.email);
      user = await this.prisma.user.update({
        where: { email: user.email },
        data: { avatarUrl: gravatarUrl },
      });
    }

    return user;
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    const { password, ...result } = user;
    return result;
  }

  async remove(id: string) {
    const user = await this.prisma.user.delete({ where: { id } });
    const { password, ...result } = user;
    return result;
  }
}
