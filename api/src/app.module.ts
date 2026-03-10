// Importa o decorador Module do NestJS, essencial para a organização da aplicação em módulos.
import { Module } from '@nestjs/common';
// Importa o ServeStaticModule, usado para servir arquivos estáticos como imagens, CSS, etc.
import { ServeStaticModule } from '@nestjs/serve-static';
// Importa a função 'join' do módulo 'path' do Node.js, para manipular caminhos de diretórios de forma segura.
import { join } from 'path';
// Importa os módulos que compõem a aplicação.
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
// Importa o controller de upload.
import { UploadController } from './controllers/upload.controller';
import { ConfigModule } from '@nestjs/config'; // Importa o ConfigModule

// Define o módulo principal da aplicação.
@Module({
  imports: [
    // Carrega e disponibiliza as variáveis de ambiente globalmente
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Configura o módulo para servir arquivos estáticos.
    // Isso permite que a pasta 'uploads' seja acessível publicamente via HTTP.
    ServeStaticModule.forRoot({
      // Define o caminho físico para o diretório raiz dos arquivos estáticos.
      // `__dirname` aponta para o diretório do arquivo atual (dentro de 'dist' em tempo de execução).
      // `join` constrói o caminho para a pasta 'uploads' na raiz do projeto.
      rootPath: join(__dirname, '..', 'uploads'),
      // Define o prefixo da rota na URL para acessar os arquivos estáticos.
      // Ex: http://localhost:3000/uploads/nome-do-arquivo.jpg
      serveRoot: '/uploads',
    }),
    // Importa os outros módulos para que seus recursos (serviços, controllers) fiquem disponíveis.
    PrismaModule,
    AuthModule,
    UsersModule,
    TasksModule,
  ],
  // Registra os controllers que pertencem diretamente a este módulo.
  controllers: [UploadController],
})
// Exporta a classe do módulo principal.
export class AppModule { }
