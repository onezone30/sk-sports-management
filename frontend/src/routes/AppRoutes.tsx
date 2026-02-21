import { Routes, Route } from "react-router-dom";
import AppLayout from "./AppLayout";
import Landing from "../features/public/pages/Landing";
import Login from "../features/auth/pages/Login";
import Unauthorized from "../features/errors/pages/Unauthorized";
import { PermissionGuard } from "./RoleGuard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<div>About Page Coming Soon</div>} />
        <Route path="/contact" element={<div>Contact Page Coming Soon</div>} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          path="/dashboard"
          element={
            <PermissionGuard requiredPermissions={["view_dashboard"]}>
              <div>Dashboard Coming Soon</div>
            </PermissionGuard>
          }
        />
        
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
      </Route>
    </Routes>
  );
}
