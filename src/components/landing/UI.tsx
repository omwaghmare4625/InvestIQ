import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'motion/react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

const snappyTransition: any = { type: 'tween', ease: 'easeOut', duration: 0.1 };

// Button Component
interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', leftIcon, rightIcon, ...props }, ref) => {
    const variants = {
      default: 'bg-primary text-text-base border-border border-[var(--border-width)] shadow-[var(--shadow-block)]',
      outline: 'bg-surface text-text-base border-border border-[var(--border-width)] shadow-[var(--shadow-block)]',
      ghost: 'bg-transparent text-text-muted hover:text-text-primary border-transparent',
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs font-bold',
      md: 'px-6 py-3 text-sm font-bold',
      lg: 'px-8 py-4 text-base font-bold',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={variant !== 'ghost' ? { x: -2, y: -2, boxShadow: 'var(--shadow-elevated)' } : { scale: 1.05 }}
        whileTap={variant !== 'ghost' ? { x: 4, y: 4, boxShadow: '0px 0px 0px 0px var(--shadow-color)' } : { scale: 0.95 }}
        transition={snappyTransition}
        className={cn(
          'inline-flex items-center justify-center transition-colors duration-100 disabled:opacity-50 disabled:pointer-events-none gap-2 font-bold uppercase tracking-wide',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {leftIcon}
        {props.children as React.ReactNode}
        {rightIcon}
      </motion.button>
    );
  }
);

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-base font-bold">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full bg-surface border-[var(--border-width)] border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-muted font-bold transition-all focus:outline-none focus:ring-0 shadow-[var(--shadow-block)] focus:shadow-[var(--shadow-elevated)] focus:-translate-y-1 focus:-translate-x-1',
            leftIcon && 'pl-12',
            rightIcon && 'pr-12',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-base font-bold">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

// Card Component
interface CardProps extends HTMLMotionProps<'div'> {
  featured?: boolean;
}

export const Card = ({ className, featured, ...props }: CardProps) => {
  return (
    <motion.div
      whileHover={{ x: -4, y: -4, boxShadow: 'var(--shadow-elevated)' }}
      transition={snappyTransition}
      className={cn(
        'bg-surface border-[var(--border-width)] border-border p-6 shadow-[var(--shadow-block)]',
        featured && 'bg-accent/10 border-accent',
        className
      )}
      {...props}
    />
  );
};

// Badge Component
export const Badge = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'inline-flex items-center bg-accent border-[2px] border-border px-3 py-1 text-[11px] font-black uppercase tracking-widest text-text-primary shadow-[2px_2px_0px_0px_var(--shadow-color)]',
        className
      )}
      {...props}
    />
  );
};

// Accordion Component
export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border-[var(--border-width)] border-border bg-surface mb-4 shadow-[var(--shadow-block)] data-[state=open]:shadow-[var(--shadow-elevated)] data-[state=open]:-translate-y-1 data-[state=open]:-translate-x-1 transition-all duration-100', className)}
    {...props}
  />
));

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between p-6 text-left text-lg font-black uppercase tracking-tight transition-all hover:bg-surface-hover [&[data-state=open]>svg]:rotate-180',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-6 w-6 shrink-0 text-text-base transition-transform duration-100 border-[2px] border-border rounded-full p-0.5" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));

export const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      'overflow-hidden text-sm text-text-primary transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down font-medium border-t-[var(--border-width)] border-border',
      className
    )}
    {...props}
  >
    <div className="p-6 bg-surface-hover/50">{children}</div>
  </AccordionPrimitive.Content>
));
