
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import { toast } from 'sonner';
import { authService } from '../../api/auth-api';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../api/auth-api');

const renderLoginPage = () => {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={() => { }} />} />
        <Route path="/forgot-password" element={<div>Página de redefinição de senha</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.pushState({}, '', '/');
  });

  it('muda para o modo de registro ao clicar no botão de cadastro', () => {
    renderLoginPage();

    const registerButton = screen.getByText('Não tem uma conta? Cadastre-se');
    fireEvent.click(registerButton);

    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(screen.getByText('Crie sua conta gratuitamente')).toBeInTheDocument();
  });

  it('realiza o registro com sucesso', async () => {
    vi.mocked(authService.register).mockResolvedValueOnce();
    renderLoginPage();

    fireEvent.click(screen.getByText('Não tem uma conta? Cadastre-se'));

    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Teste User' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'teste@example.com' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByText('Criar conta'));

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith('Teste User', 'teste@example.com', 'password123');
      expect(toast.success).toHaveBeenCalledWith('Conta criada com sucesso! Faça login para continuar.');
      expect(screen.getByText('Entre na sua conta para continuar')).toBeInTheDocument();
    });
  });

  it('exibe uma mensagem de erro ao falhar no registro', async () => {
    const errorMessage = 'Este email já está em uso';
    vi.mocked(authService.register).mockRejectedValueOnce(new Error(errorMessage));
    renderLoginPage();

    fireEvent.click(screen.getByText('Não tem uma conta? Cadastre-se'));
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Teste User' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'teste@example.com' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByText('Criar conta'));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('navega para a página de redefinição de senha', async () => {
    renderLoginPage();

    fireEvent.click(screen.getByText('Esqueceu sua senha?'));

    await waitFor(() => {
      expect(screen.getByText('Página de redefinição de senha')).toBeInTheDocument();
    });
  });
});
