import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function iniciarAplicacao() {
  const aplicativo = await NestFactory.create(AppModule);

  aplicativo.enableShutdownHooks();
  aplicativo.enableCors();

  aplicativo.setGlobalPrefix('api');
  aplicativo.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const configuracaoSwagger = new DocumentBuilder()
    .setTitle('Mini Kanban API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentoSwagger = SwaggerModule.createDocument(aplicativo, configuracaoSwagger);
  SwaggerModule.setup('api/docs', aplicativo, documentoSwagger);

  await aplicativo.listen(3000, '0.0.0.0');
}

iniciarAplicacao();
