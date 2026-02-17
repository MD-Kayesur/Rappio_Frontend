
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from "../../assets/Vector.svg";
import {
    Heart,
    MessageCircle,
    Bookmark,
    Share2,
    X,
    ChevronUp,
    ChevronDown
} from 'lucide-react';
import PageLoader from '@/Layout/PageLoader';

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

    useEffect(() => {
        // Fetch offers data
        fetch('/mediaData.json')
            .then(response => response.json())
            .then(data => {
                const allOffers = Array.isArray(data) ? data : [data];
                // Filter only items with images and no video for Photos page if needed, 
                // but let's keep it consistent with what was there before
                setOffers(allOffers);
            })
            .catch(error => console.error('Error fetching offers:', error));

        const savedUsername = localStorage.getItem('username');
        if (savedUsername) {
            setUsername(savedUsername);
        }
    }, []);

    useEffect(() => {
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
                className="h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden no-scrollbar"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onWheel={handleWheel}
            >
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
                            <div className={`relative transition-all duration-500 ${isDescriptionExpanded ? 'w-full h-[40%] sm:h-full lg:w-[45%] flex-shrink-0' : 'h-full w-full'}`}>
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

                                            {/* Show Comments List Inline */}
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
                                        <button onClick={(e) => { e.stopPropagation(); }} className="w-10 h-10 rounded-full flex items-center justify-center transition-colors">
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