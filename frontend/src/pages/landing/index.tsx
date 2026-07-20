import HeroSection from "../components/HeroSection";
import StatsSection from "../components/StatsSection";
import FeaturesSection from "../components/FeaturesSection";
import TestimonialsSection from "../components/TestimonialSection";
import CTASection from "../components/CTASection";
import Footer from "@/components/shared/Footer";

export default function Landing() {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <HeroSection />
            <StatsSection />
            <FeaturesSection />
            <TestimonialsSection />
            <CTASection />
            <Footer />
        </div>
    );
}
