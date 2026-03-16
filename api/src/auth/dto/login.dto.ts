// Importa o decorador `ApiProperty` para documentar as propriedades da classe no Swagger.
import { ApiProperty } from '@nestjs/swagger';
// Importa os validadores `IsEmail` e `IsString` do class-validator.
import { IsEmail, IsString } from 'class-validator';

/**
 * Define o Data Transfer Object (DTO) para o endpoint de login.
 * Contém as credenciais (e-mail e senha) necessárias para a autenticação.
 */
export class LoginDto {
  // Documenta a propriedade `email` no Swagger e aplica validadores.
  @ApiProperty({ description: 'Endereço de e-mail do usuário', example: 'usuario@email.com' })
  @IsEmail({}, { message: 'O e-mail fornecido deve ser válido.' })
  email: string;

  // Documenta a propriedade `password` no Swagger e aplica um validador.
  @ApiProperty({ description: 'Senha do usuário', example: '123456' })
  @IsString()
  password: string;
}
