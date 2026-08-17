import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../../api/auth-api';

const inputClassName = 'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground bg-background text-foreground border-input flex h-11 w-full min-w-0 rounded-md border px-3 py-2 text-sm transition-[color,box-shadow,border-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:opacity-50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive';
const buttonClassName = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] bg-primary text-primary-foreground hover:bg-primary/90 w-full h-11 px-4 py-2 shadow-md active:scale-[0.98]';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    } else {
      toast.error('Token de redefinição não encontrado.');
      navigate('/login');
    }
  }, [searchParams, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (!token) {
      setError('Token de segurança ausente.');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      toast.success('Senha redefinida com sucesso!');
      navigate('/login');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao redefinir senha.';
      setError(message);
      toast.error(message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-bold text-2xl">M</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Nova Senha</h1>
          <p className="text-muted-foreground mt-2">Crie uma senha forte para sua conta.</p>
        </div>

        <div className="bg-card rounded-xl p-8 border border-border shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">Nova Senha</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-foreground mb-1.5">Confirme a Nova Senha</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={inputClassName}
              />
            </div>
            {error && <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3"><p className="text-destructive text-sm font-medium">{error}</p></div>}
            <button type="submit" disabled={loading || !token} className={buttonClassName}>
              {loading ? 'Salvando...' : 'Salvar Nova Senha'}
            </button>
            <div className="text-center pt-2">
              <Link to="/login" className="text-sm font-medium text-primary hover:underline">
                Cancelar e voltar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
