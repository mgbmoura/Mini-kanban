// Importa o `NestFactory` para criar a instância da aplicação NestJS.
import { NestFactory } from '@nestjs/core';
// Importa o módulo principal da aplicação, que agrega todos os outros módulos.
import { AppModule } from './app.module';
// Importa o `ValidationPipe` para habilitar a validação automática de DTOs.
import { ValidationPipe } from '@nestjs/common';
// Importa as ferramentas do Swagger para gerar a documentação da API.
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * A função `bootstrap` é o ponto de entrada da aplicação.
 * Ela inicializa o NestJS, configura middlewares globais e inicia o servidor.
 */
async function bootstrap() {
  // Cria a instância da aplicação NestJS a partir do módulo raiz `AppModule`.
  const app = await NestFactory.create(AppModule);

  // Define um prefixo global para todas as rotas da API (ex: /api/tasks, /api/users).
  app.setGlobalPrefix('api');

  // Habilita o CORS (Cross-Origin Resource Sharing) para permitir requisições de diferentes origens.
  // A configuração com `origin: '*'` é permissiva, ideal para desenvolvimento, mas em produção,
  // deve-se restringir a origens específicas por segurança.
  app.enableCors({
    origin: '*', // Permite que qualquer frontend acesse a API.
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  // Configura um `ValidationPipe` global. Isso garante que todas as requisições que chegam
  // aos controllers e que usam DTOs sejam automaticamente validadas.
  // `whitelist: true`: remove propriedades que não estão definidas no DTO.
  // `transform: true`: tenta transformar os dados de entrada para os tipos definidos no DTO.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Configura a documentação da API usando o Swagger (OpenAPI).
  const config = new DocumentBuilder()
    .setTitle('Mini Kanban API') // Título da API.
    .setVersion('1.0') // Versão da API.
    .addBearerAuth() // Adiciona suporte para autenticação via Bearer Token (JWT).
    .build();

  // Cria o documento do Swagger com base na configuração e na aplicação.
  const document = SwaggerModule.createDocument(app, config);

  // Configura o endpoint `/api/docs` para servir a interface do Swagger UI.
  SwaggerModule.setup('api/docs', app, document);

  // Inicia o servidor da aplicação na porta 3000.
  await app.listen(3000);
}

// Chama a função de inicialização para iniciar o servidor.
bootstrap();
