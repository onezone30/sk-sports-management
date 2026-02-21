import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/ui/loader";

interface PermissionGuardProps {
    children: React.ReactNode;
    requiredPermissions: string[];
    requireAll?: boolean; 
}

export function PermissionGuard({ children, requiredPermissions, requireAll = false }: PermissionGuardProps) {
    const { user, isLoading, hasAnyPermission, hasAllPermissions } = useAuth();

    if (isLoading) {
        <Loader />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const hasAccess = requireAll 
        ? hasAllPermissions(requiredPermissions)
        : hasAnyPermission(requiredPermissions);

    if (!hasAccess) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
}
