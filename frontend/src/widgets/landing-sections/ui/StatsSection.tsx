const stats = [
    { label: "Sports supported", value: "5+", description: "Basketball to chess, one system" },
    { label: "Roles",            value: "4",  description: "Chairman, handler, player, public" },
    { label: "Source of truth",  value: "1",  description: "No drifting spreadsheets" },
    { label: "Manual standings", value: "0",  description: "Calculated the moment a result is in" },
];

export default function StatsSection() {
    return (
        <section className="border-b border-border bg-background py-16">
            <div className="mx-auto max-w-5xl px-6">
                <p className="mb-10 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    What's inside
                </p>
                <div className="grid grid-cols-2 divide-y divide-border md:grid-cols-4 md:divide-x md:divide-y-0">
                    {stats.map((stat, index) => (
                        <div key={index} className="px-2 py-6 first:pl-0 md:px-8">
                            <div className="font-display text-4xl font-extrabold tabular-nums text-foreground md:text-5xl">
                                {stat.value}
                            </div>
                            <div className="mt-2 font-sans text-sm font-semibold text-foreground">{stat.label}</div>
                            <div className="mt-0.5 font-sans text-xs text-muted-foreground">{stat.description}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
