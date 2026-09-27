import type { CSSProperties } from 'react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { useTema } from '../contexts/ContextoTema';

export function Notificacoes(props: ToasterProps) {
  const { tema } = useTema();

  return (
    <Sonner
      theme={tema}
      className="toaster group"
      style={{
        '--normal-bg': 'var(--popover)',
        '--normal-text': 'var(--popover-foreground)',
        '--normal-border': 'var(--border)',
      } as CSSProperties}
      {...props}
    />
  );
}
