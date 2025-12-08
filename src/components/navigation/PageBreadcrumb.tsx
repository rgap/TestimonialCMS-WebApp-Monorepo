import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function PageBreadcrumb({ items }: PageBreadcrumbProps) {
  return (
    <div className="bg-gradient-to-r from-[var(--color-primary-50)]/30 via-white to-[var(--color-secondary-50)]/30 border-b border-[var(--color-border)]">
      <nav aria-label="breadcrumb" className="container py-8">
        <ol className="flex items-center gap-2 text-sm">
          {/* Home */}
          <li>
            <Link href="/" 
              className="group flex items-center gap-2 px-4 py-2.5 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary-600)] hover:bg-[var(--color-primary-50)] transition-all duration-200"
            >
              <Home size={16} className="group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Inicio</span>
            </Link>
          </li>
          
          {/* Separator */}
          <li aria-hidden="true" className="flex items-center">
            <ChevronRight size={16} className="text-[var(--color-text-tertiary)] opacity-40" />
          </li>
          
          {/* Dynamic items */}
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            
            return (
              <li key={index} className="flex items-center gap-2">
                {item.href && !isLast ? (
                  <Link href={item.href}
                    className="px-4 py-2.5 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary-600)] hover:bg-[var(--color-primary-50)] transition-all duration-200 font-medium"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-[var(--color-primary-700)] font-semibold">
                    {item.label}
                  </span>
                )}
                
                {!isLast && (
                  <ChevronRight size={16} className="text-[var(--color-text-tertiary)] opacity-40" />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}