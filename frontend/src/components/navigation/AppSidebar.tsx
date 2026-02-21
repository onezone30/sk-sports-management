import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Home, Info, Phone, LayoutDashboard, LogOut, Menu, X, LogIn } from "lucide-react";
import skLogo from "../../assets/sk_logo.png";
import { Button } from "../ui/button";
import { useAuth } from "../../hooks/useAuth";

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/about", label: "About", icon: Info },
  { to: "/contact", label: "Contact", icon: Phone },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export default function AppSidebar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const closeSidebar = () => setOpen(false);

  const handleLogout = () => {
    logout();
    closeSidebar();
    navigate("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-4 md:hidden">
        <Link to="/" className="flex items-center gap-2" onClick={closeSidebar}>
          <img src={skLogo} alt="SK Sports Logo" className="h-9 w-auto object-contain" />
        </Link>
        <Button variant="outline" size="icon" onClick={() => setOpen(true)} aria-label="Open sidebar menu">
          <Menu className="h-5 w-5" />
        </Button>
      </header>

      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/50 md:hidden"
          onClick={closeSidebar}
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r bg-white shadow-xl transition-transform duration-300 md:translate-x-0 md:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link to="/" className="flex items-center gap-2" onClick={closeSidebar}>
            <img src={skLogo} alt="SK Sports Logo" className="h-9 w-auto object-contain" />
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={closeSidebar} aria-label="Close sidebar menu">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex h-[calc(100%-4rem)] flex-col justify-between p-4">
          <nav className="space-y-2">
            {links.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      isActive || (item.to !== "/" && location.pathname.startsWith(item.to))
                        ? "bg-slate-900 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="space-y-3 border-t pt-4">
            {user ? (
              <>
                <div className="rounded-lg bg-slate-50 px-3 py-2">
                  <p className="text-xs text-slate-500">Signed in as</p>
                  <p className="truncate text-sm font-medium text-slate-900">{user.name}</p>
                </div>
                <Button className="w-full justify-start gap-2" variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Button asChild className="w-full justify-start gap-2">
                <Link to="/login" onClick={closeSidebar}>
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              </Button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
