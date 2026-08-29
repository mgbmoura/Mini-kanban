import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AtualizarTarefaDto } from './dto/atualizar-tarefa.dto';
import { CriarTarefaDto } from './dto/criar-tarefa.dto';
import { TarefasRepository } from './tarefas.repository';

@Injectable()
export class TarefasService {
  constructor(private readonly tarefasRepository: TarefasRepository) {}

  criar(dados: CriarTarefaDto, usuarioId: string) {
    return this.tarefasRepository.criar(dados, usuarioId);
  }

  listar(usuarioId: string) {
    return this.tarefasRepository.listarPorUsuario(usuarioId);
  }

  async atualizar(id: string, usuarioId: string, dados: AtualizarTarefaDto) {
    await this.validarAcesso(id, usuarioId, 'editar');
    return this.tarefasRepository.atualizar(id, dados);
  }

  async remover(id: string, usuarioId: string) {
    await this.validarAcesso(id, usuarioId, 'remover');
    return this.tarefasRepository.remover(id);
  }

  private async validarAcesso(id: string, usuarioId: string, acao: 'editar' | 'remover') {
    const tarefa = await this.tarefasRepository.buscarPorId(id);

    if (!tarefa) {
      throw new NotFoundException('Tarefa não encontrada.');
    }

    if (tarefa.userId !== usuarioId) {
      throw new ForbiddenException(`Você não tem permissão para ${acao} esta tarefa.`);
    }
  }
}
