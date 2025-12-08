import Link from 'next/link';
import { Logo } from "@/components/branding/Logo";

export function SimpleFooter() {
  return (
    <footer className="bg-[var(--color-neutral-900)] text-white py-12 md:py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="md:col-span-2">
            <Logo size="sm" />
            <p className="mt-4 text-[var(--color-neutral-400)] max-w-md">
              La plataforma más simple para recopilar, gestionar
              y compartir testimonios. Gratis para siempre.
            </p>
          </div>

          <div>
            <h6 className="mb-4 text-white">Producto</h6>
            <div className="space-y-3">
              <Link href="/signup"
                className="block text-[var(--color-primary-400)] hover:text-white transition-colors"
              >
                Crear cuenta
              </Link>
              <Link href="/login"
                className="block text-[var(--color-primary-400)] hover:text-white transition-colors"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>

          <div>
            <h6 className="mb-4 text-white">Empresa</h6>
            <div className="space-y-3">
              <Link href="/about"
                className="block text-[var(--color-primary-400)] hover:text-white transition-colors"
              >
                Acerca de
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--color-neutral-800)] text-center text-[var(--color-neutral-500)] text-sm">
          © {new Date().getFullYear()} TestimonialCMS. Todos los
          derechos reservados.
        </div>
      </div>
    </footer>
  );
}