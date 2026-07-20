import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
    return (
        <section className="relative isolate overflow-hidden bg-blue-700 px-4 py-24">
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[64px_64px]" />
            <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-500 opacity-20 blur-3xl" />
            <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-500 opacity-20 blur-3xl" />

            <div className="mx-auto max-w-4xl text-center">
                <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-200">Get Started</p>
                <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                    Ready to transform your team?
                </h2>
                <p className="mx-auto mb-10 max-w-xl text-lg text-blue-100">
                    Join hundreds of coaches saving time and winning more games.
                    Start your 14-day free trial — no credit card required.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button asChild size="lg" className="h-12 bg-white px-8 font-bold text-blue-700 shadow-lg hover:bg-blue-50">
                        <Link to="/login">
                            Get Started Free
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="h-12 border-blue-400 bg-transparent px-8 text-white hover:bg-white/10 hover:text-white">
                        <Link to="/contact">
                            Talk to Sales
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
