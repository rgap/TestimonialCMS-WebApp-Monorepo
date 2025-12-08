"use client";

import { SimpleFooter } from "@/components/footer/SimpleFooter";
import { NavBarGuest } from "@/components/navigation/NavBarGuest";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Settings, Share2, Upload, Users } from "lucide-react";

export function MarketingLandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBarGuest />

      {/* Hero Section - Rediseñado */}
      <section className="relative flex-1 py-16 md:py-20 lg:py-24 overflow-hidden">
        {/* Gradient background abstracto */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#dbeafe] via-[#f3e8ff] to-[#cffafe] animate-[gradient_5s_ease-in-out_infinite]"
          style={{ backgroundSize: "600% 600%" }}
        />

        {/* Decorative blur elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#5b5be8] opacity-[0.03] rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#a855f7] opacity-[0.03] rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />

        <div className="container relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="mb-8 bg-gradient-to-br from-[#0f0f3d] via-[#3b3bc8] to-[#7c3aed] bg-clip-text text-transparent leading-tight">
              Recopila y Gestiona Testimonios
            </h1>

            <p className="text-xl md:text-2xl text-[var(--color-text-secondary)] mb-12 max-w-3xl mx-auto leading-relaxed">
              Plataforma de gestión de contenido para equipos que necesitan
              crear, moderar y compartir testimonios con texto, imágenes, fotos
              y videos. Ideal para Admins y Editores.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section - Rediseñada */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-[#fafaff]">
        <div className="container">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-[var(--color-text-primary)] mb-6">
              ¿Cómo funciona?
            </h2>
            <p className="text-xl text-[var(--color-text-secondary)]">
              Tres pasos simples para empezar a mostrar prueba social en tu
              sitio web
            </p>
          </div>

          {/* Features Grid - Estilo moderno */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Card 1 */}
            <div className="group relative bg-white p-8 rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-xl hover:border-[#5b5be8]/30 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-[#5b5be8]/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />

              <div className="relative">
                <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-[#5b5be8] to-[#7b7bff] rounded-xl mb-6 shadow-lg shadow-[#5b5be8]/20 group-hover:scale-110 transition-transform duration-300">
                  <Upload
                    size={24}
                    className="text-white"
                  />
                </div>
                <h5 className="mb-3 text-[var(--color-text-primary)]">
                  Captura fácil
                </h5>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Formularios personalizados para texto, imagen y video
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative bg-white p-8 rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-xl hover:border-[#a855f7]/30 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-[#a855f7]/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />

              <div className="relative">
                <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-[#a855f7] to-[#c084fc] rounded-xl mb-6 shadow-lg shadow-[#a855f7]/20 group-hover:scale-110 transition-transform duration-300">
                  <Settings
                    size={24}
                    className="text-white"
                  />
                </div>
                <h5 className="mb-3 text-[var(--color-text-primary)]">
                  Gestión total
                </h5>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Organiza, aprueba y edita desde un panel
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative bg-white p-8 rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-xl hover:border-[#06b6d4]/30 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-[#06b6d4]/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />

              <div className="relative">
                <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-[#06b6d4] to-[#22d3ee] rounded-xl mb-6 shadow-lg shadow-[#06b6d4]/20 group-hover:scale-110 transition-transform duration-300">
                  <Users
                    size={24}
                    className="text-white"
                  />
                </div>
                <h5 className="mb-3 text-[var(--color-text-primary)]">
                  Trabajo en equipo
                </h5>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Roles Admin y Editor para colaborar
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="group relative bg-white p-8 rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-xl hover:border-[#10b981]/30 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />

              <div className="relative">
                <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-[#10b981] to-[#34d399] rounded-xl mb-6 shadow-lg shadow-[#10b981]/20 group-hover:scale-110 transition-transform duration-300">
                  <Share2
                    size={24}
                    className="text-white"
                  />
                </div>
                <h5 className="mb-3 text-[var(--color-text-primary)]">
                  Integración simple
                </h5>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Embeds listos para tu sitio web
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-20 text-center">
            <Button
              href="/signup"
              size="lg"
              className="group shadow-lg shadow-[#5b5be8]/20 hover:shadow-xl hover:shadow-[#5b5be8]/30"
              aria-label="Comenzar ahora - Crear cuenta gratuita en TestimonialCMS"
            >
              Comenzar ahora
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Button>
          </div>
        </div>
      </section>

      <SimpleFooter />
    </div>
  );
}
