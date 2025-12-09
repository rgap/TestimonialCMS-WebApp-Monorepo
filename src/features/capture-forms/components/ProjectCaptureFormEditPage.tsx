'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { HelpCircle, Save, Smile, MessageSquare, Heart, ChevronLeft, ChevronRight, Check, Video, Image as ImageIcon, Upload, X } from 'lucide-react';
import { useProject } from '@/hooks';
import { getApiUrl, publicAnonKey } from "@/lib/supabase/info";

type Step = 1 | 2 | 3;
type PreviewType = 'text' | 'video' | 'image' | null;

export function ProjectCaptureFormEditPage() {
  const params = useParams();
  const projectId = typeof params.projectId === 'string' ? params.projectId : undefined;
  const formId = typeof params.formId === 'string' ? params.formId : undefined;
  const router = useRouter();
  const { project } = useProject(projectId);
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [previewType, setPreviewType] = useState<PreviewType>(null);
  const [formName, setFormName] = useState('Nuevo formulario');
  const [welcomeTitle, setWelcomeTitle] = useState('Comparte tu experiencia');
  const [welcomeText, setWelcomeText] = useState('Tu opinión es muy valiosa para nosotros');
  const [promptText, setPromptText] = useState('¿Qué te gustó más? ¿Cómo te ayudó nuestro producto?');
  const [thanksTitle, setThanksTitle] = useState('¡Gracias por tu testimonio!');
  const [thanksText, setThanksText] = useState('Apreciamos mucho tu tiempo y feedback');
  const [allowText, setAllowText] = useState(true);
  const [allowVideo, setAllowVideo] = useState(true);
  const [allowImage, setAllowImage] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Check if this is a new form
  const isNewForm = new URLSearchParams(window.location.search).get('new') === 'true';
  
  const contactFields = [
    { id: 'name', label: 'Nombre completo' },
    { id: 'email', label: 'Correo electrónico' },
    { id: 'avatar', label: 'Foto de perfil' },
    { id: 'jobTitle', label: 'Cargo' },
    { id: 'company', label: 'Empresa' },
  ];
  
  const [fieldSettings, setFieldSettings] = useState<Record<string, string>>({
    name: 'required',
    email: 'required',
    avatar: 'optional',
    jobTitle: 'optional',
    company: 'optional',
  });
  
  const steps = [
    { number: 1, title: 'Bienvenida', icon: Smile, color: 'primary', description: 'Primera impresión' },
    { number: 2, title: 'Testimonio', icon: MessageSquare, color: 'secondary', description: 'Captura y datos' },
    { number: 3, title: 'Gracias', icon: Heart, color: 'accent', description: 'Mensaje final' },
  ];
  
  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };
  
  const handleSaveForm = async () => {
    try {
      setIsSaving(true);
      
      const accessToken = localStorage.getItem('access_token');
      
      if (!accessToken) {
        alert('No estás autenticado');
        return;
      }
      
      const formData = {
        formName: formName || 'Nuevo formulario',
        description: '',
        welcomeTitle,
        welcomeMessage: welcomeText,
        allowText,
        allowVideo,
        allowImage,
        collectName: fieldSettings.name !== 'doNotCollect',
        collectEmail: fieldSettings.email !== 'doNotCollect',
        collectCompany: fieldSettings.company !== 'doNotCollect',
        collectJobTitle: fieldSettings.jobTitle !== 'doNotCollect',
        requireApproval: true,
        sendConfirmation: true,
      };
      
      if (isNewForm) {
        // Create new form
        const response = await fetch(
          getApiUrl(`/projects/${projectId}/capture-forms`),
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...formData,
              id: formId, // Use the temp ID from URL
            }),
          }
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al crear formulario');
        }
        
        alert('Formulario creado exitosamente');
        router.push(`/dashboard/projects/${projectId}/capture-forms`);
        
      } else {
        // Update existing form
        const response = await fetch(
          getApiUrl(`/projects/${projectId}/capture-forms/${formId}`),
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          }
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al actualizar formulario');
        }
        
        alert('Formulario actualizado exitosamente');
        router.push(`/dashboard/projects/${projectId}/capture-forms`);
      }
      
    } catch (err) {
      console.error('Error saving form:', err);
      alert(err instanceof Error ? err.message : 'Error al guardar formulario');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    
      <div className="container max-w-7xl py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="mb-3 text-[var(--color-text-primary)]">{formName}</h2>
            <a href="#" className="text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] flex items-center gap-2">
              <HelpCircle size={18} />
              <span>¿Qué son los formularios de captura?</span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              onClick={() => router.push(`/dashboard/projects/${projectId}/capture-forms`)} 
              className="px-8 py-3"
            >
              <ChevronLeft size={20} />
              Volver a Formularios
            </Button>
            <Button 
              onClick={handleSaveForm} 
              className="px-8 py-3 bg-gradient-to-r from-[var(--color-success-600)] to-[var(--color-success-700)]"
            >
              <Save size={20} />
              Guardar cambios
            </Button>
          </div>
        </div>
        
        {/* Progress Steps Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-3 max-w-2xl mx-auto mb-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.number;
              const isCurrent = currentStep === step.number;
              
              return (
                <div key={step.number} className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(step.number as Step)}
                    className={`flex flex-col items-center transition-all duration-300 ${
                      isCurrent ? 'scale-110' : 'scale-100'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? 'bg-gradient-to-br from-[var(--color-success-500)] to-[var(--color-success-600)] shadow-lg'
                        : isCurrent
                        ? step.color === 'primary'
                          ? 'bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-600)] shadow-xl ring-4 ring-[var(--color-primary-100)]'
                          : step.color === 'secondary'
                          ? 'bg-gradient-to-br from-[var(--color-secondary-500)] to-[var(--color-secondary-600)] shadow-xl ring-4 ring-[var(--color-secondary-100)]'
                          : 'bg-gradient-to-br from-[var(--color-accent-500)] to-[var(--color-accent-600)] shadow-xl ring-4 ring-[var(--color-accent-100)]'
                        : 'bg-[var(--color-neutral-100)] hover:bg-[var(--color-neutral-200)]'
                    }`}>
                      {isCompleted ? (
                        <Check size={20} className="text-white" />
                      ) : (
                        <Icon size={20} className={isCurrent ? 'text-white' : 'text-[var(--color-text-tertiary)]'} />
                      )}
                    </div>
                    <span className={`mt-2 text-xs font-medium transition-colors ${
                      isCurrent
                        ? step.color === 'primary'
                          ? 'text-[var(--color-primary-700)]'
                          : step.color === 'secondary'
                          ? 'text-[var(--color-secondary-700)]'
                          : 'text-[var(--color-accent-700)]'
                        : 'text-[var(--color-text-tertiary)]'
                    }`}>
                      {step.title}
                    </span>
                  </button>
                  
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-1 mx-2 rounded-full transition-all duration-500 ${
                      currentStep > step.number
                        ? 'bg-gradient-to-r from-[var(--color-success-500)] to-[var(--color-success-600)]'
                        : 'bg-[var(--color-neutral-200)]'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="min-w-[140px]"
            >
              <ChevronLeft size={20} />
              Anterior
            </Button>
            
            <div className="flex items-center gap-2">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    step.number === currentStep
                      ? 'w-8 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)]'
                      : step.number < currentStep
                      ? 'w-2 bg-[var(--color-success-500)]'
                      : 'w-2 bg-[var(--color-neutral-300)]'
                  }`}
                />
              ))}
            </div>
            
            <Button
              type="button"
              size="lg"
              onClick={handleNext}
              disabled={currentStep === 3}
              className="min-w-[140px] bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-700)]"
            >
              Siguiente
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form Builder - Current Step Only */}
          <div className="animate-fade-in max-w-4xl mx-auto">
            {/* Step 1: Welcome */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl shadow-xl border-2 border-[var(--color-border)] hover:border-[var(--color-primary-300)] p-10 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-[var(--color-primary-100)] to-[var(--color-primary-200)] rounded-2xl flex items-center justify-center shadow-md">
                    <Smile size={28} className="text-[var(--color-primary-600)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[var(--color-text-primary)]">Página de bienvenida</h3>
                    <p className="text-sm text-[var(--color-text-tertiary)]">Primera impresión del formulario</p>
                  </div>
                  <span className="px-4 py-2 bg-gradient-to-r from-[var(--color-primary-100)] to-[var(--color-primary-200)] text-[var(--color-primary-700)] text-sm rounded-full font-medium shadow-sm">
                    Paso 1 de 3
                  </span>
                </div>
                
                <div className="h-1 bg-gradient-to-r from-[var(--color-primary-500)] via-[var(--color-secondary-500)] to-[var(--color-accent-500)] rounded-full mb-8"></div>
                
                <div className="space-y-6">
                  <Input 
                    label="Nombre del formulario" 
                    value={formName} 
                    onChange={(e) => setFormName(e.target.value)} 
                    placeholder="Ej: Testimonios de clientes"
                  />
                  <Input 
                    label="Título" 
                    value={welcomeTitle} 
                    onChange={(e) => setWelcomeTitle(e.target.value)} 
                  />
                  <Textarea 
                    label="Texto introductorio" 
                    rows={4} 
                    value={welcomeText} 
                    onChange={(e) => setWelcomeText(e.target.value)} 
                  />
                  
                  <div>
                    <label className="block mb-3 text-sm font-medium text-[var(--color-text-primary)]">
                      Tipos de testimonio permitidos
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-4 bg-gradient-to-r from-white to-[var(--color-neutral-50)] rounded-xl border-2 border-[var(--color-border)] hover:border-[var(--color-secondary-300)] transition-all cursor-pointer">
                        <input
                          type="checkbox"
                          checked={allowText}
                          onChange={(e) => setAllowText(e.target.checked)}
                          className="w-5 h-5 rounded border-2 border-[var(--color-border)] text-[var(--color-secondary-600)] focus:ring-2 focus:ring-[var(--color-secondary-200)]"
                        />
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-xl">Aa</span>
                          <span className="font-medium text-[var(--color-text-primary)]">Texto</span>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3 p-4 bg-gradient-to-r from-white to-[var(--color-neutral-50)] rounded-xl border-2 border-[var(--color-border)] hover:border-[var(--color-secondary-300)] transition-all cursor-pointer">
                        <input
                          type="checkbox"
                          checked={allowVideo}
                          onChange={(e) => setAllowVideo(e.target.checked)}
                          className="w-5 h-5 rounded border-2 border-[var(--color-border)] text-[var(--color-secondary-600)] focus:ring-2 focus:ring-[var(--color-secondary-200)]"
                        />
                        <div className="flex items-center gap-2 flex-1">
                          <Video size={20} className="text-[var(--color-secondary-600)]" />
                          <span className="font-medium text-[var(--color-text-primary)]">Video</span>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3 p-4 bg-gradient-to-r from-white to-[var(--color-neutral-50)] rounded-xl border-2 border-[var(--color-border)] hover:border-[var(--color-secondary-300)] transition-all cursor-pointer">
                        <input
                          type="checkbox"
                          checked={allowImage}
                          onChange={(e) => setAllowImage(e.target.checked)}
                          className="w-5 h-5 rounded border-2 border-[var(--color-border)] text-[var(--color-secondary-600)] focus:ring-2 focus:ring-[var(--color-secondary-200)]"
                        />
                        <div className="flex items-center gap-2 flex-1">
                          <ImageIcon size={20} className="text-[var(--color-accent-600)]" />
                          <span className="font-medium text-[var(--color-text-primary)]">Imagen</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Testimonio + Datos */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl shadow-xl border-2 border-[var(--color-border)] hover:border-[var(--color-secondary-300)] p-10 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-[var(--color-secondary-100)] to-[var(--color-secondary-200)] rounded-2xl flex items-center justify-center shadow-md">
                    <MessageSquare size={28} className="text-[var(--color-secondary-600)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[var(--color-text-primary)]">Captura del testimonio</h3>
                    <p className="text-sm text-[var(--color-text-tertiary)]">Vista previa del formulario</p>
                  </div>
                  <span className="px-4 py-2 bg-gradient-to-r from-[var(--color-secondary-100)] to-[var(--color-secondary-200)] text-[var(--color-secondary-700)] text-sm rounded-full font-medium shadow-sm">
                    Paso 2 de 3
                  </span>
                </div>
                
                <div className="h-1 bg-gradient-to-r from-[var(--color-secondary-500)] via-[var(--color-accent-500)] to-[var(--color-primary-500)] rounded-full mb-8"></div>
                
                <div className="bg-gradient-to-br from-[var(--color-neutral-50)] to-white rounded-xl p-6 border-2 border-[var(--color-border)]">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare size={20} className="text-[var(--color-secondary-600)]" />
                    <p className="text-sm font-medium text-[var(--color-text-secondary)]">
                      Este formulario capturará el testimonio y los datos personales automáticamente
                    </p>
                  </div>
                  <p className="text-sm text-[var(--color-text-tertiary)] leading-relaxed">
                    El diseño y campos se ajustan según el tipo de testimonio seleccionado (texto, video o imagen). 
                    La estructura está optimizada para capturar testimonios de forma efectiva.
                  </p>
                </div>
              </div>
            )}
            
            {/* Step 3: Thanks */}
            {currentStep === 3 && (
              <div className="bg-white rounded-2xl shadow-xl border-2 border-[var(--color-border)] hover:border-[var(--color-accent-300)] p-10 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-[var(--color-accent-100)] to-[var(--color-accent-200)] rounded-2xl flex items-center justify-center shadow-md">
                    <Heart size={28} className="text-[var(--color-accent-600)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[var(--color-text-primary)]">Página de agradecimiento</h3>
                    <p className="text-sm text-[var(--color-text-tertiary)]">Mensaje final</p>
                  </div>
                  <span className="px-4 py-2 bg-gradient-to-r from-[var(--color-accent-100)] to-[var(--color-accent-200)] text-[var(--color-accent-700)] text-sm rounded-full font-medium shadow-sm">
                    Paso 3 de 3
                  </span>
                </div>
                
                <div className="h-1 bg-gradient-to-r from-[var(--color-accent-500)] via-[var(--color-primary-500)] to-[var(--color-secondary-500)] rounded-full mb-8"></div>
                
                <div className="space-y-6">
                  <Input 
                    label="Título" 
                    value={thanksTitle} 
                    onChange={(e) => setThanksTitle(e.target.value)} 
                  />
                  <Textarea 
                    label="Mensaje de agradecimiento" 
                    rows={4} 
                    value={thanksText} 
                    onChange={(e) => setThanksText(e.target.value)} 
                  />
                  
                  {/* Preview Button */}
                  <button
                    onClick={() => router.push(`/cf/${formId}`)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-[var(--color-accent-600)] to-[var(--color-accent-700)] text-white rounded-xl hover:from-[var(--color-accent-700)] hover:to-[var(--color-accent-800)] transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-medium"
                  >
                    👁️ Ver vista previa
                  </button>
                </div>
                
                <div className="mt-8 p-4 bg-gradient-to-r from-[var(--color-success-50)] to-[var(--color-success-100)] rounded-xl border border-[var(--color-success-300)]">
                  <div className="flex items-center gap-2">
                    <Check size={18} className="text-[var(--color-success-700)]" />
                    <span className="text-sm font-medium text-[var(--color-success-700)]">
                      ¡Último paso! Tu formulario está casi listo
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Live Preview */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-gradient-to-br from-[var(--color-neutral-900)] to-[var(--color-neutral-800)] rounded-3xl p-8 shadow-2xl border-2 border-[var(--color-neutral-700)]">
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="ml-4 text-xs text-[var(--color-neutral-400)] font-medium">Vista previa en vivo - Paso {currentStep}</span>
              </div>
              
              <div className="bg-white rounded-2xl p-10 max-w-md mx-auto shadow-xl min-h-[500px] flex flex-col">
                {/* Step 1: Welcome Page Preview */}
                {currentStep === 1 && (
                  <>
                    <h3 className="mb-6 text-[var(--color-text-primary)]">{welcomeTitle}</h3>
                    <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed">{welcomeText}</p>
                    <div className="space-y-4">
                      {allowVideo && (
                        <button 
                          onClick={() => { setCurrentStep(2); setPreviewType('video'); }}
                          className="w-full px-6 py-4 bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-700)] text-white rounded-xl hover:from-[var(--color-primary-700)] hover:to-[var(--color-primary-800)] transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                        >
                          🎥 Subir video
                        </button>
                      )}
                      {allowText && (
                        <button 
                          onClick={() => { setCurrentStep(2); setPreviewType('text'); }}
                          className="w-full px-6 py-4 bg-gradient-to-r from-[var(--color-secondary-600)] to-[var(--color-secondary-700)] text-white rounded-xl hover:from-[var(--color-secondary-700)] hover:to-[var(--color-secondary-800)] transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                        >
                          ✍️ Escribir texto
                        </button>
                      )}
                      {allowImage && (
                        <button 
                          onClick={() => { setCurrentStep(2); setPreviewType('image'); }}
                          className="w-full px-6 py-4 bg-gradient-to-r from-[var(--color-accent-600)] to-[var(--color-accent-700)] text-white rounded-xl hover:from-[var(--color-accent-700)] hover:to-[var(--color-accent-800)] transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                        >
                          📷 Subir imagen
                        </button>
                      )}
                    </div>
                  </>
                )}
                
                {/* Step 2: Captura + Datos Preview - Full Import Form Style */}
                {currentStep === 2 && (
                  <div className="overflow-y-auto max-h-[500px] -m-10 p-10">
                    {/* Decorative gradient top */}
                    <div className="h-1 bg-gradient-to-r from-[var(--color-primary-500)] via-[var(--color-secondary-500)] to-[var(--color-accent-500)] -mx-10 mb-6"></div>
                    
                    <h3 className="mb-3 text-[var(--color-text-primary)] text-base">
                      {previewType === 'text' ? 'Nuevo testimonio de texto' : previewType === 'video' ? 'Nuevo testimonio en video' : previewType === 'image' ? 'Nuevo testimonio con imagen' : 'Captura de testimonio'}
                    </h3>
                    
                    {/* Prompt Box */}
                    <div className="mb-4 p-3 bg-gradient-to-r from-[var(--color-secondary-50)] to-[var(--color-secondary-100)] rounded-lg border border-[var(--color-secondary-200)]">
                      <p className="text-xs text-[var(--color-text-secondary)]">{promptText}</p>
                    </div>
                    
                    {/* Content Label */}
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-xs font-medium text-[var(--color-text-primary)]">
                        Contenido del testimonio
                      </label>
                      <span className="px-1.5 py-0.5 bg-[var(--color-error-100)] text-[var(--color-error-700)] text-[10px] rounded-full">
                        Requerido
                      </span>
                    </div>
                    
                    {/* Content Input */}
                    {(!previewType || previewType === 'text') && (
                      <textarea 
                        placeholder="Escribe o pega el testimonio completo aquí..."
                        className="w-full min-h-[80px] p-2 border-2 border-[var(--color-border)] rounded-lg text-xs resize-none mb-3"
                        disabled
                      />
                    )}
                    
                    {previewType === 'video' && (
                      <div className="mb-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Video size={14} className="text-[var(--color-primary-600)]" />
                          <label className="text-[10px] font-medium text-[var(--color-text-primary)]">Link de YouTube</label>
                          <span className="px-1.5 py-0.5 bg-[var(--color-error-100)] text-[var(--color-error-700)] text-[8px] rounded-full">
                            Requerido
                          </span>
                        </div>
                        <input
                          type="text"
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full px-2 py-1.5 border border-[var(--color-border)] rounded-lg text-[10px]"
                          disabled
                        />
                        <p className="mt-1 text-[8px] text-[var(--color-text-tertiary)]">
                          youtube.com, youtu.be o youtube.com/shorts
                        </p>
                      </div>
                    )}
                    
                    {previewType === 'image' && (
                      <div className="border-2 border-dashed border-[var(--color-border)] rounded-lg p-4 text-center bg-[var(--color-neutral-50)] mb-3">
                        <ImageIcon size={20} className="text-[var(--color-accent-600)] mx-auto mb-1" />
                        <p className="text-[10px] font-medium text-[var(--color-text-primary)] mb-0.5">Arrastra tu imagen aquí</p>
                        <p className="text-[9px] text-[var(--color-text-tertiary)]">PNG, JPG, GIF • Máx. 10MB</p>
                      </div>
                    )}
                    
                    {/* Separator */}
                    <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent my-4"></div>
                    
                    {/* Personal Info Section */}
                    <p className="text-xs font-medium text-[var(--color-text-primary)] mb-3">Información personal</p>
                    
                    <div className="space-y-3">
                      {/* Name & Email Row */}
                      <div className="grid grid-cols-2 gap-2">
                        {fieldSettings.name !== 'doNotCollect' && (
                          <div>
                            <div className="flex items-center gap-1 mb-1">
                              <label className="text-[10px] font-medium text-[var(--color-text-primary)]">Nombre completo</label>
                              <span className={`px-1 py-0.5 text-[8px] rounded-full ${
                                fieldSettings.name === 'required' 
                                  ? 'bg-[var(--color-error-100)] text-[var(--color-error-700)]' 
                                  : 'bg-[var(--color-neutral-200)] text-[var(--color-text-tertiary)]'
                              }`}>
                                {fieldSettings.name === 'required' ? 'Requerido' : 'Opcional'}
                              </span>
                            </div>
                            <input
                              type="text"
                              placeholder="Ej: Juan Pérez"
                              className="w-full px-2 py-1.5 border border-[var(--color-border)] rounded-lg text-[10px]"
                              disabled
                            />
                          </div>
                        )}
                        {fieldSettings.email !== 'doNotCollect' && (
                          <div>
                            <div className="flex items-center gap-1 mb-1">
                              <label className="text-[10px] font-medium text-[var(--color-text-primary)]">Email</label>
                              <span className={`px-1 py-0.5 text-[8px] rounded-full ${
                                fieldSettings.email === 'required' 
                                  ? 'bg-[var(--color-error-100)] text-[var(--color-error-700)]' 
                                  : 'bg-[var(--color-neutral-200)] text-[var(--color-text-tertiary)]'
                              }`}>
                                {fieldSettings.email === 'required' ? 'Req.' : 'Opc.'}
                              </span>
                            </div>
                            <input
                              type="email"
                              placeholder="correo@ejemplo.com"
                              className="w-full px-2 py-1.5 border border-[var(--color-border)] rounded-lg text-[10px]"
                              disabled
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Job Title & Company Row */}
                      <div className="grid grid-cols-2 gap-2">
                        {fieldSettings.jobTitle !== 'doNotCollect' && (
                          <div>
                            <div className="flex items-center gap-1 mb-1">
                              <label className="text-[10px] font-medium text-[var(--color-text-primary)]">Cargo</label>
                              <span className="px-1 py-0.5 bg-[var(--color-neutral-200)] text-[var(--color-text-tertiary)] text-[8px] rounded-full">Opc.</span>
                            </div>
                            <input
                              type="text"
                              placeholder="Ej: CEO"
                              className="w-full px-2 py-1.5 border border-[var(--color-border)] rounded-lg text-[10px]"
                              disabled
                            />
                          </div>
                        )}
                        {fieldSettings.company !== 'doNotCollect' && (
                          <div>
                            <div className="flex items-center gap-1 mb-1">
                              <label className="text-[10px] font-medium text-[var(--color-text-primary)]">Empresa</label>
                              <span className="px-1 py-0.5 bg-[var(--color-neutral-200)] text-[var(--color-text-tertiary)] text-[8px] rounded-full">Opc.</span>
                            </div>
                            <input
                              type="text"
                              placeholder="Ej: Acme Corp"
                              className="w-full px-2 py-1.5 border border-[var(--color-border)] rounded-lg text-[10px]"
                              disabled
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Photo Upload */}
                      {fieldSettings.avatar !== 'doNotCollect' && (
                        <div>
                          <div className="flex items-center gap-1 mb-2">
                            <label className="text-[10px] font-medium text-[var(--color-text-primary)]">Foto</label>
                            <span className="px-1 py-0.5 bg-[var(--color-neutral-200)] text-[var(--color-text-tertiary)] text-[8px] rounded-full">Opcional</span>
                          </div>
                          <div className="border-2 border-dashed border-[var(--color-primary-200)] rounded-lg p-3 bg-gradient-to-br from-[var(--color-primary-50)] to-white">
                            <div className="flex flex-col items-center gap-1">
                              <Upload size={16} className="text-[var(--color-primary-600)]" />
                              <p className="text-[9px] font-medium text-[var(--color-primary-700)]">Clic para subir foto</p>
                              <p className="text-[8px] text-[var(--color-text-tertiary)]">PNG, JPG • Máx. 5MB</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Submit Button */}
                    <button className="mt-4 w-full px-3 py-2 bg-gradient-to-r from-[var(--color-success-600)] to-[var(--color-success-700)] text-white rounded-lg text-xs font-medium">
                      Enviar testimonio
                    </button>
                  </div>
                )}
                
                {/* Step 3: Thanks Page Preview */}
                {currentStep === 3 && (
                  <div className="flex flex-col items-center justify-center text-center flex-1">
                    <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-success-100)] to-[var(--color-success-200)] rounded-full flex items-center justify-center mb-6">
                      <Check size={40} className="text-[var(--color-success-600)]" />
                    </div>
                    <h3 className="mb-4 text-[var(--color-text-primary)]">{thanksTitle}</h3>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed mb-8">{thanksText}</p>
                    <div className="w-full p-4 bg-gradient-to-r from-[var(--color-success-50)] to-[var(--color-success-100)] rounded-xl border border-[var(--color-success-200)]">
                      <div className="text-sm text-[var(--color-success-700)] font-medium">
                        ✓ Testimonio enviado exitosamente
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
}