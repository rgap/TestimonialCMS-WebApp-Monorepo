'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/Button";
import { Plus, FileText, Eye, Edit, Trash2, AlertCircle, Copy } from 'lucide-react';
import { useProject } from '@/hooks';
import { getApiUrl, publicAnonKey } from "@/lib/supabase/info";

interface CaptureForm {
  id: string;
  formName: string;
  description: string;
  responsesCount: number;
  updatedAt: string;
  isActive: boolean;
}

export function ProjectCaptureFormsListPage() {
  const params = useParams();
  const projectId = typeof params.projectId === 'string' ? params.projectId : undefined;
  const { project } = useProject(projectId);
  const [forms, setForms] = useState<CaptureForm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingFormId, setDeletingFormId] = useState<string | null>(null);
  
  useEffect(() => {
    fetchForms();
  }, [projectId]);
  
  const fetchForms = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const accessToken = localStorage.getItem('access_token');
      
      if (!accessToken) {
        setError('No estás autenticado');
        setIsLoading(false);
        return;
      }
      
      const response = await fetch(
        getApiUrl(`/projects/${projectId}/capture-forms`),
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cargar formularios');
      }
      
      const data = await response.json();
      setForms(data.forms || []);
      
    } catch (err) {
      console.error('Error fetching forms:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteForm = async (formId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este formulario? Esta acción no se puede deshacer.')) {
      return;
    }
    
    try {
      setDeletingFormId(formId);
      
      const accessToken = localStorage.getItem('access_token');
      
      if (!accessToken) {
        alert('No estás autenticado');
        return;
      }
      
      const response = await fetch(
        getApiUrl(`/projects/${projectId}/capture-forms/${formId}`),
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar formulario');
      }
      
      // Refresh forms list
      await fetchForms();
      
    } catch (err) {
      console.error('Error deleting form:', err);
      alert(err instanceof Error ? err.message : 'Error al eliminar formulario');
    } finally {
      setDeletingFormId(null);
    }
  };
  
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Hace unos segundos';
    if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
    if (diffInSeconds < 604800) return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
    if (diffInSeconds < 2592000) return `Hace ${Math.floor(diffInSeconds / 604800)} semanas`;
    return `Hace ${Math.floor(diffInSeconds / 2592000)} meses`;
  };
  
  const router = useRouter();
  
  return (
    
      <div className="container max-w-5xl py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div>
            <h2 className="mb-3 text-[var(--color-text-primary)]">Formularios de captura</h2>
            <p className="text-lg text-[var(--color-text-secondary)]">
              Crea formularios personalizados para recopilar testimonios
            </p>
          </div>
          <Button 
            onClick={() => {
              // Generate temporary form ID
              const tempFormId = `form_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
              // Navigate to edit page with temp ID
              router.push(`/dashboard/projects/${projectId}/capture-forms/${tempFormId}/edit?new=true`);
            }}
            size="lg" 
            className="px-8 py-4"
          >
            <Plus size={22} />
            Crear formulario
          </Button>
        </div>
        
        {/* Error State */}
        {error && (
          <div className="mb-8 p-6 bg-[var(--color-error-50)] border-2 border-[var(--color-error-200)] rounded-2xl">
            <div className="flex items-center gap-3">
              <AlertCircle size={24} className="text-[var(--color-error-600)] flex-shrink-0" />
              <div>
                <h4 className="font-medium text-[var(--color-error-800)] mb-1">Error al cargar formularios</h4>
                <p className="text-[var(--color-error-700)]">{error}</p>
              </div>
            </div>
            <Button 
              onClick={fetchForms}
              variant="outline"
              className="mt-4"
            >
              Reintentar
            </Button>
          </div>
        )}
        
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-[var(--color-primary-200)] border-t-[var(--color-primary-600)] rounded-full animate-spin"></div>
            <p className="mt-4 text-[var(--color-text-secondary)]">Cargando formularios...</p>
          </div>
        )}
        
        {/* Empty State */}
        {!isLoading && !error && forms.length === 0 && (
          <div className="max-w-xl mx-auto text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-[var(--color-accent-100)] to-[var(--color-accent-200)] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
              <FileText size={64} className="text-[var(--color-accent-600)]" />
            </div>
            <h3 className="mb-4 text-[var(--color-text-primary)]">
              Crea tu primer formulario
            </h3>
            <p className="text-lg text-[var(--color-text-secondary)] max-w-md mx-auto">
              Los formularios de captura te permiten recopilar testimonios directamente de tus clientes
            </p>
          </div>
        )}
        
        {/* Forms List */}
        {!isLoading && !error && forms.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {forms.map((form) => (
              <div key={form.id} className="bg-white rounded-2xl shadow-sm border border-[var(--color-border)] p-6 hover:shadow-xl hover:border-[var(--color-accent-300)] transition-all duration-300 flex flex-col">
                {/* Header Section */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-[var(--color-accent-600)] to-[var(--color-accent-700)] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <FileText size={28} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[var(--color-text-primary)] mb-2 font-semibold">
                      {form.formName}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                      <span className="px-2 py-1 bg-[var(--color-accent-50)] text-[var(--color-accent-700)] rounded-md font-medium">
                        {form.responsesCount} respuestas
                      </span>
                      <span>•</span>
                      <span>{getRelativeTime(form.updatedAt)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Actions Section */}
                <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-[var(--color-border)]">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={() => {
                        const link = `${window.location.origin}/cf/${form.id}`;
                        // Fallback method for copying to clipboard
                        const textarea = document.createElement('textarea');
                        textarea.value = link;
                        textarea.style.position = 'fixed';
                        textarea.style.opacity = '0';
                        document.body.appendChild(textarea);
                        textarea.select();
                        try {
                          document.execCommand('copy');
                          alert('Link copiado al portapapeles');
                        } catch (err) {
                          console.error('Error al copiar:', err);
                          alert('No se pudo copiar el link. Por favor, cópialo manualmente.');
                        }
                        document.body.removeChild(textarea);
                      }}
                      variant="outline"
                      size="sm"
                      className="flex-1 justify-center bg-gradient-to-r from-[var(--color-primary-50)] to-[var(--color-primary-100)] border-[var(--color-primary-300)] text-[var(--color-primary-700)] hover:from-[var(--color-primary-100)] hover:to-[var(--color-primary-200)]"
                    >
                      <Copy size={18} />
                      <span>Copiar link</span>
                    </Button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      href={`/cf/${form.id}`}
                      variant="outline"
                      size="sm"
                      className="flex-1 justify-center"
                    >
                      <Eye size={18} />
                      <span>Vista previa</span>
                    </Button>
                    <Button
                      href={`/dashboard/projects/${projectId}/capture-forms/${form.id}/edit`}
                      variant="outline"
                      size="sm"
                      className="flex-1 justify-center"
                    >
                      <Edit size={18} />
                      <span>Editar</span>
                    </Button>
                    <Button
                      onClick={() => handleDeleteForm(form.id)}
                      variant="outline"
                      size="sm"
                      className="sm:w-auto text-[var(--color-error-600)] border-[var(--color-error-200)] hover:bg-[var(--color-error-50)] justify-center"
                      disabled={deletingFormId === form.id}
                    >
                      {deletingFormId === form.id ? (
                        <div className="w-5 h-5 border-2 border-[var(--color-error-300)] border-t-[var(--color-error-600)] rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    
  );
}