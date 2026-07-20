import { Navigate, Outlet } from "react-router-dom";
import { AppSidebar } from "@/widgets/app-sidebar";
import { Spinner } from "@/shared/ui/spinner";
import { useAuth } from "@/features/auth";

export default function ProtectedLayout() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Spinner className="size-8" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen w-full bg-slate-50">
            <AppSidebar />
            {/* Main content area. On desktop (md), push it to the right by 72 (18rem) to make room for the fixed sidebar */}
            <div className="flex flex-col min-h-screen md:ml-72">
                <main className="flex-1 p-4 md:p-6 lg:p-8 mt-16 md:mt-0">
                    {/* Your protected pages render here */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
}