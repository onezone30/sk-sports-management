import { Button } from "../../../components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
    return (
        <section className="relative isolate overflow-hidden py-24 px-4">
            {/* Colorful Gradient Background */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-600 via-red-900 to-yellow-500" />

            {/* Decorative Circles */}
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-white opacity-10 blur-3xl" />
            <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 h-96 w-96 rounded-full bg-yellow-400 opacity-20 blur-3xl" />

            <div className="mx-auto max-w-4xl text-center text-white">
                <h2 className="mb-6 text-4xl font-extrabold tracking-tight md:text-5xl">
                    Ready to transform your team?
                </h2>
                <p className="mb-10 text-lg text-blue-100 md:text-xl">
                    Join thousands of coaches who are saving time and winning more games.
                    Start your 14-day free trial today.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-bold text-blue-700 hover:bg-white">
                        Get Started Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button size="lg" variant="outline" className="h-14 border-white px-8 text-lg text-white hover:bg-white/10 hover:text-white">
                        Schedule a Demo
                    </Button>
                </div>
                <p className="mt-6 text-sm text-blue-200 opacity-80">
                    No credit card required. Cancel anytime.
                </p>
            </div>
        </section>
    );
}