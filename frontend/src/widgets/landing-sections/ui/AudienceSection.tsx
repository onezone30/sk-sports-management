const roles = [
    {
        name: "Chairman",
        description: "Sets up the season, chooses the sports, and oversees every division.",
    },
    {
        name: "Handler",
        description: "Runs one team — the roster, jersey numbers, and who's captain.",
    },
    {
        name: "Player",
        description: "Sees their team, schedule, and stats without asking anyone.",
    },
    {
        name: "Public",
        description: "Follows standings and results — no account needed.",
    },
];

export default function AudienceSection() {
    return (
        <section className="border-b border-border bg-background px-6 py-24">
            <div className="mx-auto max-w-5xl">
                <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Who it's for
                </p>
                <h2 className="max-w-2xl font-display text-2xl font-semibold leading-snug text-foreground md:text-3xl">
                    Four roles. One source of truth.
                </h2>

                <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-border pt-10 md:grid-cols-4">
                    {roles.map((role) => (
                        <div key={role.name}>
                            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                {role.name}
                            </p>
                            <p className="mt-3 font-sans text-sm leading-relaxed text-foreground">
                                {role.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
