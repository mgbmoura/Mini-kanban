// Importa os decoradores e módulos necessários do NestJS e de outras bibliotecas.
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// Importa decoradores do Swagger para a documentação da API.
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TaskDto } from './dto/task.dto';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // Define o código de status HTTP para 201
  @ApiOperation({ summary: 'Criar uma nova tarefa' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Tarefa criada com sucesso.', type: TaskDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Os dados fornecidos são inválidos.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autorizado.' })
  create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    return this.tasksService.create(createTaskDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as tarefas do usuário' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de tarefas retornada com sucesso.', type: [TaskDto] }) // Retorna um array de TaskDto
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autorizado.' })
  findAll(@Request() req) {
    return this.tasksService.findAll(req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma tarefa existente' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Tarefa atualizada com sucesso.', type: TaskDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tarefa não encontrada ou não pertence ao usuário.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autorizado.' })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Request() req) {
    return this.tasksService.update(id, req.user.id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Define o código de status HTTP para 204
  @ApiOperation({ summary: 'Remover uma tarefa' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Tarefa removida com sucesso.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tarefa não encontrada ou não pertence ao usuário.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autorizado.' })
  remove(@Param('id') id: string, @Request() req) {
    return this.tasksService.remove(id, req.user.id);
  }
}
