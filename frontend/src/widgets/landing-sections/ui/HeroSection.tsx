export default function HeroSection() {
    return (
        <section className="bg-foreground px-6 pb-20 pt-28 md:pb-28 md:pt-40">
            <div className="mx-auto max-w-5xl">
                <p className="mb-6 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-background/60">
                    SK Sports — Multi-Sport League Platform
                </p>

                <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-background md:text-7xl">
                    Run the whole season.
                    <br />
                    Not the{" "}
                    <span className="relative inline-block">
                        spreadsheet
                        <span className="absolute inset-x-0 bottom-1 -z-10 h-3 bg-secondary md:bottom-2 md:h-5" />
                    </span>
                    .
                </h1>

                <p className="mt-8 max-w-xl font-sans text-lg leading-relaxed text-background/70">
                    Seasons, divisions, rosters, schedules, and standings — one system
                    for every sport you run, from basketball to chess to Mobile Legends.
                </p>
            </div>
        </section>
    );
}
