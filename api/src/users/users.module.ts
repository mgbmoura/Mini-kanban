// Importa o decorador Module, essencial para a criação de módulos no NestJS.
import { Module } from '@nestjs/common';
// Importa o serviço UsersService, que encapsula a lógica de negócio para usuários.
import { UsersService } from './users.service';
// Importa o controlador UsersController, que gerencia as rotas e requisições HTTP para usuários.
import { UsersController } from './users.controller';

// Define o módulo de usuários, agrupando todos os componentes relacionados a usuários.
@Module({
  // Registra os controladores que fazem parte deste módulo.
  controllers: [UsersController],
  // Registra os provedores (serviços) que estarão disponíveis para injeção de dependência neste módulo.
  providers: [UsersService],
  // Exporta o `UsersService` para que ele possa ser injetado e utilizado por outros módulos
  // que importarem o `UsersModule` (como o `AuthModule`).
  exports: [UsersService],
})
// Exporta a classe do módulo para que ela possa ser importada no módulo principal (AppModule).
export class UsersModule {}