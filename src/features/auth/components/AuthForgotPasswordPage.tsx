'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CheckCircle2 } from 'lucide-react';

export function AuthForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending reset email
    setSubmitted(true);
  };
  
  if (submitted) {
    return (
      <AuthLayout 
        title="Correo enviado"
        subtitle="Revisa tu bandeja de entrada"
        breadcrumbItems={[
          { label: 'Recuperar contraseña' }
        ]}
      >
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 bg-[var(--color-success-100)] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={32} className="text-[var(--color-success-600)]" />
          </div>
          <p className="text-[var(--color-text-secondary)]">
            Hemos enviado un enlace de recuperación a <strong>{email}</strong>
          </p>
          <p className="text-sm text-[var(--color-text-tertiary)]">
            Si no ves el correo, revisa tu carpeta de spam
          </p>
        </div>
        
        <div className="mt-6 text-center text-sm">
          <Link href="/login" className="text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]">
            Volver a iniciar sesión
          </Link>
        </div>
      </AuthLayout>
    );
  }
  
  return (
    <AuthLayout 
      title="Recuperar contraseña"
      subtitle="Te enviaremos un enlace para restablecer tu contraseña"
      breadcrumbItems={[
        { label: 'Recuperar contraseña' }
      ]}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          type="email"
          label="Correo electrónico"
          placeholder="tu@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          helperText="Ingresa el correo asociado a tu cuenta"
        />
        
        <Button type="submit" className="w-full">
          Enviar enlace de recuperación
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <Link href="/login" className="text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]">
          Volver a iniciar sesión
        </Link>
      </div>
    </AuthLayout>
  );
}