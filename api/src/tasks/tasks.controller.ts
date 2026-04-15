
/**
 * ======================================================
 * CAMADA: CONTROLLER (O Porteiro da API)
 * ======================================================
 * Este arquivo define as ROTAS da aplicação. 
 * Ele é o responsável por receber o pedido do Frontend (Request),
 * verificar se o usuário está logado (Guards) e repassar a ordem 
 * para o Service executar a inteligência.
 */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // Protege todas as rotas desta classe
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar uma nova tarefa' })
  create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    // req.user.id vem do Token JWT validado pelo Guard
    return this.tasksService.create(createTaskDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as tarefas do usuário logado' })
  findAll(@Request() req) {
    return this.tasksService.findAll(req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma tarefa (Somente o dono)' })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Request() req) {
    return this.tasksService.update(id, req.user.id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover uma tarefa (Somente o dono)' })
  remove(@Param('id') id: string, @Request() req) {
    return this.tasksService.remove(id, req.user.id);
  }
}
