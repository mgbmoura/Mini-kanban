import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CardStyle, TaskStatus } from '@prisma/client';
import { TarefasRepository } from './tarefas.repository';
import { TarefasService } from './tarefas.service';

const repositorioTarefasMock = {
  criar: jest.fn(),
  listarPorUsuario: jest.fn(),
  buscarPorId: jest.fn(),
  atualizar: jest.fn(),
  remover: jest.fn(),
};

const tarefaMock = {
  id: 'tarefa-1',
  title: 'Tarefa de teste',
  description: 'Descrição de teste',
  status: TaskStatus.TODO,
  cardStyle: CardStyle.SPIRAL,
  userId: 'usuario-1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('TarefasService', () => {
  let service: TarefasService;
  let repositorio: typeof repositorioTarefasMock;

  beforeEach(async () => {
    const modulo: TestingModule = await Test.createTestingModule({
      providers: [
        TarefasService,
        { provide: TarefasRepository, useValue: repositorioTarefasMock },
      ],
    }).compile();

    service = modulo.get(TarefasService);
    repositorio = modulo.get(TarefasRepository);
    jest.clearAllMocks();
  });

  it('deve ser criado', () => {
    expect(service).toBeDefined();
  });

  it('deve criar uma tarefa', async () => {
    const dados = { title: 'Tarefa de teste', status: TaskStatus.TODO };
    repositorio.criar.mockResolvedValue(tarefaMock);

    const resultado = await service.criar(dados, 'usuario-1');

    expect(resultado).toEqual(tarefaMock);
    expect(repositorio.criar).toHaveBeenCalledWith(dados, 'usuario-1');
  });

  it('deve listar as tarefas do usuário', async () => {
    repositorio.listarPorUsuario.mockResolvedValue([tarefaMock]);

    const resultado = await service.listar('usuario-1');

    expect(resultado).toEqual([tarefaMock]);
    expect(repositorio.listarPorUsuario).toHaveBeenCalledWith('usuario-1');
  });

  it('deve atualizar uma tarefa do usuário', async () => {
    const dados = { title: 'Título atualizado' };
    const tarefaAtualizada = { ...tarefaMock, ...dados };
    repositorio.buscarPorId.mockResolvedValue(tarefaMock);
    repositorio.atualizar.mockResolvedValue(tarefaAtualizada);

    const resultado = await service.atualizar('tarefa-1', 'usuario-1', dados);

    expect(resultado).toEqual(tarefaAtualizada);
    expect(repositorio.atualizar).toHaveBeenCalledWith('tarefa-1', dados);
  });

  it('deve impedir atualização de tarefa inexistente', async () => {
    repositorio.buscarPorId.mockResolvedValue(null);

    await expect(
      service.atualizar('tarefa-inexistente', 'usuario-1', { title: 'Novo título' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('deve impedir atualização de tarefa de outro usuário', async () => {
    repositorio.buscarPorId.mockResolvedValue(tarefaMock);

    await expect(
      service.atualizar('tarefa-1', 'outro-usuario', { title: 'Novo título' }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('deve remover uma tarefa do usuário', async () => {
    repositorio.buscarPorId.mockResolvedValue(tarefaMock);
    repositorio.remover.mockResolvedValue(tarefaMock);

    const resultado = await service.remover('tarefa-1', 'usuario-1');

    expect(resultado).toEqual(tarefaMock);
    expect(repositorio.remover).toHaveBeenCalledWith('tarefa-1');
  });

  it('deve impedir remoção de tarefa inexistente', async () => {
    repositorio.buscarPorId.mockResolvedValue(null);

    await expect(service.remover('tarefa-inexistente', 'usuario-1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deve impedir remoção de tarefa de outro usuário', async () => {
    repositorio.buscarPorId.mockResolvedValue(tarefaMock);

    await expect(service.remover('tarefa-1', 'outro-usuario')).rejects.toThrow(
      ForbiddenException,
    );
  });
});
