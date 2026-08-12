import type { Status } from "@/shared/components/StatusBadge";

export interface VenueImage {
    id: number;
    url: string;
    is_primary: boolean;
}

export interface Venue {
    id: number;
    name: string;
    address_line?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
    capacity?: number | null;
    status?: Status | null;
    description?: string | null;
    images: VenueImage[];
    created_at?: string;
}
