import { ApiProperty } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';

/**
 * Representa uma tarefa completa retornada pela API.
 * Herda as propriedades de CreateTaskDto e adiciona campos específicos da entidade Task.
 */
export class TaskDto extends CreateTaskDto {
  @ApiProperty({ description: 'O ID único da tarefa', example: 'clv6l12b10000u8z6a3c1d9f1' })
  id: string;

  @ApiProperty({ description: 'O ID do usuário proprietário da tarefa', example: 'clv6l0wac0000u8z6e4g1h9k1' })
  userId: string;

  @ApiProperty({ description: 'A data e hora em que a tarefa foi criada', example: '2023-04-01T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'A data e hora da última atualização da tarefa', example: '2023-04-01T11:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ description: 'A contagem de comentários na tarefa', example: 5, default: 0 })
  commentCount?: number;
}
