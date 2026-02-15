export default function StatsSection() {
  const stats = [
    { label: "Active Teams", value: "500+", color: "text-blue-600" },
    { label: "Matches Scheduled", value: "10k+", color: "text-indigo-600" },
    { label: "Players Managed", value: "25k+", color: "text-purple-600" },
    { label: "Hours Saved", value: "100k+", color: "text-pink-600" },
  ];

  return (
    <section className="border-y border-slate-200 bg-slate-50 py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-4xl font-extrabold ${stat.color} md:text-5xl`}>
                {stat.value}
              </div>
              <div className="mt-2 text-sm font-medium uppercase tracking-wide text-slate-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}