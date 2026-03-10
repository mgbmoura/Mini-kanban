// Importa os decoradores e módulos necessários do NestJS e de outras bibliotecas.
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// Importa decoradores do Swagger para a documentação da API.
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

// Agrupa todos os endpoints deste controller sob a tag 'Tasks' na documentação do Swagger.
@ApiTags('Tasks')
// Indica que todos os endpoints neste controller requerem um token JWT (Bearer Token) para autenticação.
@ApiBearerAuth()
// Aplica o `JwtAuthGuard` a todos os endpoints, protegendo as rotas e garantindo que apenas usuários autenticados possam acessá-las.
@UseGuards(JwtAuthGuard)
// Define o prefixo da rota para todos os endpoints deste controller como '/tasks'.
@Controller('tasks')
export class TasksController {
  // Injeta o `TasksService` para que seus métodos possam ser chamados pelos endpoints.
  constructor(private readonly tasksService: TasksService) {}

  /**
   * Endpoint para criar uma nova tarefa.
   * Rota: POST /tasks
   */
  @Post()
  // Adiciona metadados para o Swagger, descrevendo a operação.
  @ApiOperation({ summary: 'Criar uma nova tarefa' })
  // Descreve a resposta esperada (status 201 - Created).
  @ApiResponse({ status: 201, description: 'Tarefa criada com sucesso.' })
  create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    // Chama o método `create` do serviço, passando os dados da tarefa e o ID do usuário.
    // O `req.user` é adicionado à requisição pelo `JwtAuthGuard` após a validação do token.
    return this.tasksService.create(createTaskDto, req.user.id);
  }

  /**
   * Endpoint para listar todas as tarefas do usuário autenticado.
   * Rota: GET /tasks
   */
  @Get()
  @ApiOperation({ summary: 'Listar todas as tarefas do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de tarefas retornada com sucesso.' })
  findAll(@Request() req) {
    // Chama o método `findAll` do serviço, passando o ID do usuário para buscar apenas suas tarefas.
    return this.tasksService.findAll(req.user.id);
  }

  /**
   * Endpoint para atualizar uma tarefa existente.
   * Rota: PATCH /tasks/:id
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma tarefa existente' })
  @ApiResponse({ status: 200, description: 'Tarefa atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada.' }) // Documenta possíveis erros.
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Request() req) {
    // Chama o método `update` do serviço, passando o ID da tarefa, o ID do usuário e os novos dados.
    return this.tasksService.update(id, req.user.id, updateTaskDto);
  }

  /**
   * Endpoint para remover uma tarefa.
   * Rota: DELETE /tasks/:id
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma tarefa' })
  @ApiResponse({ status: 200, description: 'Tarefa removida com sucesso.' })
  remove(@Param('id') id: string, @Request() req) {
    // Chama o método `remove` do serviço, passando o ID da tarefa e o ID do usuário para verificação de permissão.
    return this.tasksService.remove(id, req.user.id);
  }
}
