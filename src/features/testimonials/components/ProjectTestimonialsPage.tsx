'use client';

import { 
  MessageSquareQuote, 
  Upload, 
  FileText, 
  Trash2, 
  Video, 
  ImageIcon, 
  FileTextIcon, 
  CheckCircle, 
  Clock, 
  XCircle,
  Building2,
  Play,
  Edit,
  Tag,
  Search,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/Button";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { usePermissions, useProject } from '@/hooks';
import { getApiUrl } from "@/lib/supabase/info";

interface Testimonial {
  id: string;
  projectId: string;
  type: 'text' | 'video' | 'image';
  content: string;
  customerName: string;
  customerEmail: string;
  customerCompany: string;
  customerJobTitle: string;
  customerAvatar: string;
  status: string;
  videoUrl: string;
  imageUrl: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export function ProjectTestimonialsPage() {
  const params = useParams();
  const projectId = typeof params.projectId === 'string' ? params.projectId : undefined;
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingTestimonialId, setDeletingTestimonialId] = useState<string | null>(null);
  const [approvingTestimonialId, setApprovingTestimonialId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved'>('all');
  
  const { project } = useProject(projectId);
  const { permissions } = usePermissions();
  
  useEffect(() => {
    fetchTestimonials();
  }, [projectId]);
  
  const fetchTestimonials = async () => {
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
        getApiUrl(`/projects/${projectId}/testimonials`),
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cargar testimonios');
      }
      
      const data = await response.json();
      setTestimonials(data.testimonials || []);
      
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteTestimonial = async (testimonialId: string, customerName: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el testimonio de ${customerName}?`)) {
      return;
    }
    
    try {
      setDeletingTestimonialId(testimonialId);
      setError(null);
      
      const accessToken = localStorage.getItem('access_token');
      
      if (!accessToken) {
        setError('No estás autenticado');
        return;
      }
      
      const response = await fetch(
        getApiUrl(`/projects/${projectId}/testimonials/${testimonialId}`),
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
        throw new Error(errorData.error || 'Error al eliminar testimonio');
      }
      
      // Refresh testimonials list
      await fetchTestimonials();
      
    } catch (err) {
      console.error('Error deleting testimonial:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar testimonio');
    } finally {
      setDeletingTestimonialId(null);
    }
  };
  
  const handleApproveTestimonial = async (testimonialId: string) => {
    try {
      setApprovingTestimonialId(testimonialId);
      setError(null);
      
      const accessToken = localStorage.getItem('access_token');
      
      if (!accessToken) {
        setError('No estás autenticado');
        return;
      }
      
      const response = await fetch(
        getApiUrl(`/projects/${projectId}/testimonials/${testimonialId}/approve`),
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al aprobar testimonio');
      }
      
      // Refresh testimonials list
      await fetchTestimonials();
      
    } catch (err) {
      console.error('Error approving testimonial:', err);
      setError(err instanceof Error ? err.message : 'Error al aprobar testimonio');
    } finally {
      setApprovingTestimonialId(null);
    }
  };
  
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    if (days < 7) return `Hace ${days} días`;
    if (days < 30) return `Hace ${Math.floor(days / 7)} semanas`;
    if (days < 365) return `Hace ${Math.floor(days / 30)} meses`;
    return `Hace ${Math.floor(days / 365)} años`;
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play size={28} />;
      case 'image':
        return <ImageIcon size={28} />;
      default:
        return <FileText size={28} />;
    }
  };
  
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'video':
        return 'Video';
      case 'image':
        return 'Imagen';
      default:
        return 'Texto';
    }
  };
  
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { label: 'Publicado', class: 'bg-[var(--color-success-100)] text-[var(--color-success-700)]' },
      pending: { label: 'Pendiente', class: 'bg-yellow-100 text-yellow-700' },
      draft: { label: 'Borrador', class: 'bg-[var(--color-neutral-200)] text-[var(--color-neutral-700)]' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`px-4 py-2 ${config.class} text-xs rounded-full`}>
        {config.label}
      </span>
    );
  };
  
  // Filter testimonials based on search query
  const filteredTestimonials = testimonials.filter(testimonial => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      testimonial.customerName.toLowerCase().includes(query) ||
      testimonial.customerEmail.toLowerCase().includes(query) ||
      testimonial.customerCompany?.toLowerCase().includes(query) ||
      testimonial.customerJobTitle?.toLowerCase().includes(query) ||
      testimonial.content?.toLowerCase().includes(query) ||
      testimonial.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  });
  
  // Filter by tab status
  const tabFilteredTestimonials = filteredTestimonials.filter(testimonial => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return testimonial.status === 'pending';
    if (activeTab === 'approved') return testimonial.status === 'approved';
    return true;
  });
  
  // Count testimonials by status
  const pendingCount = testimonials.filter(t => t.status === 'pending').length;
  const approvedCount = testimonials.filter(t => t.status === 'approved').length;
  
  const hasTestimonials = testimonials.length > 0;
  const hasFilteredResults = tabFilteredTestimonials.length > 0;
  
  return (
    
      <div className="container max-w-5xl py-12">
        {/* Error Message */}
        {error && (
          <div className="mb-8 p-6 bg-[var(--color-error-50)] border-2 border-[var(--color-error-200)] rounded-2xl">
            <p className="text-[var(--color-error-700)]">{error}</p>
          </div>
        )}
        
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-[var(--color-primary-200)] border-t-[var(--color-primary-600)] rounded-full animate-spin"></div>
            <p className="mt-4 text-[var(--color-text-secondary)]">Cargando testimonios...</p>
          </div>
        )}
        
        {/* Empty State */}
        {!isLoading && !hasTestimonials && (
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-[var(--color-primary-100)] to-[var(--color-secondary-100)] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
              <FileText size={64} className="text-[var(--color-primary-600)]" />
            </div>
            <h3 className="mb-4 text-[var(--color-text-primary)]">
              {project ? `¡Bienvenido a ${project.name}!` : '¡Bienvenido a tu proyecto!'}
            </h3>
            <p className="text-lg text-[var(--color-text-secondary)] mb-12 max-w-xl mx-auto">
              Comienza importando testimonios existentes o crea formularios para recopilar nuevos
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
              {permissions.canImportTestimonials && (
                <Button 
                  href={`/dashboard/projects/${projectId}/import-testimonials`}
                  variant="outline" 
                  size="lg"
                  className="h-auto py-10 flex-col"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-[var(--color-secondary-100)] to-[var(--color-secondary-200)] rounded-2xl flex items-center justify-center mb-5 shadow-sm">
                    <Upload size={44} className="text-[var(--color-secondary-600)]" />
                  </div>
                  <span className="block mb-2">Importar testimonios</span>
                  <span className="text-sm text-[var(--color-text-tertiary)] block">
                    Sube desde texto, imagen, video o redes sociales
                  </span>
                </Button>
              )}
              
              {permissions.canManageForms && (
                <Button 
                  href={`/dashboard/projects/${projectId}/capture-forms`}
                  variant="outline" 
                  size="lg"
                  className="h-auto py-10 flex-col"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-[var(--color-accent-100)] to-[var(--color-accent-200)] rounded-2xl flex items-center justify-center mb-5 shadow-sm">
                    <FileText size={44} className="text-[var(--color-accent-600)]" />
                  </div>
                  <span className="block mb-2">Recopilar nuevos testimonios</span>
                  <span className="text-sm text-[var(--color-text-tertiary)] block">
                    Crea formularios personalizados de captura
                  </span>
                </Button>
              )}
            </div>
          </div>
        )}
        
        {/* Testimonials List (when they exist) */}
        {!isLoading && hasTestimonials && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
              <div>
                <h3 className="mb-2 text-[var(--color-text-primary)]">Testimonios</h3>
                <p className="text-lg text-[var(--color-text-secondary)]">
                  {filteredTestimonials.length} {filteredTestimonials.length === 1 ? 'testimonio' : 'testimonios'}
                  {searchQuery && testimonials.length !== filteredTestimonials.length && (
                    <span className="text-[var(--color-text-tertiary)]"> de {testimonials.length}</span>
                  )}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                {permissions.canImportTestimonials && (
                  <Button href={`/dashboard/projects/${projectId}/import-testimonials`} size="lg" className="px-8 py-4">
                    <Upload size={22} />
                    Importar
                  </Button>
                )}
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Search className={`w-5 h-5 transition-colors duration-300 ${
                    searchQuery 
                      ? 'text-[var(--color-primary-600)]' 
                      : 'text-[var(--color-text-tertiary)] group-hover:text-[var(--color-primary-500)]'
                  }`} />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por nombre, empresa, cargo, contenido o etiquetas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-12 py-4 bg-white border-2 border-[var(--color-border)] rounded-2xl text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:ring-0 focus:border-[var(--color-primary-500)] hover:border-[var(--color-primary-300)] transition-all duration-300 shadow-sm focus:shadow-lg"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-[var(--color-text-tertiary)] hover:text-[var(--color-error-600)] transition-colors duration-200"
                    title="Limpiar búsqueda"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              {/* Search results info */}
              {searchQuery && !hasFilteredResults && (
                <div className="mt-4 p-4 bg-[var(--color-neutral-50)] border border-[var(--color-border)] rounded-xl">
                  <p className="text-[var(--color-text-secondary)] text-center">
                    No se encontraron testimonios que coincidan con "<span className="font-medium text-[var(--color-text-primary)]">{searchQuery}</span>"
                  </p>
                </div>
              )}
            </div>
            
            {/* Tabs */}
            <div className="mb-8">
              <div className="bg-white border-2 border-[var(--color-border)] rounded-2xl p-2 shadow-sm">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium border-2 ${
                      activeTab === 'all'
                        ? 'bg-white text-[var(--color-text-primary)] shadow-md border-slate-400'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-neutral-50)] hover:text-[var(--color-text-primary)] border-transparent'
                    }`}
                  >
                    <span className="block">Todos</span>
                    <span className="text-sm opacity-90">{testimonials.length}</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                      activeTab === 'pending'
                        ? 'bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600 text-white shadow-md'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-neutral-50)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    <span className="block">En revisión</span>
                    <span className="text-sm opacity-90">{pendingCount}</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('approved')}
                    className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                      activeTab === 'approved'
                        ? 'bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 text-white shadow-md'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-neutral-50)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    <span className="block">Publicados</span>
                    <span className="text-sm opacity-90">{approvedCount}</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Testimonial cards - 2 per row */}
            {hasFilteredResults && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {tabFilteredTestimonials.map((testimonial) => (
                  <div 
                    key={testimonial.id} 
                    className="group rounded-2xl shadow-sm border overflow-hidden hover:shadow-xl transition-all duration-300 bg-white border-[var(--color-border)] hover:border-[var(--color-primary-200)]"
                  >
                    {/* Card Header with gradient */}
                    <div className={`h-1.5 ${
                      activeTab === 'all'
                        ? testimonial.status === 'approved'
                          ? 'bg-gradient-to-r from-[var(--color-accent-400)] via-[var(--color-accent-500)] to-[var(--color-accent-600)]'
                          : 'bg-gradient-to-r from-slate-500 via-slate-600 to-slate-700'
                        : activeTab === 'pending' 
                        ? 'bg-gradient-to-r from-slate-500 via-slate-600 to-slate-700'
                        : 'bg-gradient-to-r from-[var(--color-accent-400)] via-[var(--color-accent-500)] to-[var(--color-accent-600)]'
                    }`}></div>
                    
                    <div className="p-6">
                      {/* Top section: Icon, Name, and Actions */}
                      <div className="flex items-start gap-4 mb-5">
                        {/* Type Icon */}
                        <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-300 ${
                          activeTab === 'all'
                            ? testimonial.status === 'approved'
                              ? 'bg-gradient-to-br from-[var(--color-accent-500)] to-[var(--color-accent-700)]'
                              : 'bg-gradient-to-br from-slate-500 to-slate-700'
                            : activeTab === 'pending'
                            ? 'bg-gradient-to-br from-slate-500 to-slate-700'
                            : 'bg-gradient-to-br from-[var(--color-accent-500)] to-[var(--color-accent-700)]'
                        }`}>
                          {getTypeIcon(testimonial.type)}
                        </div>
                        
                        {/* Customer Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-semibold text-[var(--color-text-primary)] truncate">
                              {testimonial.customerName}
                            </h5>
                            {testimonial.status === 'approved' && (
                              <span className="flex-shrink-0 flex items-center gap-1 px-2 py-0.5 bg-cyan-100 text-cyan-700 text-xs rounded-full">
                                <CheckCircle size={12} />
                                Publicado
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col gap-1">
                            {testimonial.customerJobTitle && (
                              <p className="text-sm text-[var(--color-text-secondary)] truncate">
                                {testimonial.customerJobTitle}
                              </p>
                            )}
                            {testimonial.customerCompany && (
                              <p className="text-sm text-[var(--color-text-tertiary)] truncate flex items-center gap-1">
                                <Building2 size={12} />
                                {testimonial.customerCompany}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {permissions.canDeleteTestimonial && (
                            <button 
                              className="p-2 text-[var(--color-text-tertiary)] hover:bg-[var(--color-error-50)] hover:text-[var(--color-error-600)] rounded-lg transition-colors disabled:opacity-50"
                              onClick={() => handleDeleteTestimonial(testimonial.id, testimonial.customerName)}
                              disabled={deletingTestimonialId === testimonial.id}
                              title="Eliminar testimonio"
                            >
                              {deletingTestimonialId === testimonial.id ? (
                                <div className="w-4 h-4 border-2 border-[var(--color-error-300)] border-t-[var(--color-error-600)] rounded-full animate-spin"></div>
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* Testimonial Content */}
                      <div className="mb-4">
                        {testimonial.type === 'text' && testimonial.content && (
                          <div className="relative">
                            <div className="absolute -left-2 top-0 text-5xl text-[var(--color-primary-200)] font-serif leading-none">"</div>
                            <p className="text-[var(--color-text-secondary)] leading-relaxed pl-6 line-clamp-4">
                              {testimonial.content}
                            </p>
                          </div>
                        )}
                        {testimonial.type === 'video' && testimonial.videoUrl && (
                          <div className="bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-200 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-700 mb-1">Video testimonio</p>
                                <p className="text-xs text-[var(--color-text-tertiary)] truncate">{testimonial.videoUrl}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {testimonial.type === 'image' && testimonial.imageUrl && (
                          <div className="bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-200 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-700 mb-1">Imagen adjunta</p>
                                <p className="text-xs text-[var(--color-text-tertiary)]">Testimonio con imagen</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center justify-between gap-3 mb-4">
                        {permissions.canEditTestimonial && (
                          <Button
                            href={`/dashboard/projects/${projectId}/testimonials/${testimonial.id}`}
                            variant="outline"
                            className="flex-1 justify-center"
                          >
                            <Edit size={16} />
                            Editar
                          </Button>
                        )}
                        
                        {permissions.canApproveTestimonial && (
                          <div className="flex items-center gap-3 px-4 py-2.5 bg-[var(--color-neutral-50)] rounded-lg border border-[var(--color-border)]">
                            <span className="text-sm font-medium text-[var(--color-text-primary)]">
                              Publicar
                            </span>
                            <ToggleSwitch
                              checked={testimonial.status === 'approved'}
                              onChange={() => handleApproveTestimonial(testimonial.id)}
                              disabled={approvingTestimonialId === testimonial.id}
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Card Footer: Tags and Date */}
                      <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                        <div className="flex items-center gap-2 flex-wrap">
                          {testimonial.tags && testimonial.tags.length > 0 ? (
                            testimonial.tags.map(tag => (
                              <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--color-accent-100)] text-[var(--color-accent-700)] text-xs rounded-full font-medium">
                                <Tag size={12} />
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="px-2.5 py-1 bg-[var(--color-neutral-100)] text-[var(--color-text-tertiary)] text-xs rounded-full font-medium">
                              Sin etiquetas
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[var(--color-text-tertiary)] font-medium flex-shrink-0">
                          {getTimeAgo(testimonial.createdAt)}
                        </div>
                      </div>
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