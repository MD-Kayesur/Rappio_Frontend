import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Heart, Repeat2 } from 'lucide-react';

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
    commentImage?: string;
}

interface CommentsSidebarProps {
    showComments: boolean;
    setShowComments: (show: boolean) => void;
    comments: Comment[];
    commentText: string;
    setCommentText: React.Dispatch<React.SetStateAction<string>>;
    selectedImage: string | null;
    setSelectedImage: (image: string | null) => void;
    username: string;
    setShowNameSetup: (show: boolean) => void;
    handleCommentSubmit: () => void;
    toggleCommentLike: (commentId: number, isReply?: boolean, parentId?: number) => void;
    handleReplyClick: (commentId: number, user: string) => void;
    toggleReplies: (commentId: number) => void;
    replyTo: { id: number; user: string } | null;
    setReplyTo: (reply: { id: number; user: string } | null) => void;
    logo: string;
    showEmojiPicker: boolean;
    setShowEmojiPicker: (show: boolean) => void;
}

const CommentsSidebar: React.FC<CommentsSidebarProps> = ({
    showComments,
    setShowComments,
    comments,
    commentText,
    setCommentText,
    selectedImage,
    setSelectedImage,
    username,
    setShowNameSetup,
    handleCommentSubmit,
    toggleCommentLike,
    handleReplyClick,
    toggleReplies,
    replyTo,
    setReplyTo,
    // logo,
    showEmojiPicker,
    setShowEmojiPicker
}) => {
    const commentInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
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
                        initial={window.innerWidth < 768 ? { y: '100%' } : { x: '100%' }}
                        animate={window.innerWidth < 768 ? { y: 0 } : { x: 0 }}
                        exit={window.innerWidth < 768 ? { y: '100%' } : { x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 right-0 w-full h-[75vh] md:h-full md:w-[400px] lg:w-[500px] bg-background md:bg-background/40 md:backdrop-blur-lg z-[9999] flex flex-col border-t md:border-t-0 md:border-l border-border rounded-t-[16px] md:rounded-none overflow-hidden transition-colors duration-300"
                    >
                        {/* Header */}
                        <div className="px-5 py-4 flex items-center justify-between border-b border-white/5 sticky top-0 z-20 bg-transparent">
                            <button className="p-1 sm:hidden opacity-0 pointer-events-none">
                                <Repeat2 size={24} />
                            </button>
                            <h3 className="text-white font-bold text-[15px] sm:text-lg text-center flex-1">
                                Comments
                            </h3>
                            <div className="flex items-center gap-3">
                                {/* <button className="p-1 text-white/80 sm:hidden">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="7" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="7" y2="18"></line></svg>
                                </button> */}
                                <button onClick={() => setShowComments(false)} className="p-1 hover:bg-white/10 rounded-full text-white/80 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Comment List */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar space-y-5 bg-transparent">
                            {comments.map((comment) => (
                                <div key={comment.id} className="flex gap-3 group">
                                    {/* Avatar */}
                                    {/* <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-base flex-shrink-0 overflow-hidden">
                                        {typeof comment.avatar === 'string' && comment.avatar.length > 2 ? (
                                            <img src={comment.avatar} alt={comment.user} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-lg">{comment.avatar}</span>
                                        )}
                                    </div> */}

                                    {/* Content Area */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1.5 mb-0.5">
                                                <span className="text-foreground/50 font-semibold text-[13px] leading-tight">{comment.user}</span>
                                                {comment.user === 'Creator' && (
                                                    <span className="text-[#FACC15] font-bold text-[11px]">· Creator</span>
                                                )}
                                            </div>
                                            <p className="text-foreground text-[15px] leading-snug break-words">
                                                {comment.text}
                                            </p>
                                            {comment.commentImage && (
                                                <div className="mt-3 rounded-xl overflow-hidden border border-white/10 max-w-[200px]">
                                                    <img src={comment.commentImage} alt="Comment attachment" className="w-full h-auto object-cover" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="text-white/40 text-[12px]">{comment.timestamp}</span>
                                            <button onClick={() => handleReplyClick(comment.id, comment.user)} className="text-white/50 text-[12px] font-bold hover:text-white transition-colors">Reply</button>
                                        </div>

                                        {/* Replies Toggle */}
                                        {comment.replies && comment.replies.length > 0 && (
                                            <button onClick={() => toggleReplies(comment.id)} className="flex items-center gap-2 text-foreground/40 text-[13px] font-bold mt-4">
                                                <div className="w-6 h-[1px] bg-foreground/10" />
                                                View {comment.replies.length} replies
                                                <ChevronDown size={14} className={`transition-transform duration-300 ${comment.showReplies ? 'rotate-180' : ''}`} />
                                            </button>
                                        )}

                                        <AnimatePresence>
                                            {comment.showReplies && comment.replies?.map(reply => (
                                                <div key={reply.id} className="flex gap-3 mt-4">
                                                    <div className="w-6 h-6 rounded-full bg-white/10 overflow-hidden flex items-center justify-center">
                                                        {typeof reply.avatar === 'string' && reply.avatar.length > 2 ? (
                                                            <img src={reply.avatar} alt={reply.user} />
                                                        ) : (
                                                            <span className="text-[12px]">{reply.avatar}</span>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-1.5 mb-0.5">
                                                            <span className="text-white/50 text-[12px] font-bold">{reply.user}</span>
                                                            {reply.user === 'Creator' && <span className="text-[#FACC15] font-bold text-[10px]">· Creator</span>}
                                                        </div>
                                                        <p className="text-white text-[14px] leading-snug">{reply.text}</p>
                                                        {reply.commentImage && (
                                                            <div className="mt-2 rounded-lg overflow-hidden border border-white/10 max-w-[150px]">
                                                                <img src={reply.commentImage} alt="Reply attachment" className="w-full h-auto object-cover" />
                                                            </div>
                                                        )}
                                                        <div className="mt-2 flex items-center gap-4">
                                                            <span className="text-white/40 text-[11px]">{reply.timestamp}</span>
                                                            <button onClick={() => toggleCommentLike(reply.id, true, comment.id)} className={`transition-all active:scale-125 ${reply.isLiked ? 'text-[#FF2D55]' : 'text-white/30'}`}>
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
                                                className={`transition-all active:scale-125 ${comment.isLiked ? 'text-[#FF2D55]' : 'text-white/30 hover:text-white/50'}`}
                                            >
                                                <Heart size={20} fill={comment.isLiked ? 'currentColor' : 'none'} />
                                            </button>
                                            <span className="text-foreground/40 text-[11px] font-medium">{comment.likes}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Container */}
                        <div className="p-3 bg-black/40 backdrop-blur-md border-t border-white/5 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
                            <div className="flex flex-col gap-2">
                                {selectedImage && (
                                    <div className="relative inline-block w-20 h-20 ml-12 mb-1 group mt-2">
                                        <img src={selectedImage} alt="Preview" className="w-full h-full object-cover rounded-lg border border-white/20" />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedImage(null);
                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                            }}
                                            className="absolute -top-2 -right-2 bg-[#FACC15] text-black rounded-full p-1 shadow-lg opacity-100 transition-opacity hover:bg-[#EAB308] z-50"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                )}
                                {replyTo && (
                                    <div className="flex items-center justify-between px-4 py-1.5 bg-white/5 rounded-t-xl transition-all">
                                        <span className="text-[12px] text-white/50">Replying to <span className="text-white/80">{replyTo.user}</span></span>
                                        <button onClick={() => setReplyTo(null)} className="text-white/40 hover:text-white">
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 sm:gap-3">
                                    {/* My Avatar */}
                                    {/* <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black flex flex-shrink-0 items-center justify-center overflow-hidden border border-white/10">
                                        <img src={logo} alt="My Avatar" className="w-6 sm:w-7 contrast-125" />
                                    </div> */}

                                    {/* Input Box */}
                                    <div className="flex-1 flex items-center bg-foreground/5 rounded-full pl-3 pr-2 sm:px-4 border border-transparent focus-within:border-foreground/10 transition-all relative">
                                        <input
                                            ref={commentInputRef}
                                            type="text"
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            onFocus={() => { if (!username) setShowNameSetup(true); }}
                                            onClick={() => { if (!username) setShowNameSetup(true); }}
                                            placeholder="Add comment..."
                                            className="flex-1 bg-transparent py-2.5 text-[15px] text-foreground outline-none placeholder:text-foreground/30 min-w-0"
                                            onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
                                        />

                                        <div className="flex items-center gap-1.5 sm:gap-3 ml-1 sm:ml-2 text-white/40">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setSelectedImage(reader.result as string);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                            <button onClick={() => fileInputRef.current?.click()} className="hover:text-white transition-colors flex-shrink-0">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                            </button>
                                            <div className="relative flex-shrink-0">
                                                <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={`hover:text-white transition-colors ${showEmojiPicker ? 'text-[#FACC15]' : ''}`}>
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                                                </button>
                                                <AnimatePresence>
                                                    {showEmojiPicker && (
                                                        <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-full right-0 mb-4 p-2 bg-neutral-900 rounded-2xl shadow-xl border border-white/10 z-50 flex gap-2">
                                                            {['😊', '😂', '🥰', '😍', '🔥', '✨'].map(emoji => (
                                                                <button key={emoji} onClick={() => { setCommentText(prev => (prev as string) + emoji); setShowEmojiPicker(false); }} className="text-xl hover:scale-125 transition-transform p-1">{emoji}</button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                            <button className="hover:text-white transition-colors flex-shrink-0" onClick={() => setCommentText(prev => (prev as string) + '@')}>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path></svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Post Button - OUTSIDE */}
                                    {(commentText.trim() || selectedImage) && (
                                        <button
                                            onClick={handleCommentSubmit}
                                            className="text-[#000000] font-bold text-[13px] sm:text-[14px] px-3 py-2 bg-[#FACC15] rounded-full hover:bg-[#EAB308] transition-all active:scale-95 uppercase tracking-wide flex-shrink-0"
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
    );
};

export default CommentsSidebar;
