"use client";

import { SimpleFooter } from "@/components/footer/SimpleFooter";
import { NavBarGuest } from "@/components/navigation/NavBarGuest";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/context/AuthContext";
import { ArrowRight, Home } from "lucide-react";

export default function NotFound() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBarGuest />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-16 md:py-20 lg:py-24">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto px-4">
            {/* Large 404 text - Purple */}
            <h1 className="text-8xl md:text-9xl font-bold text-[var(--color-secondary-600)] mb-6">
              404
            </h1>

            {/* Page not found heading */}
            <h2 className="mb-6 text-[var(--color-text-primary)]">
              Página no encontrada
            </h2>

            {/* Descriptive text */}
            <p className="text-xl md:text-2xl text-[var(--color-text-secondary)] mb-12 max-w-xl mx-auto leading-relaxed">
              Lo sentimos, la página que estás buscando no existe o ha sido
              movida. Usa los enlaces de abajo para continuar navegando.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Ir al inicio button - Always visible */}
              <Button
                href="/"
                size="lg"
                className="group w-full sm:w-auto shadow-lg shadow-[#5b5be8]/20 hover:shadow-xl hover:shadow-[#5b5be8]/30"
              >
                <Home size={20} />
                Ir al inicio
              </Button>

              {/* Ver proyectos button - Only shown when logged in */}
              {isAuthenticated && (
                <Button
                  href="/dashboard/projects"
                  variant="outline"
                  size="lg"
                  className="group w-full sm:w-auto"
                >
                  Ver proyectos
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>

      <SimpleFooter />
    </div>
  );
}
