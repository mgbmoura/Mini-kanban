import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { servicoAutenticacao } from '../../services/servicoAutenticacao';
import { PaginaEsqueciSenha } from './PaginaEsqueciSenha';

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('../../services/servicoAutenticacao');

function renderizarPagina() {
  return render(
    <MemoryRouter>
      <PaginaEsqueciSenha />
    </MemoryRouter>,
  );
}

describe('PaginaEsqueciSenha', () => {
  beforeEach(() => vi.clearAllMocks());

  it('envia o pedido de redefinição e exibe a confirmação', async () => {
    vi.mocked(servicoAutenticacao.solicitarRedefinicaoSenha).mockResolvedValueOnce(undefined);
    renderizarPagina();

    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'teste@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Enviar Link de Redefinição/i }));

    expect(screen.getByRole('button', { name: /Enviando.../i })).toBeDisabled();

    await waitFor(() => {
      expect(servicoAutenticacao.solicitarRedefinicaoSenha).toHaveBeenCalledWith('teste@example.com');
      expect(toast.success).toHaveBeenCalledWith('Se o e-mail existir, um link foi enviado!');
    });

    expect(screen.getByText('Verifique seu E-mail')).toBeInTheDocument();
    expect(screen.getByText('teste@example.com')).toBeInTheDocument();
  });

  it('mantém o formulário e informa erro quando o envio falha', async () => {
    vi.mocked(servicoAutenticacao.solicitarRedefinicaoSenha).mockRejectedValueOnce(new Error('Falha'));
    renderizarPagina();

    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'erro@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Enviar Link de Redefinição/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Ocorreu um erro. Por favor, tente novamente.');
    });

    expect(screen.getByText('Recuperar Senha')).toBeInTheDocument();
    expect(screen.queryByText('Verifique seu E-mail')).not.toBeInTheDocument();
  });
});
