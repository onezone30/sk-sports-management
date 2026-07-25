import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
    return (
        <section className="bg-foreground px-6 py-24 md:py-28">
            <div className="mx-auto max-w-5xl">
                <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-background/60">
                    Get started
                </p>
                <h2 className="max-w-2xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-background md:text-5xl">
                    Ready to run your season on{" "}
                    <span className="relative inline-block">
                        one system
                        <span className="absolute inset-x-0 bottom-1 -z-10 h-3 bg-secondary md:bottom-2 md:h-4" />
                    </span>
                    ?
                </h2>
                <p className="mt-6 max-w-xl font-sans text-lg text-background/70">
                    Set it up once — rosters, schedules, and standings stay current
                    for the chairman, every handler, every player, and the public.
                </p>
                <div className="mt-10">
                    <Button asChild size="lg" variant="secondary" className="h-12 px-8 font-semibold">
                        <Link to="/login">
                            Get started
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
