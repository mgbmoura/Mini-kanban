import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ProvedorTema } from '../contexts/ContextoTema';
import App from './App';

vi.mock('../services/servicoAutenticacao', () => ({
  servicoAutenticacao: {
    obterUsuario: () => null,
    sair: vi.fn(),
  },
}));

describe('App', () => {
  it('exibe a página de login quando não há usuário autenticado', async () => {
    render(
      <ProvedorTema>
        <App />
      </ProvedorTema>,
    );

    expect(await screen.findByText('Entre na sua conta para continuar')).toBeInTheDocument();
  });
});
