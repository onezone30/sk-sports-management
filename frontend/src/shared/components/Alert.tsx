import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface AlertProps {
    children: ReactNode;
    className?: string;
}

/** Inline error/warning banner. Announced to screen readers via role="alert". */
export function Alert({ children, className }: AlertProps) {
    return (
        <div
            role="alert"
            className={cn(
                "rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive",
                className
            )}
        >
            {children}
        </div>
    );
}
