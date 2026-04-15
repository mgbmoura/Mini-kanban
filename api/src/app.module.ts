
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module'; 
import { CommentsModule } from './comments/comments.module';

/**
 * AppModule: O ponto central da aplicação.
 * Cada módulo (Auth, Tasks, Users, etc.) é independente e encapsulado,
 * seguindo os princípios de alta coesão e baixo acoplamento.
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    TasksModule,
    MailModule, 
    CommentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
