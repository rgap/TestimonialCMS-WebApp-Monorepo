'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from "@/features/auth/context/AuthContext";

export function AuthSignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    spamTest: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) newErrors.email = 'El correo es requerido';
    if (!formData.name) newErrors.name = 'El nombre es requerido';
    if (formData.spamTest !== '19') newErrors.spamTest = 'Respuesta incorrecta';
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setGeneralError('');
    setErrors({});
    
    try {
      await signup(formData.email, formData.password, formData.name);
      router.push('/dashboard/projects');
    } catch (error: any) {
      console.error('Signup error:', error);
      setGeneralError(error.message || 'Error al crear la cuenta. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthLayout 
      title="Crear cuenta"
      subtitle="Tu cuenta tendrá rol de Admin y podrás invitar Editores a tus proyectos"
      breadcrumbItems={[
        { label: 'Crear cuenta' }
      ]}
    >
      {generalError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-red-800">{generalError}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          type="email"
          label="Correo electrónico"
          placeholder="tu@email.com"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          disabled={loading}
        />
        
        <Input
          type="text"
          label="Nombre completo"
          placeholder="Tu nombre"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          disabled={loading}
        />
        
        <Input
          type="text"
          label="Test anti-spam: ¿Cuánto es 9 + 10?"
          placeholder="Escribe el resultado"
          required
          value={formData.spamTest}
          onChange={(e) => setFormData({ ...formData, spamTest: e.target.value })}
          error={errors.spamTest}
          helperText="Esto nos ayuda a prevenir bots"
          disabled={loading}
        />
        
        <Input
          type="password"
          label="Contraseña"
          placeholder="Mínimo 8 caracteres"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
          disabled={loading}
        />
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>
        
        <div className="pt-4 space-y-3">
          <div className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
            <CheckCircle2 size={18} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
            <p>Tu cuenta será de tipo <strong>Admin</strong> con acceso completo</p>
          </div>
          <div className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
            <CheckCircle2 size={18} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
            <p>Podrás invitar <strong>Editores</strong> a colaborar en tus proyectos</p>
          </div>
          <div className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
            <CheckCircle2 size={18} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
            <p><strong>Gratis para siempre</strong>, sin tarjeta de crédito</p>
          </div>
        </div>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <span className="text-[var(--color-text-secondary)]">¿Ya tienes cuenta? </span>
        <Link href="/login" className="text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]">
          Iniciar sesión
        </Link>
      </div>
    </AuthLayout>
  );
}