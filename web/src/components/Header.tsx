
import { Sun, Moon, Menu } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { User } from '../types/user';

interface HeaderProps {
  onMenuClick: () => void;
  user: User | null;
}

export function Header({ onMenuClick, user }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  const getInitials = (name: string): string => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="flex items-center justify-between p-4 bg-card border-b border-border shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-full text-muted-foreground hover:bg-accent"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
          <span className="font-bold text-lg text-white">M</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">Mini-Kanban</h1>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="p-2 rounded-full text-muted-foreground hover:bg-accent">
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
        <div className="w-9 h-9 bg-muted rounded-full flex items-center justify-center border-2 border-border overflow-hidden">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name || 'Avatar'} className="w-full h-full object-cover" />
          ) : (
            <span className="font-semibold text-sm text-foreground">{getInitials(user?.name || 'U')}</span>
          )}
        </div>
      </div>
    </header>
  );
}
