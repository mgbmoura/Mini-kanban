import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthenticatedRequest } from '../auth/auth.types';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar uma nova tarefa' })
  create(@Body() createTaskDto: CreateTaskDto, @Request() request: AuthenticatedRequest) {
    return this.tasksService.create(createTaskDto, request.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as tarefas do usuário logado' })
  findAll(@Request() request: AuthenticatedRequest) {
    return this.tasksService.findAll(request.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma tarefa (Somente o dono)' })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Request() request: AuthenticatedRequest) {
    return this.tasksService.update(id, request.user.id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover uma tarefa (Somente o dono)' })
  remove(@Param('id') id: string, @Request() request: AuthenticatedRequest) {
    return this.tasksService.remove(id, request.user.id);
  }
}
