import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/shared/ui/button";
import StatusBadge from "@/shared/components/StatusBadge";
import type { Player } from "@/entities/player";

export const createColumns = (
    onEdit: (player: Player) => void,
    onDelete: (player: Player) => void,
): ColumnDef<Player>[] => [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "full_name",
        header: "Name",
    },
    {
        accessorKey: "age",
        header: "Age",
    },
    {
        id: "gender",
        accessorFn: (row) => row.gender?.label ?? "—",
        header: "Gender",
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
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(row.original)}
                    aria-label={`Edit ${row.original.full_name}`}
                >
                    Edit
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(row.original)}
                    aria-label={`Delete ${row.original.full_name}`}
                >
                    Delete
                </Button>
            </div>
        ),
    },
]
