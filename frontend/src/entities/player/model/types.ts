import type { Status } from "@/shared/components/StatusBadge";

/** Mirrors App\Enums\Gender on the backend. */
export interface Gender {
    value: "male" | "female";
    label: string;
}

export interface Player {
    id: number;
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    suffix?: string | null;
    full_name: string;
    date_of_birth: string;
    age: number;
    gender: Gender;
    email?: string | null;
    phone?: string | null;
    emergency_contact_name?: string | null;
    emergency_contact_phone?: string | null;
    status?: Status | null;
    created_at?: string;
}
