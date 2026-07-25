import type { LucideIcon } from "lucide-react";

interface FeaturedCardProps {
    index: number;
    title: string;
    description: string;
    icon: LucideIcon;
}

export default function FeaturedCard({ index, title, description, icon: Icon }: FeaturedCardProps) {
    return (
        <div className="group grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-2 border-b border-border py-8 last:border-b-0 md:grid-cols-[3rem_1fr_2fr] md:items-center">
            <span className="font-display text-sm font-bold text-muted-foreground">
                {String(index).padStart(2, "0")}
            </span>

            <h3 className="flex items-center gap-3 font-display text-xl font-bold text-foreground md:text-2xl">
                <Icon className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" aria-hidden="true" />
                {title}
                <span className="ml-1 inline-block h-2 w-2 scale-0 rounded-full bg-secondary transition-transform group-hover:scale-100" />
            </h3>

            <p className="col-span-2 font-sans text-sm leading-relaxed text-muted-foreground md:col-span-1">
                {description}
            </p>
        </div>
    );
}
