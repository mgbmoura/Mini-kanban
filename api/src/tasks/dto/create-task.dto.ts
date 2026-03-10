// Importa o decorador `ApiProperty` para a documentação do Swagger.
import { ApiProperty } from '@nestjs/swagger';
// Importa os validadores do `class-validator` para garantir a integridade dos dados de entrada.
import {
  IsString,       // Verifica se o valor é uma string.
  IsNotEmpty,     // Verifica se o valor não é vazio.
  IsOptional,     // Marca a propriedade como opcional.
  IsIn,           // Verifica se o valor está dentro de um conjunto de valores permitidos.
  IsArray,        // Verifica se o valor é um array.
} from 'class-validator';

// Define as constantes para os status e prioridades válidos, garantindo consistência.
const VALID_STATUSES = ['TODO', 'DOING', 'DONE'];
const VALID_PRIORITIES = ['Baixa', 'Média', 'Alta'];

/**
 * Define o Data Transfer Object (DTO) para a criação de uma nova tarefa.
 * Esta classe descreve a estrutura de dados esperada no corpo da requisição
 * e aplica regras de validação a cada campo.
 */
export class CreateTaskDto {
  // Documenta a propriedade no Swagger.
  @ApiProperty()
  // Validações: deve ser uma string e não pode ser vazia.
  @IsString()
  @IsNotEmpty()
  title: string;

  // Documenta como opcional no Swagger.
  @ApiProperty({ required: false })
  // Validações: deve ser uma string, mas é opcional.
  @IsString()
  @IsOptional()
  description?: string;

  // Documenta com os valores de enum permitidos.
  @ApiProperty({ enum: VALID_STATUSES, required: false })
  // Validações: é opcional, mas se for fornecido, deve ser um dos status válidos.
  @IsOptional()
  @IsIn(VALID_STATUSES)
  status?: string;

  // Documenta com os valores de enum permitidos.
  @ApiProperty({ enum: VALID_PRIORITIES, required: false })
  // Validações: é opcional, mas se for fornecido, deve ser uma das prioridades válidas.
  @IsOptional()
  @IsIn(VALID_PRIORITIES)
  priority?: string;

  // Documenta como um array de strings opcional.
  @ApiProperty({ type: [String], required: false })
  // Validações: é opcional, deve ser um array e cada item do array deve ser uma string.
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  // Documenta como opcional.
  @ApiProperty({ required: false })
  // Validações: é opcional e, se presente, deve ser uma string (representando a URL ou nome do arquivo).
  @IsOptional()
  @IsString()
  attachmentImage?: string;
}
