import type { ReactNode } from "react";
import { Modal } from "@/shared/components/Modal";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    isLoading?: boolean;
    variant?: "default" | "destructive";
    children?: ReactNode;
}

export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    onConfirm,
    isLoading = false,
    variant = "default",
    children,
}: ConfirmDialogProps) {
    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title={title}
            description={description}
            footer={
                <>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        {cancelLabel}
                    </Button>
                    <Button type="button" variant={variant} onClick={onConfirm} disabled={isLoading}>
                        {isLoading && <Spinner className="size-4" />}
                        {confirmLabel}
                    </Button>
                </>
            }
        >
            {children}
        </Modal>
    );
}
