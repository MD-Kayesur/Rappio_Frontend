import { useState, useEffect } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { Outlet } from "react-router-dom";
import { AiOutlineMenuFold } from "react-icons/ai";
import { LayoutNavber } from "@/Layout/LayoutNavber";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const checkIfMobile = () => {
    const mobile = window.innerWidth < 1024;
    setIsMobile(mobile);
    if (!mobile) {
      setSidebarOpen(true);
    }
  };

  useEffect(() => {
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  return (
    <div className="flex h-screen bg-[#F5F5F5] dark:bg-gray-950 relative overflow-hidden text-gray-900 dark:text-gray-100">
      <div
        className={`fixed lg:static inset-0 lg:inset-auto z-50 lg:z-auto transition-all duration-300 ${sidebarOpen ? "block" : "hidden lg:block"
          }`}
      >
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="relative h-full">
          <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative w-full lg:w-auto">
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-6 right-4 z-40 w-9 h-9 dark:bg-[#0A0A0A] bg-white text-black dark:text-white rounded-lg flex items-center justify-center border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer lg:hidden"
            aria-label="Open menu"
          >
            <AiOutlineMenuFold className="w-5 h-5" />
          </button>
        )}

        <div className="sticky top-0 z-30">
          <LayoutNavber />
        </div>

        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}