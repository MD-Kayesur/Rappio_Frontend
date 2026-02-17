"use client"
import { ModeToggle } from "@/components/ThemeToggle/mode-toggle"
import React, { useState, useEffect } from "react"
import { useNavigate, useSearchParams, useLocation } from "react-router-dom"
import GoogleTranslate from "@/components/LanguageToggle/GoogleTranslate"
import { Search, X } from 'lucide-react'

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
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''
  const [_user, setUser] = useState<{ name: string, role: string, avatar: string } | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allTitles, setAllTitles] = useState<string[]>([]);
  const suggestionRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }

    // Fetch titles for suggestions
    fetch('/mediaData.json')
      .then(res => res.json())
      .then(data => {
        const titles = Array.isArray(data) ? data.map((item: any) => item.title) : [];
        setAllTitles(Array.from(new Set(titles)));
      })
      .catch(err => console.error("Failed to fetch search suggestions", err));

    // Click outside listener for suggestions
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
  }

  const handleSearchChange = (val: string) => {
    // Media pages that should handle filtering internally
    const mediaPages = ['/user/all', '/user/videos', '/user/photos', '/user/favorites', '/user/top-casinos'];
    const currentPath = location.pathname;

    // If we're not on a media page, redirect to /user/all when searching
    if (!mediaPages.includes(currentPath) && val.trim() !== '') {
      navigate(`/user/all?q=${encodeURIComponent(val)}`);
      return;
    }

    if (val) {
      setSearchParams({ q: val }, { replace: true });
      const filtered = allTitles
        .filter(title => title.toLowerCase().includes(val.toLowerCase()))
        .slice(0, 8);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('q');
      setSearchParams(newParams, { replace: true });
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (title: string) => {
    handleSearchChange(title);
    setShowSuggestions(false);
  };

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
      <div className="relative w-full max-w-3xl group" ref={suggestionRef}>
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search size={18} className="text-gray-500" />
        </div>

        {/* Input Field */}
        <input
          type="text"
          placeholder="Search items, titles..."
          value={searchQuery}
          onFocus={() => searchQuery && setShowSuggestions(true)}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full py-2.5 pl-11 pr-11 bg-[#1A1C1D] text-gray-200 text-sm border border-[#2a2a2a] rounded-full focus:outline-none focus:border-gray-600 focus:bg-[#1a1a1a] transition-all placeholder-gray-600"
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1C1D] border border-[#2a2a2a] rounded-2xl shadow-2xl overflow-hidden z-[10000] backdrop-blur-xl bg-opacity-95">
            <div className="py-2">
              {suggestions.map((title, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(title)}
                  className="w-full px-5 py-3 text-left text-sm text-gray-300 hover:bg-[#2a2a2a] hover:text-white transition-colors flex items-center gap-3"
                >
                  <Search size={14} className="text-gray-500" />
                  <span className="truncate">{title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Clear/X Icon */}
        {searchQuery && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <button
              onClick={() => handleSearchChange('')}
              className="flex items-center justify-center w-5 h-5 bg-[#2a2a2a] rounded-full hover:bg-gray-700 transition-colors"
            >
              <X size={12} className="text-white" />
            </button>
          </div>
        )}
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
