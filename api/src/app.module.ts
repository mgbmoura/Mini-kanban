import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { existsSync } from 'fs';
import { join } from 'path';
import { AutenticacaoModule } from './autenticacao/autenticacao.module';
import { ComentariosModule } from './comentarios/comentarios.module';
import { EmailModule } from './email/email.module';
import { PrismaModule } from './prisma/prisma.module';
import { TarefasModule } from './tarefas/tarefas.module';
import { UsuariosModule } from './usuarios/usuarios.module';

function localizarBuildFrontend() {
  const caminhos = [
    join(process.cwd(), 'web', 'dist'),
    join(process.cwd(), '..', 'web', 'dist'),
    join(__dirname, '..', '..', 'web', 'dist'),
    join(__dirname, '..', '..', '..', 'web', 'dist'),
  ];

  return caminhos.find((caminho) => existsSync(join(caminho, 'index.html'))) ?? caminhos[0];
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: localizarBuildFrontend(),
      exclude: ['/api', '/api/*path'],
    }),
    PrismaModule,
    UsuariosModule,
    AutenticacaoModule,
    TarefasModule,
    EmailModule,
    ComentariosModule,
  ],
})
export class AppModule {}
