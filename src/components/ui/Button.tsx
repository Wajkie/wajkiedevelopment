import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export default function Button({ 
  variant = 'secondary', 
  size = 'md', 
  className = '',
  disabled = false,
  children,
  ...props 
}: ButtonProps) {
  const baseStyles = 'rounded transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white disabled:hover:bg-blue-600',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600 disabled:hover:bg-gray-700',
    ghost: 'bg-transparent hover:bg-gray-700 text-gray-300 disabled:hover:bg-transparent',
  };

  const sizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-1.5 text-base',
    lg: 'px-4 py-2 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
