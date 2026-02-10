import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, X } from 'lucide-react';

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

const All: React.FC = () => {
  const [offer, setOffer] = useState<Offer | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    // Fetch data from public folder
    fetch('/mediaData.json')
      .then(response => response.json())
      .then(data => {
        // Assuming the JSON is an array, get the first item
        // Or if it's a single object, use: setOffer(data)
        setOffer(Array.isArray(data) ? data[0] : data);
      })
      .catch(error => console.error('Error fetching offer:', error));
  }, []);

  if (!offer) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 bg-black rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Close Button */}
        <button className="absolute top-6 right-6 z-50 text-white/70 hover:text-white transition-colors">
          <X size={28} strokeWidth={2} />
        </button>

        {/* Left Side - Image/Video */}
        <div className="relative bg-black flex items-center justify-center p-8">
          <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden">
            <img
              src={offer.image_url}
              alt={offer.title}
              className="w-full h-full object-cover"
            />
            {/* Optional: If you want to show video instead */}
            {/* <video
              src={offer.video_url}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
            /> */}
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="bg-gradient-to-b from-gray-900 to-black text-white p-8 md:p-10 flex flex-col overflow-y-auto max-h-screen">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <h1 className="text-xl font-bold">{offer.title}</h1>
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed">
              {offer.subtitle}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {showFullDescription ? offer.description : offer.description.split('...')[0] + '...'}
              {!showFullDescription && (
                <button 
                  onClick={() => setShowFullDescription(true)}
                  className="text-blue-400 hover:text-blue-300 ml-1"
                >
                  See More
                </button>
              )}
            </p>
          </div>

          {/* CTA Button */}
          <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 px-6 rounded-lg transition-colors mb-6">
            {offer.cta}
          </button>

          {/* Interaction Icons */}
          <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-800">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="flex items-center gap-2 group"
            >
              <Heart
                size={22}
                className={`transition-colors ${
                  isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover:text-red-500'
                }`}
              />
              <span className="text-sm text-gray-300">{formatNumber(offer.likes)}</span>
            </button>

            <button className="flex items-center gap-2 group">
              <MessageCircle
                size={22}
                className="text-gray-400 group-hover:text-blue-400 transition-colors"
              />
              <span className="text-sm text-gray-300">{formatNumber(offer.comments)}</span>
            </button>

            <button
              onClick={() => setIsSaved(!isSaved)}
              className="group"
            >
              <Bookmark
                size={22}
                className={`transition-colors ${
                  isSaved ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400 group-hover:text-yellow-500'
                }`}
              />
            </button>

            <button className="group">
              <Share2
                size={22}
                className="text-gray-400 group-hover:text-green-400 transition-colors"
              />
            </button>
          </div>

          {/* Description Section */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3 text-base">Description:</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {offer.subtitle}
            </p>
            
            <div className="flex gap-3 mb-4">
              {offer.tags && offer.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-800 text-gray-300 px-4 py-1.5 rounded-md text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">
              It is a long established fact that a reader will be distract.
            </p>
          </div>

          {/* Terms Highlights */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3 text-base">Terms highlights:</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {offer.terms_highlights.join('. ')}. Lorem Ipsum has been the industry's standard dummy.
            </p>
          </div>

          {/* Disclaimers */}
          <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <span className="text-yellow-500 text-lg">⚠️</span>
              <div>
                <h3 className="text-yellow-400 font-semibold mb-1 text-sm">Disclaimers:</h3>
                <p className="text-yellow-200/80 text-xs leading-relaxed">
                  {offer.disclaimer}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default All;