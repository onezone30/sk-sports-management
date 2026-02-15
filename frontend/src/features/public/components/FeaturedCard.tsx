import { Card, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import type { LucideIcon } from "lucide-react"; // Note the 'type' import to fix your error

interface FeaturedCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
}

export default function FeaturedCard({ title, description, icon: Icon, color }: FeaturedCardProps) {
    return (
        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-slate-200">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-slate-50 opacity-50 transition-transform group-hover:scale-150" />
            <CardHeader className="relative z-10">
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-slate-50 ${color}`}>
                    <Icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">{title}</CardTitle>
                <CardDescription className="text-slate-600 pt-2 text-sm leading-relaxed">
                    {description}
                </CardDescription>
            </CardHeader>
        </Card>
    );
}