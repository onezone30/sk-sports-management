import { Routes, Route } from "react-router-dom";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Unauthorized from "@/pages/unauthorized";
import PublicLayout from "@/app/layouts/PublicLayout";
import ProtectedLayout from "@/app/layouts/ProtectedLayout";
import Dashboard from "@/pages/dashboard";
import Users from "@/pages/users";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<div>About Page Coming Soon</div>} />
        <Route path="/contact" element={<div>Contact Page Coming Soon</div>} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>

      {/*
        ProtectedLayout already redirects to /login when there's no signed-in user.
        Wrap a route below in <PermissionGuard requiredPermissions={[...]}> once the
        backend actually seeds `permissions` and assigns them per user/role — right now
        the permissions table is empty and nothing enforces it server-side either
        (see backend/CLAUDE.md's Implementation Status table), so gating on a made-up
        permission name would just lock everyone out. Example, once that's ready:

          <Route path="/users" element={
            <PermissionGuard requiredPermissions={["users.view"]}>
              <Users />
            </PermissionGuard>
          } />
      */}
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
      </Route>
    </Routes>
  );
}
