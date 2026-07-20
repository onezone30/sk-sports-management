export interface User {
    id: number;
    role_id?: number;
    name: string;
    email: string;
    permissions?: string[];
}