import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProvedorAutenticacao } from '../../contexts/ContextoAutenticacao';
import { servicoAutenticacao } from '../../services/servicoAutenticacao';
import { servicoComentarios } from '../../services/servicoComentarios';
import { servicoTarefas } from '../../services/servicoTarefas';
import { Tarefa } from '../../types/quadro';
import { PaginaQuadro } from './PaginaQuadro';

vi.mock('../../services/servicoTarefas');
vi.mock('../../services/servicoAutenticacao');
vi.mock('../../services/servicoComentarios');

const usuario = { id: 'usuario-1', nome: 'Usuário Teste', email: 'usuario@teste.com' };
let tarefas: Tarefa[];

describe('PaginaQuadro', () => {
  beforeEach(() => {
    tarefas = [
      {
        id: '1',
        titulo: 'Tarefa Teste',
        descricao: 'Descrição inicial',
        status: 'TODO',
        prioridade: 'Alta',
        estiloCartao: 'SPIRAL',
        etiquetas: [],
        posicao: 1,
        quantidadeComentarios: 0,
      },
    ];

    vi.clearAllMocks();
    window.confirm = vi.fn(() => true);
    vi.mocked(servicoAutenticacao.obterUsuario).mockReturnValue(usuario);
    vi.mocked(servicoTarefas.listar).mockImplementation(async () => [...tarefas]);
    vi.mocked(servicoComentarios.listar).mockResolvedValue([]);

    vi.mocked(servicoTarefas.criar).mockImplementation(async (dados) => {
      const criada: Tarefa = {
        id: '2',
        titulo: dados.titulo,
        descricao: dados.descricao,
        status: dados.status ?? 'TODO',
        prioridade: dados.prioridade,
        estiloCartao: dados.estiloCartao,
        etiquetas: dados.etiquetas,
        imagemAnexa: dados.imagemAnexa,
        posicao: dados.posicao ?? 1,
        quantidadeComentarios: 0,
      };
      tarefas.push(criada);
      return criada;
    });

    vi.mocked(servicoTarefas.atualizar).mockImplementation(async (id, dados) => {
      const atual = tarefas.find((tarefa) => tarefa.id === id)!;
      const atualizada = { ...atual, ...dados };
      tarefas = tarefas.map((tarefa) => (tarefa.id === id ? atualizada : tarefa));
      return atualizada;
    });

    vi.mocked(servicoTarefas.remover).mockImplementation(async (id) => {
      tarefas = tarefas.filter((tarefa) => tarefa.id !== id);
    });
  });

  function renderizarQuadro() {
    return render(
      <ProvedorAutenticacao>
        <PaginaQuadro />
      </ProvedorAutenticacao>,
    );
  }

  it('cria uma tarefa na coluna selecionada', async () => {
    renderizarQuadro();
    await screen.findByText('Tarefa Teste');

    const coluna = screen.getByTestId('kanban-column-TODO');
    fireEvent.click(within(coluna).getByRole('button', { name: 'Adicionar tarefa' }));
    fireEvent.change(await screen.findByPlaceholderText('Digite o título da tarefa'), {
      target: { value: 'Nova Tarefa Criada' },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Criar' }));
    });

    await waitFor(() => {
      expect(servicoTarefas.criar).toHaveBeenCalledWith(
        expect.objectContaining({ titulo: 'Nova Tarefa Criada', status: 'TODO' }),
      );
    });
    expect(screen.getByText('Nova Tarefa Criada')).toBeInTheDocument();
  });

  it('atualiza uma tarefa existente', async () => {
    renderizarQuadro();
    fireEvent.click(await screen.findByText('Tarefa Teste'));

    fireEvent.change(await screen.findByDisplayValue('Tarefa Teste'), {
      target: { value: 'Tarefa Atualizada' },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));
    });

    await waitFor(() => {
      expect(servicoTarefas.atualizar).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({ titulo: 'Tarefa Atualizada' }),
      );
    });
    expect(screen.getByText('Tarefa Atualizada')).toBeInTheDocument();
  });

  it('exclui uma tarefa existente', async () => {
    renderizarQuadro();
    fireEvent.click(await screen.findByText('Tarefa Teste'));

    await act(async () => {
      fireEvent.click(await screen.findByRole('button', { name: /excluir/i }));
    });

    expect(window.confirm).toHaveBeenCalledWith('Tem certeza que deseja excluir esta tarefa?');
    await waitFor(() => expect(servicoTarefas.remover).toHaveBeenCalledWith('1'));
    expect(screen.queryByText('Tarefa Teste')).not.toBeInTheDocument();
  });
});
