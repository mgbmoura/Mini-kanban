
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ForgotPasswordPage } from './ForgotPasswordPage';
import { toast } from 'sonner';
// A importação foi atualizada para o novo caminho da API
import { authService } from '../../api/auth-api';

// Mock de módulos
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// O mock agora aponta para o novo caminho da API
vi.mock('../../api/auth-api');

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submete o pedido de redefinição de senha com sucesso e exibe a mensagem de confirmação', async () => {
    // Corrigido: O mock agora resolve com um objeto que simula uma AxiosResponse
    vi.mocked(authService.forgotPassword).mockResolvedValueOnce({ data: {}, status: 200, statusText: 'OK', headers: {}, config: {} as any });
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
      expect(toast.success).toHaveBeenCalledWith('Se uma conta com o endereço existir, um link para redefinição foi enviado.');
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
      // A lógica do componente agora sempre mostra a tela de sucesso para segurança
      expect(screen.getByText('Verifique seu E-mail')).toBeInTheDocument();
      expect(toast.success).toHaveBeenCalledWith('Se uma conta com o endereço existir, um link para redefinição foi enviado.');
    });
  });
});
