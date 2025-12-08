'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { Logo } from "@/components/branding/Logo";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/context/AuthContext";

export function NavBarGuest() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push('/');
  };
  
  return (
    <nav className="z-50 bg-white/80 backdrop-blur-lg border-b border-[var(--color-border)]">
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Logo size="sm" />
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/about" 
              className="text-[var(--color-text-primary)] hover:text-[var(--color-primary-700)] transition-colors font-medium"
            >
              Acerca de
            </Link>
            
            {user ? (
              /* User is logged in */
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 text-[var(--color-text-primary)] hover:text-[var(--color-primary-700)] transition-colors font-medium rounded-lg hover:bg-[var(--color-primary-50)]"
                  aria-label="Menú de usuario"
                  aria-expanded={userMenuOpen}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-primary-600)] to-[var(--color-secondary-600)] rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <span>{user.name}</span>
                  <ChevronDown size={16} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <>
                    {/* Backdrop to close menu */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setUserMenuOpen(false)}
                    />
                    
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[var(--color-border)] py-2 z-50">
                      <div className="px-4 py-3 border-b border-[var(--color-border)]">
                        <p className="text-sm font-medium text-[var(--color-text-primary)]">
                          {user.name}
                        </p>
                        <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                          {user.email}
                        </p>
                        <p className="text-xs text-[var(--color-primary-600)] font-medium mt-1">
                          {user.role === 'admin' ? 'Administrador' : 'Editor'}
                        </p>
                      </div>
                      
                      <Link href="/dashboard/projects"
                        className="flex items-center gap-3 px-4 py-2.5 text-[var(--color-text-primary)] hover:bg-[var(--color-primary-50)] transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard size={18} />
                        <span className="text-sm font-medium">Dashboard</span>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-[var(--color-error-600)] hover:bg-[var(--color-error-50)] transition-colors w-full text-left"
                      >
                        <LogOut size={18} />
                        <span className="text-sm font-medium">Cerrar sesión</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* User is not logged in */
              <>
                <Link href="/login" 
                  className="text-[var(--color-text-primary)] hover:text-[var(--color-primary-700)] transition-colors font-medium"
                >
                  Iniciar sesión
                </Link>
                <Button href="/signup" size="sm">
                  Crear cuenta
                </Button>
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
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[var(--color-border)] space-y-4">
            <Link href="/about" 
              className="block py-2 text-[var(--color-text-primary)] hover:text-[var(--color-primary-700)] transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Acerca de
            </Link>
            
            {user ? (
              /* User is logged in - Mobile */
              <>
                <div className="py-3 px-4 bg-[var(--color-primary-50)] rounded-lg border border-[var(--color-primary-200)]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary-600)] to-[var(--color-secondary-600)] rounded-full flex items-center justify-center">
                      <User size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">
                        {user.name}
                      </p>
                      <p className="text-xs text-[var(--color-text-tertiary)]">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--color-primary-600)] font-medium">
                    {user.role === 'admin' ? 'Administrador' : 'Editor'}
                  </p>
                </div>
                
                <Link href="/dashboard/projects"
                  className="flex items-center gap-3 py-2 text-[var(--color-text-primary)] hover:text-[var(--color-primary-700)] transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard size={20} />
                  Dashboard
                </Link>
                
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 py-2 text-[var(--color-error-600)] hover:text-[var(--color-error-700)] transition-colors font-medium w-full text-left"
                >
                  <LogOut size={20} />
                  Cerrar sesión
                </button>
              </>
            ) : (
              /* User is not logged in - Mobile */
              <>
                <Link href="/login" 
                  className="block py-2 text-[var(--color-text-primary)] hover:text-[var(--color-primary-700)] transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Iniciar sesión
                </Link>
                <Button href="/signup" className="w-full">
                  Crear cuenta
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
