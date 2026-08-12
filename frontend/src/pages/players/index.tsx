import { useCallback, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { DataTable } from "@/shared/components/DataTable";
import { Alert } from "@/shared/components/Alert";
import { createColumns } from "./columns";
import { PlayerFormModal, DeletePlayerDialog } from "@/features/players";
import { usePlayers, type Player } from "@/entities/player";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { Spinner } from "@/shared/ui/spinner";

import PageHeader from "@/shared/components/PageHeader";

type ModalState =
    | { type: "create" }
    | { type: "edit"; player: Player }
    | { type: "delete"; player: Player }
    | null;

export default function Players() {
    const [modal, setModal] = useState<ModalState>(null);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const search = useDebouncedValue(searchInput, 400);

    // Reset to page 1 as soon as the user starts a new search — no need to
    // wait for the debounce, since only the API query itself is debounced.
    const handleSearchChange = useCallback((value: string) => {
        setSearchInput(value);
        setPage(1);
    }, []);

    const { data, isLoading, error, refetch } = usePlayers({ page, search });
    const players = data?.data ?? [];
    const meta = data?.meta;

    const openCreateModal = useCallback(() => setModal({ type: "create" }), []);
    const openEditModal = useCallback((player: Player) => setModal({ type: "edit", player }), []);
    const openDeleteDialog = useCallback((player: Player) => setModal({ type: "delete", player }), []);
    const closeModal = useCallback(() => setModal(null), []);

    const columns = useMemo(() => createColumns(openEditModal, openDeleteDialog), [openEditModal, openDeleteDialog]);

    const isFormOpen = modal?.type === "create" || modal?.type === "edit";
    const isDeleteOpen = modal?.type === "delete";

    return (
        <div className="flex-1 space-y-6">
            {/* Page Header */}
            <PageHeader
                title="Players"
                description="Manage all registered players">
                <Button size="lg" onClick={openCreateModal}>Add Player</Button>
            </PageHeader>

            {/* Player Table */}
            {isLoading ? (
                <div className="flex h-48 items-center justify-center rounded-md border">
                    <Spinner className="size-8" />
                </div>
            ) : error ? (
                <Alert className="flex flex-col items-start gap-2">
                    <span>Failed to load players.</span>
                    <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
                </Alert>
            ) : (
                <DataTable
                    columns={columns}
                    data={players}
                    toolbar={
                        <div className="relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by name..."
                                value={searchInput}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="pl-9"
                                aria-label="Search players by name"
                            />
                        </div>
                    }
                    pagination={
                        meta
                            ? { page: meta.current_page, lastPage: meta.last_page, onPageChange: setPage }
                            : undefined
                    }
                />
            )}

            {isFormOpen && (
                <PlayerFormModal
                    key={modal?.type === "edit" ? modal.player.id : "new"}
                    open={isFormOpen}
                    onOpenChange={(open) => !open && closeModal()}
                    player={modal?.type === "edit" ? modal.player : null}
                    onSuccess={closeModal}
                />
            )}

            {isDeleteOpen && (
                <DeletePlayerDialog
                    open={isDeleteOpen}
                    onOpenChange={(open) => !open && closeModal()}
                    player={modal?.type === "delete" ? modal.player : null}
                    onSuccess={closeModal}
                />
            )}
        </div>
    );
}
