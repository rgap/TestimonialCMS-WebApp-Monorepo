"use client";

import { Logo } from "@/components/branding/Logo";
import { useAuth } from "@/features/auth/context/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { useProject } from "@/hooks/useProject";
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Code,
    FileText,
    LayoutGrid,
    LogOut,
    Menu,
    MessageSquare,
    Settings,
    Share2,
    Sparkles,
    Upload,
    Users,
    X,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface AppLayoutWithSidebarProps {
  children: React.ReactNode;
  userRole?: "admin" | "editor" | "Admin" | "Editor";
  userName?: string;
  projectName?: string;
}

export function AppLayoutWithSidebar({
  children,
  userRole = "Admin",
  userName = "Usuario",
  projectName = "Nombre del Proyecto",
}: AppLayoutWithSidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  const projectId = typeof params.projectId === "string" ? params.projectId : undefined;
  const router = useRouter();
  const { logout, user } = useAuth();
  const { permissions } = usePermissions();
  const { project } = useProject(projectId);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Use actual user data from auth context
  const displayName = user?.name || userName;

  // Determine display role based on project context
  // Priority: 1. Project owner (Admin), 2. Project editor role, 3. Global admin role, 4. Default to Editor
  let displayRole: "Admin" | "Editor" = "Editor";
  if (project && user) {
    if (project.ownerId === user.id) {
      // User is the owner of this project
      displayRole = "Admin";
    } else if (project.role === "editor") {
      // User has editor access to this project
      displayRole = "Editor";
    } else if (user.role === "admin") {
      // User has global admin role
      displayRole = "Admin";
    }
  } else if (user?.role === "admin") {
    // No project context, show global role
    displayRole = "Admin";
  }

  const mainNavigation = [
    { name: "Proyectos", href: "/dashboard/projects", icon: LayoutGrid },
    { name: "Ayuda", href: "/dashboard/help", icon: MessageSquare },
  ];

  const projectNavigation = [
    {
      section: "Capturar",
      items: [
        ...(permissions.canManageForms ? [{ name: "Formularios", href: `/dashboard/projects/${projectId}/capture-forms`, icon: FileText }] : []),
        ...(permissions.canImportTestimonials
          ? [{ name: "Importar testimonios", href: `/dashboard/projects/${projectId}/import-testimonials`, icon: Upload }]
          : []),
      ],
    },
    {
      section: "Gestionar",
      items: [
        ...(permissions.canViewProject ? [{ name: "Testimonios", href: `/dashboard/projects/${projectId}/testimonials`, icon: MessageSquare }] : []),
      ],
    },
    {
      section: "Compartir",
      items: [
        ...(permissions.canManageEmbeds ? [{ name: "Embeds", href: `/dashboard/projects/${projectId}/embeds`, icon: Share2 }] : []),
        ...(permissions.canManageEmbeds ? [{ name: "API", href: `/dashboard/projects/${projectId}/api`, icon: Code }] : []),
      ],
    },
  ].filter(group => group.items.length > 0);

  // Show editors management if user is admin OR owner of the project
  const isProjectOwner = project && user && project.ownerId === user.id;
  const canManageEditors = permissions.canManageEditors || isProjectOwner;

  if (canManageEditors) {
    projectNavigation.push({
      section: "Configuración",
      items: [{ name: "Editores", href: `/dashboard/projects/${projectId}/editors`, icon: Users }],
    });
  }

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Top Bar - Solo para mobile */}
      <header className="sticky top-0 z-40 bg-white border-b border-[var(--color-border)] lg:hidden">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                className="p-2 text-[var(--color-text-primary)] hover:text-[var(--color-primary-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] rounded-lg"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label={sidebarOpen ? "Cerrar menú lateral" : "Abrir menú lateral"}
                aria-expanded={sidebarOpen}
              >
                <Menu size={24} />
              </button>
              <Logo size="sm" href="/dashboard/projects" />
            </div>

            <div className="flex items-center gap-4">
              <button
                className="p-2 text-[var(--color-text-primary)] hover:text-[var(--color-primary-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] rounded-lg"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="py-4 border-t border-[var(--color-border)] space-y-2">
              {mainNavigation.map(item => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--color-text-primary)] hover:bg-[var(--color-neutral-100)] font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <div className="border-t border-[var(--color-border)] pt-2 mt-2">
                <div className="px-4 py-2">
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">{displayName}</p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">Rol: {displayRole}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-neutral-100)] transition-colors rounded-lg"
                >
                  <LogOut size={16} />
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 left-0 z-30 w-64 h-screen bg-white border-r border-[var(--color-border)] overflow-y-auto transition-transform lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:top-0`}
        >
          <div className="flex flex-col h-full">
            {/* Logo en la parte superior */}
            <div className="p-4 border-b border-[var(--color-border)]">
              <Logo size="md" href="/dashboard/projects" />
            </div>

            {/* Navegación del proyecto */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="mb-6">
                <Link
                  href="/dashboard/projects"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-neutral-100)] hover:bg-[var(--color-neutral-200)] text-[var(--color-text-primary)] transition-colors group"
                >
                  <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                  <span className="font-medium">Todos los proyectos</span>
                </Link>
              </div>

              <nav className="space-y-6">
                {projectNavigation.map(group => (
                  <div key={group.section}>
                    <h6 className="text-xs uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2 px-3">{group.section}</h6>
                    <div className="space-y-1">
                      {group.items.map(item => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                              isActive(item.href)
                                ? "bg-[var(--color-primary-100)] text-[var(--color-primary-700)]"
                                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-text-primary)]"
                            }`}
                          >
                            <Icon size={18} />
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </div>

            {/* Proyecto actual */}
            <div className="px-4 py-3 border-t border-[var(--color-border)]">
              <div className="px-3">
                <p className="text-xs text-[var(--color-text-tertiary)] mb-1">Proyecto actual</p>
                <h4 className="text-[var(--color-text-primary)] font-medium break-words text-[16px] font-normal leading-tight">{projectName}</h4>
              </div>
            </div>

            {/* Menú de usuario en la parte inferior */}
            <div className="p-4 border-t border-[var(--color-border)]">
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[var(--color-neutral-100)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                  aria-label="Menú de usuario"
                  aria-expanded={userMenuOpen}
                >
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-[var(--color-text-primary)] truncate">{displayName}</div>
                    <div className="text-xs text-[var(--color-text-secondary)]">{displayRole}</div>
                  </div>
                  <ChevronDown size={18} className="text-[var(--color-text-secondary)] flex-shrink-0" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 rounded-xl shadow-xl border-2 border-slate-700 py-2 z-50 backdrop-blur-sm">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
                      >
                        <LogOut size={16} />
                        Cerrar sesión
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </aside>

        {sidebarOpen && <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* Main Content */}
        <main className="flex-1 py-8 lg:ml-0">{children}</main>
      </div>
    </div>
  );
}
