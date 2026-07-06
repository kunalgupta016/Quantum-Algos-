import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import AlgorithmPage from "../pages/AlgorithmPage/AlgorithmPage";
import BlochSphereFullScreenPage from "../pages/BlochSphereFullScreenPage/BlochSphereFullScreenPage";

/**
 * Application routes.
 *
 * MainLayout wraps all routes to provide Navbar + Sidebar shell.
 *   /                   → Home page
 *   /algorithm/:id      → Algorithm detail page
 *   /blochsphere        → Full screen Bloch Sphere explorer
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/algorithm/:id" element={<AlgorithmPage />} />
      </Route>
      <Route path="/blochsphere" element={<BlochSphereFullScreenPage />} />
    </Routes>
  );
}
