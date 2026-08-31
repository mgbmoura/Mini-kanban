import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AutenticacaoModule } from './autenticacao/autenticacao.module';
import { ComentariosModule } from './comentarios/comentarios.module';
import { EmailModule } from './email/email.module';
import { PrismaModule } from './prisma/prisma.module';
import { TarefasModule } from './tarefas/tarefas.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsuariosModule,
    AutenticacaoModule,
    TarefasModule,
    EmailModule,
    ComentariosModule,
  ],
})
export class AppModule {}
