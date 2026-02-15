import HeroSection from "../components/HeroSection";
import FeaturedCard from "../components/FeaturedCard";
import StatsSection from "../components/StatsSection";
import TestimonialsSection from "../components/TestimonialSection";
import CTASection from "../components/CTASection";
import Footer from "../../../components/layouts/Footer";
import { Users, Calendar, Trophy, Target, Zap, Shield } from "lucide-react";

const features = [
    {
        title: "Team Management",
        description: "Effortlessly manage player rosters, profiles, and staff roles in one central database.",
        icon: Users,
        color: "text-blue-600",
    },
    {
        title: "Smart Scheduling",
        description: "Coordinate matches, trainings, and team events with automated conflict detection.",
        icon: Calendar,
        color: "text-green-600",
    },
    {
        title: "Stats & Analytics",
        description: "Track player performance, match outcomes, and generate professional reports.",
        icon: Trophy,
        color: "text-yellow-600",
    },
    {
        title: "Goal Tracking",
        description: "Set season objectives for the team and monitor progress in real-time.",
        icon: Target,
        color: "text-purple-600",
    },
    {
        title: "Instant Alerts",
        description: "Send push notifications and email updates to players and parents instantly.",
        icon: Zap,
        color: "text-orange-600",
    },
    {
        title: "Bank-Grade Security",
        description: "Your data is encrypted and protected with enterprise-level security protocols.",
        icon: Shield,
        color: "text-red-600",
    },
];

export default function Landing() {
    return (
        <div className="flex min-h-screen w-full flex-col font-sans">

            <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50">
                <HeroSection />
            </div>

            <StatsSection />

            <section id="features" className="bg-white px-4 py-24 md:py-32">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                            Everything you need to <span className="text-blue-600">win</span>
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                            A complete toolkit designed to help coaches and managers focus on the game, not the paperwork.
                        </p>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <FeaturedCard key={index} {...feature} />
                        ))}
                    </div>
                </div>
            </section>

            <TestimonialsSection />

            <CTASection />

            <Footer />
        </div>
    );
}