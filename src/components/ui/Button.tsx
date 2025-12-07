'use client';

import Link from 'next/link';
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  href, 
  children, 
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-[#5b5be8] !text-white hover:bg-[#4a4ac9] active:bg-[#3939aa] shadow-sm focus:ring-[#7b7bff]',
    secondary: 'bg-[var(--color-secondary-600)] !text-white hover:bg-[var(--color-secondary-700)] active:bg-[var(--color-secondary-800)] shadow-sm focus:ring-[var(--color-secondary-500)]',
    outline: 'bg-white border-2 border-[#5b5be8] text-[#5b5be8] hover:bg-[#f0f0ff] active:bg-[#e5e5ff] focus:ring-[#7b7bff]',
    ghost: 'bg-transparent text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-neutral-900)] active:bg-[var(--color-neutral-200)] focus:ring-[var(--color-neutral-400)]',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm min-h-[32px]',
    md: 'px-5 py-2.5 text-base min-h-[40px]',
    lg: 'px-6 py-3 text-lg min-h-[48px]',
  };
  
  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
  
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
