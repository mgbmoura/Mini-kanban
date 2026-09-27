import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AtualizarUsuarioDto {
  @ApiPropertyOptional({ description: 'Novo nome do usuário' })
  @IsString()
  @IsOptional()
  name?: string;
}
