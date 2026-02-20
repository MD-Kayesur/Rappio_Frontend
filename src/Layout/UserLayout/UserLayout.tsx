import { useState, useEffect } from "react";
import { UserSidebar } from "./UserSidebar";
import { Outlet } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import { LayoutNavber } from "@/Layout/LayoutNavber";

export default function UserLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [_isMobile, setIsMobile] = useState(false);

  // Function to check if the screen is mobile or desktop
  const checkIfMobile = () => {
    const mobile = window.innerWidth < 1024; // lg breakpoint
    setIsMobile(mobile);
  };

  useEffect(() => {
    // Check on initial load
    checkIfMobile();

    // Event listener to handle window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);


  return (
    <div className="flex h-screen relative overflow-hidden bg-black">
      {/* Sidebar - Overlay logic */}
      <div
        className={`fixed inset-0 z-[10000] transition-all duration-300 flex-shrink-0 ${sidebarOpen ? "w-70" : "w-0 overflow-hidden pointer-events-none"}`}
      >
        {/* Overlay backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md pointer-events-auto"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* The actual sidebar content */}
        <div className={`relative h-full transition-all duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="w-70 h-full bg-[#0A0A0A] border-r border-white/5 shadow-2xl pointer-events-auto">
            <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          </div>
        </div>
      </div>

      {/* Menu Toggle Button - High Z-Index to remain visible */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-6 right-6 z-[9999] w-12 h-12 bg-neutral-800/80 backdrop-blur-md text-white rounded-full flex items-center justify-center border border-white/10 hover:bg-neutral-700/80 transition-all cursor-pointer shadow-lg active:scale-95"
          aria-label="Open menu"
        >
          <AiOutlineMenu className="w-6 h-6" />
        </button>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative w-full">
        {/* Layout Navbar - only semi-visible or hidden if needed */}
        <div className="sticky top-0 z-30 hidden lg:block opacity-50 hover:opacity-100 transition-opacity">
          <LayoutNavber />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto no-scrollbar">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
