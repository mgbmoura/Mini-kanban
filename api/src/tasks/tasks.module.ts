// Importa o decorador Module, necessário para criar módulos no NestJS.
import { Module } from '@nestjs/common';
// Importa o serviço TasksService, que contém a lógica de negócio para as tarefas.
import { TasksService } from './tasks.service';
// Importa o controlador TasksController, que gerencia as requisições HTTP para as tarefas.
import { TasksController } from './tasks.controller';

// Define o módulo de tarefas, agrupando componentes relacionados a tarefas.
@Module({
  // Registra os controladores que pertencem a este módulo.
  controllers: [TasksController],
  // Registra os provedores (serviços) que estarão disponíveis para injeção de dependência dentro deste módulo.
  providers: [TasksService],
})
// Exporta a classe do módulo para que possa ser importada por outros módulos (como o AppModule).
export class TasksModule {}