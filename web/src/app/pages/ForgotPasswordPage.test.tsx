
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ForgotPasswordPage } from './ForgotPasswordPage';
import { toast } from 'sonner';
import { authService } from '../../services/authService';

// Mock de módulos
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../services/authService');

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submete o pedido de redefinição de senha com sucesso e exibe a mensagem de confirmação', async () => {
    vi.mocked(authService.forgotPassword).mockResolvedValueOnce(undefined);
    render(<ForgotPasswordPage />);

    const emailInput = screen.getByLabelText('E-mail');
    const submitButton = screen.getByRole('button', { name: /Enviar Link de Redefinição/i });

    // Preenche o formulário e submete
    fireEvent.change(emailInput, { target: { value: 'teste@example.com' } });
    fireEvent.click(submitButton);

    // Verifica o estado de carregamento
    expect(screen.getByRole('button', { name: /Enviando.../i })).toBeDisabled();

    await waitFor(() => {
      // Verifica se a função do serviço foi chamada
      expect(authService.forgotPassword).toHaveBeenCalledWith('teste@example.com');
      // Verifica se a notificação de sucesso foi exibida
      expect(toast.success).toHaveBeenCalledWith('Pedido enviado com sucesso!');
      // Verifica se a mensagem de confirmação é exibida
      expect(screen.getByText('Verifique seu E-mail')).toBeInTheDocument();
      expect(screen.getByText(/Se uma conta com o endereço/)).toBeInTheDocument();
      expect(screen.getByText('teste@example.com')).toBeInTheDocument();
    });
  });

  it('exibe uma notificação de erro ao falhar no envio', async () => {
    const errorMessage = 'Falha ao enviar email';
    vi.mocked(authService.forgotPassword).mockRejectedValueOnce(new Error(errorMessage));
    render(<ForgotPasswordPage />);

    const emailInput = screen.getByLabelText('E-mail');
    const submitButton = screen.getByRole('button', { name: /Enviar Link de Redefinição/i });

    // Preenche e submete
    fireEvent.change(emailInput, { target: { value: 'errado@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Verifica se a notificação de erro foi exibida
      expect(toast.error).toHaveBeenCalledWith('Ocorreu um erro. Por favor, tente novamente.');
      // Verifica se o formulário principal ainda está visível
      expect(screen.getByText('Esqueceu sua Senha?')).toBeInTheDocument();
      // Verifica se a tela de confirmação não é exibida
      expect(screen.queryByText('Verifique seu E-mail')).not.toBeInTheDocument();
    });
  });
});
