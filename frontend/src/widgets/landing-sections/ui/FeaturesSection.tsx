import { Layers, Users, CalendarClock, Trophy, TrendingUp, Shield } from "lucide-react";
import FeaturedCard from "./FeaturedCard";

const features: { title: string; description: string; icon: typeof Users }[] = [
    {
        title: "Seasons & Divisions",
        description: "Set up a season, choose which sports are in play, and organize each one into divisions by age or skill level.",
        icon: Layers,
    },
    {
        title: "Team Rosters",
        description: "Register teams and players, and keep jersey numbers, captains, and active status current for everyone.",
        icon: Users,
    },
    {
        title: "Game Scheduling",
        description: "Schedule games per division and track each one from scheduled to finished.",
        icon: CalendarClock,
    },
    {
        title: "Stats Per Sport",
        description: "Track the numbers that matter for each sport — points and rebounds, or kills and assists.",
        icon: Trophy,
    },
    {
        title: "Automatic Standings",
        description: "Rankings update themselves the moment a result comes in. Nobody recalculates a table by hand.",
        icon: TrendingUp,
    },
    {
        title: "Role-Based Access",
        description: "Chairmen, handlers, players, and the public each see exactly what's relevant to them — same data, no drift.",
        icon: Shield,
    },
];

export default function FeaturesSection() {
    return (
        <section id="features" className="border-b border-border bg-background px-6 py-24 md:py-32">
            <div className="mx-auto max-w-5xl">
                <div className="mb-16 max-w-2xl">
                    <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Index
                    </p>
                    <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                        Everything a season needs
                    </h2>
                    <p className="mt-4 font-sans text-lg text-muted-foreground">
                        From setting up the competition to the final standings — one system, start to finish.
                    </p>
                </div>

                <div className="border-t border-border">
                    {features.map((feature, index) => (
                        <FeaturedCard key={feature.title} index={index + 1} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
}
