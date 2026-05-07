import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "../../types/user";

export const columns: ColumnDef<User>[] = [
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
        accessorKey: "role_id",
        header: "Role",
    },
    {
        accessorKey: "permissions",
        header: "Permissions",
        cell: ({ row }) => {
            const permissions = row.getValue("permissions") as string[] | undefined;

            if(!permissions || permissions.length === 0) {
                return <span className="text-muted-foreground text-xs italic">No permissions</span>

            }

            return (
                <div className="flex flex-wrap gap-1">
                    {permissions.map((permission) => (
                        <span 
                            key={permission} 
                            className="bg-gray-200 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
                        >
                            {permission}
                        </span>
                    ))}
                </div>
            )

        }
    },
]