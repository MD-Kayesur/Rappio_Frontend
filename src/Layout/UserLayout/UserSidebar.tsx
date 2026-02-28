import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { logout } from "@/store/Slices/AuthSlice/authSlice";

import logoLight from "@/assets/bgremovelogo.png";
import logoDark from "@/assets/bgremovelogo.png";
import logoIcon from "/12143.png";
import {
  LayoutDashboard,
  Video,
  Image,
  Trophy,
  Bookmark,
  Info,
  FileText,
  Shield,
  Cookie,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { SidebarSearch } from "@/components/SidebarSearch";

import {
  MdKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
  // MdLogout,
} from "react-icons/md";

// import { useGetMySubscriptionQuery } from "@/redux/features/subscriptions/subscriptionsApi";
import { useTheme } from "@/components/ThemeToggle/theme-provider";
// import { useAppDispatch } from "@/hooks/useRedux";
// import { logout } from "@/redux/features/auth/authSlice";
// import Cookies from "js-cookie";
import { FaLock } from "react-icons/fa";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const UserSidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  isCollapsed,
  setIsCollapsed,
}) => {
  const location = useLocation();
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

  const isAboutActive = ["/about", "/terms", "/privacy", "/cookies"].includes(location.pathname);

  // Automatically open the About dropdown if an About sub-route is active
  useEffect(() => {
    if (isAboutActive) {
      setIsAboutDropdownOpen(true);
    }
  }, [isAboutActive]);

  //  const { data: subscriptionData } = useGetMySubscriptionQuery();
  // const isLifetime = subscriptionData?.data?.planAlias === "PRO_LIFETIME" || subscriptionData?.data?.plan === "PRO_LIFETIME";
  // const prodata = (subscriptionData?.data?.isPro || isLifetime) ?? false;

  // const handleLogout = () => {
  //   dispatch(logout());
  //   window.location.href = "/login";
  // };

  // Update dark mode status based on theme
  // useEffect(() => {
  //   const updateDarkMode = () => {
  //     if (theme === "dark") {
  //       setIsDarkMode(true);
  //     } else if (theme === "light") {
  //       setIsDarkMode(false);
  //     } else {
  //       // theme === "system"
  //       setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
  //     }
  //   };

  //   updateDarkMode();

  //   // Listen for system preference changes if theme is "system"
  //   if (theme === "system") {
  //     const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  //     const handleChange = () => setIsDarkMode(mediaQuery.matches);
  //     mediaQuery.addEventListener("change", handleChange);
  //     return () => mediaQuery.removeEventListener("change", handleChange);
  //   }
  // }, [theme]);

  const menuItems = [
    { path: "/user/all", label: "All", icon: LayoutDashboard },
    { path: "/user/videos", label: "Videos", icon: Video },
    { path: "/user/photos", label: "Photos", icon: Image },
    { path: "/user/favorites", label: "Favorites", icon: Bookmark },
    { path: "/user/categories", label: "Categories", icon: Trophy },
    // { path: "/user/settings", label: "Settings", icon: Settings },
    // { path: "/user/support", label: "Support", icon: LifeBuoy },
  ];

  return (
    <div
      className={`relative z-50 flex flex-col   transition-all duration-300 ease-in-out h-full ${sidebarOpen
        ? (isCollapsed ? "w-20" : "w-64 sm:w-70")
        : "w-0 overflow-hidden"
        }`}
    >
      {/* Close Button - Mobile Only */}
      {sidebarOpen && (
        <div className="absolute top-3 right-3 z-10 md:hidden">
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-8 h-8 bg-card border border-border text-foreground rounded-full flex items-center justify-center hover:bg-muted transition-colors cursor-pointer shadow-lg"
            aria-label="Close menu"
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
                <h1 className="font-bold text-[22px] text-[#111827] dark:text-gray-200 truncate">
                  Rappio
                </h1>
              )}
            </div>
          </a>
          <SidebarSearch
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            disableModal={true}
          />
        </div>
      )}

      {/* Menu */}
      {sidebarOpen && (
        <nav className="flex-1 overflow-y-auto mt-4 px-2 sm:px-3 pb-4">
          <div className="mb-4">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const isDisabled = false; // Add logic here if some items should be locked

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={(e) => {
                    if (isDisabled) {
                      e.preventDefault();
                      return;
                    }
                    // Close sidebar on mobile after navigation
                    if (window.innerWidth < 768) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={`group flex font-normal items-center gap-3 mb-2 rounded-lg transition-all duration-200 cursor-pointer
                    ${isDisabled
                      ? "opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-800 text-gray-400"
                      : isActive
                        ? "bg-[#FACC15] text-black shadow-md shadow-[#FACC15]/20"
                        : "text-foreground/70 dark:text-gray-200 hover:bg-muted dark:hover:bg-gray-800 hover:text-primary dark:hover:text-white"
                    }
                    ${isCollapsed ? "justify-center px-3 py-3" : "px-3 sm:px-4 py-2.5 sm:py-3"}
                  `}
                >
                  <item.icon
                    className={`flex-shrink-0 transition-transform duration-200 ${isCollapsed ? "w-6 h-6 sm:w-7 sm:h-7" : "w-5 h-5 sm:w-6 sm:h-6"
                      } ${!isDisabled && "group-hover:scale-110"
                      }`}
                  />

                  {!isCollapsed && (
                    <span className="flex  items-center gap-2 text-[16px] truncate">
                      {item.label}
                      {isDisabled && (
                        <span className="text-xs  text-black px-2 py-0.5 rounded whitespace-nowrap">
                          <FaLock className="text-xs dark:text-white" />
                        </span>
                      )}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="mt-4 border-t border-gray-200 dark:border-gray-800 pt-4">
            <button
              onClick={() => !isCollapsed && setIsAboutDropdownOpen(!isAboutDropdownOpen)}
              className={`w-full group flex font-normal items-center gap-3 rounded-lg transition-all duration-200 cursor-pointer
                ${isAboutDropdownOpen && !isCollapsed ? "bg-muted dark:bg-gray-800/50" : "hover:bg-muted dark:hover:bg-gray-800"}
                ${isCollapsed ? "justify-center px-3 py-3" : "px-3 sm:px-4 py-2.5 sm:py-3"}
                ${isAboutActive ? "text-primary" : "text-foreground/70 dark:text-gray-200"}
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
              <div className="mt-1 ml-4 border-l-2 border-gray-200 dark:border-gray-800 pl-2 space-y-1 animate-in slide-in-from-left-2 duration-200">
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
                          ? "bg-[#FACC15] text-black shadow-md shadow-[#FACC15]/20 font-medium"
                          : "text-gray-500 dark:text-gray-400 hover:text-[#FACC15] hover:bg-gray-50 dark:hover:bg-gray-800/50"}
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
      {/* {sidebarOpen && (
        <div className="p-3 ">
          <button
            onClick={handleLogout}
            className={`group w-full cursor-pointer flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-[#FACC15] dark:text-[#FACC15] hover:bg-[#FACC15] hover:text-black transition-colors ${isCollapsed ? "justify-center" : ""
              }`}
          >
            <MdLogout className={isCollapsed ? "w-6 h-6 sm:w-7 sm:h-7 dark:text-white text-black" : "w-5 h-5 sm:w-6 sm:h-6 dark:text-white text-black"} />
            {!isCollapsed && <span className="text-sm sm:text-base dark:text-white text-black">Logout</span>}
          </button>
        </div>
      )} */}

      {/* Collapse Button - Desktop only */}
      {sidebarOpen && (
        <div className="hidden md:block p-3">
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









