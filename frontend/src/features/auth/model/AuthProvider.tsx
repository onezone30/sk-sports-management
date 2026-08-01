import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/shared/api/client";
import type { User } from "@/entities/user";

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    permissions: string[];
    login: (token: string, user: User) => void;
    logout: () => void;
    hasPermission: (permission: string) => boolean;
    hasAnyPermission: (permissions: string[]) => boolean;
    hasAllPermissions: (permissions: string[]) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: ReactNode}) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const queryClient = useQueryClient();

    // Derived, not duplicated state — a second copy of user.permissions could drift from it.
    const permissions = user?.permissions ?? [];

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            try {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            } catch {
                // Corrupt localStorage — drop it and fall through to signed-out state
                // instead of throwing here and leaving isLoading stuck at true forever.
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }

        setIsLoading(false);
    }, []);

    const login = useCallback((newToken: string, newUser: User) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    }, []);

    const logout = useCallback(() => {
        // Fire the revoke call before clearing localStorage — the request
        // interceptor reads the token from localStorage, so clearing it first
        // would send /logout with no Authorization header. Update React state
        // immediately, though: the UI shouldn't wait on the network to reflect
        // sign-out, and a failed revoke shouldn't trap the user in a signed-in UI.
        api.post('/logout').catch(() => {}).finally(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        });

        setToken(null);
        setUser(null);
        queryClient.clear();
    }, [queryClient]);

    const hasPermission = useCallback((permission: string): boolean => {
        return permissions.includes(permission);
    }, [permissions]);

    const hasAnyPermission = useCallback((requiredPermissions: string[]): boolean => {
        return requiredPermissions.some(permission => permissions.includes(permission));
    }, [permissions]);

    const hasAllPermissions = useCallback((requiredPermissions: string[]): boolean => {
        return requiredPermissions.every(permission => permissions.includes(permission));
    }, [permissions]);

    const value = useMemo(
        () => ({ user, token, isLoading, permissions, login, logout, hasPermission, hasAnyPermission, hasAllPermissions }),
        [user, token, isLoading, permissions, login, logout, hasPermission, hasAnyPermission, hasAllPermissions]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
