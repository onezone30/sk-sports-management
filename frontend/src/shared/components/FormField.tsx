import type { ReactNode } from "react";
import { Label } from "@/shared/ui/label";

interface FormFieldProps {
    id: string;
    label: ReactNode;
    error?: ReactNode;
    children: ReactNode;
}

export function FormField({ id, label, error, children }: FormFieldProps) {
    const errorId = `${id}-error`;

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            {children}
            {error && (
                <p id={errorId} role="alert" className="text-xs text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
}
