import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CriarComentarioDto {
  @ApiProperty({ description: 'Conteúdo do comentário', example: 'Meu comentário' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
