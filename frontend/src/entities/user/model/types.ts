export interface UserRole {
    id: number;
    name: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role?: UserRole;
    role_id?: number;
    status?: string;
    created_at?: string;
    permissions?: string[];
}