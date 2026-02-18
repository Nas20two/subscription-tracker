import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ 
    className, 
    variant = 'default',
    size = 'sm',
    children,
    ...props 
  }, ref) => {
    const variants = {
      default: [
        'bg-indigo-500/20',
        'text-indigo-400',
        'border-indigo-500/30',
      ],
      success: [
        'bg-emerald-500/20',
        'text-emerald-400',
        'border-emerald-500/30',
      ],
      warning: [
        'bg-amber-500/20',
        'text-amber-400',
        'border-amber-500/30',
      ],
      danger: [
        'bg-red-500/20',
        'text-red-400',
        'border-red-500/30',
      ],
      info: [
        'bg-cyan-500/20',
        'text-cyan-400',
        'border-cyan-500/30',
      ],
      neutral: [
        'bg-slate-700',
        'text-slate-300',
        'border-slate-600',
      ],
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center',
          'font-medium',
          'rounded-full',
          'border',
          'uppercase tracking-wide',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
