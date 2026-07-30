import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { DataTable } from "@/shared/components/DataTable";
import { createColumns } from "./columns";
import { UserFormModal, DeleteUserDialog, useUsers } from "@/features/users";
import type { User as UserType } from "@/entities/user";
import { Spinner } from "@/shared/ui/spinner";

import PageHeader from "@/shared/components/PageHeader";



export default function Users() {
    const { data: users = [], isLoading, error } = useUsers();
    const [editingUser, setEditingUser] = useState<UserType | null>(null);
    const [deletingUser, setDeletingUser] = useState<UserType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const openCreateModal = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const openEditModal = (user: UserType) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const openDeleteDialog = (user: UserType) => {
        setDeletingUser(user);
        setIsDeleteOpen(true);
    };

    const handleSuccess = () => {
        setIsModalOpen(false);
    };

    const handleDeleteSuccess = () => {
        setIsDeleteOpen(false);
    };

    return (
        <div className="flex-1 space-y-6">
            {/* Page Header */}
            <PageHeader
                title="Users"
                description="Manage all system users">
                <Button size="lg" onClick={openCreateModal}>Add User</Button>
            </PageHeader>

            {/* User Table */}
            {error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    Failed to load users.
                </div>
            )}

            {isLoading ? (
                <div className="flex h-48 items-center justify-center rounded-md border">
                    <Spinner className="size-8" />
                </div>
            ) : (
                <DataTable columns={createColumns(openEditModal, openDeleteDialog)} data={users} />
            )}

            <UserFormModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                user={editingUser}
                onSuccess={handleSuccess}
            />

            <DeleteUserDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                user={deletingUser}
                onSuccess={handleDeleteSuccess}
            />
        </div>
    );
}
