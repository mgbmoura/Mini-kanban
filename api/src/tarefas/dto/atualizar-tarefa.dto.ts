import { PartialType } from '@nestjs/swagger';
import { CriarTarefaDto } from './criar-tarefa.dto';

export class AtualizarTarefaDto extends PartialType(CriarTarefaDto) {}
