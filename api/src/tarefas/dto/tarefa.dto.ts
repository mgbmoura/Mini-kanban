import { ApiProperty } from '@nestjs/swagger';
import { CriarTarefaDto } from './criar-tarefa.dto';

export class TarefaDto extends CriarTarefaDto {
  @ApiProperty({ description: 'ID único da tarefa' })
  id: string;

  @ApiProperty({ description: 'ID do usuário proprietário da tarefa' })
  userId: string;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização' })
  updatedAt: Date;

  @ApiProperty({ description: 'Quantidade de comentários', default: 0 })
  commentCount?: number;
}
