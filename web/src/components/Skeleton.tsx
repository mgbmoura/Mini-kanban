import { ComponentProps } from 'react';

export function Skeleton({ className = '', ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={`bg-accent animate-pulse rounded-md ${className}`}
      {...props}
    />
  );
}
