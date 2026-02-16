





import React, { useState, useRef, useEffect } from 'react';
import logo from "../../assets/Vector.svg";
import {
    Heart,
    MessageCircle,
    Bookmark,
    Share2,
    X,
    ChevronUp,
    ChevronDown,
    Search
} from 'lucide-react';

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
    const [showComments, setShowComments] = useState(false);
    const [showNameSetup, setShowNameSetup] = useState(false);
    const [username, setUsername] = useState('');
    const [commentText, setCommentText] = useState('');
    const [likedOffers, setLikedOffers] = useState<Set<number>>(new Set());
    const [savedOffers, setSavedOffers] = useState<Set<number>>(new Set());

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

    useEffect(() => {
        // Fetch offers data
        fetch('/mediaData.json')
            .then(response => response.json())
            .then(data => {
                setOffers(Array.isArray(data) ? data : [data]);
            })
            .catch(error => console.error('Error fetching offers:', error));

        // Check if user has set their name
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) {
            setUsername(savedUsername);
        }
    }, []);

    const handleScroll = (direction: 'up' | 'down') => {
        if (direction === 'down' && currentIndex < offers.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else if (direction === 'up' && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
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

    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    const currentOffer = offers[currentIndex];

    if (!currentOffer) {
        return (
            <div className="h-full bg-black flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <>
            {/* Main Feed Container */}
            <div
                ref={containerRef}
                className="h-full bg-[#0F0F0F] flex items-center justify-center relative overflow-hidden no-scrollbar"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {/* Central Media Container - Full screen on mobile, phone-shaped on lg */}
                <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-[420px] sm:aspect-[9/19] bg-black sm:rounded-[3rem] overflow-hidden shadow-2xl sm:border sm:border-white/10 group">

                    {/* Top Navigation - Mobile Only */}
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

                    {/* Video/Image Content */}
                    <div className="absolute inset-0">
                        {currentOffer.video_url && (currentOffer.video_url.includes("youtube.com") || currentOffer.video_url.includes("youtu.be")) ? (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-[177.77vh] h-[56.25vw]">
                                <iframe
                                    src={`https://www.youtube.com/embed/${currentOffer.video_url.includes('watch?v=')
                                        ? currentOffer.video_url.split('watch?v=')[1].split('&')[0]
                                        : currentOffer.video_url.split('/').pop()}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&playlist=${currentOffer.video_url.includes('watch?v=')
                                            ? currentOffer.video_url.split('watch?v=')[1].split('&')[0]
                                            : currentOffer.video_url.split('/').pop()}`}
                                    className="w-full h-full"
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                    style={{
                                        border: 'none',
                                        pointerEvents: 'none'
                                    }}
                                />
                            </div>
                        ) : (
                            <img
                                src={currentOffer.image_url}
                                alt={currentOffer.title}
                                className="w-full h-full object-cover"
                            />
                        )}
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />
                    </div>

                    {/* Content Overlay (Bottom Left) */}
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
                            <div className={`text-white text-[14px] leading-[1.4] drop-shadow-md ${isDescriptionExpanded ? '' : 'line-clamp-2'}`}>
                                <span className="font-semibold block mb-0.5">💥 Student OFFER ⚡️ Price 83,000 Only</span>
                                <span className="text-white/95">{currentOffer.subtitle || "🤳 iPhone 13 Pro max ✅ Pta"}</span>
                                <div className="text-blue-400 font-medium mt-1 flex flex-wrap gap-1">
                                    {currentOffer.tags?.map(tag => (
                                        <span key={tag}>#{tag.replace(/\s+/g, '')}</span>
                                    )) || <span>#apple #iphone13promax</span>}
                                </div>
                            </div>
                            {!isDescriptionExpanded && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsDescriptionExpanded(true);
                                    }}
                                    className="text-white font-bold text-[14px] hover:opacity-80 transition-opacity"
                                >
                                    more
                                </button>
                            )}
                        </div>

                        {/* Music info with Marquee */}
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

                    {/* Right Action Bar (Inside Media) - Always Overlay on Small, but can be side on LG if preferred */}
                    <div className="absolute right-2 bottom-6 w-14 flex flex-col items-center gap-5 z-20">
                        {/* Profile with Plus */}
                        <div className="relative mb-2 pointer-events-auto group cursor-pointer">
                            <div className="w-11 h-11 rounded-full border-2 border-white overflow-hidden bg-gray-500 shadow-xl group-hover:scale-105 transition-transform">
                                <img src={currentOffer.image_url} alt="User" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4.5 h-4.5 bg-[#EE2B3E] rounded-full flex items-center justify-center text-white border-2 border-black">
                                <span className="text-[14px] font-bold">+</span>
                            </div>
                        </div>

                        {/* Like */}
                        <div className="flex flex-col items-center gap-0.5 pointer-events-auto">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleLike(currentOffer.id);
                                }}
                                className="hover:scale-110 transition-transform active:scale-95"
                            >
                                <Heart
                                    size={36}
                                    className={`transition-colors duration-200 drop-shadow-lg ${likedOffers.has(currentOffer.id)
                                        ? 'fill-[#EE2B3E] text-[#EE2B3E]'
                                        : 'text-white'
                                        }`}
                                />
                            </button>
                            <span className="text-white text-[12px] font-bold drop-shadow-md">{formatNumber(currentOffer.likes)}</span>
                        </div>

                        {/* Comment */}
                        <div className="flex flex-col items-center gap-0.5 pointer-events-auto">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowComments(true);
                                }}
                                className="hover:scale-110 transition-transform active:scale-95"
                            >
                                <MessageCircle size={36} className="text-white drop-shadow-lg" />
                            </button>
                            <span className="text-white text-[12px] font-bold drop-shadow-md">{formatNumber(currentOffer.comments + comments.length)}</span>
                        </div>

                        {/* Bookmark */}
                        <div className="flex flex-col items-center gap-0.5 pointer-events-auto">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSave(currentOffer.id);
                                }}
                                className="hover:scale-110 transition-transform active:scale-95"
                            >
                                <Bookmark
                                    size={34}
                                    className={`transition-colors duration-200 drop-shadow-lg ${savedOffers.has(currentOffer.id)
                                        ? 'fill-[#facd3b] text-[#facd3b]'
                                        : 'text-white'
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Share */}
                        <div className="flex flex-col items-center gap-0.5 pointer-events-auto">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // logic for share
                                }}
                                className="w-10 h-10 bg-[#3482F6] rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
                            >
                                <Share2 size={20} className="text-white" />
                            </button>
                            <span className="text-white text-[11px] font-bold drop-shadow-md">Share</span>
                        </div>

                        {/* Music disk */}
                        <div className="mt-3 pointer-events-none">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1a1a1a] to-[#333] border-[5px] border-[#222] animate-spin-slow overflow-hidden flex items-center justify-center relative shadow-2xl">
                                <div className="absolute inset-0 bg-[repeating-conic-gradient(#000_0_15deg,#222_0_30deg)] opacity-40"></div>
                                <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-400 z-10">
                                    <img src={currentOffer.image_url} alt="disk" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Side Navigation Arrows - Outside the central container */}
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

            {/* Custom Animations for Marquee and Spin */}
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
            `}</style>

            {/* Disclaimer */}
            <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4">
                <div className="flex items-start gap-2">
                    <span className="text-yellow-500">⚠️</span>
                    <div>
                        <h3 className="text-yellow-400 font-semibold text-sm mb-1">Disclaimers:</h3>
                        <p className="text-yellow-200/80 text-xs">{currentOffer.disclaimer}</p>
                    </div>
                </div>
            </div>

            {/* Comments Modal */}
            {showComments && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="max-w-2xl w-full bg-[#121212] rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh] border border-white/10">
                        <div className="p-5 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-white font-bold text-lg">Comments ({comments.length})</h3>
                            <button onClick={() => setShowComments(false)} className="text-white/70 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-5 space-y-5">
                            {comments.map((comment) => (
                                <div key={comment.id} className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-xl flex-shrink-0">
                                        {comment.avatar}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-white/80 text-[14px] font-bold">{comment.user}</span>
                                            <span className="text-white/30 text-[12px]">{comment.timestamp}</span>
                                        </div>
                                        <p className="text-white/90 text-[15px] leading-relaxed">{comment.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-5 border-t border-white/5 bg-[#1a1a1a]">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="flex-1 bg-white/5 text-white px-5 py-3 rounded-2xl outline-none focus:ring-1 focus:ring-red-500 text-[15px]"
                                    onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
                                />
                                <button
                                    onClick={handleCommentSubmit}
                                    className="text-red-500 font-bold px-4 text-[15px] hover:opacity-80 transition-opacity"
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Name Setup Modal */}
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