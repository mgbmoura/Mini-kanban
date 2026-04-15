// Importa a função `PartialType` do Swagger, que é usada para criar tipos derivados.
import { PartialType } from '@nestjs/swagger';
// Importa o DTO (Data Transfer Object) de criação de tarefa.
import { CreateTaskDto } from './create-task.dto';

/**
 * Define o Data Transfer Object (DTO) para a atualização de tarefas.
 * `UpdateTaskDto` herda de `CreateTaskDto` mas, graças ao `PartialType`,
 * todas as propriedades se tornam opcionais. Isso significa que ao atualizar
 * uma tarefa, o cliente não precisa enviar todos os campos, apenas aqueles
 * que deseja modificar.
 */
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}