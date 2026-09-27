import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CardStyle, TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TarefasService } from './tarefas.service';

const taskMock = {
  create: jest.fn(),
  findMany: jest.fn(),
  findUnique: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const prismaMock = { task: taskMock } as unknown as PrismaService;

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

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TarefasService(prismaMock);
  });

  it('deve ser criado', () => {
    expect(service).toBeDefined();
  });

  it('deve criar uma tarefa', async () => {
    const dados = { title: 'Tarefa de teste', status: TaskStatus.TODO };
    taskMock.create.mockResolvedValue(tarefaMock);

    const resultado = await service.criar(dados, 'usuario-1');

    expect(resultado).toEqual(tarefaMock);
    expect(taskMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { ...dados, user: { connect: { id: 'usuario-1' } } },
      }),
    );
  });

  it('deve listar as tarefas do usuário', async () => {
    taskMock.findMany.mockResolvedValue([tarefaMock]);

    const resultado = await service.listar('usuario-1');

    expect(resultado).toEqual([tarefaMock]);
    expect(taskMock.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 'usuario-1' } }),
    );
  });

  it('deve atualizar uma tarefa do usuário', async () => {
    const dados = { title: 'Título atualizado' };
    const tarefaAtualizada = { ...tarefaMock, ...dados };
    taskMock.findUnique.mockResolvedValue(tarefaMock);
    taskMock.update.mockResolvedValue(tarefaAtualizada);

    const resultado = await service.atualizar('tarefa-1', 'usuario-1', dados);

    expect(resultado).toEqual(tarefaAtualizada);
  });

  it('deve impedir atualização de tarefa inexistente', async () => {
    taskMock.findUnique.mockResolvedValue(null);

    await expect(
      service.atualizar('tarefa-inexistente', 'usuario-1', { title: 'Novo título' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('deve impedir atualização de tarefa de outro usuário', async () => {
    taskMock.findUnique.mockResolvedValue(tarefaMock);

    await expect(
      service.atualizar('tarefa-1', 'outro-usuario', { title: 'Novo título' }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('deve remover uma tarefa do usuário', async () => {
    taskMock.findUnique.mockResolvedValue(tarefaMock);
    taskMock.delete.mockResolvedValue(tarefaMock);

    const resultado = await service.remover('tarefa-1', 'usuario-1');

    expect(resultado).toEqual(tarefaMock);
    expect(taskMock.delete).toHaveBeenCalledWith({ where: { id: 'tarefa-1' } });
  });

  it('deve impedir remoção de tarefa inexistente', async () => {
    taskMock.findUnique.mockResolvedValue(null);

    await expect(service.remover('tarefa-inexistente', 'usuario-1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deve impedir remoção de tarefa de outro usuário', async () => {
    taskMock.findUnique.mockResolvedValue(tarefaMock);

    await expect(service.remover('tarefa-1', 'outro-usuario')).rejects.toThrow(
      ForbiddenException,
    );
  });
});
