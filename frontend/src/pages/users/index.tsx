import { useCallback, useMemo, useState } from "react";
import { Button } from "@/shared/ui/button";
import { DataTable } from "@/shared/components/DataTable";
import { Alert } from "@/shared/components/Alert";
import { createColumns } from "./columns";
import { UserFormModal, DeleteUserDialog } from "@/features/users";
import { useUsers, type User as UserType } from "@/entities/user";
import { Spinner } from "@/shared/ui/spinner";

import PageHeader from "@/shared/components/PageHeader";

type ModalState =
    | { type: "create" }
    | { type: "edit"; user: UserType }
    | { type: "delete"; user: UserType }
    | null;

export default function Users() {
    const { data: users = [], isLoading, error, refetch } = useUsers();
    const [modal, setModal] = useState<ModalState>(null);

    const openCreateModal = useCallback(() => setModal({ type: "create" }), []);
    const openEditModal = useCallback((user: UserType) => setModal({ type: "edit", user }), []);
    const openDeleteDialog = useCallback((user: UserType) => setModal({ type: "delete", user }), []);
    const closeModal = useCallback(() => setModal(null), []);

    const columns = useMemo(() => createColumns(openEditModal, openDeleteDialog), [openEditModal, openDeleteDialog]);

    const isFormOpen = modal?.type === "create" || modal?.type === "edit";
    const isDeleteOpen = modal?.type === "delete";

    return (
        <div className="flex-1 space-y-6">
            {/* Page Header */}
            <PageHeader
                title="Users"
                description="Manage all system users">
                <Button size="lg" onClick={openCreateModal}>Add User</Button>
            </PageHeader>

            {/* User Table */}
            {isLoading ? (
                <div className="flex h-48 items-center justify-center rounded-md border">
                    <Spinner className="size-8" />
                </div>
            ) : error ? (
                <Alert className="flex flex-col items-start gap-2">
                    <span>Failed to load users.</span>
                    <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
                </Alert>
            ) : (
                <DataTable columns={columns} data={users} />
            )}

            {isFormOpen && (
                <UserFormModal
                    key={modal?.type === "edit" ? modal.user.id : "new"}
                    open={isFormOpen}
                    onOpenChange={(open) => !open && closeModal()}
                    user={modal?.type === "edit" ? modal.user : null}
                    onSuccess={closeModal}
                />
            )}

            {isDeleteOpen && (
                <DeleteUserDialog
                    open={isDeleteOpen}
                    onOpenChange={(open) => !open && closeModal()}
                    user={modal?.type === "delete" ? modal.user : null}
                    onSuccess={closeModal}
                />
            )}
        </div>
    );
}
