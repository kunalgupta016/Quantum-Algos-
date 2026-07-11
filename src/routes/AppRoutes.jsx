import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import MainLayout from "../layouts/MainLayout";
import LandingPage from "../pages/LandingPage/LandingPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import DashboardPage from "../pages/DashboardPage/DashboardPage";
import AdminDashboard from "../pages/AdminPanel/AdminDashboard";
import AdminNewsManager from "../pages/AdminPanel/AdminNewsManager";
import AdminBlogsManager from "../pages/AdminPanel/AdminBlogsManager";
import AdminDocsManager from "../pages/AdminPanel/AdminDocsManager";
import AlgorithmPage from "../pages/AlgorithmPage/AlgorithmPage";
import BlochSphereFullScreenPage from "../pages/BlochSphereFullScreenPage/BlochSphereFullScreenPage";
import SandboxPage from "../pages/SandboxPage/SandboxPage";
import CircuitSimulatorPage from "../pages/CircuitSimulatorPage/CircuitSimulatorPage";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import AnimatedPage from "../components/AnimatedPage/AnimatedPage";
import AdminAddAlgorithm from "../pages/AdminPanel/AdminAddAlgorithm";
import AdminAlgorithmEditor from "../pages/AdminPanel/AdminAlgorithmEditor";
import DocsPage from "../pages/DocsPage/DocsPage";
import BlogsPage from "../pages/BlogsPage/BlogsPage";
import NewsPage from "../pages/NewsPage/NewsPage";
import QuantumPlayground from "../pages/QuantumPlayground/QuantumPlayground";
import BlogViewerPage from "../pages/BlogViewerPage/BlogViewerPage";

/**
 * Application routes.
 */
export default function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes (with their own Navbar inside) */}
        <Route path="/" element={<AnimatedPage><LandingPage /></AnimatedPage>} />
        <Route path="/login" element={<AnimatedPage><LoginPage /></AnimatedPage>} />
        <Route path="/docs" element={<AnimatedPage><DocsPage /></AnimatedPage>} />
        <Route path="/blogs" element={<AnimatedPage><BlogsPage /></AnimatedPage>} />
        <Route path="/blogs/:id" element={<AnimatedPage><BlogViewerPage /></AnimatedPage>} />
        <Route path="/news" element={<AnimatedPage><NewsPage /></AnimatedPage>} />

        {/* Protected routes (use MainLayout with Navbar + Sidebar) */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<AnimatedPage><DashboardPage /></AnimatedPage>} />
          <Route path="/algorithm/:id" element={<AnimatedPage><AlgorithmPage /></AnimatedPage>} />
          <Route path="/sandbox" element={<AnimatedPage><SandboxPage /></AnimatedPage>} />
          <Route path="/circuit-simulator" element={<AnimatedPage><CircuitSimulatorPage /></AnimatedPage>} />
          <Route path="/playground" element={<AnimatedPage><QuantumPlayground /></AnimatedPage>} />

          {/* ─── Admin Routes ──────────────────────────────────── */}
          <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AnimatedPage><AdminDashboard /></AnimatedPage></ProtectedRoute>} />
          <Route path="/admin/news" element={<ProtectedRoute adminOnly={true}><AnimatedPage><AdminNewsManager /></AnimatedPage></ProtectedRoute>} />
          <Route path="/admin/blogs" element={<ProtectedRoute adminOnly={true}><AnimatedPage><AdminBlogsManager /></AnimatedPage></ProtectedRoute>} />
          <Route path="/admin/docs" element={<ProtectedRoute adminOnly={true}><AnimatedPage><AdminDocsManager /></AnimatedPage></ProtectedRoute>} />
          <Route path="/admin/add-algorithm" element={<ProtectedRoute adminOnly={true}><AnimatedPage><AdminAddAlgorithm /></AnimatedPage></ProtectedRoute>} />
          <Route
            path="/admin/edit-algorithm/:id"
            element={
              <ProtectedRoute adminOnly>
                <AnimatedPage><AdminAlgorithmEditor /></AnimatedPage>
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Full screen routes */}
        <Route
          path="/blochsphere"
          element={
            <ProtectedRoute>
              <AnimatedPage><BlochSphereFullScreenPage /></AnimatedPage>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
