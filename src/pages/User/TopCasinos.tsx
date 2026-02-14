import { useState, useEffect } from 'react';
import { Heart, ThumbsUp, MessageCircle, Bookmark, Play } from 'lucide-react';

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

const TopCasinos = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  // Helper function to extract YouTube video ID
  const extractYouTubeID = (url: string): string => {
    const match = url.match(/(?:youtube\.com\/(?:shorts\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return match ? match[1] : '';
  };

  // Helper function to format numbers (1000 -> 1k)
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  useEffect(() => {
    // Fetch offers data from JSON file
    fetch('/mediaData.json')
      .then((response) => response.json())
      .then((data) => {
        setOffers(Array.isArray(data) ? data : [data]);
      })
      .catch((error) => {
        console.error('Error fetching offers:', error);
      });

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Define comprehensive categories - predefined + tags from data
  const predefinedCategories = [
    'All',
    'Poker',
    'Baccarat',
    'Roulette',
    'Blackjack'
  ];
  
  // Get unique tags from offers data
  const tagCategories = Array.from(new Set(offers.flatMap((offer) => offer.tags)));
  
  // Combine and remove duplicates
  const categories = [
    ...predefinedCategories,
    ...tagCategories.filter(tag => !predefinedCategories.includes(tag))
  ];

  // Filter offers based on selected category
  const filteredOffers =
    selectedCategory === 'All'
      ? offers
      : offers.filter((offer) => offer.tags.includes(selectedCategory));

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
      return newFavorites;
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Category Filter Tabs */}
      <div className="sticky top-0 z-10 bg-black/95 backdrop-blur-sm border-b border-gray-800">
        <div className="overflow-x-auto">
          <div className="flex gap-2 px-4 py-4 min-w-max">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-white text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredOffers.map((offer) => {
            const youtubeID = extractYouTubeID(offer.video_url);
            const thumbnailUrl = youtubeID
              ? `https://img.youtube.com/vi/${youtubeID}/maxresdefault.jpg`
              : offer.image_url;

            return (
              <div
                key={offer.id}
                className="group relative bg-gray-900 rounded-xl overflow-hidden hover:ring-2 hover:ring-gray-600 transition-all duration-300 cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-800">
                  <img
                    src={thumbnailUrl}
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x600/1a1a1a/white?text=Casino+Offer';
                    }}
                  />

                  {/* Video Play Icon Overlay */}
                  {youtubeID && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                        <Play className="w-6 h-6 text-white ml-1" fill="white" />
                      </div>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                  {/* Bookmark Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(offer.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-black/70 backdrop-blur-sm rounded-lg hover:bg-black/90 transition-colors z-10"
                  >
                    <Bookmark
                      className={`h-4 w-4 ${
                        favorites.has(offer.id) ? 'fill-white text-white' : 'text-white'
                      }`}
                    />
                  </button>

                  {/* Bottom Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    {/* Title & Verified Badge */}
                    <div className="flex items-start gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-semibold text-white line-clamp-2 leading-tight">
                          {offer.title}
                        </h3>
                      </div>
                      <div className="flex-shrink-0 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs text-gray-300">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{formatNumber(offer.likes)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>{formatNumber(offer.comments)}</span>
                      </div>
                      <span className="ml-auto text-gray-400">12 pm</span>
                    </div>
                  </div>
                </div>

                {/* Hover Overlay with More Info */}
                <div className="absolute inset-0 bg-black/96 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between overflow-y-auto">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-base font-bold mb-1 leading-tight">{offer.title}</h3>
                      <p className="text-xs text-gray-400 mb-2">{offer.subtitle}</p>
                    </div>

                    <p className="text-xs text-gray-300 line-clamp-3">{offer.description}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {offer.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-gray-800 text-xs rounded-full text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Terms Highlights */}
                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 mb-1.5">Highlights:</h4>
                      <ul className="space-y-1">
                        {offer.terms_highlights.map((term, index) => (
                          <li key={index} className="text-xs text-gray-300 flex items-start">
                            <span className="mr-1.5 text-green-500">•</span>
                            <span className="line-clamp-1">{term}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <p className="text-xs text-gray-500 italic line-clamp-2">{offer.disclaimer}</p>
                  </div>

                  <button className="w-full mt-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2.5 rounded-lg transition-all text-sm">
                    {offer.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredOffers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Heart className="h-16 w-16 text-gray-700 mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No offers in this category
            </h3>
            <p className="text-gray-600">Try selecting a different category</p>
          </div>
        )}
      </div>

      {/* Add custom scrollbar styles */}
      <style>{`
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
        .overflow-x-auto {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default TopCasinos;