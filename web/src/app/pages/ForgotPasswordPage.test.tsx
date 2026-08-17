
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ForgotPasswordPage } from './ForgotPasswordPage';
import { toast } from 'sonner';
import { authService } from '../../api/auth-api';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../api/auth-api');

const renderPage = () => render(
  <MemoryRouter>
    <ForgotPasswordPage />
  </MemoryRouter>
);

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submete o pedido de redefinição de senha com sucesso e exibe a mensagem de confirmação', async () => {
    vi.mocked(authService.forgotPassword).mockResolvedValueOnce();
    renderPage();

    const emailInput = screen.getByLabelText('E-mail');
    const submitButton = screen.getByRole('button', { name: /Enviar Link de Redefinição/i });

    fireEvent.change(emailInput, { target: { value: 'teste@example.com' } });
    fireEvent.click(submitButton);

    expect(screen.getByRole('button', { name: /Enviando.../i })).toBeDisabled();

    await waitFor(() => {
      expect(authService.forgotPassword).toHaveBeenCalledWith('teste@example.com');
      expect(toast.success).toHaveBeenCalledWith('Se uma conta com o endereço existir, um link para redefinição foi enviado.');
      expect(screen.getByText('Verifique seu E-mail')).toBeInTheDocument();
      expect(screen.getByText(/Se uma conta com o endereço/)).toBeInTheDocument();
      expect(screen.getByText('teste@example.com')).toBeInTheDocument();
    });
  });

  it('exibe uma notificação de erro ao falhar no envio', async () => {
    const errorMessage = 'Falha ao enviar email';
    vi.mocked(authService.forgotPassword).mockRejectedValueOnce(new Error(errorMessage));
    renderPage();

    const emailInput = screen.getByLabelText('E-mail');
    const submitButton = screen.getByRole('button', { name: /Enviar Link de Redefinição/i });

    fireEvent.change(emailInput, { target: { value: 'errado@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Verifique seu E-mail')).toBeInTheDocument();
      expect(toast.success).toHaveBeenCalledWith('Se uma conta com o endereço existir, um link para redefinição foi enviado.');
    });
  });
});
