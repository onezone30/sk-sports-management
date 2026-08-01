import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Spinner } from "@/shared/ui/spinner";
import { useAuth } from "../model/useAuth";

interface AuthGateProps {
    children: ReactNode;
}

/**
 * Shared sign-in check used by both ProtectedLayout (every protected route)
 * and PermissionGuard (an additional per-route permission check on top of it).
 * Preserves the attempted URL so LoginForm can send the user back afterward.
 */
export function AuthGate({ children }: AuthGateProps) {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Spinner className="size-8" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <>{children}</>;
}
