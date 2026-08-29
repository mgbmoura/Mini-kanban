import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RedefinirSenhaDto {
  @ApiProperty({ description: 'Token recebido por e-mail' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ description: 'Nova senha do usuário' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  password: string;
}
