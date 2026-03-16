
import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { TaskStatus } from '@prisma/client'; // Importa o enum

// Mock do PrismaService. Simula o objeto Prisma e os seus métodos.
const mockPrismaService = {
  task: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

// Objeto mock para uma tarefa, agora usando o enum TaskStatus.
const mockTask = {
  id: 'some-task-id',
  title: 'Test Task',
  description: 'Test Description',
  status: TaskStatus.TODO, // Corrigido: Usando o valor correto do enum.
  userId: 'some-user-id',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('TasksService', () => {
  let service: TasksService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prisma = module.get(PrismaService);

    // Limpa os mocks antes de cada teste
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task and return it', async () => {
      // DTO para criar a tarefa, agora com o status correto.
      const createTaskDto = { title: 'Test Task', description: 'Test Description', status: TaskStatus.TODO };
      const userId = 'some-user-id';

      // Configura o mock para retornar a tarefa quando 'create' for chamado
      prisma.task.create.mockResolvedValue(mockTask);

      const result = await service.create(createTaskDto, userId);

      expect(result).toEqual(mockTask);
      expect(prisma.task.create).toHaveBeenCalledWith({
        data: {
          ...createTaskDto,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
      expect(prisma.task.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks for a user', async () => {
      const userId = 'some-user-id';
      const mockTaskList = [{ ...mockTask }];
      prisma.task.findMany.mockResolvedValue(mockTaskList);

      const result = await service.findAll(userId);

      expect(result).toEqual(mockTaskList);
      expect(prisma.task.findMany).toHaveBeenCalledWith({ where: { userId } });
      expect(prisma.task.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a task and return it', async () => {
      const updateTaskDto = { title: 'Updated Title' };
      const taskId = 'some-task-id';
      const userId = 'some-user-id';

      const updatedTask = { ...mockTask, ...updateTaskDto };

      prisma.task.findUnique.mockResolvedValue(mockTask);
      prisma.task.update.mockResolvedValue(updatedTask);

      const result = await service.update(taskId, userId, updateTaskDto);

      expect(result).toEqual(updatedTask);
      expect(prisma.task.findUnique).toHaveBeenCalledWith({ where: { id: taskId } });
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: taskId },
        data: updateTaskDto,
      });
    });

    it('should throw NotFoundException if task does not exist', async () => {
      const updateTaskDto = { title: 'Updated Title' };
      const taskId = 'non-existent-id';
      const userId = 'some-user-id';

      prisma.task.findUnique.mockResolvedValue(null);

      await expect(service.update(taskId, userId, updateTaskDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if user does not own the task', async () => {
      const updateTaskDto = { title: 'Updated Title' };
      const taskId = 'some-task-id';
      const wrongUserId = 'wrong-user-id';

      prisma.task.findUnique.mockResolvedValue(mockTask); // mockTask belongs to 'some-user-id'

      await expect(service.update(taskId, wrongUserId, updateTaskDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('remove', () => {
    it('should remove a task and return it', async () => {
      const taskId = 'some-task-id';
      const userId = 'some-user-id';

      prisma.task.findUnique.mockResolvedValue(mockTask);
      prisma.task.delete.mockResolvedValue(mockTask);

      const result = await service.remove(taskId, userId);

      expect(result).toEqual(mockTask);
      expect(prisma.task.findUnique).toHaveBeenCalledWith({ where: { id: taskId } });
      expect(prisma.task.delete).toHaveBeenCalledWith({ where: { id: taskId } });
    });

    it('should throw NotFoundException if task does not exist', async () => {
      const taskId = 'non-existent-id';
      const userId = 'some-user-id';

      prisma.task.findUnique.mockResolvedValue(null);

      await expect(service.remove(taskId, userId)).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if user does not own the task', async () => {
      const taskId = 'some-task-id';
      const wrongUserId = 'wrong-user-id';

      prisma.task.findUnique.mockResolvedValue(mockTask);

      await expect(service.remove(taskId, wrongUserId)).rejects.toThrow(UnauthorizedException);
    });
  });
});
