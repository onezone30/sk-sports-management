import type { Status } from "@/shared/components/StatusBadge";

export interface UserRole {
    id: number;
    name: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role?: UserRole;
    status?: Status | null;
    created_at?: string;
    // Not populated yet — backend has no permission module. Once UserResource
    // returns it, this starts working with no frontend change.
    permissions?: string[];
}