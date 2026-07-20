import sk_background from "@/shared/assets/SK_background.png";
import { Footer } from "@/widgets/footer";
import { LoginForm } from "@/features/auth";

export default function LoginPage() {
    return (
        <>
            <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">

                <div className="absolute inset-0 z-0">
                    <img
                        src={sk_background}
                        alt="Background"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]" />
                </div>

                <LoginForm />
            </div>

            <Footer />
        </>
    );
}
