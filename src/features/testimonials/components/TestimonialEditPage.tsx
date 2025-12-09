'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Upload, X, CheckCircle2, AlertCircle, Play, Image, Tag, Plus, XCircle, CheckCircle } from 'lucide-react';
import { useProject, usePermissions } from '@/hooks';
import { getApiUrl } from "@/lib/supabase/info";

// Helper function to extract YouTube video ID from URL
function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/,
    /youtube\.com\/shorts\/([^&\?\/]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

// Helper function to get YouTube thumbnail URL
function getYouTubeThumbnail(videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'maxres'): string {
  return `https://img.youtube.com/vi/${videoId}/${quality === 'maxres' ? 'maxresdefault' : `${quality}default`}.jpg`;
}

export function TestimonialEditPage() {
  const params = useParams();
  const projectId = typeof params.projectId === 'string' ? params.projectId : undefined;
  const testimonialId = typeof params.testimonialId === 'string' ? params.testimonialId : undefined;
  const router = useRouter();
  const { project } = useProject(projectId);
  const { permissions } = usePermissions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [originalType, setOriginalType] = useState<'text' | 'video' | 'image'>('text');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [testimonialStatus, setTestimonialStatus] = useState<'pending' | 'approved'>('pending');
  const [isApprovingTestimonial, setIsApprovingTestimonial] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [formData, setFormData] = useState({
    body: '',
    giverName: '',
    giverEmail: '',
    jobTitle: '',
    company: '',
    videoUrl: '',
    imageUrl: '',
    caption: '',
  });
  
  useEffect(() => {
    fetchTestimonial();
  }, [testimonialId]);
  
  const fetchTestimonial = async () => {
    try {
      setIsLoading(true);
      setServerError(null);
      
      const accessToken = localStorage.getItem('access_token');
      
      if (!accessToken) {
        throw new Error('No estás autenticado');
      }
      
      const response = await fetch(
        getApiUrl(`/projects/${projectId}/testimonials/${testimonialId}`),
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cargar el testimonio');
      }
      
      const data = await response.json();
      const testimonial = data.testimonial;
      
      // Set original type
      setOriginalType(testimonial.type);
      
      // Set status
      setTestimonialStatus(testimonial.status || 'pending');
      
      // Set tags if they exist, otherwise default to empty array
      if (testimonial.tags && Array.isArray(testimonial.tags) && testimonial.tags.length > 0) {
        setTags(testimonial.tags);
      } else {
        setTags([]);
      }
      
      // Populate form data
      setFormData({
        body: testimonial.content || '',
        giverName: testimonial.customerName || '',
        giverEmail: testimonial.customerEmail || '',
        jobTitle: testimonial.customerJobTitle || '',
        company: testimonial.customerCompany || '',
        videoUrl: testimonial.videoUrl || '',
        imageUrl: testimonial.imageUrl || '',
        caption: testimonial.content || '',
      });
      
      // Set uploaded photo if exists
      if (testimonial.customerAvatar) {
        setUploadedPhoto(testimonial.customerAvatar);
      }
      
    } catch (error) {
      console.error('Error fetching testimonial:', error);
      setServerError(error instanceof Error ? error.message : 'Error al cargar el testimonio');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    // Validate based on testimonial type
    if (originalType === 'text') {
      if (!formData.body.trim()) newErrors.body = 'El contenido del testimonio es requerido';
    } else if (originalType === 'video') {
      if (!formData.videoUrl.trim()) newErrors.videoUrl = 'La URL del video es requerida';
    } else if (originalType === 'image') {
      if (!formData.imageUrl.trim()) newErrors.imageUrl = 'La URL de la imagen es requerida';
    }
    
    if (!formData.giverName.trim()) {
      newErrors.giverName = 'El nombre es requerido';
    }
    
    if (formData.giverEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.giverEmail)) {
      newErrors.giverEmail = 'Ingresa un correo electrónico válido';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      setTouched({ ...touched, [firstErrorField]: true });
      return;
    }
    
    setIsSubmitting(true);
    setServerError(null);
    
    try {
      const accessToken = localStorage.getItem('access_token');
      
      if (!accessToken) {
        throw new Error('No estás autenticado');
      }
      
      const testimonialData = {
        type: originalType,
        content: originalType === 'text' ? formData.body.trim() : (formData.caption.trim() || ''),
        customerName: formData.giverName.trim(),
        customerEmail: formData.giverEmail.trim(),
        customerCompany: formData.company.trim(),
        customerJobTitle: formData.jobTitle.trim(),
        customerAvatar: uploadedPhoto || '',
        videoUrl: formData.videoUrl.trim(),
        imageUrl: formData.imageUrl.trim(),
        status: 'published',
        tags: tags,
      };
      
      const response = await fetch(
        getApiUrl(`/projects/${projectId}/testimonials/${testimonialId}`),
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testimonialData),
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el testimonio');
      }
      
      // Success! Navigate back to testimonials page
      router.push(`/dashboard/projects/${projectId}/testimonials`);
      
    } catch (error) {
      console.error('Error updating testimonial:', error);
      setServerError(error instanceof Error ? error.message : 'Error al actualizar el testimonio');
      setIsSubmitting(false);
    }
  };
  
  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };
  
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, photo: 'Por favor selecciona una imagen válida' });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, photo: 'La imagen no puede superar 5MB' });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedPhoto(reader.result as string);
        const newErrors = { ...errors };
        delete newErrors.photo;
        setErrors(newErrors);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removePhoto = () => {
    setUploadedPhoto(null);
    const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };
  
  const handleTagAdd = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const handleTagRemove = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  const handleApproveTestimonial = async () => {
    try {
      setIsApprovingTestimonial(true);
      setServerError(null);
      
      const accessToken = localStorage.getItem('access_token');
      
      if (!accessToken) {
        setServerError('No estás autenticado');
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
        throw new Error(errorData.error || 'Error al cambiar el estado del testimonio');
      }
      
      const data = await response.json();
      
      // Update local state
      setTestimonialStatus(data.testimonial.status);
      
    } catch (err) {
      console.error('Error approving testimonial:', err);
      setServerError(err instanceof Error ? err.message : 'Error al cambiar el estado del testimonio');
    } finally {
      setIsApprovingTestimonial(false);
    }
  };
  
  if (isLoading) {
    return (
      
        <div className="container max-w-4xl py-8">
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-[var(--color-primary-200)] border-t-[var(--color-primary-600)] rounded-full animate-spin"></div>
            <p className="mt-4 text-[var(--color-text-secondary)]">Cargando testimonio...</p>
          </div>
        </div>
      
    );
  }
  
  return (
    
      <div className="container max-w-7xl py-8 px-4">
        <form onSubmit={handleSubmit}>
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Main Form */}
            <div className="lg:col-span-2">
              {/* Main Card */}
              <div className="bg-white rounded-2xl shadow-lg border-2 border-[var(--color-border)] overflow-hidden">
                {/* Decorative gradient top */}
                <div className="h-1 bg-gradient-to-r from-[var(--color-primary-500)] via-[var(--color-secondary-500)] to-[var(--color-accent-500)]"></div>
                
                {/* Header dentro de la card */}
                <div className="px-6 pt-6 pb-4 border-b border-[var(--color-border)]">
                  <h2 className="text-[var(--color-text-primary)]">
                    Editar testimonio de {originalType === 'text' ? 'texto' : originalType === 'video' ? 'video' : 'imagen'}
                  </h2>
                </div>
                
                {/* Contenido según tipo - TEXT */}
                {originalType === 'text' && (
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <label className="text-sm font-medium text-[var(--color-text-primary)]">
                        Contenido del testimonio
                      </label>
                      <span className="px-2 py-0.5 bg-[var(--color-error-100)] text-[var(--color-error-700)] text-xs rounded-full">
                        Requerido
                      </span>
                    </div>
                    <Textarea
                      label=""
                      placeholder="Escribe o pega el testimonio completo aquí..."
                      rows={8}
                      value={formData.body}
                      onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                      required
                      onBlur={() => handleBlur('body')}
                      error={touched.body ? errors.body : undefined}
                    />
                  </div>
                )}
                
                {/* Contenido según tipo - VIDEO */}
                {originalType === 'video' && (
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <label className="text-sm font-medium text-[var(--color-text-primary)]">
                        URL del video
                      </label>
                      <span className="px-2 py-0.5 bg-[var(--color-error-100)] text-[var(--color-error-700)] text-xs rounded-full">
                        Requerido
                      </span>
                    </div>
                    <div className="relative">
                      <Input
                        label=""
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={formData.videoUrl}
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                        required
                        onBlur={() => handleBlur('videoUrl')}
                        error={touched.videoUrl ? errors.videoUrl : undefined}
                      />
                    </div>
                    {formData.videoUrl && (() => {
                      const videoId = extractYouTubeVideoId(formData.videoUrl);
                      const thumbnailUrl = videoId ? getYouTubeThumbnail(videoId) : null;
                      
                      return (
                        <div className="mt-4 overflow-hidden bg-gradient-to-br from-[var(--color-secondary-50)] to-[var(--color-accent-50)] border-2 border-[var(--color-secondary-400)] rounded-2xl shadow-lg">
                          {!isPlayingVideo && videoId && thumbnailUrl ? (
                            <>
                              <div className="relative cursor-pointer" onClick={() => setIsPlayingVideo(true)}>
                                <img 
                                  src={thumbnailUrl} 
                                  alt="Video thumbnail" 
                                  className="w-full h-auto"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    if (target.src.includes('maxresdefault')) {
                                      target.src = getYouTubeThumbnail(videoId, 'high');
                                    }
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center hover:bg-black/30 transition-colors">
                                  <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                                    <Play size={40} className="text-white ml-1" fill="white" />
                                  </div>
                                </div>
                              </div>
                              <div className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-secondary-500)] to-[var(--color-secondary-600)] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                    <Play size={24} className="text-white ml-1" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-[var(--color-secondary-700)] mb-1">
                                      Video del testimonio
                                    </div>
                                    <div className="text-sm text-[var(--color-text-tertiary)] truncate">
                                      {formData.videoUrl}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : isPlayingVideo && videoId ? (
                            <div className="relative" style={{ paddingBottom: '56.25%' }}>
                              <iframe
                                className="absolute inset-0 w-full h-full"
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                              <button
                                type="button"
                                onClick={() => setIsPlayingVideo(false)}
                                className="absolute top-3 right-3 w-9 h-9 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-[var(--color-error-50)] hover:text-[var(--color-error-600)] transition-all hover:scale-110 z-10"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          ) : (
                            <div className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-secondary-500)] to-[var(--color-secondary-600)] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                  <Play size={24} className="text-white ml-1" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-[var(--color-secondary-700)] mb-1">
                                    Video del testimonio
                                  </div>
                                  <div className="text-sm text-[var(--color-text-tertiary)] truncate">
                                    {formData.videoUrl}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
                
                {/* Contenido según tipo - IMAGE */}
                {originalType === 'image' && (
                  <>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <label className="text-sm font-medium text-[var(--color-text-primary)]">
                          URL de la imagen
                        </label>
                        <span className="px-2 py-0.5 bg-[var(--color-error-100)] text-[var(--color-error-700)] text-xs rounded-full">
                          Requerido
                        </span>
                      </div>
                      <div className="relative">
                        <Input
                          label=""
                          placeholder="https://ejemplo.com/imagen.jpg"
                          value={formData.imageUrl}
                          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                          required
                          onBlur={() => handleBlur('imageUrl')}
                          error={touched.imageUrl ? errors.imageUrl : undefined}
                        />
                      </div>
                      {formData.imageUrl && (
                        <div className="mt-4 overflow-hidden bg-gradient-to-br from-[var(--color-accent-50)] to-[var(--color-primary-50)] border-2 border-[var(--color-accent-400)] rounded-2xl shadow-lg">
                          <div className="relative">
                            <img 
                              src={formData.imageUrl} 
                              alt="Imagen del testimonio" 
                              className="w-full h-auto max-h-[600px] object-contain bg-white"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const errorMsg = target.nextElementSibling as HTMLElement;
                                if (errorMsg) errorMsg.style.display = 'block';
                              }}
                            />
                            <div 
                              className="hidden p-8 text-center text-[var(--color-error-600)]"
                              style={{ display: 'none' }}
                            >
                              <AlertCircle size={48} className="mx-auto mb-2" />
                              <p className="font-medium">No se pudo cargar la imagen</p>
                              <p className="text-sm mt-1">Verifica que la URL sea correcta</p>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-accent-500)] to-[var(--color-primary-500)] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                <Image size={24} className="text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-[var(--color-accent-700)] mb-1">
                                  Imagen del testimonio
                                </div>
                                <div className="text-sm text-[var(--color-text-tertiary)] truncate">
                                  {formData.imageUrl}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Separador */}
                    <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent"></div>
                    
                    {/* Caption */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <label className="text-sm font-medium text-[var(--color-text-primary)]">
                          Descripción o caption
                        </label>
                        <span className="px-2 py-0.5 bg-[var(--color-neutral-200)] text-[var(--color-text-tertiary)] text-xs rounded-full">
                          Opcional
                        </span>
                      </div>
                      <Textarea
                        label=""
                        placeholder="Agrega un texto descriptivo para acompañar la imagen..."
                        rows={4}
                        value={formData.caption}
                        onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                      />
                    </div>
                  </>
                )}
                
                {/* Separador */}
                <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent"></div>
                
                {/* Información del autor */}
                <div className="p-6 bg-gradient-to-br from-white to-[var(--color-neutral-50)]">
                  <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
                    Información del autor
                  </h3>
                  <p className="text-xs text-[var(--color-text-tertiary)] mb-5">
                    Los testimonios son siempre de personas individuales. Los campos "Cargo" y "Empresa" son opcionales y se refieren al lugar donde trabaja la persona.
                  </p>
                  
                  <div className="space-y-4">
                    {/* Nombre y Email en una fila */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <label className="text-sm font-medium text-[var(--color-text-primary)]">
                            Nombre completo
                          </label>
                          <span className="px-2 py-0.5 bg-[var(--color-error-100)] text-[var(--color-error-700)] text-xs rounded-full">
                            Requerido
                          </span>
                        </div>
                        <Input
                          label=""
                          placeholder="Ej: Juan Pérez"
                          value={formData.giverName}
                          onChange={(e) => setFormData({ ...formData, giverName: e.target.value })}
                          required
                          onBlur={() => handleBlur('giverName')}
                          error={touched.giverName ? errors.giverName : undefined}
                        />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <label className="text-sm font-medium text-[var(--color-text-primary)]">
                            Correo electrónico
                          </label>
                          <span className="px-2 py-0.5 bg-[var(--color-neutral-200)] text-[var(--color-text-tertiary)] text-xs rounded-full">
                            Opcional
                          </span>
                        </div>
                        <Input
                          label=""
                          type="email"
                          placeholder="correo@ejemplo.com"
                          value={formData.giverEmail}
                          onChange={(e) => setFormData({ ...formData, giverEmail: e.target.value })}
                          onBlur={() => handleBlur('giverEmail')}
                          error={touched.giverEmail ? errors.giverEmail : undefined}
                        />
                      </div>
                    </div>
                    
                    {/* Campos condicionales para Personal */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <label className="text-sm font-medium text-[var(--color-text-primary)]">
                            Cargo
                          </label>
                          <span className="px-2 py-0.5 bg-[var(--color-neutral-200)] text-[var(--color-text-tertiary)] text-xs rounded-full">
                            Opcional
                          </span>
                        </div>
                        <Input
                          label=""
                          placeholder="Ej: CEO, Director"
                          value={formData.jobTitle}
                          onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <label className="text-sm font-medium text-[var(--color-text-primary)]">
                            Empresa
                          </label>
                          <span className="px-2 py-0.5 bg-[var(--color-neutral-200)] text-[var(--color-text-tertiary)] text-xs rounded-full">
                            Opcional
                          </span>
                        </div>
                        <Input
                          label=""
                          placeholder="Nombre de la empresa"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    {/* Foto/Logo Upload */}
                    <div className="pt-2">
                      <div className="flex items-center gap-2 mb-3">
                        <label className="text-sm font-medium text-[var(--color-text-primary)]">
                          Foto
                        </label>
                        <span className="px-2 py-0.5 bg-[var(--color-neutral-200)] text-[var(--color-text-tertiary)] text-xs rounded-full">
                          Opcional
                        </span>
                      </div>
                      {!uploadedPhoto ? (
                        <label 
                          htmlFor="photo-upload"
                          className="group cursor-pointer block w-full"
                        >
                          <div className="relative min-h-[140px] px-6 py-8 bg-gradient-to-br from-[var(--color-primary-50)] via-white to-[var(--color-accent-50)] border-2 border-dashed border-[var(--color-primary-200)] rounded-2xl hover:border-[var(--color-primary-400)] hover:from-[var(--color-primary-100)] hover:to-[var(--color-accent-100)] transition-all duration-300 group-hover:shadow-lg">
                            <div className="flex flex-col items-center justify-center gap-3">
                              <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-accent-500)] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Upload size={32} className="text-white" />
                              </div>
                              <div className="text-center">
                                <div className="font-medium text-[var(--color-primary-700)] group-hover:text-[var(--color-primary-800)]">
                                  Clic para subir foto
                                </div>
                                <div className="text-sm text-[var(--color-text-tertiary)] mt-1">
                                  PNG, JPG, WEBP • Máximo 5MB
                                </div>
                              </div>
                            </div>
                          </div>
                        </label>
                      ) : (
                        <div className="relative min-h-[140px] bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-accent-50)] border-2 border-[var(--color-primary-400)] rounded-2xl p-6 shadow-lg">
                          <div className="flex items-center justify-center">
                            <img 
                              src={uploadedPhoto} 
                              alt="Preview" 
                              className="max-h-[120px] max-w-full object-contain rounded-2xl"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={removePhoto}
                            className="absolute top-3 right-3 w-9 h-9 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-[var(--color-error-50)] hover:text-[var(--color-error-600)] transition-all hover:scale-110"
                          >
                            <X size={18} />
                          </button>
                          <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-[var(--color-primary-700)] shadow-md flex items-center gap-1">
                            <CheckCircle2 size={12} />
                            Imagen cargada
                          </div>
                        </div>
                      )}
                      <input
                        type="file"
                        id="photo-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                      />
                      {errors.photo && (
                        <p className="mt-2 text-sm font-medium text-[var(--color-error-700)]">
                          {errors.photo}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Actions */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                
                {/* Publish Button Card */}
                {permissions.canApproveTestimonial && (
                  <div className="bg-white rounded-2xl shadow-lg border-2 border-[var(--color-border)] overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-[var(--color-primary-500)] via-[var(--color-secondary-500)] to-[var(--color-accent-500)]"></div>
                    
                    <div className="px-6 pt-6 pb-4 border-b border-[var(--color-border)]">
                      <h3 className="text-[var(--color-text-primary)]">
                        Estado de publicación
                      </h3>
                    </div>
                    
                    <div className="p-6">
                      <p className="text-sm text-[var(--color-text-tertiary)] mb-5">
                        {testimonialStatus === 'pending' ? 'Este testimonio está en revisión' : 'Este testimonio está publicado'}
                      </p>
                      
                      <button
                        type="button"
                        className={`w-full px-6 py-3 rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg ${
                          testimonialStatus === 'pending' 
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600' 
                            : 'bg-gradient-to-r from-slate-500 to-slate-600 text-white hover:from-slate-600 hover:to-slate-700'
                        }`}
                        onClick={handleApproveTestimonial}
                        disabled={isApprovingTestimonial}
                      >
                        {isApprovingTestimonial ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Procesando...
                          </>
                        ) : testimonialStatus === 'pending' ? (
                          <>
                            <CheckCircle size={20} />
                            Publicar testimonio
                          </>
                        ) : (
                          <>
                            <XCircle size={20} />
                            Volver a revisión
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Tags Card */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-[var(--color-border)] overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-[var(--color-primary-500)] via-[var(--color-secondary-500)] to-[var(--color-accent-500)]"></div>
                  
                  <div className="px-6 pt-6 pb-4 border-b border-[var(--color-border)]">
                    <h3 className="text-[var(--color-text-primary)]">
                      Etiquetas
                    </h3>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-sm text-[var(--color-text-tertiary)] mb-5">
                      Agrega etiquetas para categorizar este testimonio.
                    </p>
                    
                    <div className="space-y-4">
                      {/* Tag Input */}
                      <div className="flex items-center gap-2">
                        <Input
                          label=""
                          placeholder="Ej: Innovación"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e: React.KeyboardEvent) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleTagAdd();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleTagAdd}
                          className="bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-700)] hover:from-[var(--color-primary-700)] hover:to-[var(--color-primary-800)] shadow-lg hover:shadow-xl transition-all duration-300 flex-shrink-0"
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                      
                      {/* Tags List */}
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.map(tag => (
                            <div key={tag} className="bg-[var(--color-accent-100)] text-[var(--color-accent-700)] text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                              <Tag size={14} />
                              {tag}
                              <X size={14} className="cursor-pointer hover:text-[var(--color-accent-900)]" onClick={() => handleTagRemove(tag)} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Actions Card */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-[var(--color-border)] overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-[var(--color-primary-500)] via-[var(--color-secondary-500)] to-[var(--color-accent-500)]"></div>
                  
                  <div className="px-6 pt-6 pb-4 border-b border-[var(--color-border)]">
                    <h3 className="text-[var(--color-text-primary)]">
                      Acciones
                    </h3>
                  </div>
                  
                  <div className="p-6 space-y-3">
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full min-h-[56px] bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-700)] hover:from-[var(--color-primary-700)] hover:to-[var(--color-primary-800)] shadow-lg hover:shadow-xl transition-all duration-300" 
                      disabled={isSubmitting || !permissions.canEditTestimonial}
                    >
                      {isSubmitting ? (
                        <>
                          <CheckCircle2 size={22} className="animate-pulse" />
                          <span>Guardando...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={22} />
                          <span>Guardar cambios</span>
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => router.push(`/dashboard/projects/${projectId}/testimonials`)}
                      className="w-full min-h-[56px] border-2 hover:bg-[var(--color-neutral-50)] transition-all duration-300"
                    >
                      Cancelar
                    </Button>
                  </div>
                  
                  {/* Server Error Message */}
                  {serverError && (
                    <div className="px-6 pb-6">
                      <div className="p-4 bg-[var(--color-error-100)] text-[var(--color-error-700)] rounded-lg shadow-md">
                        <div className="flex items-center gap-3">
                          <AlertCircle size={20} />
                          <p className="text-sm font-medium">
                            {serverError}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    
  );
}