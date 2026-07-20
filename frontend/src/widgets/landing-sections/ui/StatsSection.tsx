const stats = [
    { label: "Active Teams",       value: "500+",  description: "Across all divisions" },
    { label: "Matches Scheduled",  value: "10k+",  description: "Every season"         },
    { label: "Players Managed",    value: "25k+",  description: "And counting"          },
    { label: "Hours Saved",        value: "100k+", description: "Per year, per club"    },
];

export default function StatsSection() {
    return (
        <section className="border-y border-slate-200 bg-white py-16">
            <div className="mx-auto max-w-6xl px-4">
                <p className="mb-10 text-center text-sm font-semibold uppercase tracking-widest text-blue-600">
                    By the numbers
                </p>
                <div className="grid grid-cols-2 divide-y divide-slate-100 md:grid-cols-4 md:divide-x md:divide-y-0">
                    {stats.map((stat, index) => (
                        <div key={index} className="px-8 py-4 text-center">
                            <div className="text-4xl font-extrabold text-slate-900 md:text-5xl">{stat.value}</div>
                            <div className="mt-1 text-sm font-semibold text-slate-700">{stat.label}</div>
                            <div className="mt-0.5 text-xs text-slate-400">{stat.description}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
