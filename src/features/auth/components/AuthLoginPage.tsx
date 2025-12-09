"use client";

import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/features/auth/context/AuthContext";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AuthLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = "El correo es requerido";
    if (!formData.password) newErrors.password = "La contraseña es requerida";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setGeneralError("");
    setErrors({});

    try {
      await login(formData.email, formData.password);
      router.push("/dashboard/projects");
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error.message || "Error al iniciar sesión. Verifica tus credenciales.";

      // Provide helpful message for invalid credentials
      if (errorMessage.includes("Invalid login credentials") || errorMessage.includes("Invalid")) {
        setGeneralError("Credenciales incorrectas. Si es tu primera vez, crea una cuenta primero.");
      } else {
        setGeneralError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (role: "admin" | "editor") => {
    const credentials = {
      admin: {
        email: "r.guzmanap@gmail.com",
        password: "admin123",
      },
      editor: {
        email: "rgap449@gmail.com",
        password: "editor123",
      },
    };

    setFormData(credentials[role]);
    setErrors({});
    setGeneralError("");
  };

  return (
    <AuthLayout title="Iniciar sesión" subtitle="Accede a tu cuenta como Admin o Editor" breadcrumbItems={[{ label: "Iniciar sesión" }]}>
      {generalError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-red-800">{generalError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          type="email"
          label="Correo electrónico"
          placeholder="tu@email.com"
          required
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          disabled={loading}
        />

        <Input
          type="password"
          label="Contraseña"
          placeholder="Ingresa tu contraseña"
          required
          value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
          disabled={loading}
        />

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-[var(--color-text-secondary)]">¿No tienes cuenta? </span>
        <Link href="/signup" className="text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]">
          Crear cuenta gratis
        </Link>
      </div>

      {/* Quick Access Buttons */}
      <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
        <p className="text-xs text-center text-[var(--color-text-secondary)] mb-3">Acceso rápido para desarrollo</p>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => quickLogin("admin")}
            disabled={loading}
            className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-neutral-50)] transition-colors text-[var(--color-text-primary)] disabled:opacity-50"
          >
            Ingresar como Admin
          </button>
          <button
            type="button"
            onClick={() => quickLogin("editor")}
            disabled={loading}
            className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-neutral-50)] transition-colors text-[var(--color-text-primary)] disabled:opacity-50"
          >
            Ingresar como Editor
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
