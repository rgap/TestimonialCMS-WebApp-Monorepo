'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { MessageSquareQuote, AlertCircle } from 'lucide-react';
import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/features/auth/context/AuthContext";
import { getApiUrl, publicAnonKey } from "@/lib/supabase/info";

export function ProjectCreatePage() {
  const router = useRouter();
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { permissions } = usePermissions();
  const { user } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectName.trim() || !permissions.canCreateProject) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const apiUrl = getApiUrl('/projects');
      
      // Get access token from localStorage
      const accessToken = localStorage.getItem('access_token');
      
      if (!accessToken) {
        setError('No estás autenticado. Por favor inicia sesión nuevamente.');
        return;
      }
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name: projectName.trim() }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error creating project:', data);
        setError(data.error || 'Error al crear el proyecto');
        return;
      }
      
      console.log('Project created successfully:', data.project);
      
      // Navigate to the new project
      router.push(`/dashboard/projects/${data.project.id}`);
    } catch (error: any) {
      console.error('Error creating project:', error);
      setError('Error al crear el proyecto. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  // Show access denied if user doesn't have permission
  if (!permissions.canCreateProject) {
    return (
      <AppLayout userRole={user?.role} userName={user?.name || user?.email}>
        <div className="container max-w-3xl py-12">
          <div className="bg-[var(--color-error-50)] border border-[var(--color-error-200)] rounded-2xl p-10 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-[var(--color-error-100)] rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} className="text-[var(--color-error-600)]" />
            </div>
            <h3 className="text-[var(--color-text-primary)] mb-4">Acceso restringido</h3>
            <p className="text-lg text-[var(--color-text-secondary)] mb-8">
              No tienes permisos para crear nuevos proyectos. Esta función está disponible solo para Administradores.
            </p>
            <p className="text-[var(--color-text-secondary)] mb-8">
              Si necesitas crear un proyecto, por favor contacta a un administrador.
            </p>
            <Button href="/dashboard/projects" variant="outline">
              Volver a proyectos
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout userRole={user?.role} userName={user?.name || user?.email}>
      <div className="container max-w-3xl py-12">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-[var(--color-text-primary)]">Crear un nuevo proyecto</h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Organiza tus testimonios por producto, cliente o campaña
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-10 max-w-2xl mx-auto">
          {/* Project Info */}
          <div className="bg-white rounded-3xl shadow-lg border border-[var(--color-border)] p-10">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-primary-600)] to-[var(--color-secondary-600)] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl">
                <MessageSquareQuote size={40} className="text-white" />
              </div>
              <div>
                <h4 className="mb-1 text-[var(--color-text-primary)]">Proyecto de Testimonios</h4>
                <p className="text-[var(--color-text-secondary)]">
                  Recopila testimonios en texto, imagen y video
                </p>
              </div>
            </div>
            
            <div>
              <label htmlFor="projectName" className="block mb-3 text-[var(--color-text-primary)]">
                Nombre del proyecto
              </label>
              <Input
                id="projectName"
                type="text"
                placeholder="Ej: Testimonios Producto X"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
              <p className="text-[var(--color-text-tertiary)] mt-3">
                Dale un nombre descriptivo para identificar fácilmente este proyecto
              </p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="submit"
              disabled={!projectName || loading}
              size="lg"
              className="px-8 py-4 flex-1 sm:flex-initial"
            >
              {loading ? 'Creando...' : 'Crear proyecto'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => router.push('/dashboard/projects')}
              className="px-8 py-4 flex-1 sm:flex-initial"
            >
              Cancelar
            </Button>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="bg-[var(--color-error-50)] border border-[var(--color-error-200)] rounded-2xl p-10 text-center max-w-2xl mx-auto mt-4">
              <div className="w-20 h-20 bg-[var(--color-error-100)] rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} className="text-[var(--color-error-600)]" />
              </div>
              <h3 className="text-[var(--color-text-primary)] mb-4">Error</h3>
              <p className="text-lg text-[var(--color-text-secondary)] mb-8">
                {error}
              </p>
            </div>
          )}
        </form>
      </div>
    </AppLayout>
  );
}