import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { notify } from "@/shared/lib/alerts";
import { useDeleteVenue } from "../model/useVenueMutations";
import type { Venue } from "@/entities/venue";

interface DeleteVenueDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    venue: Venue | null;
    onSuccess: () => void;
}

export function DeleteVenueDialog({ open, onOpenChange, venue, onSuccess }: DeleteVenueDialogProps) {
    const deleteVenue = useDeleteVenue();

    const handleConfirm = () => {
        if (!venue) return;

        deleteVenue.mutate(venue.id, {
            onSuccess: () => {
                onSuccess();
                notify.success("Venue deleted");
            },
        });
    };

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Delete Venue"
            description={venue ? `Are you sure you want to delete "${venue.name}"? This cannot be undone.` : undefined}
            confirmLabel="Delete"
            variant="destructive"
            isLoading={deleteVenue.isPending}
            onConfirm={handleConfirm}
        />
    );
}
