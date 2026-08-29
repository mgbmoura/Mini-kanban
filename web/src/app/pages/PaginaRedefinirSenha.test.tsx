import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { servicoAutenticacao } from '../../services/servicoAutenticacao';
import { PaginaRedefinirSenha } from './PaginaRedefinirSenha';

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock('../../services/servicoAutenticacao');

const navegar = vi.fn();
vi.mock('react-router-dom', async () => {
  const modulo = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...modulo, useNavigate: () => navegar };
});

function renderizarComToken(token: string | null) {
  const rota = token ? `/reset-password?token=${token}` : '/reset-password';
  return render(
    <MemoryRouter initialEntries={[rota]}>
      <Routes>
        <Route path="/reset-password" element={<PaginaRedefinirSenha />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('PaginaRedefinirSenha', () => {
  beforeEach(() => vi.clearAllMocks());

  it('redefine a senha quando token e confirmação são válidos', async () => {
    vi.mocked(servicoAutenticacao.redefinirSenha).mockResolvedValueOnce(undefined);
    renderizarComToken('token-valido');

    fireEvent.change(screen.getByLabelText('Nova Senha'), { target: { value: 'nova-senha' } });
    fireEvent.change(screen.getByLabelText('Confirme a Nova Senha'), { target: { value: 'nova-senha' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar Nova Senha' }));

    await waitFor(() => {
      expect(servicoAutenticacao.redefinirSenha).toHaveBeenCalledWith('token-valido', 'nova-senha');
      expect(toast.success).toHaveBeenCalledWith('Senha redefinida com sucesso!');
      expect(navegar).toHaveBeenCalledWith('/login');
    });
  });

  it('impede senhas diferentes', async () => {
    renderizarComToken('token-valido');

    fireEvent.change(screen.getByLabelText('Nova Senha'), { target: { value: 'senha-a' } });
    fireEvent.change(screen.getByLabelText('Confirme a Nova Senha'), { target: { value: 'senha-b' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar Nova Senha' }));

    expect(await screen.findByText('As senhas não coincidem.')).toBeInTheDocument();
    expect(servicoAutenticacao.redefinirSenha).not.toHaveBeenCalled();
  });

  it('informa quando o token não foi fornecido', async () => {
    renderizarComToken(null);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Token de redefinição não encontrado.');
      expect(navegar).toHaveBeenCalledWith('/login');
    });
  });
});
