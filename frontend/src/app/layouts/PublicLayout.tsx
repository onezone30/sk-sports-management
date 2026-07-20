import { Outlet } from "react-router-dom";
import AppNav from "@/components/navigation/AppNav";

export default function PublicLayout() {
    return (
        <div className="min-h-screen w-full relative bg-white">
            <AppNav />
            <main>
                <Outlet />
            </main>
        </div>
    );
}
