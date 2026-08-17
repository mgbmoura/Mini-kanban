import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthenticatedRequest } from '../auth/auth.types';

@ApiTags('Comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('tasks/:taskId/comments')
  @ApiOperation({ summary: 'Adicionar comentário a uma tarefa' })
  create(@Param('taskId') taskId: string, @Body() createCommentDto: CreateCommentDto, @Request() request: AuthenticatedRequest) {
    return this.commentsService.create(taskId, request.user.id, createCommentDto.content);
  }

  @Get('tasks/:taskId/comments')
  @ApiOperation({ summary: 'Listar comentários de uma tarefa' })
  findAll(@Param('taskId') taskId: string, @Request() request: AuthenticatedRequest) {
    return this.commentsService.findAllByTask(taskId, request.user.id);
  }

  @Delete('comments/:id')
  @ApiOperation({ summary: 'Deletar um comentário' })
  async remove(@Param('id') id: string, @Request() request: AuthenticatedRequest) {
    return this.commentsService.remove(id, request.user.id);
  }
}
