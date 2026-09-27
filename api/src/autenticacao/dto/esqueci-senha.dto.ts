import { IsEmail } from 'class-validator';

export class EsqueciSenhaDto {
  @IsEmail({}, { message: 'O e-mail fornecido deve ser válido.' })
  email: string;
}
