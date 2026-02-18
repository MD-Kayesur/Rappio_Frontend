
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import logo from "../../assets/Vector.svg";
import {
    Heart,
    MessageCircle,
    Bookmark,
    Share2,
    X,
    ChevronUp,
    ChevronDown,
    Search,
    Repeat2,
    Link,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import PageLoader from '@/Layout/PageLoader';
import { toast } from 'sonner';

interface Comment {
    id: number;
    user: string;
    avatar: string;
    text: string;
    likes: number;
    timestamp: string;
}

interface Offer {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    cta: string;
    likes: number;
    comments: number;
    image_url: string;
    video_url: string;
    website_url: string;
    tags: string[];
    terms_highlights: string[];
    disclaimer: string;
}

const Photos: React.FC = () => {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState<'up' | 'down'>('down');
    const [showComments, setShowComments] = useState(false);
    const [showNameSetup, setShowNameSetup] = useState(false);
    const [username, setUsername] = useState('');
    const [commentText, setCommentText] = useState('');
    const [likedOffers, setLikedOffers] = useState<Set<number>>(new Set());
    const [savedOffers, setSavedOffers] = useState<Set<number>>(() => {
        const saved = sessionStorage.getItem('favorites');
        return new Set(saved ? JSON.parse(saved) : []);
    });
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || '';
    const [allOffers, setAllOffers] = useState<Offer[]>([]);
    const [showShareModal, setShowShareModal] = useState(false);
    const shareScrollRef = useRef<HTMLDivElement>(null);

    const [comments, setComments] = useState<Comment[]>([
        {
            id: 1,
            user: 'Robert Fox',
            avatar: '👤',
            text: 'That\'s Amazing',
            likes: 0,
            timestamp: '2m'
        },
        {
            id: 2,
            user: 'Marvin McKinney',
            avatar: '👤',
            text: 'That\'s Amazing',
            likes: 0,
            timestamp: '5m'
        },
        {
            id: 3,
            user: 'Guy Hawkins',
            avatar: '👤',
            text: 'That\'s innovative...',
            likes: 0,
            timestamp: '10m'
        }
    ]);

    const containerRef = useRef<HTMLDivElement>(null);
    const commentsRef = useRef<HTMLDivElement>(null);
    const touchStartY = useRef<number>(0);
    const lastScrollTime = useRef<number>(0);

    useEffect(() => {
        // Fetch offers data
        fetch('/mediaData.json')
            .then(response => response.json())
            .then(data => {
                const allOffers = Array.isArray(data) ? data : [data];
                // Filter only items with images and no video for Photos page if needed, 
                // but let's keep it consistent with what was there before
                setOffers(allOffers);
                setAllOffers(allOffers);
            })
            .catch(error => console.error('Error fetching offers:', error));

        const savedUsername = localStorage.getItem('username');
        if (savedUsername) {
            setUsername(savedUsername);
        }
    }, []);

    useEffect(() => {
        setIsDescriptionExpanded(false);
        setShowComments(false);
    }, [currentIndex]);



    useEffect(() => {
        const filtered = allOffers.filter(offer =>
            offer.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setOffers(filtered);
        setCurrentIndex(0);
    }, [searchQuery, allOffers]);

    const handleScroll = (scrollDirection: 'up' | 'down') => {
        if (scrollDirection === 'down' && currentIndex < offers.length - 1) {
            setDirection('down');
            setCurrentIndex(currentIndex + 1);
        } else if (scrollDirection === 'up' && currentIndex > 0) {
            setDirection('up');
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleWheel = (e: React.WheelEvent) => {
        const now = Date.now();
        if (now - lastScrollTime.current < 800) return;

        if (e.deltaY > 50) {
            handleScroll('down');
            lastScrollTime.current = now;
        } else if (e.deltaY < -50) {
            handleScroll('up');
            lastScrollTime.current = now;
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY.current - touchEndY;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                handleScroll('down');
            } else {
                handleScroll('up');
            }
        }
    };

    const toggleLike = (offerId: number) => {
        setLikedOffers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(offerId)) {
                newSet.delete(offerId);
            } else {
                newSet.add(offerId);
            }
            return newSet;
        });
    };

    const toggleSave = (offerId: number) => {
        setSavedOffers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(offerId)) {
                newSet.delete(offerId);
            } else {
                newSet.add(offerId);
            }
            sessionStorage.setItem('favorites', JSON.stringify(Array.from(newSet)));
            return newSet;
        });
    };

    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}k`;
        }
        return num.toString();
    };

    const handleCommentSubmit = () => {
        const savedUsername = localStorage.getItem('username');
        if (!savedUsername && !username) {
            setShowNameSetup(true);
            return;
        }

        if (commentText.trim()) {
            const newComment: Comment = {
                id: comments.length + 1,
                user: username || savedUsername || 'Anonymous',
                avatar: '👤',
                text: commentText,
                likes: 0,
                timestamp: 'Just now'
            };
            setComments([newComment, ...comments]);
            setCommentText('');
        }
    };

    const handleNameSetup = () => {
        if (username.trim()) {
            localStorage.setItem('username', username);
            setShowNameSetup(false);
        }
    };

    const handleCommentCheck = (e: React.MouseEvent) => {
        e.stopPropagation();
        const savedUsername = localStorage.getItem('username');
        if (!savedUsername && !username) {
            setShowNameSetup(true);
        } else {
            setShowComments(!showComments);
        }
    };

    const handleExpandAndComment = (e: React.MouseEvent) => {
        e.stopPropagation();
        const savedUsername = localStorage.getItem('username');
        if (!savedUsername && !username) {
            setShowNameSetup(true);
        } else {
            setIsDescriptionExpanded(true);
            setShowComments(true);
        }
    };

    const variants = {
        enter: (direction: string) => ({
            y: direction === 'down' ? '100%' : '-100%',
            opacity: 1,
        }),
        center: {
            y: 0,
            opacity: 1,
        },
        exit: (direction: string) => ({
            y: direction === 'down' ? '-100%' : '100%',
            opacity: 1,
        }),
    };

    const currentOffer = offers[currentIndex];

    if (!currentOffer) {
        return (
            <div className="h-full bg-black flex items-center justify-center">
                <div className="text-white text-xl">
                    <PageLoader />
                </div>
            </div>
        );
    }

    return (
        <>
            <div
                ref={containerRef}
                className="h-screen sm:h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden no-scrollbar"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onWheel={handleWheel}
            >
                <div className={`relative transition-all duration-500 ease-in-out bg-black sm:rounded-[2rem] overflow-hidden shadow-2xl sm:border sm:border-white/10 group ${isDescriptionExpanded ? 'w-full h-full sm:h-[85vh] sm:max-w-6xl flex flex-col sm:flex-row' : 'w-full h-full sm:h-[85vh] sm:max-w-[450px]'}`}>
                    {!isDescriptionExpanded && (
                        <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between p-6 pr-16 sm:hidden pointer-events-none">
                            <div className="flex-1 relative group pointer-events-auto">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <Search size={18} className="text-white/60" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search photos..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchParams({ q: e.target.value }, { replace: true })}
                                    className="w-full py-2.5 pl-11 pr-11 bg-black/20 backdrop-blur-md text-white text-sm border border-white/10 rounded-full focus:outline-none focus:border-white/30 transition-all placeholder-white/40"
                                />
                                {searchQuery && (
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setSearchParams({}, { replace: true }); }}
                                            className="flex items-center justify-center w-5 h-5 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                                        >
                                            <X size={12} className="text-white" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <AnimatePresence initial={false} custom={direction} mode="popLayout">
                        <motion.div
                            key={currentOffer.id}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                            className="absolute inset-0 h-full w-full flex flex-col sm:flex-row"
                        >
                            <div className={`relative transition-all duration-500 ${isDescriptionExpanded ? 'hidden sm:block sm:w-full sm:h-full lg:w-[45%] flex-shrink-0' : 'h-full w-full'}`}>
                                <div className="absolute inset-0">
                                    <img src={currentOffer.image_url} alt={currentOffer.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />
                                </div>
                            </div>

                            {isDescriptionExpanded && (
                                <div className="flex-1 flex flex-col bg-[#1a1a1a] relative animate-in slide-in-from-right-10 duration-500 overflow-hidden z-30">
                                    {/* Close Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsDescriptionExpanded(false);
                                        }}
                                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50 pointer-events-auto"
                                    >
                                        <X size={20} className="text-white" />
                                    </button>

                                    <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
                                        <div className="space-y-6">
                                            {/* Header */}
                                            <div>
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                                                        <img src={currentOffer.image_url} alt="icon" className="w-full h-full object-cover" />
                                                    </div>
                                                    <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">{currentOffer.title}</h2>
                                                </div>
                                                <p className="text-white/60 text-sm sm:text-base">{currentOffer.subtitle}</p>
                                            </div>

                                            {/* CTA */}
                                            <button
                                                onClick={() => currentOffer.website_url && window.open(currentOffer.website_url, '_blank')}
                                                className="w-full bg-[#EE2B3E] hover:bg-[#d41f32] text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95 text-lg"
                                            >
                                                {currentOffer.cta || 'Claim Offer'}
                                            </button>

                                            {/* Stats Row */}
                                            <div className="flex items-center justify-between py-6 border-y border-white/10">
                                                <button onClick={() => toggleLike(currentOffer.id)} className="flex flex-col items-center gap-1.5 hover:opacity-80 transition-opacity">
                                                    <Heart size={28} className={likedOffers.has(currentOffer.id) ? "fill-[#EE2B3E] text-[#EE2B3E]" : "text-white"} />
                                                    <span className="text-xs text-white/60 font-medium">{formatNumber(currentOffer.likes)}</span>
                                                </button>
                                                <button onClick={handleCommentCheck} className="flex flex-col items-center gap-1.5 hover:opacity-80 transition-opacity">
                                                    <MessageCircle size={28} className={showComments ? "text-red-500 fill-red-500/10" : "text-white"} />
                                                    <span className="text-xs text-white/60 font-medium">{formatNumber(currentOffer.comments + comments.length)}</span>
                                                </button>
                                                <button onClick={() => toggleSave(currentOffer.id)} className="flex flex-col items-center gap-1.5 hover:opacity-80 transition-opacity">
                                                    <Bookmark size={28} className={savedOffers.has(currentOffer.id) ? "fill-[#facd3b] text-[#facd3b]" : "text-white"} />
                                                    <span className="text-xs text-white/60 font-medium">Save</span>
                                                </button>
                                                <button onClick={() => setShowShareModal(true)} className="flex flex-col items-center gap-1.5 hover:opacity-80 transition-opacity">
                                                    <Share2 size={28} className="text-white" />
                                                    <span className="text-xs text-white/60 font-medium">Share</span>
                                                </button>
                                            </div>

                                            <div>
                                                <h3 className="text-white font-semibold mb-3">Description:</h3>
                                                <p className="text-white/70 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                                                    {currentOffer.description || "Lorem Ipsum is simply dummy text."}
                                                </p>
                                                <div className="flex flex-wrap gap-2 mt-4">
                                                    {currentOffer.tags?.map(tag => (
                                                        <span key={tag} className="px-3 py-1.5 bg-white/5 rounded-lg text-xs font-medium text-white/60 border border-white/5">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {currentOffer.terms_highlights && currentOffer.terms_highlights.length > 0 && (
                                                <div className="pt-4">
                                                    <h3 className="text-white font-semibold mb-3">Terms highlights:</h3>
                                                    <ul className="space-y-3">
                                                        {currentOffer.terms_highlights.map((term, i) => (
                                                            <li key={i} className="text-white/70 text-sm sm:text-base flex gap-3">
                                                                <span className="text-red-500 font-bold">•</span> {term}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Show Comments List Inline */}
                                            {showComments && (
                                                <div ref={commentsRef} className="pt-6 border-t border-white/10 animate-in fade-in duration-300">
                                                    <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                                                        <MessageCircle size={20} className="text-red-500" />
                                                        Comments ({comments.length + currentOffer.comments})
                                                    </h3>
                                                    <div className="space-y-6 mb-24">
                                                        {comments.map((comment) => (
                                                            <div key={comment.id} className="flex gap-4 group">
                                                                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-lg flex-shrink-0 border border-red-500/20">
                                                                    {comment.avatar}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <span className="text-white font-bold text-sm">{comment.user}</span>
                                                                        <span className="text-white/40 text-[10px] sm:text-xs">{comment.timestamp}</span>
                                                                    </div>
                                                                    <p className="text-white/80 text-sm sm:text-base leading-relaxed">{comment.text}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {comments.length === 0 && (
                                                            <div className="text-center py-10">
                                                                <p className="text-white/30 text-sm italic">Be the first to share your thoughts!</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bottom Fixed Comment Input Area */}
                                    {showComments && (
                                        <div className="p-4 sm:p-6 bg-[#1a1a1a] border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-50">
                                            <div className="flex gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 focus-within:border-red-500 transition-colors">
                                                <input
                                                    type="text"
                                                    value={commentText}
                                                    onChange={(e) => setCommentText(e.target.value)}
                                                    placeholder="Add a comment..."
                                                    className="flex-1 bg-transparent text-white px-4 py-2 outline-none text-sm sm:text-base"
                                                    onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
                                                />
                                                <button
                                                    onClick={() => handleCommentSubmit()}
                                                    className={`px-6 py-2 rounded-xl font-bold transition-all ${commentText.trim() ? 'bg-red-500 text-white' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
                                                >
                                                    Post
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {!isDescriptionExpanded && (
                                <div className="absolute bottom-4 left-0 right-16 p-4 z-20 select-none space-y-3">
                                    <div className="pointer-events-auto">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (currentOffer.website_url) {
                                                    window.open(currentOffer.website_url, '_blank');
                                                }
                                            }}
                                            className="bg-[#EE2B3E] hover:bg-[#d41f32] text-white font-bold py-2.5 px-6 rounded-lg text-[15px] shadow-lg transition-all active:scale-95 flex items-center gap-2"
                                        >
                                            {currentOffer.cta || 'Claim Offer'}
                                            <span className="text-[18px]">→</span>
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-1.5 pt-1">
                                        <h2 className="text-white font-bold text-[17px] tracking-wide pointer-events-auto cursor-pointer" onClick={() => currentOffer.website_url && window.open(currentOffer.website_url, '_blank')}>
                                            {currentOffer.title}
                                        </h2>
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-white text-[14px] leading-[1.4] drop-shadow-md line-clamp-2">
                                            {currentOffer.subtitle}
                                        </p>
                                        <button onClick={(e) => { e.stopPropagation(); setIsDescriptionExpanded(true); }} className="text-white font-bold text-[14px]">more</button>
                                    </div>
                                </div>
                            )}

                            {!isDescriptionExpanded && (
                                <div className="absolute right-2 bottom-6 w-14 flex flex-col items-center gap-5 z-20">
                                    <div className="flex flex-col items-center gap-0.5 pointer-events-auto">
                                        <button onClick={(e) => { e.stopPropagation(); toggleLike(currentOffer.id); }} className="hover:scale-110 transition-transform active:scale-95">
                                            <Heart size={36} className={`transition-colors duration-200 drop-shadow-lg ${likedOffers.has(currentOffer.id) ? 'fill-[#EE2B3E] text-[#EE2B3E]' : 'text-white'}`} />
                                        </button>
                                        <span className="text-white text-[12px] font-bold drop-shadow-md">{formatNumber(currentOffer.likes)}</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-0.5 pointer-events-auto relative">
                                        <button onClick={handleExpandAndComment} className="hover:scale-110 transition-transform active:scale-95">
                                            <MessageCircle size={36} className="text-white drop-shadow-lg" />
                                        </button>
                                        <span className="text-white text-[12px] font-bold drop-shadow-md">{formatNumber(currentOffer.comments + comments.length)}</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-0.5 pointer-events-auto">
                                        <button onClick={(e) => { e.stopPropagation(); toggleSave(currentOffer.id); }} className="hover:scale-110 transition-transform active:scale-95">
                                            <Bookmark size={34} className={`transition-colors duration-200 drop-shadow-lg ${savedOffers.has(currentOffer.id) ? 'fill-[#facd3b] text-[#facd3b]' : 'text-white'}`} />
                                        </button>
                                    </div>
                                    <div className="flex flex-col items-center gap-0.5 pointer-events-auto">
                                        <button onClick={(e) => { e.stopPropagation(); setShowShareModal(true); }} className="w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                                            <Share2 size={24} className="text-white drop-shadow-lg" />
                                        </button>
                                        <span className="text-white text-[11px] font-bold drop-shadow-md">Share</span>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="hidden sm:flex absolute bottom-10 right-10 flex-col gap-3">
                    <button onClick={() => handleScroll('up')} disabled={currentIndex === 0} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${currentIndex === 0 ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-black/40 text-white hover:bg-black/60 border border-white/10'}`}>
                        <ChevronUp size={28} />
                    </button>
                    <button onClick={() => handleScroll('down')} disabled={currentIndex === offers.length - 1} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${currentIndex === offers.length - 1 ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-black/40 text-white hover:bg-black/60 border border-white/10'}`}>
                        <ChevronDown size={28} />
                    </button>
                </div>
            </div>

            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 20px; }`}</style>

            {showShareModal && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
                    onClick={() => setShowShareModal(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-[#1a1a1a] rounded-3xl p-6 w-full max-w-[450px] relative border border-white/10 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-center mb-8">
                            <h3 className="text-white text-lg font-semibold">Share to</h3>
                            <button
                                onClick={() => setShowShareModal(false)}
                                className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="relative group/share px-2">
                            {/* Left Arrow */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    shareScrollRef.current?.scrollBy({ left: -220, behavior: 'smooth' });
                                }}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-8 h-8 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white z-10 opacity-0 group-hover/share:opacity-100 transition-opacity border border-white/10 shadow-lg"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <div
                                ref={shareScrollRef}
                                className="flex overflow-x-auto gap-5 no-scrollbar pb-2 px-1 scroll-smooth"
                            >
                                {[
                                    {
                                        name: 'Embed',
                                        icon: <div className="text-xl font-bold">{'</>'}</div>,
                                        color: 'bg-[#0097a7]',
                                        onClick: () => {
                                            const embedCode = `<iframe src="${window.location.origin}/embed/${currentOffer.id}" width="450" height="800"></iframe>`;
                                            navigator.clipboard.writeText(embedCode);
                                            toast.success('Embed code copied to clipboard!');
                                        }
                                    },
                                    {
                                        name: 'Facebook',
                                        icon: <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>,
                                        color: 'bg-[#1877F2]',
                                        onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')
                                    },
                                    {
                                        name: 'Telegram',
                                        icon: <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current mr-0.5 mb-0.5"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.14-.257.257-.527.257l.193-2.74 5.007-4.522c.216-.196-.05-.304-.333-.11L8.597 14.15l-2.654-.83c-.577-.183-.589-.577.12-.857l10.373-3.998c.48-.182.9.11.758.756z" /></svg>,
                                        color: 'bg-[#26A5E4]',
                                        onClick: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(currentOffer.title)}`, '_blank')
                                    },
                                    {
                                        name: 'X',
                                        icon: <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z" /></svg>,
                                        color: 'bg-black/90',
                                        onClick: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(currentOffer.title)}`, '_blank')
                                    },
                                    {
                                        name: 'LinkedIn',
                                        icon: <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" /></svg>,
                                        color: 'bg-[#0077b5]',
                                        onClick: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')
                                    },
                                    {
                                        name: 'Pinterest',
                                        icon: <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.965 1.406-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.259 7.929-7.259 4.164 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592 0 12.017 0z" /></svg>,
                                        color: 'bg-[#BD081C]',
                                        onClick: () => window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&description=${encodeURIComponent(currentOffer.title)}&media=${encodeURIComponent(currentOffer.image_url)}`, '_blank')
                                    },
                                    {
                                        name: 'WhatsApp',
                                        icon: <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>,
                                        color: 'bg-[#25D366]',
                                        onClick: () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(currentOffer.title + ' ' + window.location.href)}`, '_blank')
                                    },
                                    {
                                        name: 'Copy',
                                        icon: <Link size={28} className="text-white" />,
                                        color: 'bg-[#2E7DFF]',
                                        onClick: () => {
                                            navigator.clipboard.writeText(window.location.href);
                                            toast.success('Link copied to clipboard!');
                                        }
                                    },
                                    {
                                        name: 'Repost',
                                        icon: <Repeat2 size={32} className="text-white" />,
                                        color: 'bg-[#FFB800]',
                                        onClick: () => {
                                            toast.success('Reposted successfully!');
                                        }
                                    },
                                    {
                                        name: 'Send to friends',
                                        icon: <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-white stroke-2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>,
                                        color: 'bg-[#FF3B5C]',
                                        onClick: () => {
                                            toast.success('Shared with friends!');
                                        }
                                    }
                                ].map((option) => (
                                    <button
                                        key={option.name}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            option.onClick();
                                        }}
                                        className="flex flex-col items-center gap-2 group transition-transform active:scale-95 flex-shrink-0"
                                    >
                                        <div className={`w-14 h-14 rounded-full ${option.color} flex items-center justify-center text-white shadow-lg group-hover:brightness-110 transition-all`}>
                                            {option.icon}
                                        </div>
                                        <span className="text-white/60 text-[10px] font-medium group-hover:text-white transition-colors whitespace-nowrap">{option.name}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Right Arrow */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    shareScrollRef.current?.scrollBy({ left: 220, behavior: 'smooth' });
                                }}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-8 h-8 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white z-10 opacity-0 group-hover/share:opacity-100 transition-opacity border border-white/10 shadow-lg"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {showNameSetup && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
                    <div className="bg-[#1a1a1a] rounded-[2.5rem] p-10 max-w-sm w-full text-center border border-white/10 shadow-3xl">
                        <div className="w-20 h-20 bg-red-600 rounded-2xl mx-auto mb-8 flex items-center justify-center rotate-12 shadow-red-600/20 shadow-2xl">
                            <img src={logo} alt="Logo" className="w-12 -rotate-12" />
                        </div>
                        <h3 className="text-white text-2xl font-bold mb-3">Set your name</h3>
                        <p className="text-white/50 text-sm mb-8 leading-relaxed">Choose a name to join the conversation and start commenting.</p>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full bg-white/5 text-white px-6 py-4 rounded-2xl outline-none border border-white/10 mb-5 focus:border-red-500 transition-all text-center"
                        />
                        <button
                            onClick={handleNameSetup}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4.5 rounded-2xl transition-all shadow-[0_8px_30px_rgb(220,38,38,0.2)]"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Photos;