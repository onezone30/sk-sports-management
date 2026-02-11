import { Outlet } from "react-router-dom";
import AppNav from "../components/navigation/AppNav";

export default function AppLayout() {
  return (
    <div className="min-h-screen w-full relative">
      <AppNav />
      <Outlet />
    </div>
  );
}
