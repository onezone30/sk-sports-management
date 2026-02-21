import { Routes, Route } from "react-router-dom";
import AppLayout from "./AppLayout";
import Landing from "../features/public/pages/Landing";
import Login from "../features/auth/pages/Login";
import Unauthorized from "../features/errors/pages/Unauthorized";
import { PermissionGuard } from "./RoleGuard";
import PublicLayout from "../components/layouts/PublicLayout";
import ProtectedLayout from "../components/layouts/ProtectedLayout";
import Dashboard from "../features/dashboard/pages/Dashboard";

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

      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>


      {/* Example: Permission-based route - user needs ANY of these permissions */}
      {/* <Route path="/dashboard" element={
          <PermissionGuard requiredPermissions={['view_dashboard', 'manage_dashboard']}>
            <Dashboard />
          </PermissionGuard>
        } /> */}

      {/* Example: Permission-based route - user needs ALL permissions */}
      {/* <Route path="/admin" element={
          <PermissionGuard requiredPermissions={['admin_access', 'manage_users']} requireAll={true}>
            <AdminDashboard />
          </PermissionGuard>
        } /> */}
    </Routes>
  );
}
