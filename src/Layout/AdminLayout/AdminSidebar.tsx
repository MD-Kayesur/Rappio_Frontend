import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "@/store/Slices/AuthSlice/authSlice";
import logoLight from "@/assets/Vector.svg";
import logoDark from "@/assets/Vector.svg";
import logoIcon from "@/assets/vectorLittle.png";
import {
  LayoutDashboard,
  ListOrdered,
  BarChart3,
  Settings,
  LogOut
} from "lucide-react";
import { SidebarSearch } from "@/components/SidebarSearch";
import {
  MdKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onSearchVisibilityChange?: (isVisible: boolean) => void;
}

export const AdminSidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  onSearchVisibilityChange,
}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  const menuItems = [
    { path: "/admin/overview", label: "Overview", icon: LayoutDashboard },
    { path: "/admin/feed-ordering", label: "Feed Ordering", icon: ListOrdered },
    { path: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { path: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div
      className={`relative z-50 flex flex-col       transition-all duration-300 ease-in-out h-full ${sidebarOpen
        ? (isCollapsed ? "w-20" : "w-64 sm:w-70")
        : "w-0 overflow-hidden"
        }`}
    >
      {/* Mobile Close Button */}
      {sidebarOpen && (
        <div className="absolute top-3 right-3 lg:hidden z-10">
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-8 h-8 bg-[#1A1C1D] dark:bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors cursor-pointer shadow-lg"
          >
            ✖
          </button>
        </div>
      )}

      {/* Logo */}
      {sidebarOpen && (
        <div className="md:px-3 pt-4 sm:pt-6">
          <Link to="/" className="block">
            <div
              className={`flex items-center gap-3 transition-all duration-300 pb-4 ${isCollapsed ? "justify-center px-2" : "px-4 sm:px-6"
                }`}
            >
              {isCollapsed ? (
                <img src={logoIcon} alt="ProntoCorso" className="w-10 h-10 rounded-full" />
              ) : (
                <img
                  src={isDarkMode ? logoDark : logoLight}
                  alt="ProntoCorso"
                  className="transition-all duration-300 rounded-full w-50"
                />
              )}
              {!isCollapsed && (
                <h1 className="font-bold text-xl sm:text-2xl text-[#111827] dark:text-gray-200 truncate">
                  ProntoCorso
                </h1>
              )}
            </div>
          </Link>
          <SidebarSearch isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} onSearchVisibilityChange={onSearchVisibilityChange} />
        </div>
      )}

      {/* Menu */}
      {sidebarOpen && (
        <nav className="flex-1 overflow-y-auto mt-4 px-2 sm:px-3 pb-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === "/admin/overview" && location.pathname === "/admin");

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
                className={`group flex font-normal items-center gap-3 mb-2 rounded-lg transition-all duration-200 cursor-pointer
                  ${isActive
                    ? "bg-[#DF2E38] text-white shadow-md shadow-[#DF2E38]/20"
                    : "text-[#686565] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#DF2E38] dark:hover:text-white"
                  }
                  ${isCollapsed ? "justify-center px-3 py-3" : "px-3 sm:px-4 py-2.5 sm:py-3"}
                `}
              >
                <item.icon
                  className={`flex-shrink-0 transition-transform duration-200 ${isCollapsed ? "w-6 h-6 sm:w-7 sm:h-7" : "w-5 h-5 sm:w-6 sm:h-6"
                    } group-hover:scale-110`}
                />

                {!isCollapsed && (
                  <span className="flex items-center gap-2 text-sm sm:text-base truncate">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      )}

      {/* Logout */}
      {sidebarOpen && (
        <div className="p-3  ">
          <button
            onClick={handleLogout}
            className={`group w-full cursor-pointer flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-colors ${isCollapsed ? "justify-center" : ""
              }`}
          >
            <LogOut className={isCollapsed ? "w-6 h-6 sm:w-7 sm:h-7" : "w-5 h-5 sm:w-6 sm:h-6"} />
            {!isCollapsed && <span className="text-sm sm:text-base font-semibold">Logout</span>}
          </button>
        </div>
      )}

      {/* Collapse Button */}
      {sidebarOpen && (
        <div className="hidden lg:block   p-3">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center w-full gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
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
