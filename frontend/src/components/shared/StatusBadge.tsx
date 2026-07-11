import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
    status: string;
}


const statusConfig: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
    Active: "default",
    Pending: "secondary",
    Inactive: "outline",
    // You can easily add more global statuses here later!
    Suspended: "destructive",
    Completed: "default",
    Cancelled: "destructive",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    const variant = statusConfig[status] || "default";

    return (
        <Badge variant={variant}>
            {status}
        </Badge>  
    );
}