import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class CriarUsuarioDto {
  @ApiProperty({ description: 'Nome do usuário', example: 'Usuário' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'E-mail de acesso', example: 'usuario@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha de acesso', example: 'senha123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'URL da foto de perfil', required: false })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
