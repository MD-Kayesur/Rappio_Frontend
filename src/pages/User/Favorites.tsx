import { useState, useEffect, useRef } from 'react';
import { Heart, ThumbsUp, MessageCircle, Bookmark, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

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

const Favorites = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

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

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
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
    const savedFavorites = sessionStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  useEffect(() => {
    handleScroll();
  }, [offers]);

  // Define favorited offers
  const favoritedOffers = offers.filter(offer => favorites.has(offer.id));

  // Get unique tags from favorited offers
  const tagCategories = Array.from(new Set(favoritedOffers.flatMap((offer) => offer.tags)));

  // Combine and remove duplicates for categories
  const categories = [
    'All',
    ...tagCategories
  ].filter((v, i, a) => a.indexOf(v) === i);

  // Filter offers based on selected category, favorite status, and search query
  const filteredOffers = favoritedOffers.filter((offer) => {
    const matchesCategory = selectedCategory === 'All' || offer.tags.includes(selectedCategory);
    const matchesSearch = !searchQuery || offer.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      sessionStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
      return newFavorites;
    });
  };

  return (
    <div className="min-h-full text-white overflow-hidden">
      {/* Category Filter Tabs */}
      <div className="sticky top-0 z-10 w-full backdrop-blur-md px-2">
        <div className="relative flex items-center group">
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 z-20 p-1.5 bg-black/60 rounded-full text-white backdrop-blur-sm border border-white/10 hover:bg-black/80 transition-all shadow-lg"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="overflow-x-auto no-scrollbar w-full scroll-smooth"
          >
            <div className="flex gap-2 px-4 py-4 min-w-max ">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === category
                    ? 'bg-white text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 z-20 p-1.5 bg-black/60 rounded-full text-white backdrop-blur-sm border border-white/10 hover:bg-black/80 transition-all shadow-lg"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Grid Layout */}
      <div className="p-4 overflow-y-auto h-[calc(100vh-70px)] no-scrollbar scroll-smooth">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredOffers.map((offer, index) => {
            const youtubeID = extractYouTubeID(offer.video_url);
            const thumbnailUrl = youtubeID
              ? `https://img.youtube.com/vi/${youtubeID}/maxresdefault.jpg`
              : offer.image_url;

            return (
              <div
                key={offer.id}
                onClick={() => {
                  navigate('/user/all', {
                    state: {
                      feedType: 'favorites',
                      initialIndex: index,
                      initialCategory: selectedCategory
                    }
                  });
                }}
                className="group relative bg-[#1A1C1D] rounded-xl overflow-hidden hover:ring-2 hover:ring-gray-600 transition-all duration-300 cursor-pointer"
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
                      className={`h-4 w-4 ${favorites.has(offer.id) ? 'fill-white text-white' : 'text-white'
                        }`}
                    />
                  </button>

                  {/* Bottom Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-semibold text-white line-clamp-2 leading-tight">
                          {offer.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-300">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{formatNumber(offer.likes)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
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
              No favorites yet
            </h3>
            <p className="text-gray-600">Explore offers and bookmark your favorites</p>
          </div>
        )}
      </div>

      {/* Add custom styles */}
      <style>{`
        .overflow-x-auto::-webkit-scrollbar { display: none; }
        .overflow-x-auto { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Favorites;