import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { Spinner } from "@/shared/ui/spinner";

interface PermissionGuardProps {
    children: React.ReactNode;
    requiredPermissions: string[];
    requireAll?: boolean;
}

export function PermissionGuard({ children, requiredPermissions, requireAll = false }: PermissionGuardProps) {
    const { user, isLoading, hasAnyPermission, hasAllPermissions } = useAuth();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Spinner className="size-8" />
            </div>
        );
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
