import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProvedorAutenticacao } from '../../contexts/ContextoAutenticacao';
import { servicoAutenticacao } from '../../services/servicoAutenticacao';
import PaginaLogin from './PaginaLogin';

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('../../services/servicoAutenticacao');

function renderizarLogin() {
  window.history.pushState({}, '', '/login');
  vi.mocked(servicoAutenticacao.obterUsuario).mockReturnValue(null);

  return render(
    <ProvedorAutenticacao>
      <MemoryRouter initialEntries={['/login']}>
        <PaginaLogin />
      </MemoryRouter>
    </ProvedorAutenticacao>,
  );
}

describe('PaginaLogin', () => {
  beforeEach(() => vi.clearAllMocks());

  it('alterna para o cadastro', () => {
    renderizarLogin();

    fireEvent.click(screen.getByText('Não tem uma conta? Cadastre-se'));

    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(screen.getByText('Crie sua conta gratuitamente')).toBeInTheDocument();
  });

  it('cadastra uma nova conta e retorna ao login', async () => {
    vi.mocked(servicoAutenticacao.cadastrar).mockResolvedValueOnce(undefined);
    renderizarLogin();

    fireEvent.click(screen.getByText('Não tem uma conta? Cadastre-se'));
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Teste Usuario' } });
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'teste@example.com' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Criar conta'));

    await waitFor(() => {
      expect(servicoAutenticacao.cadastrar).toHaveBeenCalledWith(
        'Teste Usuario',
        'teste@example.com',
        'password123',
      );
      expect(toast.success).toHaveBeenCalledWith('Conta criada com sucesso! Faça login para continuar.');
    });

    expect(screen.getByText('Entre na sua conta para continuar')).toBeInTheDocument();
  });

  it('exibe a mensagem retornada quando o cadastro falha', async () => {
    const mensagem = 'Este email já está em uso';
    vi.mocked(servicoAutenticacao.cadastrar).mockRejectedValueOnce(new Error(mensagem));
    renderizarLogin();

    fireEvent.click(screen.getByText('Não tem uma conta? Cadastre-se'));
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Teste Usuario' } });
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'teste@example.com' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Criar conta'));

    expect(await screen.findByText(mensagem)).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith(mensagem);
  });
});
