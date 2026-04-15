
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
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

// Componente auxiliar para renderizar a LoginPage com o router
const renderLoginPage = () => {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={() => {}} />} />
        <Route path="/forgot-password" element={<div>Página de redefinição de senha</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    // Limpa todos os mocks antes de cada teste
    vi.clearAllMocks();
    // Redefine o URL para garantir um estado limpo
    window.history.pushState({}, '', '/');
  });

  it('muda para o modo de registro ao clicar no botão de cadastro', () => {
    renderLoginPage();

    // Clica no botão para se cadastrar
    const registerButton = screen.getByText('Não tem uma conta? Cadastre-se');
    fireEvent.click(registerButton);

    // Verifica se o campo 'Nome' aparece
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    // Verifica se o título mudou
    expect(screen.getByText('Crie sua conta gratuitamente')).toBeInTheDocument();
  });

  it('realiza o registro com sucesso', async () => {
    vi.mocked(authService.register).mockResolvedValueOnce(undefined);
    renderLoginPage();

    // Muda para o modo de registro
    fireEvent.click(screen.getByText('Não tem uma conta? Cadastre-se'));

    // Preenche o formulário
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Teste User' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'teste@example.com' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'password123' } });

    // Submete o formulário
    fireEvent.click(screen.getByText('Criar conta'));

    // Aguarda a finalização do processo assíncrono
    await waitFor(() => {
      // Verifica se a função de registro foi chamada
      expect(authService.register).toHaveBeenCalledWith('Teste User', 'teste@example.com', 'password123');
      // Verifica se a notificação de sucesso foi exibida
      expect(toast.success).toHaveBeenCalledWith('Conta criada com sucesso! Faça login para continuar.');
      // Verifica se o formulário voltou para a tela de login
      expect(screen.getByText('Entre na sua conta para continuar')).toBeInTheDocument();
    });
  });

  it('exibe uma mensagem de erro ao falhar no registro', async () => {
    const errorMessage = 'Este email já está em uso';
    vi.mocked(authService.register).mockRejectedValueOnce(new Error(errorMessage));
    renderLoginPage();

    // Muda para o modo de registro e preenche o formulário
    fireEvent.click(screen.getByText('Não tem uma conta? Cadastre-se'));
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Teste User' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'teste@example.com' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'password123' } });

    // Submete o formulário
    fireEvent.click(screen.getByText('Criar conta'));

    // Aguarda e verifica a mensagem de erro
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('navega para a página de redefinição de senha', async () => {
    renderLoginPage();

    // Clica no link de redefinição de senha
    fireEvent.click(screen.getByText('Esqueceu sua senha?'));

    // Verifica se a navegação ocorreu
    await waitFor(() => {
        expect(screen.getByText('Página de redefinição de senha')).toBeInTheDocument();
    });
  });
});
