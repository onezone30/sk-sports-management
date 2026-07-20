import { Card, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import type { LucideIcon } from "lucide-react";

export type FeatureVariant = "blue" | "green" | "yellow" | "purple" | "orange" | "red";

const variantStyles: Record<FeatureVariant, { iconBg: string; iconColor: string; accentBg: string }> = {
    blue:   { iconBg: "bg-blue-50",   iconColor: "text-blue-600",   accentBg: "bg-blue-500"   },
    green:  { iconBg: "bg-green-50",  iconColor: "text-green-600",  accentBg: "bg-green-500"  },
    yellow: { iconBg: "bg-yellow-50", iconColor: "text-yellow-600", accentBg: "bg-yellow-500" },
    purple: { iconBg: "bg-purple-50", iconColor: "text-purple-600", accentBg: "bg-purple-500" },
    orange: { iconBg: "bg-orange-50", iconColor: "text-orange-600", accentBg: "bg-orange-500" },
    red:    { iconBg: "bg-red-50",    iconColor: "text-red-600",    accentBg: "bg-red-500"    },
};

interface FeaturedCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    variant: FeatureVariant;
}

export default function FeaturedCard({ title, description, icon: Icon, variant }: FeaturedCardProps) {
    const styles = variantStyles[variant];
    return (
        <Card className="group relative overflow-hidden border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className={`absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${styles.accentBg}`} />
            <CardHeader>
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${styles.iconBg} ${styles.iconColor}`}>
                    <Icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg font-bold text-slate-900">{title}</CardTitle>
                <CardDescription className="pt-1 text-sm leading-relaxed text-slate-500">
                    {description}
                </CardDescription>
            </CardHeader>
        </Card>
    );
}
