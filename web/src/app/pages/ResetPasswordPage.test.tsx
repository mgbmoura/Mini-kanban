
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ResetPasswordPage } from './ResetPasswordPage';
import { toast } from 'sonner';
import { authService } from '../../api/auth-api';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));
vi.mock('../../api/auth-api');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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
    vi.mocked(authService.resetPassword).mockResolvedValueOnce();
    renderComponentWithToken('valid-token');

    fireEvent.change(screen.getByLabelText('Nova Senha'), { target: { value: 'new-password' } });
    fireEvent.change(screen.getByLabelText('Confirme a Nova Senha'), { target: { value: 'new-password' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar Nova Senha' }));

    expect(screen.getByRole('button', { name: /Salvando.../i })).toBeDisabled();

    await waitFor(() => {
      expect(authService.resetPassword).toHaveBeenCalledWith('valid-token', 'new-password');
      expect(toast.success).toHaveBeenCalledWith('Senha redefinida com sucesso!');
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('mostra um erro se as senhas não coincidirem', async () => {
    renderComponentWithToken('valid-token');

    fireEvent.change(screen.getByLabelText('Nova Senha'), { target: { value: 'password-a' } });
    fireEvent.change(screen.getByLabelText('Confirme a Nova Senha'), { target: { value: 'password-b' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar Nova Senha' }));

    await waitFor(() => {
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
      expect(screen.getByText('A senha deve ter pelo menos 6 caracteres.')).toBeInTheDocument();
      expect(authService.resetPassword).not.toHaveBeenCalled();
    });
  });

  it('mostra um erro se nenhum token for fornecido no URL', () => {
    renderComponentWithToken(null);
    expect(toast.error).toHaveBeenCalledWith('Token de redefinição não encontrado.');
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('lida com erros da API durante a redefinição', async () => {
    const apiError = new Error('Token inválido ou expirado');
    vi.mocked(authService.resetPassword).mockRejectedValueOnce(apiError);
    renderComponentWithToken('invalid-token');

    fireEvent.change(screen.getByLabelText('Nova Senha'), { target: { value: 'new-password' } });
    fireEvent.change(screen.getByLabelText('Confirme a Nova Senha'), { target: { value: 'new-password' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar Nova Senha' }));

    await waitFor(() => {
      expect(screen.getByText(apiError.message)).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalledWith(apiError.message);
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
