import { ButtonHTMLAttributes, ReactNode, cloneElement, isValidElement } from 'react';
import { cn } from '@/lib/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'ghost' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  asChild?: boolean;
  children: ReactNode;
}

export default function Button({ 
  variant = 'default', 
  size = 'md', 
  asChild = false,
  className = '',
  children,
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90 [box-shadow:var(--shadow-glow)] hover:[box-shadow:var(--shadow-glow-lg)]',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 backdrop-blur-sm [box-shadow:var(--shadow-md)] hover:[box-shadow:var(--shadow-lg)]',
    ghost: 'hover:bg-accent hover:text-accent-foreground hover:[box-shadow:var(--shadow-sm)]',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 [box-shadow:var(--shadow-lg)] hover:[box-shadow:var(--shadow-xl)]',
    outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground backdrop-blur-sm hover:[box-shadow:var(--shadow-md)]',
  };

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8 text-base',
    icon: 'h-10 w-10',
  };

  const classes = cn(baseStyles, variants[variant], sizes[size], className);

  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      ...props,
      className: cn(classes, (children.props as { className?: string }).className),
    } as React.HTMLAttributes<HTMLElement>);
  }

  return (
    <button
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}
