// Role-based permissions utility

export type UserRole = 'admin' | 'editor';

export interface Permission {
  canCreateProject: boolean;
  canDeleteProject: boolean;
  canManageEditors: boolean;
  canEditProject: boolean;
  canViewProject: boolean;
  canCreateTestimonial: boolean;
  canEditTestimonial: boolean;
  canDeleteTestimonial: boolean;
  canApproveTestimonial: boolean;
  canManageForms: boolean;
  canManageEmbeds: boolean;
  canImportTestimonials: boolean;
}

/**
 * Get permissions based on user role
 */
export function getPermissions(role?: string): Permission {
  const userRole = (role || 'editor') as UserRole;

  // Admin has all permissions
  if (userRole === 'admin') {
    return {
      canCreateProject: true,
      canDeleteProject: true,
      canManageEditors: true,
      canEditProject: true,
      canViewProject: true,
      canCreateTestimonial: true,
      canEditTestimonial: true,
      canDeleteTestimonial: true,
      canApproveTestimonial: true,
      canManageForms: true,
      canManageEmbeds: true,
      canImportTestimonials: true,
    };
  }

  // Editor has limited permissions
  return {
    canCreateProject: true, // Editors can create projects
    canDeleteProject: false, // Only admin can delete projects
    canManageEditors: false, // Only admin can manage editors (unless they are project owner)
    canEditProject: true, // Editors can edit existing projects
    canViewProject: true, // Editors can view projects
    canCreateTestimonial: true, // Editors can create testimonials
    canEditTestimonial: true, // Editors can edit testimonials
    canDeleteTestimonial: true, // Editors can delete testimonials
    canApproveTestimonial: true, // Editors can approve testimonials
    canManageForms: true, // Editors can manage forms
    canManageEmbeds: true, // Editors can manage embeds
    canImportTestimonials: true, // Editors can import testimonials
  };
}

/**
 * Check if user has admin role
 */
export function isAdmin(role?: string): boolean {
  return role === 'admin';
}

/**
 * Check if user has editor role
 */
export function isEditor(role?: string): boolean {
  return role === 'editor';
}