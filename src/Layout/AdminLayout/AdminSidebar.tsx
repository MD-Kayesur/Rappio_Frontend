import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";

import logoLight from "../../assets/Logo.svg";
import logoDark from "../../assets/Logo2.svg";
import logo from "../../assets/Logo.svg";
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  BarChart,
  LifeBuoy,
  Settings,
  MessageSquare
} from "lucide-react";
import {
  MdKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
  MdLogout,
} from "react-icons/md";

import { useTheme } from "@/components/ThemeToggle/theme-provider";
import { FaLock } from "react-icons/fa";

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);


  useEffect(() => {
    if (theme === "dark") {
      setIsDarkMode(true);
    } else if (theme === "light") {
      setIsDarkMode(false);
    } else {
      setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, [theme]);


  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const menuItems = [
    { path: "/admin", label: "Overview", icon: LayoutDashboard },
    { path: "/admin/users", label: "User Management", icon: Users },
    { path: "/admin/content", label: "Content Management", icon: FileText },
    { path: "/admin/subscription", label: "Subscription", icon: CreditCard },
    { path: "/admin/analytics", label: "Analytics", icon: BarChart },
    { path: "/admin/support", label: "Support", icon: LifeBuoy },
    { path: "/admin/settings", label: "Settings", icon: Settings },
    { path: "/admin/master-prompt", label: "Master Prompt", icon: MessageSquare },
  ];

  const adminMenuWithPermissions = menuItems.map((item) => {
    return { ...item, disabled: false };
  });

  return (
    <div
      className={`relative z-50 flex flex-col bg-[#EBEBEB] dark:bg-gray-900 border-r border-[#C6C8CB] dark:border-r-[#536580] transition-all duration-300 ease-in-out h-full ${sidebarOpen
        ? (isCollapsed ? "w-20" : "w-64 sm:w-72")
        : "w-0 overflow-hidden"
        }`}
    >
      {/* Mobile Close Button */}
      {sidebarOpen && (
        <div className="absolute top-3 right-3 lg:hidden z-10">
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-8 h-8 bg-gray-900 dark:bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors cursor-pointer shadow-lg"
            aria-label="Close menu"
          >
            ✖
          </button>
        </div>
      )}

      {/* Logo */}
      {sidebarOpen && (
        <div className="px-3 pt-4 sm:pt-6">
          <Link to="/" className="block">
            <div
              className={`flex items-center gap-3 border-b border-[#C6C8CB] dark:border-b-[#536580] transition-all duration-300 pb-4 ${isCollapsed ? "justify-center px-2" : "px-4 sm:px-6"
                }`}
            >
              {isCollapsed ? (
                <img src={logo} alt="ProntoCorso" className="w-10 h-10 rounded-full" />
              ) : (
                <img
                  src={isDarkMode ? logoDark : logoLight}
                  alt="ProntoCorso"
                  className="transition-all duration-300 rounded-full w-50"
                />
              )}
            </div>
          </Link>
        </div>
      )}

      {/* Menu */}
      {sidebarOpen && (
        <nav className="flex-1 overflow-y-auto mt-4 px-2 sm:px-3 pb-4">
          {adminMenuWithPermissions.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.disabled ? "#" : item.path}
                onClick={(e) => {
                  if (item.disabled) {
                    e.preventDefault();
                    return;
                  }
                  // Close sidebar on mobile after navigation
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
                className={`group flex items-center gap-3 mb-2 rounded-lg transition-all duration-200 cursor-pointer
                  ${item.disabled
                    ? "opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-800 text-gray-400"
                    : isActive
                      ? "bg-[#111827] text-white dark:bg-[#AFC7FF] dark:text-[#111827] shadow-md"
                      : "text-[#5e5e5e] hover:bg-[#111827] hover:text-white dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  }
                  ${isCollapsed ? "justify-center px-3 py-3" : "px-3 sm:px-4 py-2.5 sm:py-3"}
                `}
              >
                <item.icon
                  className={`flex-shrink-0 transition-transform duration-200 ${isCollapsed ? "w-6 h-6 sm:w-7 sm:h-7" : "w-5 h-5 sm:w-6 sm:h-6"
                    } ${!item.disabled && "group-hover:scale-110"
                    }`}
                />
                {!isCollapsed && (
                  <span className="flex items-center gap-2 text-sm sm:text-base truncate">
                    {item.label}
                    {item.disabled && (
                      <span className="text-xs text-white px-2 py-0.5 rounded whitespace-nowrap">
                        <FaLock className="text-xs dark:text-white text-black" />
                      </span>
                    )}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      )}

      {/* Logout */}
      {sidebarOpen && (
        <div className="p-3 border-t border-[#C6C8CB] dark:border-r-[#536580]">
          <button
            onClick={handleLogout}
            className={`group w-full cursor-pointer flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-colors ${isCollapsed ? "justify-center" : ""
              }`}
          >
            <MdLogout className={isCollapsed ? "w-6 h-6 sm:w-7 sm:h-7 dark:text-white text-black" : "w-5 h-5 sm:w-6 sm:h-6 dark:text-white text-black"} />
            {!isCollapsed && <span className="text-sm sm:text-base dark:text-white text-black">Logout</span>}
          </button>
        </div>
      )}

      {/* Collapse Button - Desktop only */}
      {sidebarOpen && (
        <div className="hidden lg:block border-t border-[#C6C8CB] dark:border-r-[#536580] p-3">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center w-full gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <MdOutlineKeyboardDoubleArrowRight className="text-2xl sm:text-3xl" />
            ) : (
              <div className="flex items-center gap-3">
                <MdKeyboardDoubleArrowLeft className="text-2xl sm:text-3xl" />
                <span className="text-sm sm:text-base">Collapse</span>
              </div>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;
