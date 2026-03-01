import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "@/store/Slices/AuthSlice/authSlice";
import logoLight from "@/assets/bgremovelogo.png";
import logoDark from "@/assets/bgremovelogo.png";
import logoIcon from "/12143.png";
import {
  LayoutDashboard,
  ListOrdered,
  BarChart3,
  Settings,
  LogOut,
  Info,
  FileText,
  Shield,
  Cookie,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import {
  MdKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import { useTheme } from "@/components/ThemeToggle/theme-provider";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const AdminSidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  isCollapsed,
  setIsCollapsed,
}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);

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
      className={`relative z-50 flex flex-col transition-all duration-300 ease-in-out h-full ${sidebarOpen
        ? (isCollapsed ? "w-20" : "w-64 sm:w-70")
        : "w-0 overflow-hidden"
        }`}
    >
      {/* Mobile Close Button */}
      {sidebarOpen && (
        <div className="absolute top-3 right-3 md:hidden z-10">
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-8 h-8 bg-card border border-border text-foreground rounded-full flex items-center justify-center hover:bg-muted transition-colors cursor-pointer shadow-lg"
          >
            ✖
          </button>
        </div>
      )}

      {/* Logo */}
      {sidebarOpen && (
        <div className="md:px-3 pt-4 sm:pt-6">
          <a href="/user/all" className="block">
            <div
              className={`flex items-center gap-3 transition-all duration-300 pb-4 ${isCollapsed ? "justify-center px-2" : "px-4 sm:px-6"
                }`}
            >
              {isCollapsed ? (
                <img src={logoIcon} alt="Rappio" className="w-10 h-10 rounded-full" />
              ) : (
                <img
                  src={isDarkMode ? logoDark : logoLight}
                  alt="Rappio"
                  className="transition-all duration-300 rounded-full w-50"
                />
              )}
              {!isCollapsed && (
                <h1 className="font-bold text-[22px] text-foreground truncate">
                  Rappio
                </h1>
              )}
            </div>
          </a>
          {/* <SidebarSearch isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} /> */}
        </div>
      )}

      {/* Menu */}
      {sidebarOpen && (
        <nav className="flex-1 overflow-y-auto mt-4 px-2 sm:px-3 pb-4">
          <div className="mb-4">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path === "/admin/overview" && location.pathname === "/admin");

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={`group flex font-normal items-center gap-3 mb-2 rounded-lg transition-all duration-200 cursor-pointer
                    ${isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-foreground/70 hover:bg-muted hover:text-primary"
                    }
                    ${isCollapsed ? "justify-center px-3 py-3" : "px-3 sm:px-4 py-2.5 sm:py-3"}
                  `}
                >
                  <item.icon
                    className={`flex-shrink-0 transition-transform duration-200 ${isCollapsed ? "w-6 h-6 sm:w-7 sm:h-7" : "w-5 h-5 sm:w-6 sm:h-6"
                      } group-hover:scale-110`}
                  />

                  {!isCollapsed && (
                    <span className="flex items-center gap-2 text-[16px] truncate">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-4">
            <button
              onClick={() => !isCollapsed && setIsAboutDropdownOpen(!isAboutDropdownOpen)}
              className={`w-full group flex font-normal items-center gap-3 rounded-lg transition-all duration-200 cursor-pointer
                ${isAboutDropdownOpen && !isCollapsed ? "bg-muted" : "hover:bg-muted"}
                ${isCollapsed ? "justify-center px-3 py-3" : "px-3 sm:px-4 py-2.5 sm:py-3"}
                ${["/about", "/terms", "/privacy", "/cookies"].includes(location.pathname) ? "text-primary" : "text-foreground/70"}
              `}
            >
              <Info className={`flex-shrink-0 transition-transform duration-200 ${isCollapsed ? "w-6 h-6 sm:w-7 sm:h-7" : "w-5 h-5 sm:w-6 sm:h-6"} group-hover:scale-110`} />

              {!isCollapsed && (
                <div className="flex items-center justify-between w-full">
                  <span className="text-[16px] truncate">About</span>
                  {isAboutDropdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              )}
            </button>

            {isAboutDropdownOpen && !isCollapsed && (
              <div className="mt-1 ml-4 border-l-2 border-border pl-2 space-y-1 animate-in slide-in-from-left-2 duration-200">
                {[
                  { path: "/about", label: "About Us", icon: Info },
                  { path: "/terms", label: "Terms of Service", icon: FileText },
                  { path: "/privacy", label: "Privacy Policy", icon: Shield },
                  { path: "/cookies", label: "Cookie Policy", icon: Cookie },
                ].map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-[14px] transition-colors
                        ${isActive
                          ? "text-primary font-medium"
                          : "text-muted-foreground hover:text-primary hover:bg-muted/50"}
                      `}
                    >
                      <item.icon className="w-4 h-4 min-w-[16px]" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>
      )}

      {/* Logout */}
      {sidebarOpen && (
        <div className="p-3">
          <button
            onClick={handleLogout}
            className={`group w-full cursor-pointer flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-primary hover:bg-primary hover:text-primary-foreground transition-colors ${isCollapsed ? "justify-center" : ""
              }`}
          >
            <LogOut className={isCollapsed ? "w-6 h-6 sm:w-7 sm:h-7" : "w-5 h-5 sm:w-6 sm:h-6"} />
            {!isCollapsed && <span className="text-sm sm:text-base font-semibold">Logout</span>}
          </button>
        </div>
      )}

      {/* Collapse Button */}
      {sidebarOpen && (
        <div className="hidden md:block p-3">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center w-full gap-2 px-3 py-2 rounded-lg bg-card text-foreground border border-border hover:bg-muted transition-colors cursor-pointer"
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
