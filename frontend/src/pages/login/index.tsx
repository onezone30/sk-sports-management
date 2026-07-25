import skLogo from "@/shared/assets/sk_logo.png";
import { Footer } from "@/widgets/footer";
import { LoginForm } from "@/features/auth";

const LEAGUE_TICKER = [
    { sport: "Basketball", detail: "Hawks 78–74 Wolves · Q4 2:14", live: true },
    { sport: "Chess", detail: "Round 4 in progress", live: true },
    { sport: "Mobile Legends", detail: "Group B standings updated", live: false },
] as const;

export default function LoginPage() {
    return (
        <>
            <div className="grid min-h-[calc(100svh-3.5rem)] w-full lg:grid-cols-2">
                <div className="flex flex-col justify-between bg-foreground px-6 py-12 lg:px-12 lg:py-16">
                    <div>
                        <img src={skLogo} alt="SK Sports" className="h-10 w-auto" />

                        <p className="mt-8 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-background/60">
                            SK Sports — Multi-Sport League Platform
                        </p>

                        <h2 className="mt-4 font-display text-3xl font-extrabold leading-[0.95] tracking-tight text-background md:text-5xl">
                            Back in the{" "}
                            <span className="relative z-0 inline-block">
                                game
                                <span className="absolute inset-x-0 bottom-1 -z-10 h-3 bg-secondary md:bottom-2 md:h-4" />
                            </span>
                            .
                        </h2>

                        <p className="mt-6 max-w-sm font-sans text-sm leading-relaxed text-background/70 lg:text-base">
                            Sign in to pick up your season — rosters, schedules, and
                            standings, right where you left them.
                        </p>
                    </div>

                    <div className="mt-16 border-t border-background/10 pt-6 lg:mt-0">
                        <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-background/40">
                            Live across the league
                        </p>

                        <div className="relative mt-3 h-5">
                            {LEAGUE_TICKER.map((item, index) => (
                                <div
                                    key={item.sport}
                                    className="animate-ticker-fade absolute inset-0 flex items-center gap-2"
                                    style={{ animationDelay: `${index * 3}s` }}
                                >
                                    <span
                                        className={
                                            item.live
                                                ? "h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-secondary"
                                                : "h-1.5 w-1.5 shrink-0 rounded-full bg-background/30"
                                        }
                                    />
                                    <p className="truncate font-sans text-sm tabular-nums text-background/70">
                                        <span className="font-semibold text-background">
                                            {item.sport}
                                        </span>{" "}
                                        · {item.detail}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center bg-background px-6 py-12">
                    <LoginForm />
                </div>
            </div>

            <Footer />
        </>
    );
}
