import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/shared/ui/button";
import StatusBadge from "@/shared/components/StatusBadge";
import type { Venue } from "@/entities/venue";

export const createColumns = (
    onEdit: (venue: Venue) => void,
    onDelete: (venue: Venue) => void,
): ColumnDef<Venue>[] => [
    {
        id: "thumbnail",
        header: "",
        cell: ({ row }) => {
            const primary = row.original.images[0];
            return primary ? (
                <img src={primary.url} alt="" className="size-10 rounded object-cover" />
            ) : (
                <div className="size-10 rounded bg-muted" />
            );
        },
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        id: "location",
        accessorFn: (row) => [row.city, row.state].filter(Boolean).join(", ") || "—",
        header: "Location",
    },
    {
        accessorKey: "capacity",
        header: "Capacity",
        cell: ({ row }) => row.original.capacity ?? "—",
    },
    {
        id: "status",
        header: "Status",
        cell: ({ row }) => row.original.status ? <StatusBadge status={row.original.status} /> : "—",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(row.original)} aria-label={`Edit ${row.original.name}`}>
                    Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(row.original)} aria-label={`Delete ${row.original.name}`}>
                    Delete
                </Button>
            </div>
        ),
    },
];
