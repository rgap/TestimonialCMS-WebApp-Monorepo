'use client';

import { MessageSquareQuote } from 'lucide-react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  href?: string;
}

export function Logo({ size = 'md', showText = true, href = '/' }: LogoProps) {
  const sizeStyles = {
    sm: { icon: 20, text: 'text-lg' },
    md: { icon: 28, text: 'text-2xl' },
    lg: { icon: 36, text: 'text-3xl' },
  };
  
  const content = (
    <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
      <div className="flex items-center justify-center w-fit p-2 bg-gradient-to-br from-[var(--color-primary-600)] to-[var(--color-secondary-600)] rounded-xl shadow-lg">
        <MessageSquareQuote size={sizeStyles[size].icon} className="text-white" strokeWidth={2.5} />
      </div>
      {showText && (
        <span className={`${sizeStyles[size].text} tracking-tight bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-secondary-600)] bg-clip-text text-transparent`}>
          <strong>TestimonialCMS</strong>
        </span>
      )}
    </Link>
  );
  
  return content;
}
