// Importa o decorador `ApiPropertyOptional` para documentar propriedades opcionais no Swagger.
import { ApiPropertyOptional } from '@nestjs/swagger';
// Importa os validadores `IsString`, `IsOptional` e `IsUrl` do class-validator.
import { IsString, IsOptional, IsUrl } from 'class-validator';

/**
 * Define o Data Transfer Object (DTO) para a atualização de dados do usuário.
 * Como na atualização nem todos os campos são obrigatórios, as propriedades são marcadas como opcionais.
 */
export class UpdateUserDto {
  // Documenta a propriedade no Swagger, fornecendo uma descrição e um exemplo.
  @ApiPropertyOptional({ description: 'Novo nome completo do usuário', example: 'Marcelo Giulian' })
  // Validações: deve ser uma string e é opcional.
  @IsString()
  @IsOptional()
  name?: string;

  // Documenta a propriedade no Swagger com descrição e exemplo.
  @ApiPropertyOptional({ description: 'Nova URL da foto de perfil', example: 'https://example.com/avatar.png' })
  // Validações: deve ser uma URL válida e é opcional. A mensagem de erro customizada é exibida se a validação de URL falhar.
  @IsUrl({}, { message: 'A URL do avatar deve ser uma URL válida' })
  @IsOptional()
  avatarUrl?: string;
}
