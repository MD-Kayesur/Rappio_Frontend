"use client"
import { ModeToggle } from "@/components/ThemeToggle/mode-toggle"
import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import GoogleTranslate from "@/components/LanguageToggle/GoogleTranslate"

// Helper function to get initials from name
// const getInitials = (name: string) => {
//   if (!name) return 'U';
//   return name
//     .split(' ')
//     .map(word => word[0])
//     .join('')
//     .toUpperCase()
//     .slice(0, 2);
// };

export const LayoutNavber: React.FC = () => {
  const [showLogout] = useState(false)
  const navigate = useNavigate()
  const [_user, setUser] = useState<{ name: string, role: string, avatar: string } | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
  }

  // Determine settings route based on role
  // const settingsRoute = user?.role === 'Admin' || user?.role === 'SUPER_ADMIN' ? '/admin/settings' : '/user/settings';

  // const userNameToShow = user?.name || "Guest";
  // const userRoleToShow = user?.role || "User";
  // const userImageToShow = user?.avatar || "";

  return (
    <div className="md:px-10 pl-5 pr-15 relative z-[9999] py-5 flex items-center justify-between  ">
      {/* <Link to={settingsRoute} className="flex items-center gap-3 cursor-pointer">
        {userImageToShow ? (
          <img
            src={userImageToShow}
            alt={userNameToShow}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center text-sm font-bold border-2 border-gray-200 dark:border-gray-700">
            {getInitials(userNameToShow)}
          </div>
        )}
        <div className="flex flex-col">
          <div className="font-semibold text-sm text-gray-900 dark:text-white">{userNameToShow}</div>
          <div className="text-xs text-gray-500 dark:text-gray-300">{userRoleToShow}</div>
        </div>
      </Link> */}
      <div>

      </div>
      <div className="relative w-full max-w-3xl group">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Input Field */}
        <input
          type="text"
          placeholder="Search"
          className="w-full py-2.5 pl-11 pr-11 bg-[#1A1C1D] text-gray-200 text-sm border border-[#2a2a2a] rounded-full focus:outline-none focus:border-gray-600 focus:bg-[#1a1a1a] transition-all placeholder-gray-600"
        />

        {/* Clear/X Icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
          <button className="flex items-center justify-center w-5 h-5 bg-[#2a2a2a] rounded-full hover:bg-gray-700 transition-colors">
            <svg
              className="w-3 h-3 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <GoogleTranslate />
        <ModeToggle />
      </div>
      {showLogout && (
        <div className="absolute top-5 left-70 transform -translate-x-1/2 w-full flex justify-center">
          <button
            onClick={handleLogout}
            className="text-sm bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
