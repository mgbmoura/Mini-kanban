import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class AtualizarUsuarioDto {
  @ApiPropertyOptional({ description: 'Novo nome do usuário' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Nova URL do avatar' })
  @IsUrl()
  @IsOptional()
  avatarUrl?: string;

  @ApiPropertyOptional({ description: 'Nova senha do usuário' })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;
}
