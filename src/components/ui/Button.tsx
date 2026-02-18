import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    const variants = {
      primary: [
        'bg-gradient-to-r from-indigo-500 to-violet-500',
        'text-white',
        'hover:from-indigo-600 hover:to-violet-600',
        'hover:shadow-lg hover:shadow-indigo-500/25',
        'active:scale-[0.98]',
      ],
      secondary: [
        'bg-slate-800',
        'text-slate-200',
        'border border-slate-600',
        'hover:bg-slate-700',
        'hover:border-slate-500',
        'active:scale-[0.98]',
      ],
      ghost: [
        'bg-transparent',
        'text-slate-300',
        'hover:bg-slate-800',
        'hover:text-slate-100',
        'active:scale-[0.98]',
      ],
      danger: [
        'bg-red-500',
        'text-white',
        'hover:bg-red-600',
        'hover:shadow-lg hover:shadow-red-500/25',
        'active:scale-[0.98]',
      ],
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center',
          'font-medium',
          'rounded-lg',
          'transition-all duration-200 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {!loading && leftIcon && (
          <span className="mr-2">{leftIcon}</span>
        )}
        {children}
        {!loading && rightIcon && (
          <span className="ml-2">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
