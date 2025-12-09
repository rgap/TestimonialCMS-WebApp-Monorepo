import { Badge } from "@/components/ui/Badge";
import { Shield, User } from 'lucide-react';

interface UserRoleBadgeProps {
  role?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function UserRoleBadge({ role = 'editor', size = 'md' }: UserRoleBadgeProps) {
  const isAdmin = role === 'admin';
  
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <Badge 
      variant={isAdmin ? 'default' : 'secondary'}
      className={`flex items-center gap-1 ${sizeClasses[size]}`}
    >
      {isAdmin ? (
        <>
          <Shield className="size-3" />
          Admin
        </>
      ) : (
        <>
          <User className="size-3" />
          Editor
        </>
      )}
    </Badge>
  );
}
