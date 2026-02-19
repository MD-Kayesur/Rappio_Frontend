import { useState, useEffect, useRef } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

import {
  FileText,
  CreditCard,
  TrendingUp,
  Upload,
  Heart,
  MessageCircle,
  Bookmark,
  Share,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

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

const Overview = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [timeFilter, setTimeFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('2026');
  const [feedView, setFeedView] = useState('web');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [contains18Plus, setContains18Plus] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    bonuses: '',
    description: '',
    termsHighlights: '',
    affiliateLink: '',
    languages: '',
    categories: '',
    disclaimers: '',
    mediaFile: null as File | null,
    mediaPreview: '',
    thumbnailFile: null as File | null,
    thumbnailPreview: '',
  });

  const mediaInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/mediaData.json')
      .then(res => res.json())
      .then(data => {
        setOffers(Array.isArray(data) ? data : [data]);
      })
      .catch(err => console.error('Error fetching media data:', err));
  }, []);

  const totalLikes = offers.reduce((acc, curr) => acc + (curr.likes || 0), 0);
  const totalComments = offers.reduce((acc, curr) => acc + (curr.comments || 0), 0);
  const sortedOffers = [...offers].sort((a, b) => (b.likes || 0) - (a.likes || 0));

  // Pagination logic
  const totalPages = Math.ceil(sortedOffers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedOffers.slice(indexOfFirstItem, indexOfLastItem);

  // Actually, we'll just paginate the list view using currentItems which are sliced from sortedOffers.

  // Trend data matching the user's provided image
  const monthlyData = [
    { name: 'JAN', videos: 10, photos: 8 },
    { name: 'FEB', videos: 25, photos: 5 },
    { name: 'MAR', videos: 20, photos: 8 },
    { name: 'APR', videos: 42, photos: 18 },
    { name: 'MAY', videos: 35, photos: 12 },
    { name: 'JUN', videos: 32, photos: 6 },
    { name: 'JUL', videos: 22, photos: 18 },
    { name: 'AUG', videos: 28, photos: 12 },
    { name: 'SEP', videos: 42, photos: 6 },
    { name: 'OCT', videos: 55, photos: 25 },
    { name: 'NOV', videos: 40, photos: 12 },
    { name: 'DEC', videos: 30, photos: 18 },
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        mediaFile: file,
        mediaPreview: URL.createObjectURL(file),
      });
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        thumbnailFile: file,
        thumbnailPreview: URL.createObjectURL(file),
      });
    }
  };

  const handlePreview = () => {
    setShowCreatePost(false);
    setShowPreview(true);
  };

  const handlePublish = () => {
    console.log('Publishing post:', formData);
    setShowPreview(false);
    setFormData({
      title: '',
      type: '',
      bonuses: '',
      description: '',
      termsHighlights: '',
      affiliateLink: '',
      languages: '',
      categories: '',
      disclaimers: '',
      mediaFile: null,
      mediaPreview: '',
      thumbnailFile: null,
      thumbnailPreview: '',
    });
  };

  return (
    <div className="min-h-full text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Overview</h1>

          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-32 bg-[#1A1C1D] border-gray-800 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1C1D] border-gray-800 text-white">
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="month">This month</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-32 bg-[#1A1C1D] border-gray-800 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1C1D] border-gray-800 text-white">
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={() => setShowCreatePost(true)}
          className="bg-red-600 hover:bg-red-700"
        >
          New Post
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1A1C1D]/60 backdrop-blur-md rounded-lg p-6 border border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-gray-800 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-500 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>12%</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">{formatNumber(offers.length)}</h2>
          <p className="text-gray-400 text-sm">Total Published Items</p>
        </div>

        <div className="bg-[#1A1C1D]/60 backdrop-blur-md rounded-lg p-6 border border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-gray-800 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-500 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>8%</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">{formatNumber(totalLikes)}</h2>
          <p className="text-gray-400 text-sm">Total Performance (Likes)</p>
        </div>

        <div className="bg-[#1A1C1D]/60 backdrop-blur-md rounded-lg p-6 border border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-gray-800 rounded-lg">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-500 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>15%</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">{formatNumber(totalComments)}</h2>
          <p className="text-gray-400 text-sm">Total Engagement (Comments)</p>
        </div>

        <div className="bg-[#1A1C1D]/60 backdrop-blur-md rounded-lg p-6 border border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-gray-800 rounded-lg">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-500 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>5%</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">{formatNumber(totalLikes * 4.2)}</h2>
          <p className="text-gray-400 text-sm">Estimated Clicks (CTR)</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top performing items */}
        <div className="bg-[#1A1C1D]/60 backdrop-blur-md rounded-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold mb-6">Top performing items</h3>
          <div className="space-y-4">
            {currentItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                  <p className="text-xs text-gray-400 line-clamp-1">{item.subtitle}</p>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium">
                  <div className="flex items-center gap-1.5 text-red-500">
                    <Heart className="h-4 w-4 fill-red-500/10" />
                    <span>{formatNumber(item.likes)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-blue-500">
                    <MessageCircle className="h-4 w-4 fill-blue-500/10" />
                    <span>{formatNumber(item.comments)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {offers.length > itemsPerPage && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800">
              <div className="text-xs text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-gray-800 border-gray-700 hover:bg-gray-700 p-2 h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="bg-gray-800 border-gray-700 hover:bg-gray-700 p-2 h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Feed Performance Chart */}
        <div className="bg-[#1A1C1D]/60 backdrop-blur-md rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Feed Performance</h3>
            <Select value={feedView} onValueChange={setFeedView}>
              <SelectTrigger className="w-24 bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="web">Web</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="tablet">Tablet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="h-80 relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" opacity={0.5} />
                <XAxis
                  dataKey="name"
                  stroke="#9CA3AF"
                  axisLine={false}
                  tickLine={false}
                  style={{ fontSize: '12px', fontWeight: '500' }}
                  dy={10}
                />
                <YAxis hide={true} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '30px' }}
                  iconType="square"
                  iconSize={14}
                  formatter={(value) => <span className="text-gray-300 ml-1">{value}</span>}
                />
                <Line
                  type="monotone"
                  dataKey="videos"
                  name="Videos"
                  stroke="#EE2B3E"
                  strokeWidth={1.5}
                  dot={{ r: 3, fill: '#EE2B3E', strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="photos"
                  name="Photos"
                  stroke="#0095F6"
                  strokeWidth={1.5}
                  dot={{ r: 3, fill: '#0095F6', strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Create New Post Dialog */}
      {/* Create New Post Dialog */}
      {showCreatePost && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-[900px] bg-gray-950 text-white border border-gray-800 rounded-lg shadow-xl relative">
              <div className="p-6">
                <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                  <h2 className="text-xl font-bold">Create New post</h2>
                  <p className="text-sm text-gray-400">Fill out this form to publish a new post.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm mb-2 block">
                        Title / Casino name: <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="Title or Casino name here..."
                        className="bg-[#1A1C1D] border-gray-800 text-white"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">
                        Type: <span className="text-red-500">*</span>
                      </Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                        <SelectTrigger className="bg-[#1A1C1D] border-gray-800 text-white">
                          <SelectValue placeholder="Choose One..." />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1C1D] border-gray-800 text-white">
                          <SelectItem value="casino">Casino</SelectItem>
                          <SelectItem value="poker">Poker</SelectItem>
                          <SelectItem value="sports">Sports Betting</SelectItem>
                          <SelectItem value="slots">Slots</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">
                        Bonuses: <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        placeholder="Type bonus points & press enter to add"
                        className="bg-[#1A1C1D] border-gray-800 text-white min-h-20"
                        value={formData.bonuses}
                        onChange={(e) => setFormData({ ...formData, bonuses: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">Short description:</Label>
                      <Textarea
                        placeholder="Type bonus points & press enter to add"
                        className="bg-[#1A1C1D] border-gray-800 text-white min-h-20"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">Terms highlights:</Label>
                      <Textarea
                        placeholder="Provide your highlighted terms"
                        className="bg-[#1A1C1D] border-gray-800 text-white min-h-20"
                        value={formData.termsHighlights}
                        onChange={(e) => setFormData({ ...formData, termsHighlights: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">
                        Affiliate link: <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="Type bonus points & press enter to add"
                        className="bg-[#1A1C1D] border-gray-800 text-white"
                        value={formData.affiliateLink}
                        onChange={(e) => setFormData({ ...formData, affiliateLink: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">
                        Languages: <span className="text-red-500">*</span>
                      </Label>
                      <Select value={formData.languages} onValueChange={(value) => setFormData({ ...formData, languages: value })}>
                        <SelectTrigger className="bg-[#1A1C1D] border-gray-800 text-white">
                          <SelectValue placeholder="Choose One..." />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1C1D] border-gray-800 text-white">
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">Categories/tags:</Label>
                      <Textarea
                        placeholder="Type bonus points & press enter to add"
                        className="bg-[#1A1C1D] border-gray-800 text-white min-h-20"
                        value={formData.categories}
                        onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">Disclaimers:</Label>
                      <Textarea
                        placeholder="Type bonus points & press enter to add"
                        className="bg-[#1A1C1D] border-gray-800 text-white min-h-20"
                        value={formData.disclaimers}
                        onChange={(e) => setFormData({ ...formData, disclaimers: e.target.value })}
                      />
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <Label className="text-sm">This media contains 18+ content</Label>
                      <Switch checked={contains18Plus} onCheckedChange={setContains18Plus} />
                    </div>
                  </div>

                  {/* Right Column - Upload Media */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm mb-2 block">
                        Upload Media: <span className="text-red-500">*</span>
                      </Label>
                      <div className="border-2 border-dashed border-gray-800 rounded-lg p-8 bg-[#1A1C1D]/50 flex flex-col items-center justify-center min-h-[300px]">
                        {formData.mediaPreview ? (
                          <div className="relative w-full h-full">
                            {formData.mediaFile?.type.startsWith('video') ? (
                              <video src={formData.mediaPreview} controls className="w-full h-full rounded-lg" />
                            ) : (
                              <img src={formData.mediaPreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                            )}
                            <button
                              onClick={() => setFormData({ ...formData, mediaFile: null, mediaPreview: '' })}
                              className="absolute top-2 right-2 p-1 bg-red-600 rounded-full hover:bg-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                              <Upload className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-400 mb-2">Tap to upload</p>
                            <p className="text-xs text-gray-500">File supported: Mp4, jpeg, png</p>
                            <input
                              type="file"
                              accept="image/*,video/*"
                              ref={mediaInputRef}
                              onChange={handleMediaUpload}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              onClick={() => mediaInputRef.current?.click()}
                              className="mt-4 bg-red-600 hover:bg-red-700"
                            >
                              Upload
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">Upload Thumbnail:</Label>
                      <div className="border-2 border-dashed border-gray-800 rounded-lg p-6 bg-[#1A1C1D]/50 flex flex-col items-center justify-center">
                        {formData.thumbnailPreview ? (
                          <div className="relative w-full">
                            <img src={formData.thumbnailPreview} alt="Thumbnail" className="w-full h-32 object-cover rounded-lg" />
                            <button
                              onClick={() => setFormData({ ...formData, thumbnailFile: null, thumbnailPreview: '' })}
                              className="absolute top-2 right-2 p-1 bg-red-600 rounded-full hover:bg-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-2">
                              <Upload className="h-6 w-6 text-gray-400" />
                            </div>
                            <p className="text-xs text-gray-500 mb-2">Choose a thumbnail for your video</p>
                            <input
                              type="file"
                              accept="image/*"
                              ref={thumbnailInputRef}
                              onChange={handleThumbnailUpload}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => thumbnailInputRef.current?.click()}
                              className="bg-gray-800 border-gray-700"
                            >
                              Select
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <Button onClick={handlePreview} className="bg-red-600 hover:bg-red-700">
                    Publish
                  </Button>
                  <Button onClick={handlePreview} variant="outline" className="bg-[#1A1C1D] border-gray-800">
                    Preview
                  </Button>
                  <Button
                    onClick={() => setShowCreatePost(false)}
                    variant="outline"
                    className="ml-auto bg-[#1A1C1D] border-gray-800"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Post Dialog */}
      {showPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-7xl bg-gray-950 text-white border border-gray-800 rounded-lg shadow-xl relative">
              <div className="p-6">
                <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                  <h2 className="text-xl font-bold">Preview Post</h2>
                  <p className="text-sm text-gray-400">Your post will look like this preview.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Left - Image */}
                  <div className="relative">
                    {formData.mediaPreview ? (
                      formData.mediaFile?.type.startsWith('video') ? (
                        <video src={formData.mediaPreview} controls className="w-full rounded-lg" />
                      ) : (
                        <img src={formData.mediaPreview} alt="Preview" className="w-full rounded-lg object-cover" />
                      )
                    ) : (
                      <img
                        src="https://via.placeholder.com/400x600"
                        alt="Default preview"
                        className="w-full rounded-lg object-cover"
                      />
                    )}
                  </div>

                  {/* Right - Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-sm">🎰</div>
                      <h3 className="font-bold text-lg">
                        {formData.title || "Fortune's Fortune Casino"}
                      </h3>
                    </div>

                    <p className="text-sm text-gray-300">
                      {formData.description || "Lorem Ipsum is simply dummy text of the printing and typesetting industry."}
                    </p>

                    <Button className="bg-red-600 hover:bg-red-700">Claim Offer</Button>

                    <div className="flex items-center gap-6 py-4">
                      <button className="flex flex-col items-center gap-1 group">
                        <Heart className="h-6 w-6 group-hover:text-red-500 transition-colors" />
                        <span className="text-xs text-gray-400">0</span>
                      </button>
                      <button className="flex flex-col items-center gap-1 group">
                        <MessageCircle className="h-6 w-6 group-hover:text-blue-500 transition-colors" />
                        <span className="text-xs text-gray-400">0</span>
                      </button>
                      <button className="flex flex-col items-center gap-1 group">
                        <Bookmark className="h-6 w-6 group-hover:text-yellow-500 transition-colors" />
                      </button>
                      <button className="flex flex-col items-center gap-1 group">
                        <Share className="h-6 w-6 group-hover:text-green-500 transition-colors" />
                      </button>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Description:</h4>
                      <p className="text-sm text-gray-300">
                        {formData.description || "No description provided."}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Terms highlights:</h4>
                      <p className="text-sm text-gray-300">
                        {formData.termsHighlights || "No terms highlights provided."}
                      </p>
                    </div>

                    <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <span className="text-yellow-500">⚠</span>
                        <div>
                          <h4 className="font-semibold text-yellow-500 mb-1 leading-none">Disclaimers:</h4>
                          <p className="text-xs text-gray-300 mt-1.5">
                            {formData.disclaimers || "No disclaimers provided."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <Button onClick={handlePublish} className="bg-red-600 hover:bg-red-700">
                    Publish Now
                  </Button>
                  <Button
                    onClick={() => {
                      setShowPreview(false);
                      setShowCreatePost(true);
                    }}
                    variant="outline"
                    className="bg-[#1A1C1D] border-gray-800"
                  >
                    Back to Edit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;