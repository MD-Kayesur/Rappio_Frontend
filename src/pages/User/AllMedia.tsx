/* eslint-disable @typescript-eslint/no-explicit-any */




import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useLocation, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
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
    Play,
    Link,
    Facebook,
    Send,
    Linkedin,
    Mail,
    Code,
    ChevronLeft,
    ChevronRight,
    Repeat2,
} from 'lucide-react';
import PageLoader from '@/Layout/PageLoader';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaXTwitter } from 'react-icons/fa6';

interface Comment {
    id: number;
    user: string;
    avatar: string;
    text: string;
    likes: number;
    isLiked?: boolean;
    timestamp: string;
    replies?: Comment[];
    showReplies?: boolean;
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
    const [showShareModal, setShowShareModal] = useState(false);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [replyTo, setReplyTo] = useState<{ id: number; user: string } | null>(null);
    const commentInputRef = useRef<HTMLInputElement>(null);
    const shareScrollRef = useRef<HTMLDivElement>(null);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || '';
    const [allOffers, setAllOffers] = useState<Offer[]>([]);

    const [comments, setComments] = useState<Comment[]>([
        { id: 1, user: 'Robert Fox', avatar: '👤', text: 'That\'s Amazing', likes: 0, timestamp: '2m' },
        { id: 2, user: 'Marvin McKinney', avatar: '👤', text: 'That\'s Amazing', likes: 0, timestamp: '5m' },
        { id: 3, user: 'Guy Hawkins', avatar: '👤', text: 'That\'s innovative...', likes: 0, timestamp: '10m' }
    ]);

    const containerRef = useRef<HTMLDivElement>(null);
    const touchStartY = useRef<number>(0);
    const lastScrollTime = useRef<number>(0);

    const location = useLocation();
    const { feedType, initialIndex, initialCategory } = (location.state as { feedType?: string; initialIndex?: number; initialCategory?: string }) || {};

    useEffect(() => {
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
                setAllOffers(allOffers);
                if (typeof initialIndex === 'number' && initialIndex < allOffers.length) {
                    setCurrentIndex(initialIndex);
                }
            })
            .catch(error => console.error('Error fetching offers:', error));

        const savedUsername = localStorage.getItem('username');
        if (savedUsername) setUsername(savedUsername);
    }, [feedType, initialIndex, initialCategory]);

    useEffect(() => {
        setIsPlaying(true);
        setProgress(0);
        setVideoReady(false);
        setIsDescriptionExpanded(false);
        setComments([
            { id: 1, user: 'User_' + currentIndex, avatar: '👤', text: `Great content for ${offers[currentIndex]?.title}!`, likes: Math.floor(Math.random() * 50), timestamp: '2h ago' },
            { id: 2, user: 'Fan_' + (currentIndex + 1), avatar: '👤', text: 'Love this vibe!', likes: Math.floor(Math.random() * 30), timestamp: '1h ago' }
        ]);
        setCommentText('');
    }, [currentIndex]);

    useEffect(() => {
        const filtered = allOffers.filter(offer => offer.title.toLowerCase().includes(searchQuery.toLowerCase()));
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
        if (e.deltaY > 50) { handleScroll('down'); lastScrollTime.current = now; }
        else if (e.deltaY < -50) { handleScroll('up'); lastScrollTime.current = now; }
    };

    const handleTouchStart = (e: React.TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
    const handleTouchEnd = (e: React.TouchEvent) => {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY.current - touchEndY;
        if (Math.abs(diff) > 50) { if (diff > 0) handleScroll('down'); else handleScroll('up'); }
    };

    const toggleLike = (offerId: number) => {
        setLikedOffers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(offerId)) newSet.delete(offerId); else newSet.add(offerId);
            return newSet;
        });
    };

    const toggleSave = (offerId: number) => {
        setSavedOffers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(offerId)) newSet.delete(offerId); else newSet.add(offerId);
            sessionStorage.setItem('favorites', JSON.stringify(Array.from(newSet)));
            return newSet;
        });
    };

    const formatNumber = (num: number) => {
        if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
        return num.toString();
    };

    const handleCommentSubmit = () => {
        const savedUsername = localStorage.getItem('username');
        if (!savedUsername && !username) { setShowNameSetup(true); return; }
        if (commentText.trim()) {
            const newComment: Comment = {
                id: Date.now(),
                user: username || savedUsername || 'Anonymous',
                avatar: '👤',
                text: commentText,
                likes: 0,
                timestamp: 'Just now',
                replies: []
            };
            if (replyTo) {
                setComments(prev => prev.map(c => {
                    if (c.id === replyTo.id) return { ...c, replies: [...(c.replies || []), newComment], showReplies: true };
                    return c;
                }));
                setReplyTo(null);
            } else {
                setComments([newComment, ...comments]);
            }
            setCommentText('');
        }
    };

    const toggleCommentLike = (commentId: number, isReply: boolean = false, parentId?: number) => {
        if (isReply && parentId) {
            setComments(prev => prev.map(c => {
                if (c.id === parentId) {
                    return { ...c, replies: c.replies?.map(r => r.id === commentId ? { ...r, likes: r.isLiked ? r.likes - 1 : r.likes + 1, isLiked: !r.isLiked } : r) };
                }
                return c;
            }));
        } else {
            setComments(prev => prev.map(c => c.id === commentId ? { ...c, likes: c.isLiked ? c.likes - 1 : c.likes + 1, isLiked: !c.isLiked } : c));
        }
    };

    const handleReplyClick = (commentId: number, user: string) => { setReplyTo({ id: commentId, user }); setCommentText(``); commentInputRef.current?.focus(); };
    const toggleReplies = (commentId: number) => { setComments(prev => prev.map(c => c.id === commentId ? { ...c, showReplies: !c.showReplies } : c)); };

    const handleNameSetup = () => { if (username.trim()) { localStorage.setItem('username', username); setShowNameSetup(false); } };

    const variants = {
        enter: (direction: string) => ({ y: direction === 'down' ? '100%' : '-100%', opacity: 1 }),
        center: { y: 0, opacity: 1 },
        exit: (direction: string) => ({ y: direction === 'down' ? '-100%' : '100%', opacity: 1 }),
    };

    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const currentOffer = offers[currentIndex];
    if (!currentOffer) return <div className="h-full bg-black flex items-center justify-center"><PageLoader /></div>;

    const Player = ReactPlayer as any;

    const handleExpandAndComment = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowComments((prev) => !prev);
    };

    return (
        <>
            <div ref={containerRef} className="h-screen sm:h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden no-scrollbar" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onWheel={handleWheel}>
                <div className={`relative transition-all duration-500 ease-in-out sm:max-w-[550px] w-full h-full sm:h-[85vh] ${showComments ? 'sm:-translate-x-[320px]' : 'sm:translate-x-0'} z-[120]`}>
                    <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between p-6 pr-16 sm:hidden pointer-events-none">
                        <div className={`pointer-events-auto transition-all duration-300 ${isSearchExpanded || searchQuery ? 'flex-1 relative group' : 'w-10'}`}>
                            {!isSearchExpanded && !searchQuery ? (
                                <button
                                    onClick={() => setIsSearchExpanded(true)}
                                    className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10"
                                >
                                    <Search size={20} />
                                </button>
                            ) : (
                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/60"><Search size={18} /></div>
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchParams({ q: e.target.value }, { replace: true })}
                                        className="w-full py-2.5 pl-11 pr-11 bg-black/20 backdrop-blur-md text-white text-sm border border-white/10 rounded-full focus:outline-none focus:border-white/30 transition-all placeholder-white/40"
                                        autoFocus
                                        onBlur={() => !searchQuery && setIsSearchExpanded(false)}
                                    />
                                    {searchQuery ? (
                                        <button onClick={(e) => { e.stopPropagation(); setSearchParams({}, { replace: true }); }} className="absolute inset-y-0 right-0 flex items-center pr-4 text-white"><X size={12} /></button>
                                    ) : (
                                        <button onClick={(e) => { e.stopPropagation(); setIsSearchExpanded(false); }} className="absolute inset-y-0 right-0 flex items-center pr-4 text-white"><X size={12} /></button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <AnimatePresence initial={false} custom={direction} mode="popLayout">
                        <motion.div key={currentOffer.id} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }} className="absolute inset-0 h-full w-full block sm:flex sm:flex-row sm:items-end sm:gap-5">
                            {/* Main Card - Full Height Video */}
                            <div className="w-full h-full sm:flex-1 bg-[#121212] sm:rounded-[1rem] overflow-hidden shadow-2xl sm:border sm:border-white/10 relative group">
                                <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
                                    {currentOffer.video_url ? (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="absolute min-w-full min-h-full w-[177.77vh] h-[100vh] sm:w-[177.77vh] sm:h-[85vh]">
                                                {getYouTubeId(currentOffer.video_url) ? (
                                                    <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${getYouTubeId(currentOffer.video_url)}?autoplay=1&mute=1&controls=0&loop=1&playlist=${getYouTubeId(currentOffer.video_url)}&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&enablejsapi=1&origin=${window.location.origin}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" onLoad={() => { setVideoReady(true); setIsPlaying(true); }} className="w-full h-full pointer-events-none"></iframe>
                                                ) : (
                                                    <Player url={currentOffer.video_url} playing={isPlaying} loop muted={true} playsinline={true} width="100%" height="100%" onReady={() => { setVideoReady(true); setIsPlaying(true); }} onProgress={(state: any) => setProgress(state.played * 100)} className="pointer-events-none" style={{ position: 'absolute', top: 0, left: 0 }} config={{ file: { attributes: { style: { width: '100%', height: '100%', objectFit: 'cover' } } } }} />
                                                )}
                                            </div>
                                            <div className="absolute inset-0 z-20 cursor-pointer" onClick={() => setIsPlaying(!isPlaying)} />
                                        </div>
                                    ) : (
                                        <img src={currentOffer.image_url} alt={currentOffer.title} className="w-full h-full object-cover" />
                                    )}
                                    {currentOffer.video_url && (
                                        <>
                                            {!videoReady ? <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 pointer-events-none"><div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div></div> : !isPlaying && <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10 pointer-events-none"><Play size={60} className="text-white opacity-80" fill="white" /></div>}
                                            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/20 z-30"><div className="h-full bg-white transition-all duration-100 ease-linear shadow-[0_0_8px_rgba(255,255,255,0.8)]" style={{ width: `${progress}%` }} /></div>
                                        </>
                                    )}
                                    {/* Gradient for text readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-20" />
                                </div>

                                {/* Overlaid Info Area */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 pr-16 sm:pr-6 space-y-3 z-30 pointer-events-none">
                                    {/* Claim Offer Button inside overlay */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); if (currentOffer.website_url) window.open(currentOffer.website_url, '_blank'); }}
                                        className="glow-on-hover w-full sm:w-auto"
                                        type="button"
                                    >
                                        {currentOffer.cta || 'CLAIM OFFER'}
                                    </button>

                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center overflow-hidden border border-white/20">
                                            <img src={logo} alt="Logo" className="w-5" />
                                        </div>
                                        <h2 className="text-white font-bold text-[20px] tracking-tight cursor-pointer hover:underline pointer-events-auto" onClick={() => currentOffer.website_url && window.open(currentOffer.website_url, '_blank')}>{currentOffer.title}</h2>
                                    </div>

                                    <div className="space-y-1">
                                        <div className={`text-white/90 text-[14px] leading-relaxed drop-shadow-lg ${isDescriptionExpanded ? '' : 'line-clamp-2'}`}>
                                            <span className="font-semibold block mb-0.5 text-white">{currentOffer.subtitle}</span>
                                            {currentOffer.description}
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); setIsDescriptionExpanded(!isDescriptionExpanded); }} className="text-white font-bold text-[13px] hover:opacity-70 transition-opacity pointer-events-auto">
                                            {isDescriptionExpanded ? 'See Less' : 'See More'}
                                        </button>
                                    </div>





                                    {/* Tags */}
                                    {/* {currentOffer.tags && currentOffer.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {currentOffer.tags.map((tag, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-white/80 text-[11px] font-medium border border-white/10 whitespace-nowrap">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )} */}
                                </div>
                            </div>

                            {/* Sidebar Icons (Still separate from card) */}
                            <div className="absolute right-2 bottom-20 sm:static w-14 flex flex-col items-center gap-4 sm:gap-6 sm:mb-8 flex-shrink-0 z-[120]">
                                <div className="hidden sm:flex flex-col items-center gap-1.5">
                                    {/* <button className="w-12 h-12 rounded-full bg-neutral-800/80 backdrop-blur-md hover:bg-neutral-700/80 flex items-center justify-center text-white transition-all shadow-lg border border-white/5">
                                        <Search size={22} />
                                    </button> */}
                                    {/* <div className="hidden sm:flex flex-col items-center gap-1.5">
                                        <img className="w-12 h-12 rounded-full bg-neutral-800/80 backdrop-blur-md hover:bg-neutral-700/80 flex items-center justify-center text-white transition-all shadow-lg border border-white/5" src={currentOffer.image_url} alt="" />

                                    </div> */}
                                </div>

                                <div className="flex flex-col items-center gap-1.5">
                                    <button onClick={(e) => { e.stopPropagation(); toggleLike(currentOffer.id); }} className="w-12 h-12 rounded-full bg-neutral-800/80 backdrop-blur-md hover:bg-neutral-700/80 flex items-center justify-center transition-all shadow-lg border border-white/5">
                                        <Heart size={22} className={`${likedOffers.has(currentOffer.id) ? 'fill-[#EE2B3E] text-[#EE2B3E]' : 'text-white'}`} />
                                    </button>
                                    <span className="text-white/80 text-[12px] font-bold">{formatNumber(currentOffer.likes)}</span>
                                </div>

                                <div className="flex flex-col items-center gap-1.5">
                                    <button onClick={handleExpandAndComment} className="w-12 h-12 rounded-full bg-neutral-800/80 backdrop-blur-md hover:bg-neutral-700/80 flex items-center justify-center text-white transition-all shadow-lg border border-white/5">
                                        <MessageCircle size={22} />
                                    </button>
                                    <span className="text-white/80 text-[12px] font-bold">{formatNumber(currentOffer.comments + comments.length)}</span>
                                </div>

                                <div className="flex flex-col items-center gap-1.5">
                                    <button onClick={(e) => { e.stopPropagation(); toggleSave(currentOffer.id); }} className="w-12 h-12 rounded-full bg-neutral-800/80 backdrop-blur-md hover:bg-neutral-700/80 flex items-center justify-center transition-all shadow-lg border border-white/5">
                                        <Bookmark size={22} className={`${savedOffers.has(currentOffer.id) ? 'fill-[#facd3b] text-[#facd3b]' : 'text-white'}`} />
                                    </button>
                                </div>

                                <div className="flex flex-col items-center gap-1.5">
                                    <button onClick={(e) => { e.stopPropagation(); setShowShareModal(true); }} className="w-12 h-12 rounded-full bg-neutral-800/80 backdrop-blur-md hover:bg-neutral-700/80 flex items-center justify-center text-white transition-all shadow-lg border border-white/5">
                                        <Share2 size={22} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
                <div className={`hidden sm:flex absolute bottom-10 flex-col gap-3 transition-all duration-300 z-[120] ${showComments ? 'right-[520px]' : 'right-10'}`}>
                    <button onClick={() => handleScroll('up')} disabled={currentIndex === 0} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${currentIndex === 0 ? 'bg-white/5 text-white/20' : 'bg-black/40 text-white hover:bg-black/60 border border-white/10'}`}><ChevronUp size={28} /></button>
                    <button onClick={() => handleScroll('down')} disabled={currentIndex === offers.length - 1} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${currentIndex === offers.length - 1 ? 'bg-white/5 text-white/20' : 'bg-black/40 text-white hover:bg-black/60 border border-white/10'}`}><ChevronDown size={28} /></button>
                </div>
            </div>

            <AnimatePresence>
                {showComments && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onWheel={handleWheel} className="fixed inset-0   sm:bg-transparent z-[9998] pointer-events-none" />
                        <motion.div initial={window.innerWidth < 640 ? { y: '100%' } : { x: '100%' }} animate={window.innerWidth < 640 ? { y: 0 } : { x: 0 }} exit={window.innerWidth < 640 ? { y: '100%' } : { x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed bottom-0 right-0 w-full h-[70vh] sm:h-full sm:w-[500px] backdrop-blur-lg  z-[9999] flex flex-col border-t sm:border-t-0 sm:border-l border-white/10 rounded-t-[20px] overflow-hidden">
                            <div className="px-5 bg-black py-4 flex items-center justify-between border-b border-white/5 sticky top-0 z-20"><h3 className="text-white font-bold text-[15px] sm:text-lg flex items-center gap-2">{formatNumber(comments.length + currentOffer.comments)} Comments</h3><button onClick={() => setShowComments(false)} className="p-1.5 hover:bg-white/10 rounded-full text-white/80"><X size={24} /></button></div>
                            <div className="flex-1 overflow-y-auto px-5 py-4 custom-scrollbar space-y-6">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="flex flex-col gap-1">
                                        <div className="flex gap-3 group">
                                            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-base flex-shrink-0 overflow-hidden">{typeof comment.avatar === 'string' && comment.avatar.length > 2 ? <img src={comment.avatar} alt={comment.user} className="w-full h-full object-cover" /> : <span className="text-lg">{comment.avatar}</span>}</div>
                                            <div className="flex-1">
                                                <div className="flex flex-col mb-1"><span className="text-white/50 font-bold text-[13px]">{comment.user}</span><p className="text-white text-[14px] sm:text-[15px]">{comment.text}</p></div>
                                                <div className="flex items-center gap-4 mt-2"><span className="text-white/40 text-[12px]">{comment.timestamp}</span><button onClick={() => handleReplyClick(comment.id, comment.user)} className="text-white/40 text-[12px] font-bold">Reply</button><div className="flex-1" /><button onClick={() => toggleCommentLike(comment.id)} className={`transition-colors ${comment.isLiked ? 'text-red-500' : 'text-white/40'}`}><Heart size={16} fill={comment.isLiked ? 'currentColor' : 'none'} /></button><span className="text-white/40 text-[11px]">{comment.likes}</span></div>
                                                {comment.replies && comment.replies.length > 0 && <button onClick={() => toggleReplies(comment.id)} className="flex items-center gap-1.5 text-white/40 text-[12px] font-bold mt-3">View {comment.replies.length} replies</button>}
                                                <AnimatePresence>{comment.showReplies && comment.replies?.map(reply => <div key={reply.id} className="flex gap-3 mt-4 ml-4"><div className="w-6 h-6 rounded-full bg-white/10 overflow-hidden flex items-center justify-center">{typeof reply.avatar === 'string' && reply.avatar.length > 2 ? <img src={reply.avatar} alt={reply.user} /> : <span>{reply.avatar}</span>}</div><div className="flex-1"><span className="text-white/50 text-[11px] font-bold">{reply.user}</span><p className="text-white text-[12px]">{reply.text}</p><div className="mt-2 flex items-center gap-4"><span className="text-white/40 text-[10px]">{reply.timestamp}</span><button onClick={() => toggleCommentLike(reply.id, true, comment.id)} className={reply.isLiked ? 'text-red-500' : 'text-white/40'}><Heart size={12} fill={reply.isLiked ? 'currentColor' : 'none'} /></button></div></div></div>)}</AnimatePresence>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 bg-transparent border-t border-white/5">
                                <div className="flex flex-col gap-2">
                                    {replyTo && (
                                        <div className="flex items-center justify-between px-4 py-1 bg-white/5 rounded-t-lg">
                                            <span className="text-[12px] text-white/60">Replying to {replyTo.user}</span>
                                            <button onClick={() => setReplyTo(null)} className="text-white/40"><X size={14} /></button>
                                        </div>
                                    )}
                                    <div className="flex gap-3 items-center bg-black p-2 rounded-full border border-white/10">
                                        <input
                                            ref={commentInputRef}
                                            type="text"
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            onFocus={() => { if (!username) setShowNameSetup(true); }}
                                            onClick={() => { if (!username) setShowNameSetup(true); }}
                                            placeholder="Add a comment..."
                                            className="flex-1 bg-transparent text-white px-4 outline-none"
                                            onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
                                        />
                                        <button
                                            onClick={handleCommentSubmit}
                                            className={commentText.trim() ? 'text-[#FE2C55]' : 'text-white/20'}
                                        >
                                            Post
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showShareModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={() => setShowShareModal(false)}>
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-black/20 backdrop-blur-lg rounded-3xl p-6 w-full max-w-[450px] relative border border-white/10" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center mb-8"><h3 className="text-white text-lg font-semibold">Share to</h3><button onClick={() => setShowShareModal(false)} className="absolute top-5 right-5 text-white/60"><X size={24} /></button></div>
                            <div className="relative group/share">
                                <div className="flex overflow-x-auto gap-5 no-scrollbar pb-2 px-1 scroll-smooth" ref={shareScrollRef}>
                                    {[
                                        { name: 'Repost', icon: <Repeat2 size={24} />, color: 'bg-[#facd3b]', onClick: () => toast.success('Reposted!') },
                                        { name: 'Send to friends', icon: <Send size={24} />, color: 'bg-[#ff3b5c]', onClick: () => toast.success('Opening messages...') },
                                        { name: 'Copy Link', icon: <Link size={24} />, color: 'bg-[#2E7DFF]', onClick: () => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); } },
                                        { name: 'WhatsApp', icon: <FaWhatsapp size={26} />, color: 'bg-[#25D366]', onClick: () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(window.location.href)}`) },
                                        { name: 'Embed', icon: <Code size={22} />, color: 'bg-[#0096a7]', onClick: () => { navigator.clipboard.writeText(`<iframe src="${window.location.href}" width="100%" height="450px" frameborder="0"></iframe>`); toast.success('Embed code copied!'); } },
                                        { name: 'Facebook', icon: <Facebook size={22} />, color: 'bg-[#1877F2]', onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`) },
                                        { name: 'Telegram', icon: <Send size={22} />, color: 'bg-[#24A1DE]', onClick: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}`) },
                                        { name: 'X', icon: <FaXTwitter size={22} />, color: 'bg-[#000000]', onClick: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`) },
                                        { name: 'LinkedIn', icon: <Linkedin size={22} />, color: 'bg-[#0A66C2]', onClick: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`) },
                                        { name: 'Email', icon: <Mail size={22} />, color: 'bg-[#EA4335]', onClick: () => window.open(`mailto:?subject=Check this out&body=${encodeURIComponent(window.location.href)}`) },
                                    ].map(option => (
                                        <button key={option.name} onClick={option.onClick} className="flex flex-col items-center gap-2 flex-shrink-0 transition-transform active:scale-95 text-center w-[72px]">
                                            <div className={`w-14 h-14 rounded-full ${option.color} flex items-center justify-center text-white shadow-lg`}>
                                                {option.icon}
                                            </div>
                                            <span className="text-white/60 text-[11px] font-medium leading-tight">{option.name}</span>
                                        </button>
                                    ))}
                                </div>
                                <button onClick={() => shareScrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' })} className="absolute left-0 top-7 -translate-x-4 w-10 h-10 bg-[#222] text-white rounded-full flex items-center justify-center shadow-xl border border-white/10 opacity-0 group-hover/share:opacity-100 transition-opacity z-10"><ChevronLeft size={24} /></button>
                                <button onClick={() => shareScrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' })} className="absolute right-0 top-7 translate-x-4 w-10 h-10 bg-[#222] text-white rounded-full flex items-center justify-center shadow-xl border border-white/10 opacity-0 group-hover/share:opacity-100 transition-opacity z-10"><ChevronRight size={24} /></button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {showNameSetup && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[9999] flex items-center justify-center p-4">
                    <div className="bg-black/20 backdrop-blur-lg rounded-[2.5rem] p-10 max-w-sm w-full text-center border border-white/10 relative">
                        <button onClick={() => setShowNameSetup(false)} className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                        <div className="w-20 h-20 bg-red-600 rounded-2xl mx-auto mb-8 flex items-center justify-center rotate-12"><img src={logo} alt="Logo" className="w-12 -rotate-12" /></div>
                        <h3 className="text-white text-2xl font-bold mb-3">Set your name</h3>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your name" className="w-full bg-white/5 text-white px-6 py-4 rounded-2xl outline-none border border-white/10 mb-5 text-center" />
                        <button onClick={handleNameSetup} className="w-full bg-red-600 text-white font-bold py-4.5 rounded-2xl">Get Started</button>
                    </div>
                </div>
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 20px; }
                @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin-slow { animation: spin-slow 4s linear infinite; }
                @keyframes gradient-xy { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
                .animate-gradient-xy { animation: gradient-xy 3s ease infinite; }
                @keyframes shine { 100% { transform: translateX(200%) skewX(12deg); } }
                .animate-shine { animation: shine 1s ease-in-out infinite; }

                .glow-on-hover {
                    position: relative;
                    background: transparent;
                    z-index: 0;
                    overflow: hidden;
                    padding: 14px 40px;
                    border-radius: 9999px;
                    border: none;
                    color: white;
                    font-weight: 800;
                    font-size: 15px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                }

                .glow-on-hover::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 500%;
                    height: 500%;
                    background: conic-gradient(
                        #ff0000, #ff7300, #fffb00, #48ff00, 
                        #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000
                    );
                    transform: translate(-50%, -50%);
                    animation: spin-border 4s linear infinite;
                    z-index: -2;
                }

                .glow-on-hover::after {
                    content: '';
                    position: absolute;
                    inset: 3px;
                    background: #000;
                    border-radius: 9999px;
                    z-index: -1;
                    transition: background 0.3s;
                }

                .glow-on-hover:hover::after {
                    background: #111;
                }

                @keyframes spin-border {
                    from { transform: translate(-50%, -50%) rotate(0deg); }
                    to { transform: translate(-50%, -50%) rotate(360deg); }
                }
            `}</style>
        </>
    );
};

export default AllMedia;