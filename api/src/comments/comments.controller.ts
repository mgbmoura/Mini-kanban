import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('tasks/:taskId/comments')
  @ApiOperation({ summary: 'Adicionar comentário a uma tarefa' })
  create(@Param('taskId') taskId: string, @Body() createCommentDto: CreateCommentDto, @Request() req) {
    return this.commentsService.create(taskId, req.user.id, createCommentDto.content);
  }

  @Get('tasks/:taskId/comments')
  @ApiOperation({ summary: 'Listar comentários de uma tarefa' })
  findAll(@Param('taskId') taskId: string) {
    return this.commentsService.findAllByTask(taskId);
  }

  @Delete('comments/:id')
  @ApiOperation({ summary: 'Deletar um comentário' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.commentsService.remove(id, req.user.id);
  }
}
