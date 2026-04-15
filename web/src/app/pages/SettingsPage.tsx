import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Save, Loader2, Info, Palette } from 'lucide-react';
import { useOutletContext } from 'react-router';
import { authService } from '../../services/authService';
import { SettingsSkeleton } from '../../components/SettingsSkeleton';
import { toast } from 'sonner';
import { useTheme } from '../../contexts/ThemeContext';

export function SettingsPage() {
  const { onProfileUpdate } = useOutletContext<{ onProfileUpdate: () => void }>();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        const user = authService.getUser();
        if (user) {
          setName(user.name);
          setEmail(user.email);
          setAvatarPreview(user.avatarUrl || '');
        }
      } catch (error) {
        console.error('Erro ao carregar utilizador', error);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authService.updateProfile({
        name: name.trim(),
      });

      if (onProfileUpdate) onProfileUpdate();
      
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      console.error('Erro:', error);
      toast.error('Erro ao salvar perfil.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <SettingsSkeleton />;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 p-4 sm:p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-muted-foreground" />
          Configurações
        </h1>
        <p className="text-muted-foreground mt-1">Gerencie seu perfil e preferências.</p>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <form onSubmit={handleSave} className="space-y-0">
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-background border-2 border-border flex items-center justify-center overflow-hidden shadow-inner">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
              </div>
              <div className="text-center sm:text-left space-y-2">
                <h3 className="font-bold text-foreground">Sua Foto</h3>
                <p className="text-sm text-muted-foreground">Gerenciada pelo Gravatar</p>
                <div className="flex items-center gap-2 text-xs text-accent-foreground bg-accent/20 px-4 py-2 rounded-full font-semibold">
                  <Info className="w-3 h-3" />
                  <span>
                    Para alterar seu avatar, acesse{' '}
                    <a href="https://gravatar.com" target="_blank" rel="noopener noreferrer" className="underline">
                        Gravatar.com
                    </a>
                    .
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground uppercase tracking-wider">Nome Completo</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-ring outline-none transition-all font-medium"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground uppercase tracking-wider">Email (Inalterável)</label>
                <input 
                  type="email" 
                  value={email} 
                  disabled 
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-muted-foreground cursor-not-allowed font-medium opacity-70"
                />
              </div>
            </div>
          </div>

          <div className="bg-muted/5 p-6 border-t border-border flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-xs rounded-xl flex items-center gap-3 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Gravando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-accent/20 p-2 rounded-lg">
              <Palette className="w-6 h-6 text-accent-foreground"/>
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground tracking-tight">Aparência</h3>
              <p className="text-muted-foreground text-sm">Escolha como o Mini-Kanban deve aparecer para você.</p>
            </div>
          </div>
          
          <div className="mt-8 flex items-center gap-4">
            <button 
                onClick={() => setTheme('light')}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all border-2 ${
                  theme === 'light' 
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' 
                  : 'bg-background border-border text-muted-foreground hover:border-accent/50'
                }`}
            >
                ☀️ Claro
            </button>
            <button 
                onClick={() => setTheme('dark')}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all border-2 ${
                  theme === 'dark' 
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' 
                  : 'bg-background border-border text-muted-foreground hover:border-accent/50'
                }`}
            >
                🌙 Escuro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
