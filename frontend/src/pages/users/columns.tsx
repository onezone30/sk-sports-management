import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/shared/ui/button";
import StatusBadge from "@/shared/components/StatusBadge";
import type { User } from "@/entities/user";

export const createColumns = (
    onEdit: (user: User) => void,
    onDelete: (user: User) => void,
): ColumnDef<User>[] => [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        id: "role",
        accessorFn: (row) => row.role?.name ?? "—",
        header: "Role",
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
                    aria-label={`Edit ${row.original.name}`}
                >
                    Edit
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(row.original)}
                    aria-label={`Delete ${row.original.name}`}
                >
                    Delete
                </Button>
            </div>
        ),
    },
]