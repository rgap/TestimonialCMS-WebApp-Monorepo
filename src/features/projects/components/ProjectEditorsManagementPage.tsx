'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Users, UserPlus, Trash2, AlertCircle } from 'lucide-react';
import { usePermissions, useProject } from '@/hooks';
import { useAuth } from "@/features/auth/context/AuthContext";
import { getApiUrl } from "@/lib/supabase/info";

interface Editor {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export function ProjectEditorsManagementPage() {
  const params = useParams();
  const projectId = typeof params.projectId === 'string' ? params.projectId : undefined;
  const [newEditorEmail, setNewEditorEmail] = useState('');
  const [editors, setEditors] = useState<Editor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingEditorId, setDeletingEditorId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const { permissions, isAdmin } = usePermissions();
  const { project, loading: projectLoading } = useProject(projectId);
  const { user } = useAuth();
  
  // Check if user can manage editors: either admin role OR owner of the project
  const isProjectOwner = project && user && project.ownerId === user.id;
  const canManageEditors = permissions.canManageEditors || isProjectOwner;
  
  useEffect(() => {
    if (canManageEditors && !projectLoading) {
      fetchEditors();
    }
  }, [projectId, canManageEditors, projectLoading]);
  
  const fetchEditors = async () => {
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
        getApiUrl(`/projects/${projectId}/editors`),
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cargar editores');
      }
      
      const data = await response.json();
      setEditors(data.editors || []);
      
    } catch (err) {
      console.error('Error fetching editors:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddEditor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEditorEmail.trim()) {
      setError('Por favor ingresa un correo electrónico');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);
      
      const accessToken = localStorage.getItem('access_token');
      
      if (!accessToken) {
        setError('No estás autenticado');
        return;
      }
      
      const response = await fetch(
        getApiUrl(`/projects/${projectId}/editors`),
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: newEditorEmail.trim() }),
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al agregar editor');
      }
      
      // Success!
      setSuccessMessage(`Editor ${newEditorEmail} agregado exitosamente`);
      setNewEditorEmail('');
      
      // Refresh editors list
      await fetchEditors();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (err) {
      console.error('Error adding editor:', err);
      setError(err instanceof Error ? err.message : 'Error al agregar editor');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteEditor = async (editorId: string, editorEmail: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar a ${editorEmail} del proyecto?`)) {
      return;
    }
    
    try {
      setDeletingEditorId(editorId);
      setError(null);
      
      const accessToken = localStorage.getItem('access_token');
      
      if (!accessToken) {
        setError('No estás autenticado');
        return;
      }
      
      const response = await fetch(
        getApiUrl(`/projects/${projectId}/editors/${editorId}`),
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
        throw new Error(errorData.error || 'Error al eliminar editor');
      }
      
      // Success!
      setSuccessMessage(`Editor ${editorEmail} eliminado exitosamente`);
      
      // Refresh editors list
      await fetchEditors();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (err) {
      console.error('Error deleting editor:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar editor');
    } finally {
      setDeletingEditorId(null);
    }
  };
  
  // Show loading while checking project ownership
  if (projectLoading) {
    return (
      
        <div className="container max-w-4xl py-12">
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-[var(--color-primary-200)] border-t-[var(--color-primary-600)] rounded-full animate-spin"></div>
            <p className="mt-4 text-[var(--color-text-secondary)]">Verificando permisos...</p>
          </div>
        </div>
      
    );
  }
  
  // Redirect if user doesn't have permission to manage editors
  if (!canManageEditors) {
    return (
      
        <div className="container max-w-4xl py-12">
          <div className="bg-[var(--color-error-50)] border border-[var(--color-error-200)] rounded-2xl p-8 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-[var(--color-error-100)] rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} className="text-[var(--color-error-600)]" />
            </div>
            <h3 className="text-[var(--color-text-primary)] mb-4">Acceso restringido</h3>
            <p className="text-lg text-[var(--color-text-secondary)] mb-8">
              No tienes permisos para gestionar editores. Esta función está disponible solo para administradores del proyecto.
            </p>
            <Button href={`/dashboard/projects/${projectId}/testimonials`} variant="outline">
              Volver a testimonios
            </Button>
          </div>
        </div>
      
    );
  }
  
  return (
    
      <div className="container max-w-4xl py-12">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-[var(--color-text-primary)]">Gestión de editores</h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Gestiona quién puede editar testimonios y formularios de captura en este proyecto
          </p>
        </div>
        
        {/* Success Message */}
        {successMessage && (
          <div className="mb-8 p-6 bg-green-50 border-2 border-green-200 rounded-2xl max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-green-800 font-medium">{successMessage}</p>
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="mb-8 p-6 bg-[var(--color-error-50)] border-2 border-[var(--color-error-200)] rounded-2xl max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              <AlertCircle size={24} className="text-[var(--color-error-600)] flex-shrink-0" />
              <div>
                <h4 className="font-medium text-[var(--color-error-800)] mb-1">Error</h4>
                <p className="text-[var(--color-error-700)]">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Add Editor */}
        <form onSubmit={handleAddEditor} className="bg-white rounded-2xl shadow-lg border border-[var(--color-border)] p-8 mb-10 max-w-2xl mx-auto">
          <h4 className="mb-6 text-[var(--color-text-primary)] flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary-100)] to-[var(--color-primary-200)] rounded-xl flex items-center justify-center">
              <UserPlus size={20} className="text-[var(--color-primary-600)]" />
            </div>
            <span>Agregar editor</span>
          </h4>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="email"
              placeholder="correo@ejemplo.com"
              value={newEditorEmail}
              onChange={(e) => setNewEditorEmail(e.target.value)}
              className="flex-1"
              disabled={isSubmitting}
              required
            />
            <Button 
              type="submit"
              className="px-8 py-3 sm:w-auto w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Invitar'
              )}
            </Button>
          </div>
          <p className="mt-5 text-[var(--color-text-tertiary)]">
            Los editores podrán gestionar testimonios y formularios, pero no eliminar el proyecto ni gestionar otros editores
          </p>
        </form>
        
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-[var(--color-primary-200)] border-t-[var(--color-primary-600)] rounded-full animate-spin"></div>
            <p className="mt-4 text-[var(--color-text-secondary)]">Cargando editores...</p>
          </div>
        )}
        
        {/* Editors List */}
        {!isLoading && (
          <div className="bg-white rounded-2xl shadow-lg border border-[var(--color-border)] overflow-hidden max-w-2xl mx-auto">
            <div className="p-8 border-b border-[var(--color-border)]">
              <h4 className="text-[var(--color-text-primary)] flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-secondary-100)] to-[var(--color-secondary-200)] rounded-xl flex items-center justify-center">
                  <Users size={20} className="text-[var(--color-secondary-600)]" />
                </div>
                <span>Editores actuales ({editors.length})</span>
              </h4>
            </div>
            
            {editors.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-[var(--color-neutral-100)] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users size={40} className="text-[var(--color-neutral-400)]" />
                </div>
                <p className="text-[var(--color-text-secondary)]">
                  Aún no hay editores agregados a este proyecto
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--color-border)]">
                {editors.map((editor) => (
                  <div key={editor.id} className="p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-[var(--color-neutral-50)] transition-colors">
                    <div className="flex items-center gap-5 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-primary-600)] to-[var(--color-secondary-600)] rounded-2xl flex items-center justify-center text-white shadow-lg text-xl flex-shrink-0">
                        <span>{editor.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <h5 className="text-[var(--color-text-primary)] mb-1">{editor.name}</h5>
                        <p className="text-[var(--color-text-secondary)]">{editor.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 w-full sm:w-auto">
                      <div className="text-left sm:text-right flex-1 sm:flex-initial">
                        <p className="text-[var(--color-text-primary)] capitalize">{editor.role}</p>
                        <p className="text-sm text-[var(--color-text-tertiary)] capitalize">{editor.status}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="px-3 py-2"
                        onClick={() => handleDeleteEditor(editor.id, editor.email)}
                        disabled={deletingEditorId === editor.id}
                      >
                        {deletingEditorId === editor.id ? (
                          <div className="w-5 h-5 border-2 border-[var(--color-error-300)] border-t-[var(--color-error-600)] rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 size={18} className="text-[var(--color-error-600)]" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    
  );
}