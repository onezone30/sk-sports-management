import { createContext, useEffect, useState, type ReactNode,  } from "react";

export interface User {
    id: number;
    name: string;
    email: string;
    role_id: number;
    permissions?: string[];
}

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
    const [permissions, setPermissions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if(storedUser && storedToken) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setToken(storedToken);
            setPermissions(parsedUser.permissions || []);
        }

        setIsLoading(false);
    }, []);

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
        setPermissions(newUser.permissions || []);
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setPermissions([]);
    }

    const hasPermission = (permission: string): boolean => {
        return permissions.includes(permission);
    }

    const hasAnyPermission = (requiredPermissions: string[]): boolean => {
        return requiredPermissions.some(permission => permissions.includes(permission));
    }

    const hasAllPermissions = (requiredPermissions: string[]): boolean => {
        return requiredPermissions.every(permission => permissions.includes(permission));
    }

    return (
        <AuthContext.Provider value={{user, token, isLoading, permissions, login, logout, hasPermission, hasAnyPermission, hasAllPermissions}}>
            {children}
        </AuthContext.Provider>
    )
}