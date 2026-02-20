import { useState, useEffect } from "react";
import { UserSidebar } from "./UserSidebar";
import { Outlet } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import { LayoutNavber } from "@/Layout/LayoutNavber";
import { SidebarSearch } from "@/components/SidebarSearch";

export default function UserLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Function to check if the screen is mobile or desktop
  const checkIfMobile = () => {
    const mobile = window.innerWidth < 1024; // lg breakpoint
    setIsMobile(mobile);
    // On desktop, sidebar should be open by default
    if (!mobile) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
    }
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
    <div className="flex h-screen relative overflow-hidden bg-transparent">
      {/* Sidebar Container */}
      <div
        className={`fixed lg:relative inset-0 lg:inset-auto z-[10000] lg:z-auto transition-all duration-300 flex-shrink-0 
          ${isMobile ? (sidebarOpen ? "w-70" : "w-0 overflow-hidden pointer-events-none") : (isCollapsed ? "lg:w-20" : "lg:w-70")}
        `}
      >
        {/* Mobile Overlay backdrop */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md lg:hidden pointer-events-auto"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* The actual sidebar content */}
        <div className={`relative h-full transition-all duration-300 
          ${isMobile ? (sidebarOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
        `}>
          <div className={`h-full bg-black/10 backdrop-blur-lg border-r border-white/5 shadow-2xl pointer-events-auto transition-all duration-300 ${isCollapsed ? "w-20" : "w-70"}`}>
            <UserSidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          </div>
        </div>
      </div>

      {/* Menu Toggle Button - Mobile only */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-6 right-6 z-[9999] w-12 h-12 bg-neutral-800/80 backdrop-blur-md text-white rounded-full flex items-center justify-center border border-white/10 hover:bg-neutral-700/80 transition-all cursor-pointer shadow-lg active:scale-95 lg:hidden"
          aria-label="Open menu"
        >
          <AiOutlineMenu className="w-6 h-6" />
        </button>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative w-full">
        {/* Layout Navbar - only semi-visible or hidden if needed */}
        <div className="sticky top-0 z-30 hidden lg:block border-b border-white/5">
          <LayoutNavber />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto no-scrollbar">
          <Outlet />
        </div>
      </div>
      <SidebarSearch
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        disableTrigger={true}
      />
    </div>
  );
}
