import React, { useState, useRef, useEffect } from 'react';
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
    tags: string[];
    terms_highlights: string[];
    disclaimer: string;
}

const AllMedia: React.FC = () => {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);
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

    const currentOffer = offers[currentIndex];

    if (!currentOffer) {
        return (
            <div className="h-screen bg-black flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <>
            {/* Main Feed */}
            <div
                ref={containerRef}
                className="h-screen overflow-hidden relative"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {/* Video/Image Background */}

                <div className="absolute w-[400px] mx-auto inset-0 overflow-hidden">
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

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                </div>

                {/* Content Overlay - TikTok Style */}
                <div className="relative h-full flex  flex-col justify-end p-4 pb-24">
                    {/* Bottom Content */}
                    <div className="space-y-2 max-w-[calc(100%-80px)]">
                        {/* Creator/Title */}
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold">F</span>
                            </div>
                            <h2 className="text-white font-bold text-base">
                                {currentOffer.title}
                            </h2>
                        </div>

                        {/* Description */}
                        <p className="text-white text-sm leading-relaxed">
                            {currentOffer.subtitle}
                        </p>

                        {/* Tags */}
                        <div className="flex gap-2 flex-wrap">
                            <span className="text-white/80 text-sm font-semibold">#trending-worldwide</span>
                            <span className="text-white/80 text-sm font-semibold">#Lifestyle</span>
                        </div>
                    </div>
                </div>


                {/* Right Side Actions */}
                <div className="absolute right-4 bottom-32 flex flex-col gap-6">
                    {/* Like */}
                    <button
                        onClick={() => toggleLike(currentOffer.id)}
                        className="flex flex-col items-center gap-1"
                    >
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                            <Heart
                                size={24}
                                className={`transition-colors ${likedOffers.has(currentOffer.id)
                                    ? 'fill-red-500 text-red-500'
                                    : 'text-white'
                                    }`}
                            />
                        </div>
                        <span className="text-white text-xs font-semibold">
                            {formatNumber(currentOffer.likes + (likedOffers.has(currentOffer.id) ? 1 : 0))}
                        </span>
                    </button>

                    {/* Comments */}
                    <button
                        onClick={() => setShowComments(true)}
                        className="flex flex-col items-center gap-1"
                    >
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                            <MessageCircle size={24} className="text-white" />
                        </div>
                        <span className="text-white text-xs font-semibold">
                            {formatNumber(currentOffer.comments + comments.length)}
                        </span>
                    </button>

                    {/* Save */}
                    <button
                        onClick={() => toggleSave(currentOffer.id)}
                        className="flex flex-col items-center gap-1"
                    >
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                            <Bookmark
                                size={24}
                                className={`transition-colors ${savedOffers.has(currentOffer.id)
                                    ? 'fill-white text-white'
                                    : 'text-white'
                                    }`}
                            />
                        </div>
                    </button>

                    {/* Share */}
                    <button className="flex flex-col items-center gap-1">
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                            <Share2 size={24} className="text-white" />
                        </div>
                    </button>
                </div>

                {/* Navigation Arrows - Only visible on large screens */}
                <div className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 flex-col gap-4">
                    <button
                        onClick={() => handleScroll('up')}
                        disabled={currentIndex === 0}
                        className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-colors ${currentIndex === 0
                            ? 'bg-white/5 text-white/30'
                            : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                    >
                        <ChevronUp size={24} />
                    </button>
                    <button
                        onClick={() => handleScroll('down')}
                        disabled={currentIndex === offers.length - 1}
                        className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-colors ${currentIndex === offers.length - 1
                            ? 'bg-white/5 text-white/30'
                            : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                    >
                        <ChevronDown size={24} />
                    </button>
                </div>
            </div>

            {/* Detail Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
                    <div className="max-w-4xl w-full grid md:grid-cols-2 bg-black rounded-2xl overflow-hidden shadow-2xl relative max-h-[90vh]">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 z-50 text-white/70 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        {/* Left - Image */}
                        {/* <div className="relative bg-black flex items-center justify-center p-8">
                            <img
                                src={currentOffer.image_url}
                                alt={currentOffer.title}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div> */}

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





                        {/* Right - Content */}
                        <div className="bg-gradient-to-b from-gray-900 to-black text-white p-8 overflow-y-auto">
                            {/* Header */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">F</span>
                                    </div>
                                    <h1 className="text-xl font-bold">{currentOffer.title}</h1>
                                </div>
                                <p className="text-gray-400 text-sm">{currentOffer.subtitle}</p>
                            </div>

                            {/* CTA Button */}
                            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg mb-6">
                                {currentOffer.cta}
                            </button>

                            {/* Interaction Icons */}
                            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-800">
                                <button className="flex items-center gap-2">
                                    <Heart size={20} className={likedOffers.has(currentOffer.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                                    <span className="text-sm">{formatNumber(currentOffer.likes)}</span>
                                </button>
                                <button className="flex items-center gap-2">
                                    <MessageCircle size={20} className="text-gray-400" />
                                    <span className="text-sm">{formatNumber(currentOffer.comments)}</span>
                                </button>
                                <button>
                                    <Bookmark size={20} className={savedOffers.has(currentOffer.id) ? 'fill-white text-white' : 'text-gray-400'} />
                                </button>
                                <button>
                                    <Share2 size={20} className="text-gray-400" />
                                </button>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="text-white font-semibold mb-2">Description:</h3>
                                <p className="text-gray-400 text-sm mb-3">{currentOffer.subtitle}</p>
                                <div className="flex gap-2 mb-3">
                                    {currentOffer.tags.slice(0, 2).map((tag, i) => (
                                        <span key={i} className="bg-gray-800 px-3 py-1 rounded text-xs">{tag}</span>
                                    ))}
                                </div>
                                <p className="text-gray-400 text-sm">
                                    It is a long established fact that a reader will be distract.
                                </p>
                            </div>

                            {/* Terms */}
                            <div className="mb-6">
                                <h3 className="text-white font-semibold mb-2">Terms highlights:</h3>
                                <p className="text-gray-400 text-sm">
                                    {currentOffer.terms_highlights.join('. ')}
                                </p>
                            </div>

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
                        </div>
                    </div>
                </div>
            )}

            {/* Comments Modal */}
            {showComments && (
                <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
                    <div className="max-w-4xl w-full grid md:grid-cols-2 bg-black rounded-2xl overflow-hidden shadow-2xl relative max-h-[90vh]">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowComments(false)}
                            className="absolute top-4 right-4 z-50 text-white/70 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        {/* Left - Image */}
                        <div className="relative bg-black flex items-center justify-center p-8">
                            <img
                                src={currentOffer.image_url}
                                alt={currentOffer.title}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>

                        {/* Right - Comments */}
                        <div className="bg-gradient-to-b from-gray-900 to-black text-white p-8 flex flex-col">
                            {/* Header */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">F</span>
                                    </div>
                                    <h1 className="text-xl font-bold">{currentOffer.title}</h1>
                                </div>
                                <p className="text-gray-400 text-sm">{currentOffer.subtitle}</p>
                            </div>

                            {/* CTA Button */}
                            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg mb-6">
                                {currentOffer.cta}
                            </button>

                            {/* Interaction Icons */}
                            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-800">
                                <button className="flex items-center gap-2">
                                    <Heart size={20} className={likedOffers.has(currentOffer.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                                    <span className="text-sm">{formatNumber(currentOffer.likes)}</span>
                                </button>
                                <button className="flex items-center gap-2">
                                    <MessageCircle size={20} className="text-blue-400" />
                                    <span className="text-sm">{formatNumber(currentOffer.comments + comments.length)}</span>
                                </button>
                                <button>
                                    <Bookmark size={20} className={savedOffers.has(currentOffer.id) ? 'fill-white text-white' : 'text-gray-400'} />
                                </button>
                                <button>
                                    <Share2 size={20} className="text-gray-400" />
                                </button>
                            </div>

                            {/* Comments Section */}
                            <div className="flex-1 overflow-y-auto mb-4">
                                <h3 className="text-white font-semibold mb-4">Comments:</h3>
                                <div className="space-y-4">
                                    {comments.map((comment) => (
                                        <div key={comment.id} className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                                                {comment.avatar}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-white text-sm font-semibold">{comment.user}</span>
                                                    <span className="text-gray-500 text-xs">{comment.timestamp}</span>
                                                </div>
                                                <p className="text-gray-300 text-sm mb-2">{comment.text}</p>
                                                <div className="flex items-center gap-4">
                                                    <button className="text-gray-500 hover:text-red-500 transition-colors">
                                                        <Heart size={14} />
                                                    </button>
                                                    <button className="text-gray-500 text-xs hover:text-white transition-colors">
                                                        Reply
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Comment Input */}
                            <div className="border-t border-gray-800 pt-4">
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
                                        placeholder="Type your comment here..."
                                        className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                                    />
                                    <button
                                        onClick={handleCommentSubmit}
                                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                    >
                                        Comment
                                    </button>
                                </div>
                            </div>

                            {/* Up/Down Navigation */}
                            <div className="absolute bottom-8 right-8 flex flex-col gap-2">
                                <button
                                    onClick={() => handleScroll('up')}
                                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                >
                                    <ChevronUp size={20} />
                                </button>
                                <button
                                    onClick={() => handleScroll('down')}
                                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                >
                                    <ChevronDown size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Name Setup Modal */}
            {showNameSetup && (
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl p-8 max-w-md w-full text-center relative">
                        <div className="mb-6">
                            
                                <img src={logo} alt="Logo" />
                         </div>

                        <h3 className="text-white text-xl font-bold mb-2">Setup a Name</h3>
                        <p className="text-gray-400 text-sm mb-6">
                            Before commenting, you are required to provide a name for your comment.
                        </p>

                        <div className="mb-6">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Your full name"
                                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 mb-2"
                            />
                        </div>

                        <button
                            onClick={handleNameSetup}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AllMedia;