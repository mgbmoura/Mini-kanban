import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'O novo nome do usuário', example: 'Usuario Atualizado' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'A nova URL do avatar do usuário', example: 'https://example.com/new_avatar.png' })
  @IsUrl()
  @IsOptional()
  avatarUrl?: string;
}
