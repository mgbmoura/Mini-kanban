
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ResetPasswordPage } from './ResetPasswordPage';
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

const mockNavigate = vi.fn();
// Mock do react-router-dom para controlar a navegação
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual as any,
        useNavigate: () => mockNavigate,
    };
});

// Função auxiliar para renderizar o componente com um token no URL
const renderComponentWithToken = (token: string | null) => {
  const route = token ? `/reset-password?token=${token}` : '/reset-password';
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('ResetPasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redefine a senha com sucesso com um token válido', async () => {
    vi.mocked(authService.resetPassword).mockResolvedValueOnce(undefined);
    renderComponentWithToken('valid-token');

    // Preenche as senhas
    fireEvent.change(screen.getByLabelText('Nova Senha'), { target: { value: 'new-password' } });
    fireEvent.change(screen.getByLabelText('Confirme a Nova Senha'), { target: { value: 'new-password' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar Nova Senha' }));

    // Verifica o estado de carregamento
    expect(screen.getByRole('button', { name: /Salvando.../i })).toBeDisabled();

    await waitFor(() => {
      // Verifica se a função do serviço foi chamada e se a navegação ocorreu
      expect(authService.resetPassword).toHaveBeenCalledWith('valid-token', 'new-password');
      expect(toast.success).toHaveBeenCalledWith('Senha redefinida com sucesso! Você já pode fazer login com sua nova senha.');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('mostra um erro se as senhas não coincidirem', async () => {
    renderComponentWithToken('valid-token');

    fireEvent.change(screen.getByLabelText('Nova Senha'), { target: { value: 'password-a' } });
    fireEvent.change(screen.getByLabelText('Confirme a Nova Senha'), { target: { value: 'password-b' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar Nova Senha' }));

    await waitFor(() => {
      // Verifica se a mensagem de erro é exibida e o serviço não é chamado
      expect(screen.getByText('As senhas não coincidem.')).toBeInTheDocument();
      expect(authService.resetPassword).not.toHaveBeenCalled();
    });
  });

  it('mostra um erro se a senha for muito curta', async () => {
    renderComponentWithToken('valid-token');

    fireEvent.change(screen.getByLabelText('Nova Senha'), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText('Confirme a Nova Senha'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar Nova Senha' }));

    await waitFor(() => {
      // Verifica a mensagem de erro e se o serviço não foi chamado
      expect(screen.getByText('A senha deve ter pelo menos 6 caracteres.')).toBeInTheDocument();
      expect(authService.resetPassword).not.toHaveBeenCalled();
    });
  });

  it('mostra um erro se nenhum token for fornecido no URL', () => {
    renderComponentWithToken(null);
    expect(toast.error).toHaveBeenCalledWith('Token de redefinição não encontrado ou inválido.');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('lida com erros da API durante a redefinição', async () => {
    const apiError = 'Token inválido ou expirado';
    vi.mocked(authService.resetPassword).mockRejectedValueOnce(new Error(apiError));
    renderComponentWithToken('invalid-token');

    fireEvent.change(screen.getByLabelText('Nova Senha'), { target: { value: 'new-password' } });
    fireEvent.change(screen.getByLabelText('Confirme a Nova Senha'), { target: { value: 'new-password' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar Nova Senha' }));

    await waitFor(() => {
      // Verifica se a mensagem de erro da API é exibida
      expect(screen.getByText(apiError)).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalledWith(apiError);
      expect(mockNavigate).not.toHaveBeenCalled(); // Não deve navegar
    });
  });
});
