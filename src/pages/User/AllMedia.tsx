import { useState, useEffect } from 'react';
import { Search, Heart, MessageCircle, Bookmark, Share2, ChevronUp, ChevronDown } from 'lucide-react';

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

const AllMedia = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Fetch offers data
  useEffect(() => {
    fetch('/mediaData.json')
      .then((response) => response.json())
      .then((data) => {
        setOffers(Array.isArray(data) ? data : [data]);
      })
      .catch((error) => console.error('Error fetching offers:', error));
  }, []);

  // Get current offer
  const currentOffer = offers[currentIndex];

  // Navigation handlers
  const handleNext = () => {
    if (currentIndex < offers.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsLiked(false);
      setIsSaved(false);
      setShowFullDescription(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsLiked(false);
      setIsSaved(false);
      setShowFullDescription(false);
    }
  };

  // Helper function to extract YouTube video ID
  const extractYouTubeID = (url: string): string => {
    const match = url.match(/(?:youtube\.com\/(?:shorts\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return match ? match[1] : '';
  };

  // Get thumbnail or image URL
  const getMediaUrl = () => {
    if (!currentOffer) return 'https://via.placeholder.com/400x600';
    
    const youtubeID = extractYouTubeID(currentOffer.video_url);
    if (youtubeID) {
      return `https://img.youtube.com/vi/${youtubeID}/maxresdefault.jpg`;
    }
    return currentOffer.image_url;
  };

  // Format numbers (1400 -> 1.4k)
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  // Toggle description
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  // Get truncated description
  const getDescription = () => {
    if (!currentOffer) return '';
    
    const maxLength = 120;
    if (showFullDescription || currentOffer.description.length <= maxLength) {
      return currentOffer.description;
    }
    return currentOffer.description.substring(0, maxLength) + '...';
  };

  if (!currentOffer) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="flex gap-4 items-center">
        {/* Main Card */}
        <div className="relative w-80 h-[600px] rounded-3xl overflow-hidden shadow-2xl">
          {/* Background Image */}
          <img
            src={getMediaUrl()}
            alt={currentOffer.title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/400x600?text=Casino+Offer';
            }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

          {/* Content Overlay */}
          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            {/* Top - Claim Offer Badge */}
            <div className="flex justify-start">
              <span className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg">
                {currentOffer.cta}
              </span>
            </div>

            {/* Bottom Content */}
            <div className="space-y-3">
              {/* Casino Name with Icon */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-sm">🎰</span>
                </div>
                <h2 className="text-white font-bold text-lg line-clamp-1">{currentOffer.title}</h2>
              </div>

              {/* Description */}
              <p className="text-white text-sm leading-relaxed">
                {getDescription()}{' '}
                {currentOffer.description.length > 120 && (
                  <span 
                    onClick={toggleDescription} 
                    className="text-white font-semibold cursor-pointer hover:underline"
                  >
                    {showFullDescription ? 'See Less' : 'See More'}
                  </span>
                )}
              </p>

              {/* Tags */}
              <div className="flex gap-2 flex-wrap">
                {currentOffer.tags.slice(0, 2).map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Terms Highlights */}
              <div className="space-y-1">
                {currentOffer.terms_highlights.slice(0, 2).map((term, index) => (
                  <p key={index} className="text-white text-xs">
                    {term}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex flex-col gap-4">
          {/* Search Icon */}
          <button className="flex items-center justify-center text-white hover:text-gray-300 transition-colors">
            <Search className="w-5 h-5" />
          </button>

          {/* Like Button */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="flex flex-col items-center gap-1 text-white hover:text-red-500 transition-colors"
          >
            <Heart
              className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
            />
            <span className="text-xs text-gray-400">{formatNumber(currentOffer.likes)}</span>
          </button>

          {/* Comment Button */}
          <button className="flex flex-col items-center gap-1 text-white hover:text-gray-300 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs text-gray-400">{formatNumber(currentOffer.comments)}</span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="flex items-center justify-center text-white hover:text-yellow-500 transition-colors"
          >
            <Bookmark
              className={`w-5 h-5 ${isSaved ? 'fill-yellow-500 text-yellow-500' : ''}`}
            />
          </button>

          {/* Share Button */}
          <button className="flex items-center justify-center text-white hover:text-gray-300 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Arrows (Far Right) */}
        <div className="flex flex-col gap-3 ml-auto">
          <button 
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`w-12 h-12 rounded-full bg-gray-900/80 border border-gray-700 flex items-center justify-center hover:bg-gray-800 transition-colors ${
              currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ChevronUp className="w-5 h-5 text-white" />
          </button>
          <button 
            onClick={handleNext}
            disabled={currentIndex === offers.length - 1}
            className={`w-12 h-12 rounded-full bg-gray-900/80 border border-gray-700 flex items-center justify-center hover:bg-gray-800 transition-colors ${
              currentIndex === offers.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ChevronDown className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Card Counter */}
        <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs">
          {currentIndex + 1} / {offers.length}
        </div>
      </div>
    </div>
  );
};

export default AllMedia;