import { useCallback, useMemo, useState } from "react";
import { Button } from "@/shared/ui/button";
import { DataTable } from "@/shared/components/DataTable";
import { Alert } from "@/shared/components/Alert";
import { createColumns } from "./columns";
import { VenueFormModal, DeleteVenueDialog } from "@/features/venues";
import { useVenues, type Venue as VenueType } from "@/entities/venue";
import { Spinner } from "@/shared/ui/spinner";

import PageHeader from "@/shared/components/PageHeader";

type ModalState =
    | { type: "create" }
    | { type: "edit"; venue: VenueType }
    | { type: "delete"; venue: VenueType }
    | null;

export default function Venues() {
    const { data: venues = [], isLoading, error, refetch } = useVenues();
    const [modal, setModal] = useState<ModalState>(null);

    const openCreateModal = useCallback(() => setModal({ type: "create" }), []);
    const openEditModal = useCallback((venue: VenueType) => setModal({ type: "edit", venue }), []);
    const openDeleteDialog = useCallback((venue: VenueType) => setModal({ type: "delete", venue }), []);
    const closeModal = useCallback(() => setModal(null), []);

    const columns = useMemo(() => createColumns(openEditModal, openDeleteDialog), [openEditModal, openDeleteDialog]);

    const isFormOpen = modal?.type === "create" || modal?.type === "edit";
    const isDeleteOpen = modal?.type === "delete";

    return (
        <div className="flex-1 space-y-6">
            <PageHeader title="Venues" description="Manage all sports venues">
                <Button size="lg" onClick={openCreateModal}>Add Venue</Button>
            </PageHeader>

            {isLoading ? (
                <div className="flex h-48 items-center justify-center rounded-md border">
                    <Spinner className="size-8" />
                </div>
            ) : error ? (
                <Alert className="flex flex-col items-start gap-2">
                    <span>Failed to load venues.</span>
                    <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
                </Alert>
            ) : (
                <DataTable columns={columns} data={venues} />
            )}

            {isFormOpen && (
                <VenueFormModal
                    key={modal?.type === "edit" ? modal.venue.id : "new"}
                    open={isFormOpen}
                    onOpenChange={(open) => !open && closeModal()}
                    venue={modal?.type === "edit" ? modal.venue : null}
                    onSuccess={closeModal}
                />
            )}

            {isDeleteOpen && (
                <DeleteVenueDialog
                    open={isDeleteOpen}
                    onOpenChange={(open) => !open && closeModal()}
                    venue={modal?.type === "delete" ? modal.venue : null}
                    onSuccess={closeModal}
                />
            )}
        </div>
    );
}
