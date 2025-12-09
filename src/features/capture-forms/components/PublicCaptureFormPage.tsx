'use client';

import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { uploadToCloudinary } from '@/lib/cloudinary';
import { ArrowLeft, Check, ChevronRight, Eye, Image as ImageIcon, Upload, Video, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

type Step = 1 | 2 | 3;
type TestimonialType = 'text' | 'video' | 'image' | null;

export function PublicCaptureFormPage() {
  const { formId } = useParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedType, setSelectedType] = useState<TestimonialType>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [uploadedPhotoFile, setUploadedPhotoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    jobTitle: '',
    testimonial: '',
  });
  
  // Mock form configuration - In a real app, this would be fetched based on formId
  const formConfig = {
    projectId: 'proj_demo_testimonialcms_2024',
    projectName: 'Proyecto Demo',
    formName: 'Formulario por defecto',
    welcomeTitle: 'Por favor, escribe un testimonio',
    welcomeText: 'Tu opinión es muy valiosa para nosotros',
    promptText: '¿Qué te gustó más? ¿Cómo te ayudó nuestro producto?',
    thanksTitle: '¡Gracias por tu testimonio!',
    thanksText: 'Apreciamos mucho tu tiempo y feedback',
    allowText: true,
    allowVideo: true,
    allowImage: true,
    fieldSettings: {
      name: 'required',
      email: 'optional',
      avatar: 'optional',
      jobTitle: 'optional',
      company: 'optional',
    },
  };
  
  const contactFields = [
    { id: 'name', label: 'Nombre completo' },
    { id: 'email', label: 'Correo electrónico' },
    { id: 'avatar', label: 'Foto' },
    { id: 'jobTitle', label: 'Cargo' },
    { id: 'company', label: 'Empresa' },
  ];
  
  const handleBack = () => {
    router.push(`/dashboard/projects/${formConfig.projectId}/capture-forms/`);
  };
  
  const handleBackToStep1 = () => {
    setCurrentStep(1);
    setSelectedType(null);
    setUploadedPhoto(null);
    setFormData({
      name: '',
      email: '',
      company: '',
      jobTitle: '',
      testimonial: '',
    });
  };
  
  const handleVideoClick = () => {
    setSelectedType('video');
    setCurrentStep(2);
  };
  
  const handleTextClick = () => {
    setSelectedType('text');
    setCurrentStep(2);
  };
  
  const handleImageClick = () => {
    setSelectedType('image');
    setCurrentStep(2);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Upload photo to Cloudinary if exists
      let avatarUrl = '';
      if (uploadedPhotoFile) {
        const uploadResult = await uploadToCloudinary(uploadedPhotoFile, {
          folder: 'avatars',
        });
        avatarUrl = uploadResult.secureUrl;
      }
      
      // Here you would send the testimonial data to your backend
      // For now, we'll just move to the next step
      console.log('Testimonial data:', {
        ...formData,
        type: selectedType,
        avatar: avatarUrl,
      });
      
      setCurrentStep(3);
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      alert('Error al enviar el testimonio. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store the file for later upload
      setUploadedPhotoFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedPhoto(reader.result as string);
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
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary-50)] via-white to-[var(--color-accent-50)] py-8 px-4">
      <div className="w-full max-w-3xl mx-auto">
        {/* Header with Back and Preview Buttons */}
        <div className="mb-6 bg-white rounded-2xl shadow-md border border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push(`/dashboard/projects/${formConfig.projectId}/capture-forms/`)}
            className="inline-flex items-center gap-2 text-[var(--color-text-primary)] hover:text-[var(--color-primary-600)] font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            Volver a Formularios
          </button>
          
          <button
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent-50)] text-[var(--color-accent-700)] border border-[var(--color-accent-300)] rounded-lg hover:bg-[var(--color-accent-100)] font-medium transition-all"
          >
            <Eye size={18} />
            Vista Previa
          </button>
        </div>
        
        {/* Step 1: Welcome + Type Selection */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl p-10 max-w-md mx-auto shadow-xl">
            {/* Breadcrumb de pasos */}
            <div className="mb-8 pb-6 border-b border-[var(--color-border)]">
              <nav className="flex items-center justify-center gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[var(--color-primary-100)] to-[var(--color-primary-200)] text-[var(--color-primary-700)] rounded-lg font-medium">
                    <span className="w-5 h-5 bg-[var(--color-primary-600)] text-white rounded-full flex items-center justify-center text-xs">1</span>
                    Tipo
                  </div>
                  <ChevronRight size={16} className="text-[var(--color-text-tertiary)]" />
                  <div className="flex items-center gap-2 px-3 py-1.5 text-[var(--color-text-tertiary)]">
                    <span className="w-5 h-5 bg-[var(--color-neutral-200)] text-[var(--color-text-tertiary)] rounded-full flex items-center justify-center text-xs">2</span>
                    Detalles
                  </div>
                  <ChevronRight size={16} className="text-[var(--color-text-tertiary)]" />
                  <div className="flex items-center gap-2 px-3 py-1.5 text-[var(--color-text-tertiary)]">
                    <span className="w-5 h-5 bg-[var(--color-neutral-200)] text-[var(--color-text-tertiary)] rounded-full flex items-center justify-center text-xs">3</span>
                    Confirmar
                  </div>
                </div>
              </nav>
            </div>
            
            <h3 className="mb-6 text-[var(--color-text-primary)]">{formConfig.welcomeTitle}</h3>
            <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed">{formConfig.welcomeText}</p>
            <div className="space-y-4">
              {formConfig.allowVideo && (
                <button 
                  onClick={handleVideoClick}
                  className="w-full px-6 py-4 bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-700)] text-white rounded-xl hover:from-[var(--color-primary-700)] hover:to-[var(--color-primary-800)] transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  🎥 Subir video
                </button>
              )}
              {formConfig.allowText && (
                <button 
                  onClick={handleTextClick}
                  className="w-full px-6 py-4 bg-gradient-to-r from-[var(--color-secondary-600)] to-[var(--color-secondary-700)] text-white rounded-xl hover:from-[var(--color-secondary-700)] hover:to-[var(--color-secondary-800)] transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  ✍️ Escribir texto
                </button>
              )}
              {formConfig.allowImage && (
                <button 
                  onClick={handleImageClick}
                  className="w-full px-6 py-4 bg-gradient-to-r from-[var(--color-accent-600)] to-[var(--color-accent-700)] text-white rounded-xl hover:from-[var(--color-accent-700)] hover:to-[var(--color-accent-800)] transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  📷 Subir imagen
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Step 2: Testimonial Capture + Personal Info */}
        {currentStep === 2 && (
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border-2 border-[var(--color-border)] overflow-hidden">
              {/* Decorative gradient top */}
              <div className="h-1 bg-gradient-to-r from-[var(--color-primary-500)] via-[var(--color-secondary-500)] to-[var(--color-accent-500)]"></div>
              
              {/* Breadcrumb de pasos */}
              <div className="px-6 pt-6 pb-4 border-b border-[var(--color-border)]">
                <nav className="flex items-center justify-center gap-2 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 text-[var(--color-text-tertiary)]">
                      <span className="w-5 h-5 bg-[var(--color-success-500)] text-white rounded-full flex items-center justify-center text-xs">✓</span>
                      Tipo
                    </div>
                    <ChevronRight size={16} className="text-[var(--color-text-tertiary)]" />
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[var(--color-primary-100)] to-[var(--color-primary-200)] text-[var(--color-primary-700)] rounded-lg font-medium">
                      <span className="w-5 h-5 bg-[var(--color-primary-600)] text-white rounded-full flex items-center justify-center text-xs">2</span>
                      Detalles
                    </div>
                    <ChevronRight size={16} className="text-[var(--color-text-tertiary)]" />
                    <div className="flex items-center gap-2 px-3 py-1.5 text-[var(--color-text-tertiary)]">
                      <span className="w-5 h-5 bg-[var(--color-neutral-200)] text-[var(--color-text-tertiary)] rounded-full flex items-center justify-center text-xs">3</span>
                      Confirmar
                    </div>
                  </div>
                </nav>
                
                <h2 className="text-[var(--color-text-primary)]">
                  {selectedType === 'text' ? 'Nuevo testimonio de texto' : selectedType === 'video' ? 'Nuevo testimonio en video' : 'Nuevo testimonio con imagen'}
                </h2>
              </div>
              
              {/* Prompt Text */}
              {formConfig.promptText && (
                <div className="px-6 pt-6">
                  <div className="p-4 bg-gradient-to-r from-[var(--color-secondary-50)] to-[var(--color-secondary-100)] rounded-xl border border-[var(--color-secondary-200)]">
                    <p className="text-sm text-[var(--color-text-secondary)] whitespace-pre-wrap">{formConfig.promptText}</p>
                  </div>
                </div>
              )}
              
              {/* Testimonial Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <label className="text-sm font-medium text-[var(--color-text-primary)]">
                    Contenido del testimonio
                  </label>
                  <span className="px-2 py-0.5 bg-[var(--color-error-100)] text-[var(--color-error-700)] text-xs rounded-full">
                    Requerido
                  </span>
                </div>
                
                {selectedType === 'text' && (
                  <Textarea
                    label=""
                    placeholder="Escribe o pega el testimonio completo aquí..."
                    rows={4}
                    value={formData.testimonial}
                    onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                    required
                  />
                )}
                
                {selectedType === 'video' && (
                  <div className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-8 text-center bg-[var(--color-neutral-50)] hover:bg-[var(--color-neutral-100)] transition-all">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-primary-100)] to-[var(--color-primary-200)] rounded-full flex items-center justify-center">
                        <Video size={28} className="text-[var(--color-primary-600)]" />
                      </div>
                      <div>
                        <p className="font-medium text-[var(--color-text-primary)] mb-1">Arrastra tu video aquí</p>
                        <p className="text-sm text-[var(--color-text-tertiary)]">o haz clic para seleccionar</p>
                      </div>
                      <button type="button" className="mt-2 px-4 py-2 bg-white border-2 border-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-neutral-50)] transition-all">
                        Seleccionar archivo
                      </button>
                      <p className="text-xs text-[var(--color-text-tertiary)]">MP4, MOV, AVI • Máximo 100MB</p>
                    </div>
                  </div>
                )}
                
                {selectedType === 'image' && (
                  <div className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-8 text-center bg-[var(--color-neutral-50)] hover:bg-[var(--color-neutral-100)] transition-all">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-accent-100)] to-[var(--color-accent-200)] rounded-full flex items-center justify-center">
                        <ImageIcon size={28} className="text-[var(--color-accent-600)]" />
                      </div>
                      <div>
                        <p className="font-medium text-[var(--color-text-primary)] mb-1">Arrastra tu imagen aquí</p>
                        <p className="text-sm text-[var(--color-text-tertiary)]">o haz clic para seleccionar</p>
                      </div>
                      <button type="button" className="mt-2 px-4 py-2 bg-white border-2 border-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-neutral-50)] transition-all">
                        Seleccionar archivo
                      </button>
                      <p className="text-xs text-[var(--color-text-tertiary)]">PNG, JPG, GIF • Máximo 10MB</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Separador */}
              <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent"></div>
              
              {/* Personal Information */}
              <div className="p-6 bg-gradient-to-br from-white to-[var(--color-neutral-50)]">
                <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-5">
                  Información personal
                </h3>
                
                <div className="space-y-4">
                  {/* Nombre y Email en la misma fila */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formConfig.fieldSettings.name !== 'doNotCollect' && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <label className="text-sm font-medium text-[var(--color-text-primary)]">
                            Nombre completo
                          </label>
                          {formConfig.fieldSettings.name === 'required' && (
                            <span className="px-2 py-0.5 bg-[var(--color-error-100)] text-[var(--color-error-700)] text-xs rounded-full">
                              Requerido
                            </span>
                          )}
                          {formConfig.fieldSettings.name === 'optional' && (
                            <span className="px-2 py-0.5 bg-[var(--color-neutral-200)] text-[var(--color-text-tertiary)] text-xs rounded-full">
                              Opcional
                            </span>
                          )}
                        </div>
                        <Input
                          label=""
                          placeholder="Ej: Juan Pérez"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required={formConfig.fieldSettings.name === 'required'}
                        />
                      </div>
                    )}
                    
                    {formConfig.fieldSettings.email !== 'doNotCollect' && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <label className="text-sm font-medium text-[var(--color-text-primary)]">
                            Correo electrónico
                          </label>
                          {formConfig.fieldSettings.email === 'required' && (
                            <span className="px-2 py-0.5 bg-[var(--color-error-100)] text-[var(--color-error-700)] text-xs rounded-full">
                              Requerido
                            </span>
                          )}
                          {formConfig.fieldSettings.email === 'optional' && (
                            <span className="px-2 py-0.5 bg-[var(--color-neutral-200)] text-[var(--color-text-tertiary)] text-xs rounded-full">
                              Opcional
                            </span>
                          )}
                        </div>
                        <Input
                          label=""
                          type="email"
                          placeholder="correo@ejemplo.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required={formConfig.fieldSettings.email === 'required'}
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Cargo y Empresa en la misma fila */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formConfig.fieldSettings.jobTitle !== 'doNotCollect' && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <label className="text-sm font-medium text-[var(--color-text-primary)]">
                            Cargo
                          </label>
                          {formConfig.fieldSettings.jobTitle === 'optional' && (
                            <span className="px-2 py-0.5 bg-[var(--color-neutral-200)] text-[var(--color-text-tertiary)] text-xs rounded-full">
                              Opcional
                            </span>
                          )}
                        </div>
                        <Input
                          label=""
                          placeholder="Ej: CEO, Director"
                          value={formData.jobTitle}
                          onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        />
                      </div>
                    )}
                    
                    {formConfig.fieldSettings.company !== 'doNotCollect' && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <label className="text-sm font-medium text-[var(--color-text-primary)]">
                            Empresa
                          </label>
                          {formConfig.fieldSettings.company === 'optional' && (
                            <span className="px-2 py-0.5 bg-[var(--color-neutral-200)] text-[var(--color-text-tertiary)] text-xs rounded-full">
                              Opcional
                            </span>
                          )}
                        </div>
                        <Input
                          label=""
                          placeholder="Ej: Acme Corp"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Foto Upload */}
                  {formConfig.fieldSettings.avatar !== 'doNotCollect' && (
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
                        </div>
                      )}
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="px-6 pb-6">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleBackToStep1}
                    className="px-6 py-4 bg-white border-2 border-[var(--color-border)] text-[var(--color-text-primary)] rounded-xl hover:bg-[var(--color-neutral-50)] hover:border-[var(--color-primary-300)] transition-all font-medium flex items-center gap-2"
                  >
                    <ArrowLeft size={18} />
                    Volver
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-[var(--color-success-600)] to-[var(--color-success-700)] text-white rounded-xl hover:from-[var(--color-success-700)] hover:to-[var(--color-success-800)] transition-all shadow-lg font-medium"
                  >
                    Enviar testimonio
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
        
        {/* Step 3: Thanks Page */}
        {currentStep === 3 && (
          <div className="w-full max-w-xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-[var(--color-border)] overflow-hidden">
              {/* Breadcrumb de pasos */}
              <div className="px-6 pt-6 pb-4 border-b border-[var(--color-border)]">
                <nav className="flex items-center justify-center gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 text-[var(--color-text-tertiary)]">
                      <span className="w-5 h-5 bg-[var(--color-success-500)] text-white rounded-full flex items-center justify-center text-xs">✓</span>
                      Tipo
                    </div>
                    <ChevronRight size={16} className="text-[var(--color-text-tertiary)]" />
                    <div className="flex items-center gap-2 px-3 py-1.5 text-[var(--color-text-tertiary)]">
                      <span className="w-5 h-5 bg-[var(--color-success-500)] text-white rounded-full flex items-center justify-center text-xs">✓</span>
                      Detalles
                    </div>
                    <ChevronRight size={16} className="text-[var(--color-text-tertiary)]" />
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[var(--color-success-100)] to-[var(--color-success-200)] text-[var(--color-success-700)] rounded-lg font-medium">
                      <span className="w-5 h-5 bg-[var(--color-success-600)] text-white rounded-full flex items-center justify-center text-xs">✓</span>
                      Confirmar
                    </div>
                  </div>
                </nav>
              </div>
              
              <div className="p-8 text-center relative">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[var(--color-success-100)] to-transparent rounded-full blur-3xl opacity-40 -mr-24 -mt-24"></div>
              
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-success-500)] to-[var(--color-success-600)] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Check size={40} className="text-white" strokeWidth={2.5} />
                  </div>
                  <h2 className="mb-3 text-[var(--color-text-primary)]">
                    {formConfig.thanksTitle}
                  </h2>
                  <p className="text-[var(--color-text-secondary)] mb-6 max-w-md mx-auto">
                    {formConfig.thanksText}
                  </p>
                
                  <div className="pt-6 border-t border-[var(--color-border)]">
                    <p className="text-sm text-[var(--color-text-tertiary)]">
                      Powered by{' '}
                      <a 
                        href="/" 
                        className="text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] font-medium transition-colors"
                      >
                        TestimonialCMS
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Footer */}
        {currentStep !== 3 && (
          <div className="text-center mt-6">
            <p className="text-xs text-[var(--color-text-tertiary)]">
              Powered by{' '}
              <a 
                href="/" 
                className="text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] font-medium transition-colors"
              >
                TestimonialCMS
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}