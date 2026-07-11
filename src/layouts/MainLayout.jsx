import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "var(--color-app-base)", color: "var(--color-app-text-main)" }}>
      <Navbar />
      <div className="flex flex-1 relative">
        <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex flex-1 flex-col overflow-y-auto" data-lenis-prevent="true">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
