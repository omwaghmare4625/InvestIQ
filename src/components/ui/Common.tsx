import React from 'react';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, Info, XOctagon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.memo(
  React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
      const variants = {
        primary:
          'bg-primary text-white font-bold hover:bg-primary-hover shadow-sm rounded-lg active:scale-95',
        secondary:
          'bg-surface-high text-text-primary hover:bg-surface-bright border border-border shadow-sm rounded-lg',
        ghost: 'hover:bg-surface-high text-text-muted hover:text-text-primary rounded-lg',
        danger: 'bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20 rounded-lg',
        outline: 'border border-border bg-transparent text-text-primary hover:bg-surface rounded-lg',
      };

      const sizes = {
        sm: 'px-3 py-1.5 text-xs font-bold uppercase tracking-wider',
        md: 'px-5 py-2.5 text-sm font-bold',
        lg: 'px-7 py-3.5 text-base font-bold',
      };

      return (
        <button
          ref={ref}
          className={cn(
            'inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-30 disabled:pointer-events-none',
            variants[variant],
            sizes[size],
            className
          )}
          {...props}
        />
      );
    }
  )
);

interface CardProps extends React.ComponentPropsWithoutRef<'div'> {
  variant?: 'default' | 'tonal' | 'outline';
  className?: string;
  children?: React.ReactNode;
}

export const Card = React.memo(
  ({ className, variant = 'default', children, ...props }: CardProps) => {
    const styles = {
      default: 'bg-surface border border-border rounded-xl shadow-sm',
      tonal: 'bg-surface-high rounded-xl border border-border shadow-sm',
      outline: 'bg-transparent border border-border rounded-xl',
    };

    return (
      <div
        className={cn(
          'p-6 transition-all duration-200',
          styles[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

export const MetricCard = React.memo(
  ({
    label,
    value,
    change,
    percent,
    prefix = '',
    variant = 'default',
  }: {
    label: string;
    value: string | number;
    change: number;
    percent: number;
    prefix?: string;
    variant?: 'default' | 'tonal' | 'outline';
  }) => (
    <Card variant={variant} className="flex flex-col gap-1 group hover:border-primary/30">
      <span className="text-[10px] text-text-dim tracking-widest font-bold uppercase">{label}</span>
      <span className="text-3xl font-sans font-bold text-text-primary tracking-tight">
        {prefix}
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
      <div
        className={cn(
          'flex items-center gap-1.5 text-xs font-bold mt-2',
          change >= 0 ? 'text-tertiary' : 'text-danger'
        )}
      >
        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-current/10">
          {change >= 0 ? '▲' : '▼'}
          {Math.abs(percent)}%
        </span>
        <span className="text-text-dim/60 font-medium">from last session</span>
      </div>
    </Card>
  )
);

export const Input = React.memo(
  React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, ...props }, ref) => (
      <input
        ref={ref}
        className={cn(
          'w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-text-dim/40',
          className
        )}
        {...props}
      />
    )
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
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
              'relative bg-surface rounded-xl overflow-hidden max-w-md w-full z-10 shadow-2xl border border-border',
              className
            )}
          >
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-high/30">
                <h2 className="text-lg font-sans font-bold text-text-primary tracking-tight">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-text-dim" />
                </button>
              </div>
            )}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel', 
  variant = 'primary' 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onConfirm: () => void, 
  title: string, 
  message: React.ReactNode, 
  confirmText?: string, 
  cancelText?: string, 
  variant?: 'primary' | 'danger' 
}) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={title}>
      <div className="text-sm text-text-muted mb-8 leading-relaxed font-normal">{message}</div>
      <div className="flex items-center justify-end gap-3">
        <Button variant="ghost" onClick={onClose} className="text-xs uppercase tracking-widest">{cancelText}</Button>
        <Button variant={variant} onClick={() => { onConfirm(); onClose(); }} className="text-xs uppercase tracking-widest">{confirmText}</Button>
      </div>
    </Dialog>
  );
};

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn('skeleton-shimmer', className)} />
);


