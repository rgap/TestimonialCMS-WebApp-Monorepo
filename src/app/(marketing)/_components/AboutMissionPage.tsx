import { SimpleFooter } from "@/components/footer/SimpleFooter";
import { NavBarGuest } from "@/components/navigation/NavBarGuest";
import { PageBreadcrumb } from "@/components/navigation/PageBreadcrumb";
import { Button } from "@/components/ui/Button";
import { User } from "lucide-react";
import Link from "next/link";

export function AboutMissionPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBarGuest />

      <PageBreadcrumb items={[{ label: "Acerca de" }]} />

      <main className="flex-1 py-12 md:py-20 bg-white">
        <div className="container max-w-4xl">
          {/* Page Header */}
          <div className="mb-12">
            <p className="text-sm uppercase tracking-wider text-[var(--color-primary-600)] mb-3">
              Acerca de
            </p>
            <h1 className="text-[var(--color-text-primary)]">Nuestra misión</h1>
          </div>

          {/* Mission Body */}
          <div className="prose prose-lg max-w-none">
            <div className="space-y-6 text-[var(--color-text-secondary)]">
              <p>
                TestimonialCMS nació de una necesidad real: la dificultad de
                gestionar testimonios de forma profesional sin herramientas
                complicadas o costosas.
              </p>

              <p>
                Después de trabajar con múltiples empresas y ver cómo luchaban
                por recopilar, organizar y mostrar prueba social de manera
                efectiva, decidimos crear una solución simple pero poderosa.
              </p>

              <p>
                <strong className="text-[var(--color-text-primary)]">
                  Nuestra misión es clara:
                </strong>{" "}
                Proporcionar una plataforma accesible, gratuita y fácil de usar
                que permita a equipos de cualquier tamaño gestionar sus
                testimonios de forma colaborativa.
              </p>

              <p>
                Con roles de <strong>Admin</strong> y <strong>Editor</strong>,
                facilitamos el trabajo en equipo. Los administradores tienen
                control total sobre proyectos y permisos, mientras que los
                editores pueden enfocarse en recopilar y curar el mejor
                contenido.
              </p>

              <p>
                Creemos que la prueba social es fundamental para construir
                confianza, y que no debería ser un privilegio de empresas con
                grandes presupuestos. Por eso, TestimonialCMS es{" "}
                <strong>gratis para siempre</strong>.
              </p>
            </div>

            {/* Author Signature */}
            <div className="mt-12 pt-8 border-t border-[var(--color-border)]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-primary-600)] to-[var(--color-secondary-600)] rounded-full flex items-center justify-center text-white shadow-lg">
                  <User size={32} />
                </div>
                <div>
                  <p className="text-[var(--color-text-primary)]">
                    <strong>Fundador de TestimonialCMS</strong>
                  </p>
                  <p className="text-sm text-[var(--color-text-tertiary)]">
                    Construyendo herramientas para equipos
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 p-8 bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-secondary-50)] rounded-2xl border border-[var(--color-primary-100)] text-center">
            <h3 className="mb-4 text-[var(--color-text-primary)]">
              ¿Listo para comenzar?
            </h3>
            <p className="text-[var(--color-text-secondary)] mb-6">
              Crea tu cuenta gratuita y empieza a gestionar testimonios hoy
              mismo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                href="/signup"
                size="lg"
              >
                Crear cuenta
              </Button>
              <Button
                href="/login"
                variant="outline"
                size="lg"
              >
                Iniciar sesión
              </Button>
            </div>
          </div>
        </div>
      </main>

      <SimpleFooter />
    </div>
  );
}
