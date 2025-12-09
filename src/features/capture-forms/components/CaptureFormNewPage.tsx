'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, Check, FileText, Palette, Settings, Sparkles, Video, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useProject } from '@/hooks';
import { getApiUrl, publicAnonKey } from "@/lib/supabase/info";

type Step = 1 | 2 | 3 | 4;

export function CaptureFormNewPage() {
  const params = useParams();
  const projectId = typeof params.projectId === 'string' ? params.projectId : undefined;
  const router = useRouter();
  const { project } = useProject(projectId);
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    // Paso 1: Información básica
    formName: '',
    description: '',
    
    // Paso 2: Personalización
    welcomeTitle: 'Comparte tu experiencia',
    welcomeMessage: 'Tu testimonio nos ayuda a mejorar. Por favor, toma un momento para compartir tu opinión.',
    allowText: true,
    allowVideo: true,
    allowImage: true,
    
    // Paso 3: Campos a solicitar
    collectName: true,
    collectEmail: true,
    collectJobTitle: false,
    collectCompany: false,
    
    // Paso 4: Configuración
    requireApproval: true,
    sendConfirmation: true,
  });
  
  const steps = [
    { number: 1, title: 'Información', icon: FileText },
    { number: 2, title: 'Personalización', icon: Palette },
    { number: 3, title: 'Campos', icon: Settings },
    { number: 4, title: 'Configuración', icon: Sparkles },
  ];
  
  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };
  
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const accessToken = localStorage.getItem('access_token');
      
      if (!accessToken) {
        setError('No estás autenticado');
        return;
      }
      
      const response = await fetch(
        getApiUrl(`/projects/${projectId}/capture-forms`),
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear formulario');
      }
      
      const data = await response.json();
      console.log('Form created successfully:', data.form);
      
      // Navigate back to forms list
      router.push(`/dashboard/projects/${projectId}/capture-forms`);
      
    } catch (err) {
      console.error('Error creating form:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isStepValid = () => {
    if (currentStep === 1) {
      return formData.formName.trim().length > 0;
    }
    return true;
  };
  
  return (
    
      <div className="container max-w-5xl py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-[var(--color-text-primary)] mb-2">Crear nuevo formulario</h1>
          <p className="text-[var(--color-text-secondary)]">
            Sigue los pasos para configurar tu formulario de captura de testimonios
          </p>
        </div>
        
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="max-w-4xl mx-auto">
            {/* Step Indicators */}
            <div className="relative mb-8">
              {/* Progress Bar Background */}
              <div className="absolute top-6 left-0 right-0 h-1 bg-[var(--color-neutral-200)] rounded-full" />
              
              {/* Progress Bar Fill */}
              <div 
                className="absolute top-6 left-0 h-1 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-accent-500)] rounded-full transition-all duration-500"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
              
              {/* Steps */}
              <div className="relative flex items-start justify-between">
                {steps.map((step) => {
                  const Icon = step.icon;
                  const isCompleted = currentStep > step.number;
                  const isCurrent = currentStep === step.number;
                  
                  return (
                    <div key={step.number} className="flex flex-col items-center" style={{ width: `${100 / steps.length}%` }}>
                      {/* Step Circle */}
                      <button
                        onClick={() => setCurrentStep(step.number as Step)}
                        className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isCompleted
                            ? 'bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-600)] shadow-lg'
                            : isCurrent
                            ? 'bg-gradient-to-br from-[var(--color-primary-600)] to-[var(--color-accent-600)] shadow-xl ring-4 ring-[var(--color-primary-100)] scale-110'
                            : 'bg-white border-2 border-[var(--color-neutral-300)] hover:border-[var(--color-primary-400)]'
                        }`}
                      >
                        {isCompleted ? (
                          <Check size={20} className="text-white" />
                        ) : (
                          <Icon size={20} className={isCurrent ? 'text-white' : 'text-[var(--color-text-tertiary)]'} />
                        )}
                      </button>
                      
                      {/* Step Info */}
                      <div className="mt-3 text-center">
                        <div className={`text-xs font-semibold mb-1 transition-colors ${
                          isCurrent 
                            ? 'text-[var(--color-primary-700)]' 
                            : isCompleted
                            ? 'text-[var(--color-primary-600)]'
                            : 'text-[var(--color-text-tertiary)]'
                        }`}>
                          Paso {step.number}
                        </div>
                        <div className={`text-sm font-medium transition-colors ${
                          isCurrent ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'
                        }`}>
                          {step.title}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Dot Indicators - Mobile friendly */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {steps.map((step) => (
                <button
                  key={step.number}
                  onClick={() => setCurrentStep(step.number as Step)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    step.number === currentStep
                      ? 'w-8 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-accent-500)]'
                      : step.number < currentStep
                      ? 'w-2 bg-[var(--color-primary-400)]'
                      : 'w-2 bg-[var(--color-neutral-300)]'
                  }`}
                  aria-label={`Ir al paso ${step.number}`}
                />
              ))}
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
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
              
              {currentStep < 4 ? (
                <Button
                  type="button"
                  size="lg"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="min-w-[140px] bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-700)]"
                >
                  Siguiente
                  <ChevronRight size={20} />
                </Button>
              ) : (
                <Button
                  type="button"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isStepValid()}
                  className="min-w-[140px] bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-accent-600)]"
                >
                  {isSubmitting ? (
                    <>
                      <Check size={20} className="animate-pulse" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Check size={20} />
                      Crear formulario
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Step Content */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-[var(--color-border)] overflow-hidden">
            {/* Decorative gradient top */}
            <div className="h-1 bg-gradient-to-r from-[var(--color-primary-500)] via-[var(--color-secondary-500)] to-[var(--color-accent-500)]"></div>
            
            {/* Step 1: Información básica */}
            {currentStep === 1 && (
              <div className="p-8 animate-fade-in">
                <div className="mb-8">
                  <h2 className="mb-2 text-[var(--color-text-primary)]">Información básica</h2>
                  <p className="text-[var(--color-text-secondary)]">
                    Configura el nombre y descripción de tu formulario
                  </p>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-sm font-medium text-[var(--color-text-primary)]">
                        Nombre del formulario
                      </label>
                      <span className="px-2 py-0.5 bg-[var(--color-error-100)] text-[var(--color-error-700)] text-xs rounded-full">
                        Requerido
                      </span>
                    </div>
                    <Input
                      label=""
                      placeholder="Ej: Formulario de testimonios Q4 2024"
                      value={formData.formName}
                      onChange={(e) => setFormData({ ...formData, formName: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-sm font-medium text-[var(--color-text-primary)]">
                        Descripción
                      </label>
                      <span className="px-2 py-0.5 bg-[var(--color-neutral-200)] text-[var(--color-text-tertiary)] text-xs rounded-full">
                        Opcional
                      </span>
                    </div>
                    <Textarea
                      label=""
                      placeholder="Describe el propósito de este formulario (solo visible para ti)"
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Personalización */}
            {currentStep === 2 && (
              <div className="p-8 animate-fade-in">
                <div className="mb-8">
                  <h2 className="mb-2 text-[var(--color-text-primary)]">Personalización</h2>
                  <p className="text-[var(--color-text-secondary)]">
                    Personaliza los mensajes que verán tus usuarios
                  </p>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                      Título de bienvenida
                    </label>
                    <Input
                      label=""
                      placeholder="Título principal del formulario"
                      value={formData.welcomeTitle}
                      onChange={(e) => setFormData({ ...formData, welcomeTitle: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                      Mensaje de bienvenida
                    </label>
                    <Textarea
                      label=""
                      placeholder="Mensaje que aparecerá al inicio del formulario"
                      rows={4}
                      value={formData.welcomeMessage}
                      onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
                    />
                  </div>
                  
                  {/* Tipos de testimonio permitidos */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                      Tipos de testimonio permitidos
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-4 bg-gradient-to-r from-white to-[var(--color-neutral-50)] rounded-xl border-2 border-[var(--color-border)] hover:border-[var(--color-primary-300)] transition-all cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.allowText}
                          onChange={(e) => setFormData({ ...formData, allowText: e.target.checked })}
                          className="w-5 h-5 rounded border-2 border-[var(--color-border)] text-[var(--color-primary-600)] focus:ring-2 focus:ring-[var(--color-primary-200)]"
                        />
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-xl">Aa</span>
                          <span className="font-medium text-[var(--color-text-primary)]">Texto</span>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3 p-4 bg-gradient-to-r from-white to-[var(--color-neutral-50)] rounded-xl border-2 border-[var(--color-border)] hover:border-[var(--color-primary-300)] transition-all cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.allowVideo}
                          onChange={(e) => setFormData({ ...formData, allowVideo: e.target.checked })}
                          className="w-5 h-5 rounded border-2 border-[var(--color-border)] text-[var(--color-primary-600)] focus:ring-2 focus:ring-[var(--color-primary-200)]"
                        />
                        <div className="flex items-center gap-2 flex-1">
                          <Video size={20} className="text-[var(--color-primary-600)]" />
                          <span className="font-medium text-[var(--color-text-primary)]">Video</span>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3 p-4 bg-gradient-to-r from-white to-[var(--color-neutral-50)] rounded-xl border-2 border-[var(--color-border)] hover:border-[var(--color-primary-300)] transition-all cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.allowImage}
                          onChange={(e) => setFormData({ ...formData, allowImage: e.target.checked })}
                          className="w-5 h-5 rounded border-2 border-[var(--color-border)] text-[var(--color-primary-600)] focus:ring-2 focus:ring-[var(--color-primary-200)]"
                        />
                        <div className="flex items-center gap-2 flex-1">
                          <ImageIcon size={20} className="text-[var(--color-accent-600)]" />
                          <span className="font-medium text-[var(--color-text-primary)]">Imagen</span>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  {/* Preview */}
                  <div className="mt-8 p-6 bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-accent-50)] rounded-xl border-2 border-[var(--color-primary-200)]">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-accent-500)] rounded-lg flex items-center justify-center">
                        <Sparkles size={16} className="text-white" />
                      </div>
                      <span className="text-sm font-medium text-[var(--color-primary-700)]">
                        Vista previa
                      </span>
                    </div>
                    <h3 className="mb-2 text-[var(--color-text-primary)]">{formData.welcomeTitle}</h3>
                    <p className="text-[var(--color-text-secondary)]">{formData.welcomeMessage}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Campos */}
            {currentStep === 3 && (
              <div className="p-8 animate-fade-in">
                <div className="mb-8">
                  <h2 className="mb-2 text-[var(--color-text-primary)]">Campos del formulario</h2>
                  <p className="text-[var(--color-text-secondary)]">
                    Selecciona qué información solicitar
                  </p>
                </div>
                
                <div className="space-y-4">
                  {/* Campo Nombre */}
                  <label className="flex items-center gap-4 p-5 bg-gradient-to-r from-white to-[var(--color-neutral-50)] rounded-xl border-2 border-[var(--color-border)] hover:border-[var(--color-primary-300)] transition-all cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.collectName}
                      onChange={(e) => setFormData({ ...formData, collectName: e.target.checked })}
                      className="w-5 h-5 rounded border-2 border-[var(--color-border)] text-[var(--color-primary-600)] focus:ring-2 focus:ring-[var(--color-primary-200)]"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-[var(--color-text-primary)]">Nombre completo</div>
                      <div className="text-sm text-[var(--color-text-tertiary)]">Solicitar el nombre de la persona</div>
                    </div>
                    <span className="px-2 py-0.5 bg-[var(--color-primary-100)] text-[var(--color-primary-700)] text-xs rounded-full">
                      Recomendado
                    </span>
                  </label>
                  
                  {/* Campo Email */}
                  <label className="flex items-center gap-4 p-5 bg-gradient-to-r from-white to-[var(--color-neutral-50)] rounded-xl border-2 border-[var(--color-border)] hover:border-[var(--color-primary-300)] transition-all cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.collectEmail}
                      onChange={(e) => setFormData({ ...formData, collectEmail: e.target.checked })}
                      className="w-5 h-5 rounded border-2 border-[var(--color-border)] text-[var(--color-primary-600)] focus:ring-2 focus:ring-[var(--color-primary-200)]"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-[var(--color-text-primary)]">Correo electrónico</div>
                      <div className="text-sm text-[var(--color-text-tertiary)]">Solicitar el email de contacto</div>
                    </div>
                    <span className="px-2 py-0.5 bg-[var(--color-primary-100)] text-[var(--color-primary-700)] text-xs rounded-full">
                      Recomendado
                    </span>
                  </label>
                  
                  {/* Campo Cargo */}
                  <label className="flex items-center gap-4 p-5 bg-gradient-to-r from-white to-[var(--color-neutral-50)] rounded-xl border-2 border-[var(--color-border)] hover:border-[var(--color-primary-300)] transition-all cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.collectJobTitle}
                      onChange={(e) => setFormData({ ...formData, collectJobTitle: e.target.checked })}
                      className="w-5 h-5 rounded border-2 border-[var(--color-border)] text-[var(--color-primary-600)] focus:ring-2 focus:ring-[var(--color-primary-200)]"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-[var(--color-text-primary)]">Cargo</div>
                      <div className="text-sm text-[var(--color-text-tertiary)]">Solicitar el puesto o rol</div>
                    </div>
                  </label>
                  
                  {/* Campo Empresa */}
                  <label className="flex items-center gap-4 p-5 bg-gradient-to-r from-white to-[var(--color-neutral-50)] rounded-xl border-2 border-[var(--color-border)] hover:border-[var(--color-primary-300)] transition-all cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.collectCompany}
                      onChange={(e) => setFormData({ ...formData, collectCompany: e.target.checked })}
                      className="w-5 h-5 rounded border-2 border-[var(--color-border)] text-[var(--color-primary-600)] focus:ring-2 focus:ring-[var(--color-primary-200)]"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-[var(--color-text-primary)]">Empresa</div>
                      <div className="text-sm text-[var(--color-text-tertiary)]">Solicitar el nombre de la empresa</div>
                    </div>
                  </label>
                </div>
              </div>
            )}
            
            {/* Step 4: Configuración */}
            {currentStep === 4 && (
              <div className="p-8 animate-fade-in">
                <div className="mb-8">
                  <h2 className="mb-2 text-[var(--color-text-primary)]">Configuración final</h2>
                  <p className="text-[var(--color-text-secondary)]">
                    Ajustes adicionales para tu formulario
                  </p>
                </div>
                
                <div className="space-y-4">
                  {/* Requerir aprobación */}
                  <label className="flex items-start gap-4 p-5 bg-gradient-to-r from-white to-[var(--color-neutral-50)] rounded-xl border-2 border-[var(--color-border)] hover:border-[var(--color-primary-300)] transition-all cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.requireApproval}
                      onChange={(e) => setFormData({ ...formData, requireApproval: e.target.checked })}
                      className="w-5 h-5 mt-0.5 rounded border-2 border-[var(--color-border)] text-[var(--color-primary-600)] focus:ring-2 focus:ring-[var(--color-primary-200)]"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-[var(--color-text-primary)]">Requerir aprobación</div>
                      <div className="text-sm text-[var(--color-text-tertiary)] mt-1">
                        Los testimonios deberán ser revisados y aprobados antes de publicarse
                      </div>
                    </div>
                  </label>
                  
                  {/* Enviar confirmación */}
                  <label className="flex items-start gap-4 p-5 bg-gradient-to-r from-white to-[var(--color-neutral-50)] rounded-xl border-2 border-[var(--color-border)] hover:border-[var(--color-primary-300)] transition-all cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.sendConfirmation}
                      onChange={(e) => setFormData({ ...formData, sendConfirmation: e.target.checked })}
                      className="w-5 h-5 mt-0.5 rounded border-2 border-[var(--color-border)] text-[var(--color-primary-600)] focus:ring-2 focus:ring-[var(--color-primary-200)]"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-[var(--color-text-primary)]">Enviar email de confirmación</div>
                      <div className="text-sm text-[var(--color-text-tertiary)] mt-1">
                        Enviar un email automático al usuario después de enviar su testimonio
                      </div>
                    </div>
                  </label>
                  
                  {/* Resumen */}
                  <div className="mt-8 p-6 bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-accent-50)] rounded-xl border-2 border-[var(--color-primary-200)]">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-accent-500)] rounded-lg flex items-center justify-center">
                        <Check size={16} className="text-white" />
                      </div>
                      <span className="text-sm font-medium text-[var(--color-primary-700)]">
                        Resumen del formulario
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--color-text-tertiary)]">Nombre:</span>
                        <span className="font-medium text-[var(--color-text-primary)]">{formData.formName || 'Sin nombre'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--color-text-tertiary)]">Campos:</span>
                        <span className="font-medium text-[var(--color-text-primary)]">
                          {[formData.collectName && 'Nombre', formData.collectEmail && 'Email', formData.collectJobTitle && 'Cargo', formData.collectCompany && 'Empresa'].filter(Boolean).join(', ') || 'Ninguno'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--color-text-tertiary)]">Aprobación:</span>
                        <span className="font-medium text-[var(--color-text-primary)]">{formData.requireApproval ? 'Sí' : 'No'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-[var(--color-error-100)] text-[var(--color-error-700)] rounded-lg shadow-md">
            <AlertCircle size={20} className="inline-block mr-2" />
            {error}
          </div>
        )}
      </div>
    
  );
}