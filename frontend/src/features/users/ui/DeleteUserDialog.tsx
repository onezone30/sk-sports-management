import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { Alert } from "@/shared/components/Alert";
import { useFormErrors } from "@/shared/hooks/useFormErrors";
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
    const { formError, handleError, reset } = useFormErrors();

    const handleConfirm = async () => {
        if (!user) return;
        reset();

        try {
            await deleteUser.mutateAsync(user.id);
            onSuccess();
        } catch (err) {
            handleError(err);
        }
    };

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={(next) => {
                if (next === false) reset();
                onOpenChange(next);
            }}
            title="Delete User"
            description={user ? `Are you sure you want to delete "${user.name}"? This cannot be undone.` : undefined}
            confirmLabel="Delete"
            variant="destructive"
            isLoading={deleteUser.isPending}
            onConfirm={handleConfirm}
        >
            {formError && <Alert>{formError}</Alert>}
        </ConfirmDialog>
    );
}
