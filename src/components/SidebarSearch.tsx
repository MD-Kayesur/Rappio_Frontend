import React, { useState, useEffect, useRef } from "react"
import { useNavigate, useSearchParams, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ChevronLeft } from 'lucide-react'

interface SidebarSearchProps {
    isCollapsed: boolean;
    setIsCollapsed: (open: boolean) => void;
    onSearchVisibilityChange?: (isVisible: boolean) => void;
    disableModal?: boolean;
    disableTrigger?: boolean;
}

export const SidebarSearch: React.FC<SidebarSearchProps> = ({
    isCollapsed,
    onSearchVisibilityChange,
    disableModal = false,
    disableTrigger = false
}) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams()
    const searchQuery = searchParams.get('q') || ''
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
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
        onSearchVisibilityChange?.(isOpen);
    }, [isOpen, onSearchVisibilityChange]);

    useEffect(() => {
        const handleOpenSearch = () => {
            if (!disableModal) setIsOpen(prev => !prev);
        };
        window.addEventListener('open-sidebar-search', handleOpenSearch);
        return () => window.removeEventListener('open-sidebar-search', handleOpenSearch);
    }, [disableModal]);

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
    };

    const handleSuggestionClick = (title: string) => {
        handleSearchChange(title);
        closeSearch();
    };


    return (
        <>
            {/* Trigger */}
            {!disableTrigger && (
                <div className={`px-4 py-2 ${isCollapsed ? 'flex justify-center' : ''}`}>
                    <button
                        onClick={() => {
                            if (disableModal) {
                                window.dispatchEvent(new CustomEvent('open-sidebar-search'));
                            } else {
                                setIsOpen(!isOpen);
                            }
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
            )}

            <AnimatePresence>
                {isOpen && (!isMobile || !disableModal) && (
                    <motion.div
                        id="search-modal"
                        variants={{
                            hidden: { y: '100%', opacity: 0, filter: 'blur(10px)' },
                            visible: {
                                y: 0,
                                opacity: 1,
                                filter: 'blur(0px)',
                                transition: {
                                    duration: 1.0,
                                    ease: [0.22, 1, 0.36, 1],
                                    staggerChildren: 0.1,
                                    delayChildren: 0.2
                                }
                            },
                            exit: { y: '100%', opacity: 0, filter: 'blur(10px)', transition: { duration: 0.6 } }
                        }}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={`fixed top-0 bottom-0 ${isMobile ? 'z-[99999]' : 'z-[9999]'} flex flex-col ${isMobile ? 'left-0 right-0 w-full bg-black/60 backdrop-blur-xl text-white' : 'border-r border-white/10 shadow-2xl bg-black/60 backdrop-blur-xl text-white'}`}
                        style={!isMobile ? {
                            left: isCollapsed ? '80px' : '280px',
                            width: '350px',
                            pointerEvents: 'auto'
                        } : { pointerEvents: 'auto' }}
                    >
                        <div className={`${isMobile ? 'p-4' : 'p-6'} flex flex-col gap-6`}>
                            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                                {isMobile ? (
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={closeSearch}
                                            className="p-1 text-white hover:opacity-70"
                                        >
                                            <ChevronLeft size={32} />
                                        </button>
                                        <div className="relative flex-1 group">
                                            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" />
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                placeholder="Search..."
                                                value={searchQuery}
                                                onChange={(e) => handleSearchChange(e.target.value)}
                                                className="w-full py-2.5 pl-12 pr-11 bg-white/10 text-white rounded-lg border border-white/10 focus:outline-none placeholder-white/20 text-[17px]"
                                                onKeyPress={(e) => e.key === 'Enter' && closeSearch()}
                                                autoFocus
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
                                        <button
                                            onClick={() => {
                                                if (searchQuery.trim()) {
                                                    handleSearchChange(searchQuery);
                                                    closeSearch();
                                                }
                                            }}
                                            className=" font-bold text-[18px] px-1"
                                        >
                                            Search
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-white text-2xl font-bold">Search</h2>
                                        <button
                                            onClick={closeSearch}
                                            className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-all"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                )}
                            </motion.div>

                            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                                {!isMobile && (
                                    <div className="relative group">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            placeholder="Search anything..."
                                            value={searchQuery}
                                            onChange={(e) => handleSearchChange(e.target.value)}
                                            className="w-full py-3 px-5 bg-white/10 text-white rounded-full border border-transparent focus:border-white/20 outline-none placeholder-white/30 text-[15px]"
                                            onKeyPress={(e) => e.key === 'Enter' && closeSearch()}
                                            autoFocus
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
                                )}
                            </motion.div>

                            <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="flex-1 overflow-y-auto no-scrollbar">
                                {isMobile ? (
                                    <div className="flex-1 overflow-y-auto no-scrollbar">
                                        {searchQuery && (
                                            <div className="flex flex-col gap-1">
                                                {suggestions.map((title, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleSuggestionClick(title)}
                                                        className="w-full px-4 py-3 text-left text-[16px] text-white/80 hover:bg-white/5 active:bg-white/10 transition-all flex items-center gap-4"
                                                    >
                                                        <Search size={18} className="text-white/30" />
                                                        <span className="truncate">{title}</span>
                                                    </button>
                                                ))}
                                                {suggestions.length === 0 && (
                                                    <div className="px-4 py-10 text-center text-white/40 text-[15px]">
                                                        No results found for "{searchQuery}"
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
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
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
