
import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useLocation } from 'react-router-dom';
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
    Play
} from 'lucide-react';
import PageLoader from '@/Layout/PageLoader';
import { motion, AnimatePresence } from 'framer-motion';

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

const AllMedia: React.FC = () => {
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
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const [videoReady, setVideoReady] = useState(false);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

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
    const touchStartY = useRef<number>(0);
    const lastScrollTime = useRef<number>(0);

    const location = useLocation();
    const { feedType, initialIndex, initialCategory } = (location.state as { feedType?: string; initialIndex?: number; initialCategory?: string }) || {};

    useEffect(() => {
        // Fetch offers data
        fetch('/mediaData.json')
            .then(response => response.json())
            .then(data => {
                let allOffers: Offer[] = Array.isArray(data) ? data : [data];

                if (feedType === 'favorites') {
                    const savedFavorites = sessionStorage.getItem('favorites');
                    const favoritesSet = new Set<number>(savedFavorites ? JSON.parse(savedFavorites) : []);
                    allOffers = allOffers.filter(o => favoritesSet.has(o.id));
                }

                if (initialCategory && initialCategory !== 'All') {
                    allOffers = allOffers.filter(o => o.tags.includes(initialCategory));
                }

                setOffers(allOffers);

                if (typeof initialIndex === 'number' && initialIndex < allOffers.length) {
                    setCurrentIndex(initialIndex);
                }
            })
            .catch(error => console.error('Error fetching offers:', error));

        const savedUsername = localStorage.getItem('username');
        if (savedUsername) {
            setUsername(savedUsername);
        }
    }, [feedType, initialIndex, initialCategory]);

    useEffect(() => {
        setIsPlaying(true);
        setProgress(0);
        setVideoReady(false);
        setIsDescriptionExpanded(false);
    }, [currentIndex]);

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

    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
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

    const Player = ReactPlayer as any;

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

    return (
        <>
            <div
                ref={containerRef}
                className="h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden no-scrollbar"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onWheel={handleWheel}
            >
                {/* Central Media Container */}
                <div className={`relative transition-all duration-500 ease-in-out bg-black sm:rounded-[2rem] overflow-hidden shadow-2xl sm:border sm:border-white/10 group ${isDescriptionExpanded ? 'w-full h-full sm:h-[700px] sm:max-w-5xl flex flex-col sm:flex-row' : 'w-full h-full sm:h-[700px] sm:max-w-[420px]'}`}>
                    <AnimatePresence initial={false} custom={direction} mode="popLayout">
                        <motion.div
                            key={currentOffer.id}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                            className="absolute inset-0 h-full w-full flex"
                        >
                            {!isDescriptionExpanded && (
                                <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-6 sm:hidden pointer-events-none">
                                    <button className="text-white hover:opacity-80 transition-opacity pointer-events-auto">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6 drop-shadow-lg">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                        </svg>
                                    </button>
                                    <div className="px-5 py-2 bg-black/30 backdrop-blur-lg rounded-full border border-white/10 pointer-events-auto shadow-sm">
                                        <span className="text-white text-[13px] font-bold tracking-tight">Open App</span>
                                    </div>
                                    <button className="text-white hover:opacity-80 transition-opacity pointer-events-auto">
                                        <Search size={24} className="drop-shadow-lg" />
                                    </button>
                                </div>
                            )}

                            <div className={`relative transition-all duration-500 ${isDescriptionExpanded ? 'w-full h-[40%] sm:h-full lg:w-[45%] flex-shrink-0' : 'h-full w-full'}`}>
                                <div className="absolute inset-0">
                                    {currentOffer.video_url ? (
                                        <div className="absolute inset-0 overflow-hidden">
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-black">
                                                {getYouTubeId(currentOffer.video_url) ? (
                                                    <iframe
                                                        width="100%"
                                                        height="100%"
                                                        src={`https://www.youtube.com/embed/${getYouTubeId(currentOffer.video_url)}?autoplay=1&mute=1&controls=0&loop=1&playlist=${getYouTubeId(currentOffer.video_url)}&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&enablejsapi=1&origin=${window.location.origin}`}
                                                        title="YouTube video player"
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                        onLoad={() => {
                                                            setVideoReady(true);
                                                            setIsPlaying(true);
                                                        }}
                                                        className="w-full h-full pointer-events-none"
                                                    ></iframe>
                                                ) : (
                                                    <Player
                                                        url={currentOffer.video_url}
                                                        playing={isPlaying}
                                                        loop
                                                        muted={true}
                                                        playsinline={true}
                                                        width="100%"
                                                        height="100%"
                                                        onReady={() => {
                                                            setVideoReady(true);
                                                            setIsPlaying(true);
                                                        }}
                                                        onProgress={(state: any) => setProgress(state.played * 100)}
                                                        className="pointer-events-none"
                                                        config={{
                                                            file: {
                                                                attributes: {
                                                                    style: { width: '100%', height: '100%', objectFit: 'cover' }
                                                                }
                                                            }
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <div
                                                className="absolute inset-0 z-20 cursor-pointer"
                                                onClick={() => setIsPlaying(!isPlaying)}
                                            />
                                        </div>
                                    ) : (
                                        <img
                                            src={currentOffer.image_url}
                                            alt={currentOffer.title}
                                            className="w-full h-full object-cover"
                                        />
                                    )}

                                    {currentOffer.video_url && (
                                        <>
                                            {!videoReady ? (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 pointer-events-none">
                                                    <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                                </div>
                                            ) : !isPlaying && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10 pointer-events-none">
                                                    <Play size={60} className="text-white opacity-80" fill="white" />
                                                </div>
                                            )}
                                            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/20 z-30">
                                                <div
                                                    className="h-full bg-white transition-all duration-100 ease-linear shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />
                                </div>
                            </div>

                            {isDescriptionExpanded && (
                                <div className="flex-1 flex flex-col bg-[#1a1a1a] relative animate-in slide-in-from-right-10 duration-500 overflow-hidden">
                                    {/* Close Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsDescriptionExpanded(false);
                                        }}
                                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50"
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
                                                <button onClick={() => { }} className="flex flex-col items-center gap-1.5 hover:opacity-80 transition-opacity">
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

                                            {/* Show Comments List Inline, but Footer handles Input */}
                                            {showComments && (
                                                <div className="pt-6 border-t border-white/10 animate-in fade-in duration-300">
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

                                    {/* Bottom Fixed Comment Input in Expanded View */}
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
                                        <h2
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (currentOffer.website_url) {
                                                    window.open(currentOffer.website_url, '_blank');
                                                }
                                            }}
                                            className="text-white font-bold text-[17px] tracking-wide pointer-events-auto cursor-pointer hover:underline"
                                        >
                                            {currentOffer.title} <span className="text-[14px]">🍎</span> mart <span className="text-[14px]">📲</span>
                                        </h2>
                                    </div>

                                    <div className="space-y-0.5">
                                        <div className={`text-white text-[14px] leading-[1.4] drop-shadow-md line-clamp-2`}>
                                            <span className="font-semibold block mb-0.5">💥 Student OFFER ⚡️ Price 83,000 Only</span>
                                            <span className="text-white/95">{currentOffer.subtitle || "🤳 iPhone 13 Pro max ✅ Pta"}</span>
                                            <div className="text-blue-400 font-medium mt-1 flex flex-wrap gap-1">
                                                {currentOffer.tags?.map(tag => (
                                                    <span key={tag}>#{tag.replace(/\s+/g, '')}</span>
                                                )) || <span>#apple #iphone13promax</span>}
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsDescriptionExpanded(true);
                                            }}
                                            className="text-white font-bold text-[14px] hover:opacity-80 transition-opacity"
                                        >
                                            more
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2 pt-1">
                                        <span className="text-white text-[12px] opacity-90">♫</span>
                                        <div className="overflow-hidden w-[180px]">
                                            <div className="flex whitespace-nowrap animate-marquee">
                                                <span className="text-white text-[13px] font-medium mr-12 drop-shadow-sm">
                                                    original sound - {currentOffer.title} - original sound...
                                                </span>
                                                <span className="text-white text-[13px] font-medium mr-12 drop-shadow-sm">
                                                    original sound - {currentOffer.title} - original sound...
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!isDescriptionExpanded && (
                                <div className="absolute right-2 bottom-6 w-14 flex flex-col items-center gap-5 z-20">
                                    <div className="relative mb-2 pointer-events-auto group cursor-pointer">
                                        <div className="w-11 h-11 rounded-full border-2 border-white overflow-hidden bg-gray-500 shadow-xl group-hover:scale-105 transition-transform">
                                            <img src={currentOffer.image_url} alt="User" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4.5 h-4.5 bg-[#EE2B3E] rounded-full flex items-center justify-center text-white border-2 border-black">
                                            <span className="text-[14px] font-bold">+</span>
                                        </div>
                                    </div>

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
                                        <button onClick={(e) => { e.stopPropagation(); }} className="w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                                            <Share2 size={24} className="text-white drop-shadow-lg" />
                                        </button>
                                        <span className="text-white text-[11px] font-bold drop-shadow-md">Share</span>
                                    </div>

                                    <div className="mt-3 pointer-events-none">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1a1a1a] to-[#333] border-[5px] border-[#222] animate-spin-slow overflow-hidden flex items-center justify-center relative shadow-2xl">
                                            <div className="absolute inset-0 bg-[repeating-conic-gradient(#000_0_15deg,#222_0_30deg)] opacity-40"></div>
                                            <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-400 z-10">
                                                <img src={currentOffer.image_url} alt="disk" className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="hidden sm:flex absolute bottom-10 right-10 flex-col gap-3">
                    <button
                        onClick={() => handleScroll('up')}
                        disabled={currentIndex === 0}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${currentIndex === 0
                            ? 'bg-white/5 text-white/20 cursor-not-allowed'
                            : 'bg-black/40 text-white hover:bg-black/60 border border-white/10'
                            }`}
                    >
                        <ChevronUp size={28} />
                    </button>
                    <button
                        onClick={() => handleScroll('down')}
                        disabled={currentIndex === offers.length - 1}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${currentIndex === offers.length - 1
                            ? 'bg-white/5 text-white/20 cursor-not-allowed'
                            : 'bg-black/40 text-white hover:bg-black/60 border border-white/10'
                            }`}
                    >
                        <ChevronDown size={28} />
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 12s linear infinite;
                }
                .animate-spin-slow {
                    animation: spin 6s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 20px; }
            `}</style>

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

export default AllMedia;