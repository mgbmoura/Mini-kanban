import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock the authService to control the authentication status
vi.mock('../services/authService', () => ({
  authService: {
    getUser: () => null, // Simulate no user logged in
    logout: vi.fn(),
  },
}));

describe('App', () => {
  it('renders the login page when no user is authenticated', () => {
    render(<App />);

    // Check if the login page content is present
    expect(screen.getByText('Entre na sua conta para continuar')).toBeInTheDocument();
  });
});
