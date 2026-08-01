import type { Status } from "@/shared/components/StatusBadge";

export interface Role {
    id: number;
    name: string;
    description?: string | null;
    status?: Status | null;
}
