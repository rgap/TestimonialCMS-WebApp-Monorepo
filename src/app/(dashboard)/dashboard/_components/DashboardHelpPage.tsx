'use client';

import { useState } from 'react';
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Send, Check, Shield, User, MessageCircle } from 'lucide-react';
import { useAuth } from "@/features/auth/context/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { UserRoleBadge } from "@/components/badges/UserRoleBadge";

export function DashboardHelpPage() {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth();
  const { isAdmin } = usePermissions();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular envío
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setMessage('');
    }, 3000);
  };
  
  return (
    <AppLayout userRole={user?.role} userName={user?.name || user?.email}>
      <div className="container max-w-4xl py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-[var(--color-text-primary)] mb-4">
            Ayuda y sugerencias
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Encuentra respuestas a tus preguntas o envíanos tus ideas para mejorar TestimonialCMS
          </p>
        </div>
        
        {/* User Role Info Card */}
        <div className="bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-secondary-50)] rounded-2xl border border-[var(--color-border)] p-8 mb-10 max-w-2xl mx-auto">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md">
              {isAdmin ? <Shield size={32} className="text-[var(--color-primary-600)]" /> : <User size={32} className="text-[var(--color-secondary-600)]" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-[var(--color-text-primary)]">Tu rol</h4>
                <UserRoleBadge role={user?.role} size="sm" />
              </div>
              <p className="text-[var(--color-text-secondary)]">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
        
        {/* Contact Form */}
        <div className="bg-white rounded-3xl shadow-lg border border-[var(--color-border)] p-10 mb-10 max-w-2xl mx-auto">
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <div className="flex items-start gap-5 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-primary-600)] to-[var(--color-secondary-600)] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <MessageCircle size={32} className="text-white" />
                </div>
                <div>
                  <h4 className="mb-2 text-[var(--color-text-primary)]">
                    ¿Necesitas ayuda o tienes una sugerencia?
                  </h4>
                  <p className="text-[var(--color-text-secondary)]">
                    Envíanos tu consulta, idea o comentario y te responderemos lo antes posible
                  </p>
                </div>
              </div>
              
              <div className="mb-8">
                <label htmlFor="message" className="block mb-3 text-[var(--color-text-primary)]">
                  Tu mensaje
                </label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe tu consulta o sugerencia. Cuanto más detalle nos proporciones, mejor podremos ayudarte..."
                  rows={10}
                  required
                />
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[var(--color-border)]">
                <p className="text-sm text-[var(--color-text-tertiary)]">
                  Responderemos a tu email asociado a esta cuenta
                </p>
                <Button type="submit" disabled={!message.trim()} className="px-8 py-3 w-full sm:w-auto">
                  <Send size={20} />
                  Enviar mensaje
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-[var(--color-success-100)] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                <Check size={48} className="text-[var(--color-success-600)]" />
              </div>
              <h4 className="mb-3 text-[var(--color-text-primary)]">
                ¡Mensaje enviado correctamente!
              </h4>
              <p className="text-lg text-[var(--color-text-secondary)]">
                Hemos recibido tu mensaje y te responderemos pronto
              </p>
            </div>
          )}
        </div>
        
        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-primary-100)] rounded-2xl p-8 border border-[var(--color-primary-200)]">
            <div className="text-4xl mb-4">💡</div>
            <h5 className="mb-3 text-[var(--color-primary-900)]">
              Sugerencias de mejora
            </h5>
            <p className="text-[var(--color-primary-700)]">
              Comparte tus ideas de nuevas funcionalidades o mejoras que te gustaría ver en TestimonialCMS
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[var(--color-secondary-50)] to-[var(--color-secondary-100)] rounded-2xl p-8 border border-[var(--color-secondary-200)]">
            <div className="text-4xl mb-4">❓</div>
            <h5 className="mb-3 text-[var(--color-secondary-900)]">
              ¿Necesitas ayuda?
            </h5>
            <p className="text-[var(--color-secondary-700)]">
              Si tienes dudas sobre cómo usar alguna función, no dudes en consultarnos
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
