import { useAuth } from "@/features/auth/context/AuthContext";
import { getPermissions, isAdmin, isEditor, Permission } from "@/lib/auth/permissions";

interface UsePermissionsReturn {
  permissions: Permission;
  isAdmin: boolean;
  isEditor: boolean;
  role: string;
}

/**
 * Custom hook to access user permissions based on their role
 */
export function usePermissions(): UsePermissionsReturn {
  const { user } = useAuth();
  
  const role = user?.role || 'editor';
  const permissions = getPermissions(role);
  
  return {
    permissions,
    isAdmin: isAdmin(role),
    isEditor: isEditor(role),
    role,
  };
}
