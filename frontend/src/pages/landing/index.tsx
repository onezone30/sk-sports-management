import {
    HeroSection,
    StatsSection,
    FeaturesSection,
    AudienceSection,
    CTASection,
} from "@/widgets/landing-sections";
import { Footer } from "@/widgets/footer";

export default function Landing() {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <HeroSection />
            <StatsSection />
            <FeaturesSection />
            <AudienceSection />
            <CTASection />
            <Footer />
        </div>
    );
}
