export interface Role {
    id: number;
    name: string;
    description?: string | null;
    status?: "active" | "inactive" | "archived" | "done";
}
