'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Menu, 
  X, 
  LayoutGrid, 
  Sparkles, 
  MessageSquare, 
  LogOut,
  ChevronDown 
} from 'lucide-react';
import { Logo } from "@/components/branding/Logo";
import { useAuth } from "@/features/auth/context/AuthContext";

interface AppLayoutProps {
  children: React.ReactNode;
  userRole?: 'admin' | 'editor' | 'Admin' | 'Editor';
  userName?: string;
}

export function AppLayout({ children, userRole = 'Admin', userName = 'Usuario' }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  // Use authenticated user's data if available
  const displayName = user?.name || userName;
  const displayRole = user?.role === 'admin' ? 'Admin' : user?.role === 'editor' ? 'Editor' : userRole;
  
  const navigation = [
    { name: 'Proyectos', href: '/dashboard/projects', icon: LayoutGrid },
    { name: 'Ayuda', href: '/dashboard/help', icon: MessageSquare },
  ];
  
  const isActive = (href: string) => pathname === href;
  
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[var(--color-border)]">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Nav */}
            <div className="flex items-center gap-8">
              <Logo size="sm" href="/dashboard/projects" />
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]'
                          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[var(--color-neutral-100)] transition-colors"
                >
                  <div className="text-right">
                    <div className="text-sm text-[var(--color-text-primary)]">{displayName}</div>
                    <div className="text-xs text-[var(--color-text-tertiary)]">
                      {displayRole}
                    </div>
                  </div>
                  <ChevronDown size={18} className="text-[var(--color-text-secondary)]" />
                </button>
                
                {userMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[var(--color-border)] py-2 z-50">
                      <div className="px-4 py-3 border-b border-[var(--color-border)]">
                        <p className="text-sm font-medium text-[var(--color-text-primary)]">{displayName}</p>
                        <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                          Rol: {displayRole}
                        </p>
                      </div>
                      <Link href="/"
                        className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-neutral-100)] transition-colors"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} />
                        Cerrar sesión
                      </Link>
                    </div>
                  </>
                )}
              </div>
              
              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-[var(--color-text-primary)] hover:text-[var(--color-primary-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] rounded-lg"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-[var(--color-border)] space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]'
                        : 'text-[var(--color-text-secondary)]'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <div className="pt-4 mt-4 border-t border-[var(--color-border)]">
                <div className="px-4 py-2">
                  <p className="text-sm text-[var(--color-text-primary)]">{displayName}</p>
                  <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                    {displayRole}
                  </p>
                </div>
                <Link href="/"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--color-text-secondary)]"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  Cerrar sesión
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Main Content */}
      <main className="py-8">
        {children}
      </main>
    </div>
  );
}