import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      if (mobile !== isMobile) {
        setIsMobile(mobile);
        setIsSidebarOpen(!mobile); // Auto close on mobile, open on desktop
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "var(--color-app-base)", color: "var(--color-app-text-main)" }}>
      <Navbar />
      <div className="flex flex-1 relative overflow-hidden">
        {/* Mobile Overlay Backdrop */}
        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        <Sidebar 
          isOpen={isSidebarOpen} 
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
          isMobile={isMobile} 
        />
        
        <main className="flex flex-1 flex-col overflow-y-auto w-full relative" data-lenis-prevent="true">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
