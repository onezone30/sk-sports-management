import React from "react";

interface PageHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
}

export default function PageHeader({ title, description, children }: PageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    {title}
                </h1>
                {/* Only render the description if one is provided */}
                {description && (
                    <p className="text-slate-500 mt-1">
                        {description}
                    </p>
                )}
            </div>

            {/* Only render the action area if buttons are passed as children */}
            {children && (
                <div className="flex items-center gap-2">
                    {children}
                </div>
            )}
        </div>
    );
}