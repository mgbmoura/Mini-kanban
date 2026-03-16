import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ description: 'O token recebido por e-mail' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ description: 'A nova senha do usuário' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password: string;
}
