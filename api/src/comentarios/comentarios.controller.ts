import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GuardAutenticacaoJwt } from '../autenticacao/guards/guard-autenticacao-jwt';
import { ComentariosService } from './comentarios.service';
import { CriarComentarioDto } from './dto/criar-comentario.dto';

interface RequisicaoAutenticada {
  user: { id: string };
}

@ApiTags('Comments')
@ApiBearerAuth()
@UseGuards(GuardAutenticacaoJwt)
@Controller()
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @Post('tasks/:taskId/comments')
  @ApiOperation({ summary: 'Adicionar comentário a uma tarefa' })
  criar(
    @Param('taskId') tarefaId: string,
    @Body() dados: CriarComentarioDto,
    @Request() requisicao: RequisicaoAutenticada,
  ) {
    return this.comentariosService.criar(tarefaId, requisicao.user.id, dados.content);
  }

  @Get('tasks/:taskId/comments')
  @ApiOperation({ summary: 'Listar comentários de uma tarefa' })
  listar(
    @Param('taskId') tarefaId: string,
    @Request() requisicao: RequisicaoAutenticada,
  ) {
    return this.comentariosService.listarPorTarefa(tarefaId, requisicao.user.id);
  }

  @Delete('comments/:id')
  @ApiOperation({ summary: 'Excluir um comentário' })
  remover(@Param('id') id: string, @Request() requisicao: RequisicaoAutenticada) {
    return this.comentariosService.remover(id, requisicao.user.id);
  }
}
