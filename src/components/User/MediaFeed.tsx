/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Heart,
    MessageCircle,
    Bookmark,
    ChevronUp,
    ChevronDown,
    Search,
    Play,
    Volume2,
    VolumeX,
    X
} from 'lucide-react';
import PageLoader from '@/Layout/PageLoader';
import logo from "../../assets/bgremovelogo.png";
import CommentsSidebar from './CommentsSidebar';
import ShareModal from './ShareModal';
import MediaCard from './MediaCard';

export interface Comment {
    id: number;
    user: string;
    avatar: string;
    text: string;
    likes: number;
    isLiked?: boolean;
    timestamp: string;
    replies?: Comment[];
    showReplies?: boolean;
    commentImage?: string;
}

export interface Offer {
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

interface MediaFeedProps {
    type?: 'all' | 'photo' | 'video';
    feedType?: string; // 'favorites', etc.
}

const MediaFeed: React.FC<MediaFeedProps> = ({ type: propType, feedType: propFeedType }) => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || '';

    // Determine type from location if not provided
    const type = propType || (location.pathname.includes('photos') ? 'photo' : location.pathname.includes('videos') ? 'video' : 'all');

    // Determine feedType from location state or prop
    const locationState = location.state as { feedType?: string; initialIndex?: number; initialCategory?: string };
    const feedType = propFeedType || locationState?.feedType;
    const initialIndex = locationState?.initialIndex;
    const initialCategory = locationState?.initialCategory;

    const [offers, setOffers] = useState<Offer[]>([]);
    const [allOffers, setAllOffers] = useState<Offer[]>([]);
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
    const [isMuted, setIsMuted] = useState(true);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [flippedCardId, setFlippedCardId] = useState<number | null>(null);

    const [comments, setComments] = useState<Comment[]>([]);

    const containerRef = useRef<HTMLDivElement>(null);
    const isFirstLoad = useRef(true);

    useEffect(() => {
        fetch('/mediaData.json')
            .then(response => response.json())
            .then(data => {
                let loadedOffers: Offer[] = Array.isArray(data) ? data : [data];

                // Filter by type
                if (type === 'photo') {
                    // In the original code, Photos.tsx just showed every item but as images
                    // But maybe we should filter for only those that DONT have video?
                    // Actually, looking at Photos.tsx, it doesn't filter by existence of video.
                    // It just treats everything as a photo.
                } else if (type === 'video') {
                    // Videos.tsx doesn't filter either, it just prioritizes video rendering.
                }

                if (feedType === 'favorites') {
                    const savedFavorites = sessionStorage.getItem('favorites');
                    const favoritesSet = new Set<number>(savedFavorites ? JSON.parse(savedFavorites) : []);
                    loadedOffers = loadedOffers.filter(o => favoritesSet.has(o.id));
                }

                if (initialCategory && initialCategory !== 'All') {
                    loadedOffers = loadedOffers.filter(o => o.tags.includes(initialCategory));
                }

                setAllOffers(loadedOffers);
                setOffers(loadedOffers);

                if (typeof initialIndex === 'number' && initialIndex < loadedOffers.length) {
                    setCurrentIndex(initialIndex);
                }
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching offers:', error);
                setIsLoading(false);
            });

        const savedUsername = localStorage.getItem('username');
        if (savedUsername) setUsername(savedUsername);
    }, [type, feedType, initialCategory, initialIndex]);

    useEffect(() => {
        if (!isLoading && typeof initialIndex === 'number' && containerRef.current) {
            const itemHeight = containerRef.current.clientHeight;
            containerRef.current.scrollTo({
                top: initialIndex * itemHeight,
                behavior: 'instant' as any
            });
        }
    }, [isLoading, initialIndex]);

    useEffect(() => {
        setIsPlaying(true);
        setProgress(0);
        setVideoReady(false);
        setIsDescriptionExpanded(false);
        setFlippedCardId(null);

        if (offers[currentIndex]) {
            setComments([
                { id: 1, user: 'User_' + currentIndex, avatar: '👤', text: `Great content for ${offers[currentIndex]?.title}!`, likes: Math.floor(Math.random() * 50), timestamp: '2h ago' },
                { id: 2, user: 'Fan_' + (currentIndex + 1), avatar: '👤', text: 'Love this vibe!', likes: Math.floor(Math.random() * 30), timestamp: '1h ago' }
            ]);
        }
        setCommentText('');
    }, [currentIndex, offers]);

    useEffect(() => {
        const filtered = allOffers.filter(offer => offer.title.toLowerCase().includes(searchQuery.toLowerCase()));
        setOffers(filtered);

        if (!isFirstLoad.current) {
            setCurrentIndex(0);
        } else if (!searchQuery && typeof initialIndex !== 'number') {
            setCurrentIndex(0);
        }

        if (allOffers.length > 0) {
            isFirstLoad.current = false;
        }
    }, [searchQuery, allOffers, initialIndex]);

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

    const handleCommentSubmit = () => {
        const savedUsername = localStorage.getItem('username');
        if (!savedUsername && !username) { setShowNameSetup(true); return; }
        if (commentText.trim() || selectedImage) {
            const newComment: Comment = {
                id: Date.now(),
                user: username || savedUsername || 'Anonymous',
                avatar: '👤',
                text: commentText,
                likes: 0,
                timestamp: 'Just now',
                replies: [],
                commentImage: selectedImage || undefined
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
            setSelectedImage(null);
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

    const handleReplyClick = (commentId: number, user: string) => {
        setReplyTo({ id: commentId, user });
        setCommentText(``);
    };

    const toggleReplies = (commentId: number) => {
        setComments(prev => prev.map(c => c.id === commentId ? { ...c, showReplies: !c.showReplies } : c));
    };

    const handleNameSetup = () => {
        if (username.trim()) {
            localStorage.setItem('username', username);
            setShowNameSetup(false);
        }
    };

    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleExpandAndComment = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowComments((prev) => !prev);
    };

    const renderMedia = (offer: Offer, index: number) => {
        const isCurrent = index === currentIndex;

        // In "photo" mode, we only show images
        if (type === 'photo' || !offer.video_url) {
            return <img src={offer.image_url} alt={offer.title} className="w-full h-full object-cover" />;
        }

        // In "video" or "all" mode, show video if available
        const ytId = getYouTubeId(offer.video_url);
        const Player = ReactPlayer as any;

        return (
            <div
                className="absolute inset-0 w-full h-full overflow-hidden bg-black"
                onClick={() => {
                    if (window.innerWidth >= 640) {
                        setIsPlaying(!isPlaying);
                    }
                }}
            >
                <div className="absolute inset-0 flex items-end justify-center">
                    <div className="absolute min-w-full min-h-full w-[177.77vh] h-[100dvh] md:w-[177.77vh] md:h-[85vh]">
                        {ytId ? (
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${ytId}?autoplay=${isCurrent ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${ytId}&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&enablejsapi=1&origin=${window.location.origin}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                className="w-full h-full pointer-events-none"
                                onLoad={() => isCurrent && setVideoReady(true)}
                            />
                        ) : (
                            <Player
                                url={offer.video_url}
                                playing={isCurrent && isPlaying}
                                loop
                                muted={isMuted}
                                playsinline={true}
                                width="100%"
                                height="100%"
                                onReady={() => isCurrent && setVideoReady(true)}
                                onProgress={(state: any) => isCurrent && setProgress(state.played * 100)}
                                className="pointer-events-none"
                                style={{ position: 'absolute', top: 0, left: 0 }}
                                config={{ file: { attributes: { style: { width: '100%', height: '100%', objectFit: 'cover' } } } }}
                            />
                        )}
                    </div>
                </div>
                {isCurrent && (
                    <>
                        {!videoReady && !isPlaying && <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10 pointer-events-none"><Play size={60} className="text-white opacity-80" fill="white" /></div>}
                        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/20 z-30"><div className="h-full bg-white transition-all duration-100 ease-linear shadow-[0_0_8px_rgba(255,255,255,0.8)]" style={{ width: `${progress}%` }} /></div>
                    </>
                )}
            </div>
        );
    };

    if (isLoading || offers.length === 0) {
        if (isLoading) return <div className="h-full bg-background flex items-center justify-center text-foreground text-xl"><PageLoader /></div>;
        return <div className="h-full bg-background flex flex-col items-center justify-center text-foreground text-xl p-4 text-center">
            <p className="mb-4">No content found</p>
            {feedType === 'favorites' && <p className="text-sm text-foreground/50">Explore and save some favorites first!</p>}
        </div>;
    }

    return (
        <>
            <div
                ref={containerRef}
                className="h-[100dvh] sm:h-[calc(100dvh-84px)] w-full overflow-y-auto snap-y snap-mandatory no-scrollbar scroll-smooth flex flex-col items-center shadow-2xl"
                onScroll={handleOnScroll}
            >
                {offers.map((offer, index) => (
                    <div key={offer.id} className="w-full h-full flex-shrink-0 snap-start snap-always flex items-end sm:items-center justify-center relative">
                        <div className={`relative transition-all duration-500 ease-in-out md:max-w-[450px] lg:max-w-[550px] w-full h-[100dvh] md:h-[85vh] ${showComments ? 'md:-translate-x-[250px] lg:-translate-x-[320px]' : 'md:translate-x-0'} z-[120]`}>
                            <div className="absolute inset-0 h-full w-full block sm:flex sm:flex-row sm:items-end sm:gap-5" style={{ perspective: "1200px" }}>
                                <MediaCard
                                    offer={offer}
                                    index={index}
                                    currentIndex={currentIndex}
                                    flippedCardId={flippedCardId}
                                    setFlippedCardId={setFlippedCardId}
                                    renderMedia={renderMedia}
                                    isDescriptionExpanded={isDescriptionExpanded}
                                    ctaText={offer.cta || 'CLAIM OFFER'}
                                    mediaLabel={offer.video_url && type !== 'photo' ? 'Video' : 'Photo'}
                                />

                                {/* Sidebar Icons */}
                                <div className="absolute right-2 bottom-20 sm:static w-14 flex flex-col items-center gap-4 sm:gap-6 sm:mb-8 flex-shrink-0 z-[120]">
                                    <div className="flex flex-col items-center gap-0">
                                        <button onClick={(e) => { e.stopPropagation(); toggleLike(offer.id); }} className="w-12 h-12 rounded-full hover:bg-foreground/10 flex items-center justify-center transition-all">
                                            <Heart size={22} className={`${likedOffers.has(offer.id) ? 'fill-[#FF2D55] text-[#FF2D55]' : 'text-foreground'}`} />
                                        </button>
                                    </div>

                                    <div className="flex flex-col items-center gap-0">
                                        <button onClick={handleExpandAndComment} className="w-12 h-12 rounded-full hover:bg-foreground/10 flex items-center justify-center text-foreground transition-all">
                                            <MessageCircle size={22} />
                                        </button>
                                    </div>

                                    <div className="flex flex-col items-center gap-0">
                                        <button onClick={(e) => { e.stopPropagation(); toggleSave(offer.id); }} className="w-12 h-12 rounded-full hover:bg-foreground/10 flex items-center justify-center transition-all">
                                            <Bookmark size={22} className={`${savedOffers.has(offer.id) ? 'fill-[#facd3b] text-[#facd3b]' : 'text-foreground'}`} />
                                        </button>
                                    </div>

                                    <div className="flex flex-col items-center gap-0">
                                        <button onClick={(e) => { e.stopPropagation(); setShowShareModal(true); }} className="w-12 h-12 rounded-full hover:bg-foreground/10 flex items-center justify-center text-foreground transition-all active:scale-90 duration-300">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M14 9V5l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11z" />
                                            </svg>
                                        </button>
                                    </div>

                                    {(type === 'video' || (type === 'all' && offer.video_url)) && (
                                        <div className="flex flex-col items-center gap-1.5">
                                            <button onClick={() => setIsMuted(!isMuted)} className="w-12 h-12 rounded-full hover:bg-foreground/10 flex items-center justify-center text-foreground transition-all">
                                                {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile Search - Use the same logic as original */}
            <div className="fixed top-0 left-0 z-[200] md:hidden">
                <button
                    id="mobile-search-button"
                    onClick={() => {
                        window.dispatchEvent(new CustomEvent('open-sidebar-search'));
                    }}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-foreground active:scale-95 transition-all hover:bg-foreground/10"
                >
                    <Search size={20} />
                </button>
            </div>

            {/* Scroll Buttons */}
            <motion.div
                animate={{
                    right: showComments ? (window.innerWidth < 768 ? 10 : (window.innerWidth < 1024 ? 420 : 520)) : 40,
                    opacity: 1
                }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="hidden sm:flex absolute bottom-10 flex-col gap-3 z-[120]"
            >
                <button onClick={() => handleScroll('up')} disabled={currentIndex === 0} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${currentIndex === 0 ? 'opacity-20' : 'text-foreground hover:bg-foreground/10'}`}><ChevronUp size={28} /></button>
                <button onClick={() => handleScroll('down')} disabled={currentIndex === offers.length - 1} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${currentIndex === offers.length - 1 ? 'opacity-20' : 'text-foreground hover:bg-foreground/10'}`}><ChevronDown size={28} /></button>
            </motion.div>

            <CommentsSidebar
                showComments={showComments}
                setShowComments={setShowComments}
                comments={comments}
                commentText={commentText}
                setCommentText={setCommentText}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                username={username}
                setShowNameSetup={setShowNameSetup}
                handleCommentSubmit={handleCommentSubmit}
                toggleCommentLike={toggleCommentLike}
                handleReplyClick={handleReplyClick}
                toggleReplies={toggleReplies}
                replyTo={replyTo}
                setReplyTo={setReplyTo}
                logo={logo}
                showEmojiPicker={showEmojiPicker}
                setShowEmojiPicker={setShowEmojiPicker}
            />

            <ShareModal
                showShareModal={showShareModal}
                setShowShareModal={setShowShareModal}
            />

            {showNameSetup && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[9999] flex items-center justify-center p-4">
                    <div className="bg-[#121212]/80 backdrop-blur-2xl rounded-[2.5rem] p-10 max-w-sm w-full text-center border border-white/10 relative shadow-2xl">
                        <button onClick={() => setShowNameSetup(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors border border-white/5">
                            <X size={20} />
                        </button>
                        <div className="mb-8 flex justify-center">
                            <img src={logo} alt="Logo" className="h-12 object-contain" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Wait! What's your name?</h2>
                        <p className="text-white/50 mb-8 text-sm">Join the conversation by picking a username.</p>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Type your username..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-center outline-none focus:border-[#FACC15] transition-all mb-6"
                            autoFocus
                        />
                        <button
                            onClick={handleNameSetup}
                            className="w-full bg-[#FACC15] text-black font-bold py-4 rounded-2xl hover:bg-[#EAB308] transition-all transform active:scale-95"
                        >
                            Let's Go
                        </button>
                    </div>
                </div>
            )}
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
            `}</style>
        </>
    );
};

export default MediaFeed;
