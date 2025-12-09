'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, FolderOpen, MessageSquareQuote, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from "@/features/auth/context/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { getApiUrl, publicAnonKey } from "@/lib/supabase/info";

interface Project {
  id: string;
  name: string;
  type: string;
  testimonialsCount: number;
  createdAt: string;
  updatedAt: string;
  role?: string; // 'owner' or 'editor'
  ownerId?: string;
  ownerEmail?: string;
}

interface ProjectCardProps {
  project: Project;
  isOwner: boolean;
  permissions: any;
  onDelete: (project: Project) => void;
  getTimeAgo: (date: string) => string;
}

function ProjectCard({ project, isOwner, permissions, onDelete, getTimeAgo }: ProjectCardProps) {
  const roleLabel = isOwner ? 'Admin' : 'Editor';
  const roleBadgeClass = isOwner 
    ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]' 
    : 'bg-[var(--color-secondary-100)] text-[var(--color-secondary-700)]';
  
  return (
    <div className="relative group">
      <Link href={`/dashboard/projects/${project.id}/testimonials`}
        className="block bg-white rounded-2xl shadow-sm border-2 border-[var(--color-border)] p-8 hover:shadow-xl hover:border-[var(--color-primary-300)] transition-all duration-200"
      >
        <div className="flex items-start gap-5 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-primary-600)] to-[var(--color-secondary-600)] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform">
            <MessageSquareQuote size={32} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-[var(--color-text-primary)] group-hover:text-[var(--color-primary-600)] transition-colors">
                {project.name}
              </h4>
              <span className={`text-xs px-2 py-0.5 rounded ${roleBadgeClass}`}>
                {roleLabel}
              </span>
            </div>
            <p className="text-[var(--color-text-tertiary)]">
              {project.type}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-6 border-t border-[var(--color-border)]">
          <span className="text-[var(--color-text-secondary)]">
            {project.testimonialsCount} testimonios
          </span>
          <span className="text-sm text-[var(--color-text-tertiary)]">
            {getTimeAgo(project.updatedAt)}
          </span>
        </div>
      </Link>
      
      {isOwner && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onDelete(project);
          }}
          className="absolute top-4 right-4 p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          title="Eliminar proyecto"
        >
          <Trash2 size={18} />
        </button>
      )}
    </div>
  );
}

export function DashboardProjectsListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const { user, isAuthenticated } = useAuth();
  const { permissions } = usePermissions();
  
  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
    }
  }, [isAuthenticated]);
  
  const loadProjects = async () => {
    const accessToken = localStorage.getItem('access_token');
    
    if (!accessToken) {
      setLoading(false);
      return;
    }
    
    try {
      const apiUrl = getApiUrl('/projects');
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error loading projects:', data);
        setError(data.error || 'Error al cargar los proyectos');
        return;
      }
      
      console.log('Projects loaded:', data.projects);
      setProjects(data.projects || []);
    } catch (error: any) {
      console.error('Error loading projects:', error);
      setError('Error al cargar los proyectos. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Hoy';
    if (diffInDays === 1) return 'Ayer';
    if (diffInDays < 7) return `Hace ${diffInDays} días`;
    if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`;
    return `Hace ${Math.floor(diffInDays / 30)} meses`;
  };
  
  // Separate projects by ownership: compare ownerId with current user.id
  const ownedProjects = projects.filter(p => p.ownerId === user?.id);
  const collaboratorProjects = projects.filter(p => p.ownerId !== user?.id);
  
  const hasProjects = projects.length > 0;
  const hasOwnedProjects = ownedProjects.length > 0;
  const hasCollaboratorProjects = collaboratorProjects.length > 0;
  
  const openDeleteModal = (project: Project) => {
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };
  
  const closeDeleteModal = () => {
    setProjectToDelete(null);
    setDeleteModalOpen(false);
    setDeleteConfirmName('');
    setDeleteError('');
  };
  
  const handleDeleteProject = async () => {
    if (!projectToDelete || deleteConfirmName !== projectToDelete.name) {
      setDeleteError('El nombre del proyecto no coincide');
      return;
    }
    
    setDeleting(true);
    setDeleteError('');
    
    try {
      const apiUrl = getApiUrl(`/projects/${projectToDelete.id}`);
      
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error deleting project:', data);
        setDeleteError(data.error || 'Error al eliminar el proyecto');
        return;
      }
      
      console.log('Project deleted:', data);
      setProjects(projects.filter(project => project.id !== projectToDelete.id));
      closeDeleteModal();
    } catch (error: any) {
      console.error('Error deleting project:', error);
      setDeleteError('Error al eliminar el proyecto. Por favor intenta de nuevo.');
    } finally {
      setDeleting(false);
    }
  };
  
  return (
    <AppLayout userRole={user?.role} userName={user?.name || user?.email || 'Usuario'}>
      <div className="container max-w-5xl py-12">
        {/* Header */}
        <div className="mb-12">
          <h2 className="mb-3 text-[var(--color-text-primary)]">Dashboard de Proyectos</h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Administra y colabora en proyectos de captura de testimonios
          </p>
        </div>
        
        {/* Projects List */}
        <div className="space-y-12">
            {/* Owned Projects */}
            <div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-[var(--color-text-primary)] mb-2">Mis Proyectos</h3>
                  <p className="text-[var(--color-text-secondary)]">
                    Proyectos donde eres el administrador
                  </p>
                </div>
                {permissions.canCreateProject && (
                  <Button href="/dashboard/projects/new" size="lg" className="px-8 py-4 md:flex-shrink-0">
                    <Plus size={22} />
                    Crear proyecto
                  </Button>
                )}
              </div>
              {hasOwnedProjects ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {ownedProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      isOwner={true}
                      permissions={permissions}
                      onDelete={openDeleteModal}
                      getTimeAgo={getTimeAgo}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-[var(--color-background)] rounded-2xl border-2 border-dashed border-[var(--color-border)]">
                  <p className="text-[var(--color-text-tertiary)]">
                    Aún no tienes proyectos como administrador
                  </p>
                </div>
              )}
            </div>
            
            {/* Collaborator Projects */}
            <div>
              <div className="mb-6">
                <h3 className="text-[var(--color-text-primary)] mb-2">Proyectos como Editor</h3>
                <p className="text-[var(--color-text-secondary)]">
                  Proyectos donde eres editor
                </p>
              </div>
              {hasCollaboratorProjects ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {collaboratorProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      isOwner={false}
                      permissions={permissions}
                      onDelete={openDeleteModal}
                      getTimeAgo={getTimeAgo}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-[var(--color-background)] rounded-2xl border-2 border-dashed border-[var(--color-border)]">
                  <p className="text-[var(--color-text-tertiary)]">
                    Aún no estás asignado como editor en ningún proyecto
                  </p>
                </div>
              )}
            </div>
        </div>
        
        {/* Delete Modal */}
        {deleteModalOpen && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle size={32} className="text-red-600" />
                </div>
              </div>
              
              <h3 className="mb-3 text-[var(--color-text-primary)] text-center">
                Eliminar proyecto
              </h3>
              
              <p className="text-[var(--color-text-secondary)] mb-6 text-center">
                Esta acción no se puede deshacer. Se eliminará permanentemente el proyecto <strong className="text-[var(--color-text-primary)]">{projectToDelete?.name}</strong> y todos sus datos asociados.
              </p>
              
              <div className="mb-6">
                <label htmlFor="confirmName" className="block text-sm mb-2 text-[var(--color-text-secondary)]">
                  Para confirmar, escribe el nombre del proyecto:
                </label>
                <Input
                  id="confirmName"
                  type="text"
                  placeholder={projectToDelete?.name}
                  value={deleteConfirmName}
                  onChange={(e) => setDeleteConfirmName(e.target.value)}
                  autoComplete="off"
                />
              </div>
              
              {deleteError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 text-center">
                    {deleteError}
                  </p>
                </div>
              )}
              
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={closeDeleteModal}
                  disabled={deleting}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  size="lg"
                  onClick={handleDeleteProject}
                  disabled={deleting || deleteConfirmName !== projectToDelete?.name}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? 'Eliminando...' : 'Eliminar proyecto'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}