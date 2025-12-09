'use client';

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useProject } from '@/hooks';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { getApiUrl } from "@/lib/supabase/info";
import { AlertCircle, CheckCircle2, Upload, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export function ProjectImportFromTextPage() {
  const params = useParams();
  const projectId = typeof params.projectId === 'string' ? params.projectId : undefined;
  const router = useRouter();
  const { project } = useProject(projectId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [uploadedPhotoFile, setUploadedPhotoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    body: '',
    giverName: '',
    giverEmail: '',
    jobTitle: '',
    company: '',
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    if (!formData.body.trim()) newErrors.body = 'El contenido del testimonio es requerido';
    if (!formData.giverName.trim()) newErrors.giverName = 'El nombre es requerido';
    
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
      
      // Upload photo to Cloudinary if exists
      let avatarUrl = '';
      if (uploadedPhotoFile) {
        try {
          const uploadResult = await uploadToCloudinary(uploadedPhotoFile, {
            folder: 'avatars',
          });
          avatarUrl = uploadResult.secureUrl;
        } catch (uploadError) {
          console.error('Error uploading photo:', uploadError);
          throw new Error('Error al subir la foto. Por favor intenta de nuevo.');
        }
      }
      
      const testimonialData = {
        type: 'text',
        content: formData.body.trim(),
        customerName: formData.giverName.trim(),
        customerEmail: formData.giverEmail.trim(),
        customerCompany: formData.company.trim(),
        customerJobTitle: formData.jobTitle.trim(),
        customerAvatar: avatarUrl,
        status: 'pending',
      };
      
      const response = await fetch(
        getApiUrl(`/projects/${projectId}/testimonials`),
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testimonialData),
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear el testimonio');
      }
      
      // Success! Navigate to testimonials page
      router.push(`/dashboard/projects/${projectId}/testimonials`);
      
    } catch (error) {
      console.error('Error creating testimonial:', error);
      setServerError(error instanceof Error ? error.message : 'Error al crear el testimonio');
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
      
      // Store the file for later upload to Cloudinary
      setUploadedPhotoFile(file);
      
      // Create preview URL
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
    setUploadedPhotoFile(null);
    const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };
  
  return (
    
      <div className="container max-w-4xl py-8">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-[var(--color-border)] overflow-hidden">
            {/* Decorative gradient top */}
            <div className="h-1 bg-gradient-to-r from-[var(--color-primary-500)] via-[var(--color-secondary-500)] to-[var(--color-accent-500)]"></div>
            
            {/* Header dentro de la card */}
            <div className="px-6 pt-6 pb-4 border-b border-[var(--color-border)]">
              <h2 className="text-[var(--color-text-primary)]">Nuevo testimonio de texto</h2>
            </div>
            
            {/* Contenido del testimonio */}
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
                rows={4}
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                required
                onBlur={() => handleBlur('body')}
                error={touched.body ? errors.body : undefined}
              />
            </div>
            
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
                {/* Nombre y Email en la misma fila */}
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
                
                {/* Cargo y Empresa en la misma fila */}
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
                      placeholder="Ej: Acme Corp"
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
                          className={`max-h-[120px] max-w-full object-contain rounded-2xl`}
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
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button 
              type="submit" 
              size="lg" 
              className="flex-1 sm:flex-initial min-h-[56px] bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-700)] hover:from-[var(--color-primary-700)] hover:to-[var(--color-primary-800)] shadow-lg hover:shadow-xl transition-all duration-300" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <CheckCircle2 size={22} className="animate-pulse" />
                  <span>Importando...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={22} />
                  <span>Importar testimonio</span>
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => router.push(`/dashboard/projects/${projectId}/import-testimonials`)}
              className="flex-1 sm:flex-initial min-h-[56px] border-2 hover:bg-[var(--color-neutral-50)] transition-all duration-300"
            >
              Cancelar
            </Button>
          </div>
          
          {/* Server Error Message */}
          {serverError && (
            <div className="mt-4 p-4 bg-[var(--color-error-100)] text-[var(--color-error-700)] rounded-lg shadow-md">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} />
                <p className="text-sm font-medium">
                  {serverError}
                </p>
              </div>
            </div>
          )}
        </form>
      </div>
    
  );
}