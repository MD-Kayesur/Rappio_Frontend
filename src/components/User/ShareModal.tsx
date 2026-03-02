import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Link, Code, Facebook, Linkedin, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import { FaWhatsapp, FaXTwitter, FaTelegram } from 'react-icons/fa6';
import { toast } from 'sonner';

interface ShareModalProps {
    showShareModal: boolean;
    setShowShareModal: (show: boolean) => void;
    url?: string;
    title?: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ 
    showShareModal, 
    setShowShareModal,
    url = window.location.href,
    title = 'Check this out!'
}) => {
    const shareScrollRef = useRef<HTMLDivElement>(null);

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title, url });
            } catch (err) {
                console.log('Share failed:', err);
            }
        } else {
            toast.info('Native sharing is not supported on this browser.');
        }
    };

    const shareOptions = [
        { name: 'Send to friends', icon: <Send size={24} className="text-black" />, color: 'bg-[#FACC15]', onClick: handleNativeShare },
        { name: 'Copy Link', icon: <Link size={24} />, color: 'bg-[#2E7DFF]', onClick: () => { navigator.clipboard.writeText(url); toast.success('Link copied!'); } },
        { name: 'WhatsApp', icon: <FaWhatsapp size={26} />, color: 'bg-[#25D366]', onClick: () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`) },
        { name: 'Embed', icon: <Code size={22} />, color: 'bg-[#0096a7]', onClick: () => { navigator.clipboard.writeText(`<iframe src="${url}" width="100%" height="450px" frameborder="0"></iframe>`); toast.success('Embed code copied!'); } },
        { name: 'Facebook', icon: <Facebook size={22} />, color: 'bg-[#1877F2]', onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`) },
        { name: 'Telegram', icon: <FaTelegram size={24} />, color: 'bg-[#24A1DE]', onClick: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`) },
        { name: 'X', icon: <FaXTwitter size={22} />, color: 'bg-[#000000]', onClick: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`) },
        { name: 'LinkedIn', icon: <Linkedin size={22} />, color: 'bg-[#0A66C2]', onClick: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`) },
        { name: 'Email', icon: <Mail size={22} />, color: 'bg-[#EA4335]', onClick: () => window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`) },
    ];

    return (
        <AnimatePresence>
            {showShareModal && (
                <div className="fixed inset-0 backdrop-blur-sm z-[11000] flex items-center justify-center p-4" onClick={() => setShowShareModal(false)}>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-background md:bg-background/40 backdrop-blur-lg rounded-3xl p-6 w-full max-w-[450px] relative border border-border transition-colors duration-300" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center mb-8">
                            <h3 className="text-foreground text-lg font-semibold">Share to</h3>
                            <button onClick={() => setShowShareModal(false)} className="absolute top-5 right-5 text-foreground/60 transition-colors hover:text-foreground">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="relative group/share">
                            <div className="flex overflow-x-auto gap-5 no-scrollbar pb-2 px-1 scroll-smooth" ref={shareScrollRef}>
                                {shareOptions.map(option => (
                                    <button key={option.name} onClick={option.onClick} className="flex flex-col items-center gap-2 flex-shrink-0 transition-transform active:scale-95 text-center w-[72px]">
                                        <div className={`w-14 h-14 rounded-full ${option.color} flex items-center justify-center text-white shadow-lg`}>
                                            {option.icon}
                                        </div>
                                        <span className="text-foreground/60 text-[11px] font-medium leading-tight">{option.name}</span>
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => shareScrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' })} className="absolute left-0 top-7 -translate-x-4 w-10 h-10 bg-[#222] text-white rounded-full flex items-center justify-center shadow-xl border border-white/10 opacity-0 group-hover/share:opacity-100 transition-opacity z-10">
                                <ChevronLeft size={24} />
                            </button>
                            <button onClick={() => shareScrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' })} className="absolute right-0 top-7 translate-x-4 w-10 h-10 bg-[#222] text-white rounded-full flex items-center justify-center shadow-xl border border-white/10 opacity-0 group-hover/share:opacity-100 transition-opacity z-10">
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ShareModal;
