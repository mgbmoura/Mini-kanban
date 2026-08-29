import type { ComponentProps } from 'react';

export function Esqueleto({ className = '', ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={`bg-accent animate-pulse rounded-md ${className}`.trim()}
      {...props}
    />
  );
}
