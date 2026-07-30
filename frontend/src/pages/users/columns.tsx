import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/shared/ui/button";
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
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(row.original)}>
                    Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(row.original)}>
                    Delete
                </Button>
            </div>
        ),
    },
]