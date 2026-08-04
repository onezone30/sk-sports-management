import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { notify } from "@/shared/lib/alerts";
import { useDeleteUser } from "../model/useUserMutations";
import type { User } from "@/entities/user";

interface DeleteUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
    onSuccess: () => void;
}

export function DeleteUserDialog({ open, onOpenChange, user, onSuccess }: DeleteUserDialogProps) {
    const deleteUser = useDeleteUser();

    const handleConfirm = () => {
        if (!user) return;

        deleteUser.mutate(user.id, {
            onSuccess: () => {
                onSuccess();
                notify.success("User deleted");
            },
        });
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
