import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Endereço de e-mail do usuário', example: 'usuario@email.com' })
  @IsEmail({}, { message: 'O e-mail fornecido deve ser válido.' })
  email: string;

  @ApiProperty({ description: 'Senha do usuário', example: '123456' })
  @IsString()
  password: string;
}
