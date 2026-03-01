import React from 'react';
import { motion } from 'framer-motion';

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

interface MediaCardProps {
    offer: Offer;
    index: number;
    currentIndex: number;
    flippedCardId: number | null;
    setFlippedCardId: (id: number | null) => void;
    renderMedia: (offer: Offer, index: number) => React.ReactNode;
    isDescriptionExpanded: boolean;
    ctaText?: string;
    mediaLabel?: string;
}

const MediaCard: React.FC<MediaCardProps> = ({
    offer,
    index,
    currentIndex,
    flippedCardId,
    setFlippedCardId,
    renderMedia,
    isDescriptionExpanded,
    ctaText = 'CLAIM OFFER',
    mediaLabel = 'Photo'
}) => {
    return (
        <motion.div
            animate={{
                rotateY: flippedCardId === offer.id ? 180 : 0,
                scale: flippedCardId === offer.id ? 0.95 : 1,
            }}
            transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                mass: 1
            }}
            style={{ transformStyle: "preserve-3d" }}
            className="w-full h-full sm:flex-1 bg-card sm:rounded-[1rem] shadow-2xl sm:border border-border relative group transition-colors duration-300"
        >
            {/* Front Side */}
            <div
                className="absolute inset-0 w-full h-full overflow-hidden bg-black sm:rounded-[1rem] cursor-pointer"
                style={{ backfaceVisibility: "hidden" }}
                onClick={() => {
                    if (index === currentIndex && window.innerWidth < 640) {
                        setFlippedCardId(flippedCardId === offer.id ? null : offer.id);
                    }
                }}
            >
                {renderMedia(offer, index)}

                {/* Gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-20" />

                {/* Overlaid Info Area */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 pr-16 sm:pr-6 space-y-3 z-30 pointer-events-none">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (offer.website_url) window.open(offer.website_url, '_blank');
                        }}
                        type="button"
                        className="w-full px-6 py-3 rounded-xl bg-gray-600/50 backdrop-blur-md text-white border border-white font-bold transition-all duration-300 ease-in-out hover:bg-white hover:text-black hover:shadow-xl hover:scale-105 active:scale-95 pointer-events-auto"
                    >
                        {ctaText}
                    </button>

                    <div className="flex items-center gap-3">
                        <h2 className="text-white font-bold text-[20px] tracking-tight cursor-pointer hover:underline pointer-events-auto" onClick={(e) => { e.stopPropagation(); offer.website_url && window.open(offer.website_url, '_blank'); }}>{offer.title}</h2>
                    </div>

                    <div className="space-y-1">
                        <div className={`text-white/90 text-[14px] leading-relaxed drop-shadow-lg ${isDescriptionExpanded ? '' : 'line-clamp-2'}`}>
                            <span className="font-semibold block mb-0.5 text-white">{offer.subtitle}</span>
                            {offer.description}
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFlippedCardId(offer.id);
                                }}
                                className="text-white font-bold text-[13px] hover:opacity-70 transition-opacity pointer-events-auto"
                            >
                                Read More
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back Side */}
            <div
                className="absolute inset-0 w-full h-full bg-card sm:rounded-[1rem] overflow-hidden p-6 sm:p-8 flex flex-col gap-6 custom-scrollbar overflow-y-auto transition-colors duration-300"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
                <div className="flex items-center gap-4">
                    <div className="min-w-0">
                        <h3 className="text-foreground text-xl font-bold truncate">{offer.title}</h3>
                        <p className="text-foreground/70 text-sm truncate">{offer.subtitle}</p>
                    </div>
                </div>

                <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                    <div className="space-y-2">
                        <h4 className="text-foreground font-bold text-xs uppercase tracking-wider">About this offer</h4>
                        <p className="text-foreground/90 text-[15px] leading-relaxed">{offer.description}</p>
                    </div>

                    {offer.tags && offer.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 py-2">
                            {offer.tags.map((tag, idx) => (
                                <span key={idx} className="px-3 py-1 bg-foreground/5 dark:bg-white/5 border border-border dark:border-white/10 rounded-lg text-foreground dark:text-white text-[10px] font-bold uppercase tracking-tight">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {offer.terms_highlights && (
                        <div className="space-y-3 pt-2">
                            <h4 className="text-foreground font-bold text-xs uppercase tracking-wider">Key Highlights</h4>
                            <ul className="space-y-2.5">
                                {offer.terms_highlights.map((term, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-foreground/90 text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#FACC15] mt-1.5 shrink-0" />
                                        {term}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="space-y-4 pt-6 mt-auto border-t border-border">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (offer.website_url) window.open(offer.website_url, '_blank');
                        }}
                        className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl border border-primary/20 hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(0,0,0,0.1)] active:scale-95"
                    >
                        {ctaText}
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setFlippedCardId(null);
                        }}
                        className="w-full bg-foreground/5 text-foreground font-medium py-3 rounded-2xl hover:bg-foreground/10 transition-all text-sm transition-colors duration-300"
                    >
                        Back to {mediaLabel}
                    </button>
                    {offer.disclaimer && (
                        <p className="text-foreground/20 text-[10px] text-center leading-tight">
                            {offer.disclaimer}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default MediaCard;
