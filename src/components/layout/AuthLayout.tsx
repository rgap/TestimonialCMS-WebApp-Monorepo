import { NavBarGuest } from "@/components/navigation/NavBarGuest";
import { SimpleFooter } from "@/components/footer/SimpleFooter";
import { PageBreadcrumb } from "@/components/navigation/PageBreadcrumb";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  breadcrumbItems?: { label: string; href?: string }[];
}

export function AuthLayout({ children, title, subtitle, breadcrumbItems }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBarGuest />
      
      {breadcrumbItems && breadcrumbItems.length > 0 && (
        <PageBreadcrumb items={breadcrumbItems} />
      )}
      
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[var(--color-primary-50)] via-white to-[var(--color-secondary-50)] p-4 py-16">
        <div className="w-full max-w-md">
          {/* Brand Section */}
          <div className="text-center mb-8">
            <h2 className="mb-2 text-[var(--color-text-primary)]">{title}</h2>
            {subtitle && (
              <p className="text-[var(--color-text-secondary)]">{subtitle}</p>
            )}
          </div>
          
          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-[var(--color-border)] p-8">
            {children}
          </div>
        </div>
      </div>
      
      <SimpleFooter />
    </div>
  );
}