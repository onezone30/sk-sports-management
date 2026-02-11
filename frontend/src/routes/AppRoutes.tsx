import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./AppLayout";
import Landing from "../features/public/pages/Landing";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<div>About Page Coming Soon</div>} />
        <Route path="/landing" element={<Landing />} />
      </Route>
    </Routes>
  );
}
