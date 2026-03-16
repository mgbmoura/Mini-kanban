
import { LayoutDashboard, Settings, X, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { User } from '../types/user';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  disabled?: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  user: User;
}

export function Sidebar({ isOpen, onClose, onLogout, user }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    { icon: LayoutDashboard, label: 'Quadro', path: '/app' },
    { icon: LayoutDashboard, label: 'Equipe (Em breve)', path: '#', disabled: true },
    { icon: Settings, label: 'Configurações', path: '/app/settings' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      <aside
        className={`
          fixed inset-y-0 left-0 w-64 bg-card border-r border-border
          transform transition-transform duration-300 ease-in-out z-50
          flex flex-col shadow-lg
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold text-lg text-foreground">Menu</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:bg-accent p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => !item.disabled && handleNavigation(item.path)}
                disabled={item.disabled}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors mb-1 ${
                  isActive
                    ? 'bg-accent text-accent-foreground font-semibold'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border bg-muted/5">
          <div className="flex flex-col mb-4 px-1">
            <span className="text-sm font-bold text-foreground truncate">{user?.name}</span>
            <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
          </div>
          <button
            onClick={() => { onLogout(); onClose(); }}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-destructive hover:bg-destructive/90 transition-all active:scale-95 shadow-md shadow-destructive/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}
