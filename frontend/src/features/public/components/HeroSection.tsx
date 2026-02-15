import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";
import heroImage from "../../../assets/SK_background.png";

export default function HeroSection() {
    return (
        <section className="relative isolate w-full overflow-hidden px-4 py-32 md:py-40">

            <div className="absolute inset-0 -z-20">
                <img
                    src={heroImage}
                    alt="Sports Team Huddle"
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="absolute inset-0 -z-10 bg-gray-900/80" />

            <div className="mx-auto max-w-5xl text-center">

                <div className="flex justify-center">
                    <Badge variant="secondary" className="rounded-full px-4 py-1 text-sm font-medium text-blue-300 bg-blue-900/50 border border-blue-700 animate-in fade-in zoom-in duration-500">
                        ✨ The #1 Platform for Sports Clubs
                    </Badge>
                </div>

                <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white md:text-6xl lg:text-7xl">
                    Manage Your Sports Team
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                        Like a Pro
                    </span>
                </h1>

                <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-300 md:text-xl leading-relaxed">
                    Streamline your entire club's operations. From scheduling and roster management
                    to communication and stats—all in one secure place.
                </p>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button size="lg" className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-lg shadow-blue-500/20 transition-all">
                        Start Free Trial
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <Button size="lg" variant="outline" className="h-12 px-8 text-base border-gray-600 text-white hover:bg-white/10 hover:text-white bg-transparent">
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Watch Demo
                    </Button>
                </div>

                <p className="mt-8 text-sm text-gray-400 font-medium">
                    Trusted by over 500+ local sports clubs
                </p>
            </div>
        </section>
    );
}