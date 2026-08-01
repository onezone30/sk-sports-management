import { Badge } from "@/shared/ui/badge";

export type BadgeVariant = "default" | "secondary" | "outline" | "destructive";

/** Mirrors App\Enums\Status on the backend. */
export interface Status {
    value: string;
    label: string;
    variant: BadgeVariant;
}

interface StatusBadgeProps {
    status: Status;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    return <Badge variant={status.variant}>{status.label}</Badge>;
}
