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

const Videos: React.FC = () => {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const shareScrollRef = useRef<HTMLDivElement>(null);
    const [flippedCardId, setFlippedCardId] = useState<number | null>(null);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || '';
    const [allOffers, setAllOffers] = useState<Offer[]>([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const [comments, setComments] = useState<Comment[]>([
        { id: 1, user: 'Robert Fox', avatar: '👤', text: 'That\'s Amazing', likes: 0, timestamp: '2m' },
        { id: 2, user: 'Marvin McKinney', avatar: '👤', text: 'That\'s Amazing', likes: 0, timestamp: '5m' },
        { id: 3, user: 'Guy Hawkins', avatar: '👤', text: 'That\'s innovative...', likes: 0, timestamp: '10m' }
    ]);

    const containerRef = useRef<HTMLDivElement>(null);

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
        if (!containerRef.current) return;
        const itemHeight = containerRef.current.clientHeight;
        if (scrollDirection === 'down' && currentIndex < offers.length - 1) {
            containerRef.current.scrollTo({ top: (currentIndex + 1) * itemHeight, behavior: 'smooth' });
        } else if (scrollDirection === 'up' && currentIndex > 0) {
            containerRef.current.scrollTo({ top: (currentIndex - 1) * itemHeight, behavior: 'smooth' });
        }
    };

    const handleOnScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const scrollPos = e.currentTarget.scrollTop;
        const itemHeight = e.currentTarget.clientHeight;
        if (itemHeight === 0) return;
        const newIndex = Math.round(scrollPos / itemHeight);
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < offers.length) {
            setCurrentIndex(newIndex);
            setFlippedCardId(null);
        }
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
            <div
                ref={containerRef}
                className="h-[100dvh] sm:h-[calc(100vh-80px)] w-full overflow-y-auto snap-y snap-mandatory no-scrollbar scroll-smooth flex flex-col items-center"
                onScroll={handleOnScroll}
            >
                {offers.map((offer, index) => (
                    <div key={offer.id} className="w-full h-full flex-shrink-0 snap-start snap-always flex items-end sm:items-center justify-center relative">
                        <div className={`relative transition-all duration-500 ease-in-out sm:max-w-[550px] w-full h-[100dvh] sm:h-[85vh] ${showComments ? 'sm:-translate-x-[320px]' : 'sm:translate-x-0'} z-[120]`}>


                            <div className="absolute inset-0 h-full w-full block sm:flex sm:flex-row sm:items-end sm:gap-5" style={{ perspective: "1200px" }}>
                                {/* Main Card - Full Height Video */}
                                <motion.div
                                    animate={{ rotateY: flippedCardId === offer.id ? 180 : 0 }}
                                    transition={{ duration: 0.7, ease: "easeInOut" }}
                                    style={{ transformStyle: "preserve-3d" }}
                                    className="w-full h-full sm:flex-1 bg-[#121212] sm:rounded-[1rem] shadow-2xl sm:border sm:border-white/10 relative group"
                                >
                                    {/* Front Side */}
                                    <div
                                        className="absolute inset-0 w-full h-full overflow-hidden bg-black sm:rounded-[1rem] cursor-pointer"
                                        style={{ backfaceVisibility: "hidden" }}
                                        onClick={() => {
                                            if (index === currentIndex) {
                                                if (window.innerWidth < 640) {
                                                    setFlippedCardId(flippedCardId === offer.id ? null : offer.id);
                                                } else {
                                                    setIsPlaying(!isPlaying);
                                                }
                                            }
                                        }}
                                    >
                                        <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
                                            {offer.video_url ? (
                                                <div className="absolute inset-0 flex items-end justify-center">
                                                    <div className="absolute min-w-full min-h-full w-[177.77vh] h-[100dvh] sm:w-[177.77vh] sm:h-[85vh]">
                                                        {getYouTubeId(offer.video_url) ? (
                                                            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${getYouTubeId(offer.video_url)}?autoplay=${index === currentIndex ? 1 : 0}&mute=1&controls=0&loop=1&playlist=${getYouTubeId(offer.video_url)}&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&enablejsapi=1&origin=${window.location.origin}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" className="w-full h-full pointer-events-none"></iframe>
                                                        ) : (
                                                            <Player url={offer.video_url} playing={index === currentIndex && isPlaying} loop muted={true} playsinline={true} width="100%" height="100%" onReady={() => index === currentIndex && setVideoReady(true)} onProgress={(state: any) => index === currentIndex && setProgress(state.played * 100)} className="pointer-events-none" style={{ position: 'absolute', top: 0, left: 0 }} config={{ file: { attributes: { style: { width: '100%', height: '100%', objectFit: 'cover' } } } }} />
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <img src={offer.image_url} alt={offer.title} className="w-full h-full object-cover" />
                                            )}
                                            {offer.video_url && index === currentIndex && (
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
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (offer.website_url) window.open(offer.website_url, '_blank');
                                                }}
                                                type="button"
                                                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md text-white border border-white/20 transition-all duration-300 ease-in-out hover:bg-white hover:text-black hover:shadow-xl hover:scale-105 active:scale-95 pointer-events-auto"
                                            >
                                                {offer.cta || 'CLAIM OFFER'}
                                            </button>

                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center overflow-hidden border border-white/20">
                                                    <img src={logo} alt="Logo" className="w-5" />
                                                </div>
                                                <h2 className="text-white font-bold text-[20px] tracking-tight cursor-pointer hover:underline pointer-events-auto" onClick={(e) => { e.stopPropagation(); offer.website_url && window.open(offer.website_url, '_blank'); }}>{offer.title}</h2>
                                            </div>

                                            <div className="space-y-1">
                                                <div className={`text-white/90 text-[14px] leading-relaxed drop-shadow-lg ${isDescriptionExpanded ? '' : 'line-clamp-2'}`}>
                                                    <span className="font-semibold block mb-0.5 text-white">{offer.subtitle}</span>
                                                    {offer.description}
                                                </div>
                                                <button onClick={(e) => { e.stopPropagation(); setIsDescriptionExpanded(!isDescriptionExpanded); }} className="text-white font-bold text-[13px] hover:opacity-70 transition-opacity pointer-events-auto">
                                                    {isDescriptionExpanded ? 'See Less' : 'See More'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Back Side */}
                                    <div
                                        className="absolute inset-0 w-full h-full bg-[#121212] sm:rounded-[1rem] overflow-hidden p-6 sm:p-8 flex flex-col gap-6 custom-scrollbar cursor-pointer"
                                        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                                        onClick={() => setFlippedCardId(null)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
                                                <img src={logo} alt="Logo" className="w-8" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-white text-xl font-bold truncate">{offer.title}</h3>
                                                <p className="text-white/60 text-sm truncate">{offer.subtitle}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar">
                                            <div className="space-y-2">
                                                <h4 className="text-white/80 font-bold text-xs uppercase tracking-wider">About this offer</h4>
                                                <p className="text-white/70 text-[15px] leading-relaxed">{offer.description}</p>
                                            </div>

                                            {offer.tags && offer.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 py-2">
                                                    {offer.tags.map((tag, idx) => (
                                                        <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-white/50 text-[10px] font-bold uppercase tracking-tight">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {offer.terms_highlights && (
                                                <div className="space-y-3 pt-2">
                                                    <h4 className="text-white/80 font-bold text-xs uppercase tracking-wider">Key Highlights</h4>
                                                    <ul className="space-y-2.5">
                                                        {offer.terms_highlights.map((term, idx) => (
                                                            <li key={idx} className="flex items-start gap-3 text-white/60 text-sm">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-[#FF2D55] mt-1.5 shrink-0" />
                                                                {term}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-4 pt-6 mt-auto border-t border-white/10">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (offer.website_url) window.open(offer.website_url, '_blank');
                                                }}
                                                className="w-full bg-[#FF2D55] text-white font-bold py-4 rounded-2xl hover:bg-[#ff4d6d] transition-all shadow-[0_0_20px_rgba(255,45,85,0.3)] active:scale-95"
                                            >
                                                {offer.cta || 'CLAIM OFFER NOW'}
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFlippedCardId(null);
                                                }}
                                                className="w-full bg-white/5 text-white/60 font-medium py-3 rounded-2xl hover:bg-white/10 transition-all text-sm"
                                            >
                                                Back to Video
                                            </button>
                                            {offer.disclaimer && (
                                                <p className="text-white/20 text-[10px] text-center leading-tight">
                                                    {offer.disclaimer}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Sidebar Icons (Still separate from card) */}
                                <div className="absolute right-2 bottom-20 sm:static w-14 flex flex-col items-center gap-4 sm:gap-6 sm:mb-8 flex-shrink-0 z-[120]">
                                    {/* <div className="hidden sm:flex flex-col items-center gap-1.5">
                                        <button className="w-12 h-12 rounded-full bg-neutral-800/80 backdrop-blur-md hover:bg-neutral-700/80 flex items-center justify-center text-white transition-all shadow-lg border border-white/5">
                                        <Search size={22} />
                                    </button>
                                        <div className="hidden sm:flex flex-col items-center gap-1.5">
                                        <img className="w-12 h-12 rounded-full bg-neutral-800/80 backdrop-blur-md hover:bg-neutral-700/80 flex items-center justify-center text-white transition-all shadow-lg border border-white/5" src={offer.image_url} alt="" />

                                    </div>
                                    </div> */}

                                    {/* <div className="flex flex-col items-center gap-1.5">
                                          <button
                                        onClick={() => {
                                            window.dispatchEvent(new CustomEvent('open-sidebar-search'));
                                        }}
                                        className="w-10 h-10  hover:bg-neutral-700/80 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10"
                                    >
                                        <Search size={20} />
                                    </button>
                                    </div> */}
                                    <div className="flex flex-col items-center gap-1.5">
                                        <button onClick={(e) => { e.stopPropagation(); toggleLike(offer.id); }} className="w-12 h-12 rounded-full  backdrop-blur-md hover:bg-neutral-700/80 flex items-center justify-center transition-all shadow-lg border border-white/5">
                                            <Heart size={22} className={`${likedOffers.has(offer.id) ? 'fill-[#EE2B3E] text-[#EE2B3E]' : 'text-white'}`} />
                                        </button>
                                        <span className="text-white/80 text-[12px] font-bold">{formatNumber(offer.likes + (index === currentIndex ? 0 : 0))}</span>
                                    </div>

                                    <div className="flex flex-col items-center gap-1.5">
                                        <button onClick={handleExpandAndComment} className="w-12 h-12 rounded-full  backdrop-blur-md hover:bg-neutral-700/80 flex items-center justify-center text-white transition-all shadow-lg border border-white/5">
                                            <MessageCircle size={22} />
                                        </button>
                                        <span className="text-white/80 text-[12px] font-bold">{formatNumber(offer.comments + (index === currentIndex ? comments.length : 0))}</span>
                                    </div>

                                    <div className="flex flex-col items-center gap-1.5">
                                        <button onClick={(e) => { e.stopPropagation(); toggleSave(offer.id); }} className="w-12 h-12 rounded-full  backdrop-blur-md hover:bg-neutral-700/80 flex items-center justify-center transition-all shadow-lg border border-white/5">
                                            <Bookmark size={22} className={`${savedOffers.has(offer.id) ? 'fill-[#facd3b] text-[#facd3b]' : 'text-white'}`} />
                                        </button>
                                    </div>

                                    <div className="flex flex-col items-center gap-1.5">
                                        <button onClick={(e) => { e.stopPropagation(); setShowShareModal(true); }} className="w-12 h-12 rounded-full  backdrop-blur-md hover:bg-neutral-700/80 flex items-center justify-center text-white transition-all shadow-lg border border-white/5">
                                            <Share2 size={22} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Fixed Mobile Search Button */}
            <div className="fixed top-1 left-1 z-[200] sm:hidden">
                <button
                    id="mobile-search-button"
                    onClick={() => {
                        window.dispatchEvent(new CustomEvent('open-sidebar-search'));
                    }}
                    className="w-12 h-12 bg-neutral-800/80 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 shadow-lg active:scale-95 transition-all"
                >
                    <Search size={20} />
                </button>
            </div>

            <motion.div
                animate={{
                    right: showComments ? (window.innerWidth < 640 ? 10 : 520) : 40,
                    opacity: 1
                }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="hidden sm:flex absolute bottom-10 flex-col gap-3 z-[120]"
            >
                <button onClick={() => handleScroll('up')} disabled={currentIndex === 0} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${currentIndex === 0 ? 'bg-white/5 text-white/20' : 'bg-black/40 text-white hover:bg-black/60 border border-white/10'}`}><ChevronUp size={28} /></button>
                <button onClick={() => handleScroll('down')} disabled={currentIndex === offers.length - 1} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${currentIndex === offers.length - 1 ? 'bg-white/5 text-white/20' : 'bg-black/40 text-white hover:bg-black/60 border border-white/10'}`}><ChevronDown size={28} /></button>
            </motion.div>

            <AnimatePresence>
                {showComments && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 z-[9998] sm:bg-transparent sm:pointer-events-none"
                            onClick={() => setShowComments(false)}
                        />
                        <motion.div
                            initial={window.innerWidth < 640 ? { y: '100%' } : { x: '100%' }}
                            animate={window.innerWidth < 640 ? { y: 0 } : { x: 0 }}
                            exit={window.innerWidth < 640 ? { y: '100%' } : { x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 right-0 w-full h-[75vh] sm:h-full sm:w-[500px] bg-white sm:bg-black/20 sm:backdrop-blur-lg z-[9999] flex flex-col border-t sm:border-t-0 sm:border-l border-white/10 rounded-t-[16px] sm:rounded-none overflow-hidden"
                        >
                            {/* Header */}
                            <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100 sm:border-white/5 sticky top-0 z-20 bg-white sm:bg-transparent">
                                <button className="p-1 sm:hidden opacity-0 pointer-events-none">
                                    <Repeat2 size={24} />
                                </button>
                                <h3 className="text-black sm:text-white font-bold text-[15px] sm:text-lg text-center flex-1">
                                    {formatNumber(comments.length + (offers[currentIndex]?.comments || 0))} comments
                                </h3>
                                <div className="flex items-center gap-3">
                                    <button className="p-1 text-black/80 sm:text-white/80 sm:hidden">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="7" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="7" y2="18"></line></svg>
                                    </button>
                                    <button onClick={() => setShowComments(false)} className="p-1 hover:bg-black/5 sm:hover:bg-white/10 rounded-full text-black/80 sm:text-white/80 transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Comment List */}
                            <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar space-y-5 bg-white sm:bg-transparent">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="flex gap-3 group">
                                        {/* Avatar */}
                                        <div className="w-9 h-9 rounded-full bg-gray-100 sm:bg-white/10 flex items-center justify-center text-base flex-shrink-0 overflow-hidden">
                                            {typeof comment.avatar === 'string' && comment.avatar.length > 2 ? (
                                                <img src={comment.avatar} alt={comment.user} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-lg">{comment.avatar}</span>
                                            )}
                                        </div>

                                        {/* Content Area */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                    <span className="text-gray-500 sm:text-white/50 font-semibold text-[13px] leading-tight">{comment.user}</span>
                                                    {comment.user === 'Creator' && (
                                                        <span className="text-[#FF2D55] font-bold text-[11px]">· Creator</span>
                                                    )}
                                                </div>
                                                <p className="text-black sm:text-white text-[15px] leading-snug break-words">
                                                    {comment.text}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-black/40 sm:text-white/40 text-[12px]">{comment.timestamp}</span>
                                                <button onClick={() => handleReplyClick(comment.id, comment.user)} className="text-black/50 sm:text-white/50 text-[12px] font-bold hover:text-black sm:hover:text-white transition-colors">Reply</button>
                                            </div>

                                            {/* Replies Toggle */}
                                            {comment.replies && comment.replies.length > 0 && (
                                                <button onClick={() => toggleReplies(comment.id)} className="flex items-center gap-2 text-black/40 sm:text-white/40 text-[13px] font-bold mt-4">
                                                    <div className="w-6 h-[1px] bg-black/5 sm:bg-white/10" />
                                                    View {comment.replies.length} replies
                                                    <ChevronDown size={14} className={`transition-transform duration-300 ${comment.showReplies ? 'rotate-180' : ''}`} />
                                                </button>
                                            )}

                                            <AnimatePresence>
                                                {comment.showReplies && comment.replies?.map(reply => (
                                                    <div key={reply.id} className="flex gap-3 mt-4">
                                                        <div className="w-6 h-6 rounded-full bg-gray-100 sm:bg-white/10 overflow-hidden flex items-center justify-center">
                                                            {typeof reply.avatar === 'string' && reply.avatar.length > 2 ? (
                                                                <img src={reply.avatar} alt={reply.user} />
                                                            ) : (
                                                                <span className="text-[12px]">{reply.avatar}</span>
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-1.5 mb-0.5">
                                                                <span className="text-gray-500 sm:text-white/50 text-[12px] font-bold">{reply.user}</span>
                                                                {reply.user === 'Creator' && <span className="text-[#FF2D55] font-bold text-[10px]">· Creator</span>}
                                                            </div>
                                                            <p className="text-black sm:text-white text-[14px] leading-snug">{reply.text}</p>
                                                            <div className="mt-2 flex items-center gap-4">
                                                                <span className="text-black/40 sm:text-white/40 text-[11px]">{reply.timestamp}</span>
                                                                <button onClick={() => toggleCommentLike(reply.id, true, comment.id)} className={`transition-all active:scale-125 ${reply.isLiked ? 'text-[#FF2D55]' : 'text-black/30 sm:text-white/30'}`}>
                                                                    <Heart size={14} fill={reply.isLiked ? 'currentColor' : 'none'} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </AnimatePresence>
                                        </div>

                                        {/* Interaction Row */}
                                        <div className="flex items-center gap-3 pt-1 flex-shrink-0 self-start">
                                            <div className="flex flex-col items-center gap-0.5">
                                                <button
                                                    onClick={() => toggleCommentLike(comment.id)}
                                                    className={`transition-all active:scale-125 ${comment.isLiked ? 'text-[#FF2D55]' : 'text-black/30 sm:text-white/30 hover:text-black/50 sm:hover:text-white/50'}`}
                                                >
                                                    <Heart size={20} fill={comment.isLiked ? 'currentColor' : 'none'} />
                                                </button>
                                                <span className="text-black/40 sm:text-white/40 text-[11px] font-medium">{comment.likes}</span>
                                            </div>
                                            <button className="text-black/30 sm:text-white/30 hover:text-black/50 sm:hover:text-white/50 sm:hidden">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input Container */}
                            <div className="p-3 bg-white sm:bg-black/40 border-t border-gray-100 sm:border-white/5 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
                                <div className="flex flex-col gap-2">
                                    {replyTo && (
                                        <div className="flex items-center justify-between px-4 py-1.5 bg-gray-50 sm:bg-white/5 rounded-t-xl transition-all">
                                            <span className="text-[12px] text-gray-500 sm:text-white/50">Replying to <span className="text-black sm:text-white/80">{replyTo.user}</span></span>
                                            <button onClick={() => setReplyTo(null)} className="text-gray-400 sm:text-white/40 hover:text-black sm:hover:text-white">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        {/* My Avatar */}
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black flex flex-shrink-0 items-center justify-center overflow-hidden border border-gray-100 sm:border-white/10">
                                            <img src={logo} alt="My Avatar" className="w-6 sm:w-7 contrast-125" />
                                        </div>

                                        {/* Input Box */}
                                        <div className="flex-1 flex items-center bg-gray-100 sm:bg-white/5 rounded-full pl-3 pr-2 sm:px-4 border border-transparent focus-within:border-black/5 sm:focus-within:border-white/10 transition-all relative">
                                            <input
                                                ref={commentInputRef}
                                                type="text"
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                                onFocus={() => { if (!username) setShowNameSetup(true); }}
                                                onClick={() => { if (!username) setShowNameSetup(true); }}
                                                placeholder="Add comment..."
                                                className="flex-1 bg-transparent py-2.5 text-[15px] text-black sm:text-white outline-none placeholder:text-gray-400 sm:placeholder:text-white/30"
                                                onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
                                            />

                                            <div className="flex items-center gap-2 sm:gap-3 ml-1 sm:ml-2 text-black/60 sm:text-white/40">
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) toast.success(`Image selected: ${file.name}`);
                                                    }}
                                                />
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="hover:text-black sm:hover:text-white transition-colors"
                                                >
                                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                                </button>
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                                        className={`hover:text-black sm:hover:text-white transition-colors ${showEmojiPicker ? 'text-[#FF2D55]' : ''}`}
                                                    >
                                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                                                    </button>
                                                    <AnimatePresence>
                                                        {showEmojiPicker && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                className="absolute bottom-full right-0 mb-4 p-2 bg-white sm:bg-neutral-900 rounded-2xl shadow-xl border border-gray-100 sm:border-white/10 z-50 flex gap-2"
                                                            >
                                                                {['😊', '😂', '🥰', '😍', '🔥', '✨'].map(emoji => (
                                                                    <button
                                                                        key={emoji}
                                                                        onClick={() => {
                                                                            setCommentText(prev => prev + emoji);
                                                                            setShowEmojiPicker(false);
                                                                        }}
                                                                        className="text-xl hover:scale-125 transition-transform p-1"
                                                                    >
                                                                        {emoji}
                                                                    </button>
                                                                ))}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                                <button className="hover:text-black sm:hover:text-white transition-colors" onClick={() => setCommentText(prev => prev + '@')}>
                                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path></svg>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Post Button (Floating when text exists) */}
                                        {commentText.trim() && (
                                            <button
                                                onClick={handleCommentSubmit}
                                                className="text-[#FF2D55] font-bold text-[15px] px-1 transition-all active:scale-90 flex-shrink-0"
                                            >
                                                Post
                                            </button>
                                        )}
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

            {
                showNameSetup && (
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
                )
            }

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

export default Videos;