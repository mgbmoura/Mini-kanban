import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';
import { ThemeProvider } from '../contexts/ThemeContext';

vi.mock('../api/auth-api', () => ({
  authService: {
    getUser: () => null,
    logout: vi.fn(),
  },
}));

describe('App', () => {
  it('renders the login page when no user is authenticated', async () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );

    expect(await screen.findByText('Entre na sua conta para continuar')).toBeInTheDocument();
  });
});
