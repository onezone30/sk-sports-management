import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useDeleteUser } from "../model/useUsers";
import type { User } from "@/entities/user";

interface DeleteUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
    onSuccess: () => void;
}

export function DeleteUserDialog({ open, onOpenChange, user, onSuccess }: DeleteUserDialogProps) {
    const deleteUser = useDeleteUser();

    const handleConfirm = async () => {
        if (!user) return;

        try {
            await deleteUser.mutateAsync(user.id);
            onSuccess();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Delete User"
            description={user ? `Are you sure you want to delete "${user.name}"? This cannot be undone.` : undefined}
            confirmLabel="Delete"
            variant="destructive"
            isLoading={deleteUser.isPending}
            onConfirm={handleConfirm}
        />
    );
}
