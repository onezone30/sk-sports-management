import heroImage from "@/assets/SK_background.png";

export default function HeroSection() {
    return (
        <section className="relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden px-6">
            <div className="absolute inset-0 -z-20">
                <img src={heroImage} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="absolute inset-0 -z-10 bg-slate-950/65" />

            <h1 className="text-center text-5xl font-black leading-tight tracking-tight text-white md:text-7xl lg:text-8xl">
                SK Sports
                <span className="block text-blue-400">Management System</span>
            </h1>
        </section>
    );
}
