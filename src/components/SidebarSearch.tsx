import React, { useState, useEffect, useRef } from "react"
import { useNavigate, useSearchParams, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'

interface SidebarSearchProps {
    isCollapsed: boolean;
    setIsCollapsed: (open: boolean) => void;
}

export const SidebarSearch: React.FC<SidebarSearchProps> = ({ isCollapsed, setIsCollapsed }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams()
    const searchQuery = searchParams.get('q') || ''
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [allTitles, setAllTitles] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch('/mediaData.json')
            .then(res => res.json())
            .then(data => {
                const titles = Array.isArray(data) ? data.map((item: any) => item.title) : [];
                setAllTitles(Array.from(new Set(titles)));
            })
            .catch(err => console.error("Failed to fetch search suggestions", err));
    }, []);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSearchChange = (val: string) => {
        const mediaPages = ['/user/all', '/user/videos', '/user/photos', '/user/favorites', '/user/top-casinos'];
        const currentPath = location.pathname;

        if (!mediaPages.includes(currentPath) && val.trim() !== '') {
            navigate(`/user/all?q=${encodeURIComponent(val)}`);
            setIsOpen(false);
            return;
        }

        if (val) {
            setSearchParams({ q: val }, { replace: true });
            const filtered = allTitles
                .filter(title => title.toLowerCase().includes(val.toLowerCase()))
                .slice(0, 8);
            setSuggestions(filtered);
        } else {
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('q');
            setSearchParams(newParams, { replace: true });
            setSuggestions([]);
        }
    };

    const closeSearch = () => {
        setIsOpen(false);
        setIsCollapsed(false);
    };

    const handleSuggestionClick = (title: string) => {
        handleSearchChange(title);
        closeSearch();
    };

    // Click outside listener
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const modal = document.getElementById('search-modal');
            if (isOpen && modal && !modal.contains(event.target as Node)) {
                closeSearch();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <>
            {/* Trigger */}
            <div className={`px-4 py-2 ${isCollapsed ? 'flex justify-center' : ''}`}>
                <button
                    onClick={() => {
                        setIsCollapsed(true);
                        setIsOpen(true);
                    }}
                    className={`flex items-center transition-all bg-[#1A1C1D] border border-white/5 hover:border-white/10 text-gray-400 hover:text-white rounded-full ${isCollapsed
                            ? 'w-10 h-10 justify-center p-0 flex-shrink-0'
                            : 'w-full px-4 py-2.5 gap-3'
                        }`}
                >
                    <Search size={isCollapsed ? 20 : 18} className="flex-shrink-0" />
                    {!isCollapsed && <span className="text-[15px] whitespace-nowrap">Search</span>}
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            id="search-modal"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`fixed top-0 bottom-0 z-[101] border-r border-white/10 shadow-2xl flex flex-col backdrop-blur-md`}
                            style={{
                                left: isCollapsed ? '80px' : '280px',
                                width: '350px'
                            }}
                        >
                            <div className="p-6 flex flex-col gap-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-white text-2xl font-bold">Search</h2>
                                    <button
                                        onClick={closeSearch}
                                        className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="relative group">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder="Search"
                                        value={searchQuery}
                                        onChange={(e) => handleSearchChange(e.target.value)}
                                        className="w-full py-3 px-5 bg-white/10 text-white rounded-full border border-transparent focus:border-white/20 outline-none placeholder-white/30 text-[15px]"
                                        onKeyPress={(e) => e.key === 'Enter' && closeSearch()}
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => handleSearchChange('')}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                    {suggestions.map((title, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSuggestionClick(title)}
                                            className="w-full px-4 py-3 text-left text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-all rounded-xl flex items-center gap-3"
                                        >
                                            <Search size={14} className="opacity-40" />
                                            <span className="truncate">{title}</span>
                                        </button>
                                    ))}
                                    {searchQuery && suggestions.length === 0 && (
                                        <div className="px-4 py-10 text-center text-gray-500 text-sm">
                                            No results found
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
