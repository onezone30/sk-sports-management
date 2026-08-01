import { Navigate } from "react-router-dom";
import { AuthGate, useAuth } from "@/features/auth";

interface PermissionGuardProps {
    children: React.ReactNode;
    requiredPermissions: string[];
    requireAll?: boolean;
}

export function PermissionGuard({ children, requiredPermissions, requireAll = false }: PermissionGuardProps) {
    const { hasAnyPermission, hasAllPermissions } = useAuth();

    const hasAccess = requireAll
        ? hasAllPermissions(requiredPermissions)
        : hasAnyPermission(requiredPermissions);

    return (
        <AuthGate>
            {hasAccess ? children : <Navigate to="/unauthorized" replace />}
        </AuthGate>
    );
}
