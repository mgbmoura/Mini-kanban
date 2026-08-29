import { Module } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { ComentariosController } from './comentarios.controller';
import { ComentariosRepository } from './comentarios.repository';
import { TarefasModule } from '../tarefas/tarefas.module';

@Module({
  imports: [TarefasModule],
  controllers: [ComentariosController],
  providers: [ComentariosService, ComentariosRepository],
  exports: [ComentariosService, ComentariosRepository],
})
export class ComentariosModule {}
