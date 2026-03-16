import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { authService } from '../../services/authService';

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
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-background h-11"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-foreground mb-1.5">Confirme a Nova Senha</label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-background h-11"
              />
            </div>
            {error && <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3"><p className="text-destructive text-sm font-medium">{error}</p></div>}
            <Button type="submit" disabled={loading || !token} className="w-full h-11 shadow-md active:scale-[0.98]">
              {loading ? 'Salvando...' : 'Salvar Nova Senha'}
            </Button>
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
