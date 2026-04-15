import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsUrl } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'O nome do usuário', example: 'Usuario' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'O email de acesso do usuário', example: 'usuario@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'A senha de acesso (mínimo de 6 caracteres)', example: 'senha123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'A URL para a foto de perfil', example: 'https://example.com/avatar.png', required: false })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
