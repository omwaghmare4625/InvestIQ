import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-primary hover:bg-primary-hover text-white shadow-sm',
      secondary: 'bg-surface border border-border hover:bg-surface-elevated text-text-primary',
      ghost: 'hover:bg-surface-elevated text-text-secondary hover:text-text-primary',
      danger: 'bg-danger hover:opacity-90 text-white',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

export const Card = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'bg-surface rounded-xl border border-border/50 p-5 shadow-elevated transition-all duration-150 hover:-translate-y-0.5 hover:shadow-modal',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const MetricCard = ({ label, value, change, percent, prefix = '' }: {
  label: string;
  value: string | number;
  change: number;
  percent: number;
  prefix?: string;
}) => (
  <Card className="flex flex-col gap-2">
    <span className="text-sm text-text-muted font-medium uppercase tracking-wider">{label}</span>
    <span className="text-2xl font-bold text-text-primary font-numbers">
      {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
    </span>
    <div className={cn(
      'flex items-center gap-1 text-sm font-medium',
      change >= 0 ? 'text-success' : 'text-danger'
    )}>
      <span>{change >= 0 ? '▲' : '▼'}</span>
      <span>{Math.abs(change).toLocaleString()} ({Math.abs(percent)}%)</span>
      <span className="text-text-muted ml-1 font-normal">today</span>
    </div>
  </Card>
);

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full bg-background border border-border rounded-lg px-4 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none',
        className
      )}
      {...props}
    />
  )
);

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const Dialog = ({ isOpen, onClose, children, title, className }: DialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Dialog */}
      <div
        className={cn(
          'relative bg-surface border border-border/50 rounded-xl shadow-modal max-w-md w-full mx-4 z-50',
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-border/30">
            <h2 className="text-lg font-bold">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-surface-elevated rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
