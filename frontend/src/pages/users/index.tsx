import { useEffect, useState } from "react";
import PageHeader from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";
import { DataTable } from "@/shared/components/DataTable";
import { columns } from "./columns";
import api from "@/shared/api/client";
import type { User as UserType } from "@/entities/user";
import { Spinner } from "@/shared/ui/spinner";


export default function Users() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await api.get("/users");
                const payload = response.data;

                if (Array.isArray(payload)) {
                    setUsers(payload);
                } else if (Array.isArray(payload?.data)) {
                    setUsers(payload.data);
                } else {
                    setUsers([]);
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load users.");
                setUsers([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="flex-1 space-y-6">
            {/* Page Header */}
            <PageHeader 
                title="Users"
                description="Manage all system users">
                <Button size="lg">Add User</Button>
            </PageHeader>

            {/* User Table */}
            {error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="flex h-48 items-center justify-center rounded-md border">
                    <Spinner className="size-8" />
                </div>
            ) : (
                <DataTable columns={columns} data={users} />
            )}
        </div>
    );
}