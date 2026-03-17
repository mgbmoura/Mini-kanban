import { TaskStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsArray,
  IsEnum,
  IsNumber,
} from 'class-validator';

const VALID_PRIORITIES = ['Baixa', 'Média', 'Alta'];

export class CreateTaskDto {
  @ApiProperty({ description: 'Título da tarefa', example: 'Minha Tarefa' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Descrição da tarefa', example: 'Descrição da minha tarefa', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: TaskStatus, description: 'Status da tarefa', example: 'TODO', required: false })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({ enum: VALID_PRIORITIES, description: 'Prioridade da tarefa', example: 'Média', required: false })
  @IsOptional()
  @IsIn(VALID_PRIORITIES)
  priority?: string;

  @ApiProperty({ type: [String], description: 'Tags da tarefa', example: ['Tag1', 'Tag2'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ description: 'URL de uma imagem anexa', example: 'https://example.com/image.png', required: false })
  @IsOptional()
  @IsString()
  attachmentImage?: string;

  @ApiProperty({ description: 'Posição da tarefa', example: 1, required: false })
  @IsNumber()
  @IsOptional()
  position?: number;
}
