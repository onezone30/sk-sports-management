import { Users, Calendar, Trophy, Target, Zap, Shield } from "lucide-react";
import FeaturedCard from "./FeaturedCard";
import type { FeatureVariant } from "./FeaturedCard";

const features: { title: string; description: string; icon: typeof Users; variant: FeatureVariant }[] = [
    {
        title: "Team Management",
        description: "Effortlessly manage player rosters, profiles, and staff roles in one central database.",
        icon: Users,
        variant: "blue",
    },
    {
        title: "Smart Scheduling",
        description: "Coordinate matches, trainings, and team events with automated conflict detection.",
        icon: Calendar,
        variant: "green",
    },
    {
        title: "Stats & Analytics",
        description: "Track player performance, match outcomes, and generate professional reports.",
        icon: Trophy,
        variant: "yellow",
    },
    {
        title: "Goal Tracking",
        description: "Set season objectives for the team and monitor progress in real-time.",
        icon: Target,
        variant: "purple",
    },
    {
        title: "Instant Alerts",
        description: "Send push notifications and email updates to players and parents instantly.",
        icon: Zap,
        variant: "orange",
    },
    {
        title: "Bank-Grade Security",
        description: "Your data is encrypted and protected with enterprise-level security protocols.",
        icon: Shield,
        variant: "red",
    },
];

export default function FeaturesSection() {
    return (
        <section id="features" className="bg-slate-50 px-4 py-24 md:py-32">
            <div className="mx-auto max-w-6xl">
                <div className="mb-16 text-center">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">Features</p>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                        Everything you need to <span className="text-blue-600">win</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
                        A complete toolkit designed to help coaches and managers focus on the game, not the paperwork.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <FeaturedCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
}
