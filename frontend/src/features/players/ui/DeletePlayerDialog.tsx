import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { notify } from "@/shared/lib/alerts";
import { useDeletePlayer } from "../model/usePlayerMutations";
import type { Player } from "@/entities/player";

interface DeletePlayerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    player: Player | null;
    onSuccess: () => void;
}

export function DeletePlayerDialog({ open, onOpenChange, player, onSuccess }: DeletePlayerDialogProps) {
    const deletePlayer = useDeletePlayer();

    const handleConfirm = () => {
        if (!player) return;

        deletePlayer.mutate(player.id, {
            onSuccess: () => {
                onSuccess();
                notify.success("Player deleted");
            },
            // On failure (e.g. 409 — player has recorded stats), the global
            // mutation error toast (queryClient.ts) already surfaces the
            // backend's message. Leave the dialog open so the user sees it
            // land and can reconsider, rather than closing on failure.
        });
    };

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Delete Player"
            description={player ? `Are you sure you want to delete "${player.full_name}"? This cannot be undone.` : undefined}
            confirmLabel="Delete"
            variant="destructive"
            isLoading={deletePlayer.isPending}
            onConfirm={handleConfirm}
        />
    );
}
