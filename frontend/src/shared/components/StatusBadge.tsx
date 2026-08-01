import { Badge } from "@/shared/ui/badge";

interface StatusBadgeProps {
    status: string;
}


// Keys match the lowercase values the API emits (see ActiveStatus enum on the backend).
const statusConfig: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
    active: "default",
    inactive: "outline",
    archived: "secondary",
    done: "default",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    const variant = statusConfig[status] || "default";

    return (
        <Badge variant={variant} className="capitalize">
            {status}
        </Badge>
    );
}