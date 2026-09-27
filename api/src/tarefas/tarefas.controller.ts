import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GuardAutenticacaoJwt } from '../autenticacao/guards/guard-autenticacao-jwt';
import { AtualizarTarefaDto } from './dto/atualizar-tarefa.dto';
import { CriarTarefaDto } from './dto/criar-tarefa.dto';
import { TarefaDto } from './dto/tarefa.dto';
import { TarefasService } from './tarefas.service';

interface RequisicaoAutenticada {
  user: { id: string };
}

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(GuardAutenticacaoJwt)
@Controller('tasks')
export class TarefasController {
  constructor(private readonly tarefasService: TarefasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar uma nova tarefa' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Tarefa criada com sucesso.', type: TarefaDto })
  criar(@Body() dados: CriarTarefaDto, @Request() requisicao: RequisicaoAutenticada) {
    return this.tarefasService.criar(dados, requisicao.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as tarefas do usuário' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de tarefas retornada com sucesso.', type: [TarefaDto] })
  listar(@Request() requisicao: RequisicaoAutenticada) {
    return this.tarefasService.listar(requisicao.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma tarefa existente' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Tarefa atualizada com sucesso.', type: TarefaDto })
  atualizar(
    @Param('id') id: string,
    @Body() dados: AtualizarTarefaDto,
    @Request() requisicao: RequisicaoAutenticada,
  ) {
    return this.tarefasService.atualizar(id, requisicao.user.id, dados);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover uma tarefa' })
  remover(@Param('id') id: string, @Request() requisicao: RequisicaoAutenticada) {
    return this.tarefasService.remover(id, requisicao.user.id);
  }
}
