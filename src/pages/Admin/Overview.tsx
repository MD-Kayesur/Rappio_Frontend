import { useState } from 'react';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  FileText,
  Clock,
  Eye,
  CreditCard,
  TrendingUp,
  Share2,
  ThumbsUp,
  Upload,
  Heart,
  MessageCircle,
  Bookmark,
  Share,
  X,
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

// Sample data for the chart
const chartData = [
  { month: 'JAN', videos: 450, photos: 420 },
  { month: 'FEB', videos: 480, photos: 440 },
  { month: 'MAR', videos: 460, photos: 450 },
  { month: 'APR', videos: 520, photos: 480 },
  { month: 'MAY', videos: 550, photos: 500 },
  { month: 'JUN', videos: 530, photos: 520 },
  { month: 'JUL', videos: 580, photos: 540 },
  { month: 'AUG', videos: 620, photos: 560 },
  { month: 'SEP', videos: 600, photos: 580 },
  { month: 'OCT', videos: 680, photos: 620 },
  { month: 'NOV', videos: 720, photos: 660 },
  { month: 'DEC', videos: 700, photos: 680 },
];

// Top performing items data
const topItems = [
  {
    id: 1,
    title: 'Total Published Items',
    subtitle: 'Total Published Items',
    image: 'https://via.placeholder.com/60',
    views: '41k',
    likes: '522',
    shares: '2k',
  },
  {
    id: 2,
    title: 'Total Published Items',
    subtitle: 'Total Published Items',
    image: 'https://via.placeholder.com/60',
    views: '41k',
    likes: '522',
    shares: '2k',
  },
  {
    id: 3,
    title: 'Total Published Items',
    subtitle: 'Total Published Items',
    image: 'https://via.placeholder.com/60',
    views: '41k',
    likes: '522',
    shares: '2k',
  },
  {
    id: 4,
    title: 'Total Published Items',
    subtitle: 'Total Published Items',
    image: 'https://via.placeholder.com/60',
    views: '41k',
    likes: '522',
    shares: '2k',
  },
  {
    id: 5,
    title: 'Total Published Items',
    subtitle: 'Total Published Items',
    image: 'https://via.placeholder.com/60',
    views: '41k',
    likes: '522',
    shares: '2k',
  },
];

const Overview = () => {
  const [timeFilter, setTimeFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('2026');
  const [feedView, setFeedView] = useState('web');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [deviceVisibility, setDeviceVisibility] = useState({
    mobile: false,
    desktop: false,
    both: true,
  });
  const [contains18Plus, setContains18Plus] = useState(false);

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
    // Handle publish logic here
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
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Overview</h1>

          {/* Dropdowns */}
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-32 bg-gray-900 border-gray-800 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-800 text-white">
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="month">This month</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-32 bg-gray-900 border-gray-800 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-800 text-white">
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
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
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-gray-800 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-500 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>12%</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">12,450</h2>
          <p className="text-gray-400 text-sm">Total Published Items</p>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-gray-800 rounded-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-500 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>12%</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">1M +</h2>
          <p className="text-gray-400 text-sm">Favourite Count Trend</p>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-gray-800 rounded-lg">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-500 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>12%</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">9,92,66,978</h2>
          <p className="text-gray-400 text-sm">Total Views</p>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-gray-800 rounded-lg">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-500 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>12%</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">12,450</h2>
          <p className="text-gray-400 text-sm">Clicks over time</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top performing items (CTR) */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold mb-6">Top performing items (CTR)</h3>
          <div className="space-y-4">
            {topItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-400">{item.subtitle}</p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Eye className="h-4 w-4" />
                    <span>{item.views}</span>
                  </div>
                  <div className="flex items-center gap-1 text-red-500">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{item.likes}</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-500">
                    <Share2 className="h-4 w-4" />
                    <span>{item.shares}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feed Performance */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
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
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                <Line
                  type="monotone"
                  dataKey="videos"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={{ fill: '#EF4444', r: 4 }}
                  name="Videos"
                />
                <Line
                  type="monotone"
                  dataKey="photos"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', r: 4 }}
                  name="Photos"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Create New Post Dialog */}
      <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
        <DialogContent className="max-w-4xl bg-gray-950 text-white border-gray-800 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Create New post</DialogTitle>
            <p className="text-sm text-gray-400">Fill out this form to publish a new post.</p>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm mb-2 block">
                  Title / Casino name: <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Title or Casino name here..."
                  className="bg-gray-900 border-gray-800 text-white"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <Label className="text-sm mb-2 block">
                  Type: <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger className="bg-gray-900 border-gray-800 text-white">
                    <SelectValue placeholder="Choose One..." />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800 text-white">
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
                  className="bg-gray-900 border-gray-800 text-white min-h-20"
                  value={formData.bonuses}
                  onChange={(e) => setFormData({ ...formData, bonuses: e.target.value })}
                />
              </div>

              <div>
                <Label className="text-sm mb-2 block">Short description:</Label>
                <Textarea
                  placeholder="Type bonus points & press enter to add"
                  className="bg-gray-900 border-gray-800 text-white min-h-20"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <Label className="text-sm mb-2 block">Terms highlights:</Label>
                <Textarea
                  placeholder="Provide your highlighted terms"
                  className="bg-gray-900 border-gray-800 text-white min-h-20"
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
                  className="bg-gray-900 border-gray-800 text-white"
                  value={formData.affiliateLink}
                  onChange={(e) => setFormData({ ...formData, affiliateLink: e.target.value })}
                />
              </div>

              <div>
                <Label className="text-sm mb-2 block">
                  Languages: <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.languages} onValueChange={(value) => setFormData({ ...formData, languages: value })}>
                  <SelectTrigger className="bg-gray-900 border-gray-800 text-white">
                    <SelectValue placeholder="Choose One..." />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800 text-white">
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm mb-2 block">Device visibility:</Label>
                <div className="flex gap-4 mt-2">
                  <Button
                    type="button"
                    variant={deviceVisibility.mobile ? 'default' : 'outline'}
                    className={`flex-1 ${deviceVisibility.mobile ? 'bg-white text-black' : 'bg-gray-900 border-gray-800'}`}
                    onClick={() => setDeviceVisibility({ mobile: true, desktop: false, both: false })}
                  >
                    Mobile
                  </Button>
                  <Button
                    type="button"
                    variant={deviceVisibility.desktop ? 'default' : 'outline'}
                    className={`flex-1 ${deviceVisibility.desktop ? 'bg-white text-black' : 'bg-gray-900 border-gray-800'}`}
                    onClick={() => setDeviceVisibility({ mobile: false, desktop: true, both: false })}
                  >
                    Desktop
                  </Button>
                  <Button
                    type="button"
                    variant={deviceVisibility.both ? 'default' : 'outline'}
                    className={`flex-1 ${deviceVisibility.both ? 'bg-white text-black' : 'bg-gray-900 border-gray-800'}`}
                    onClick={() => setDeviceVisibility({ mobile: false, desktop: false, both: true })}
                  >
                    Both
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm mb-2 block">Categories/tags:</Label>
                <Textarea
                  placeholder="Type bonus points & press enter to add"
                  className="bg-gray-900 border-gray-800 text-white min-h-20"
                  value={formData.categories}
                  onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                />
              </div>

              <div>
                <Label className="text-sm mb-2 block">Disclaimers:</Label>
                <Textarea
                  placeholder="Type bonus points & press enter to add"
                  className="bg-gray-900 border-gray-800 text-white min-h-20"
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
                <div className="border-2 border-dashed border-gray-800 rounded-lg p-8 bg-gray-900/50 flex flex-col items-center justify-center min-h-[300px]">
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
                        onChange={handleMediaUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button className="mt-4 bg-red-600 hover:bg-red-700">Upload</Button>
                    </>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm mb-2 block">Upload Thumbnail:</Label>
                <div className="border-2 border-dashed border-gray-800 rounded-lg p-6 bg-gray-900/50 flex flex-col items-center justify-center">
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
                      <p className="text-xs text-gray-500 mb-2">Choose a thumbnail for your videoshow</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700">
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
            <Button onClick={handlePreview} variant="outline" className="bg-gray-900 border-gray-800">
              Preview
            </Button>
            <Button
              onClick={() => setShowCreatePost(false)}
              variant="outline"
              className="ml-auto bg-gray-900 border-gray-800"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Post Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl bg-gray-950 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Preview Post</DialogTitle>
            <p className="text-sm text-gray-400">Your post will be like this preview.</p>
          </DialogHeader>

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
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-sm">🎰</span>
                </div>
                <h3 className="font-bold text-lg">
                  {formData.title || "Fortune's Fortune Casino."}
                </h3>
              </div>

              <p className="text-sm text-gray-300">
                {formData.description ||
                  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy... See More"}
              </p>

              <Button className="bg-red-600 hover:bg-red-700">Claim Offer</Button>

              {/* Actions */}
              <div className="flex items-center gap-6 py-4">
                <button className="flex flex-col items-center gap-1">
                  <Heart className="h-6 w-6" />
                  <span className="text-xs">1.4k</span>
                </button>
                <button className="flex flex-col items-center gap-1">
                  <MessageCircle className="h-6 w-6" />
                  <span className="text-xs">1k</span>
                </button>
                <button className="flex flex-col items-center gap-1">
                  <Bookmark className="h-6 w-6" />
                </button>
                <button className="flex flex-col items-center gap-1">
                  <Share className="h-6 w-6" />
                </button>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold mb-2">Description:</h4>
                <p className="text-sm text-gray-300">
                  {formData.description ||
                    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy..."}
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="px-3 py-1 bg-gray-800 rounded-full text-xs">Lorem Ipsum has been</span>
                  <span className="px-3 py-1 bg-gray-800 rounded-full text-xs">Lorem Ipsum</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  It is a long established fact that a reader will be distract
                </p>
              </div>

              {/* Terms */}
              <div>
                <h4 className="font-semibold mb-2">Terms highlights:</h4>
                <p className="text-sm text-gray-300">
                  {formData.termsHighlights ||
                    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy."}
                </p>
              </div>

              {/* Disclaimers */}
              <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-500">⚠</span>
                  <div>
                    <h4 className="font-semibold text-yellow-500 mb-1">Disclaimers:</h4>
                    <p className="text-xs text-gray-300">
                      {formData.disclaimers ||
                        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <Button onClick={handlePublish} className="bg-red-600 hover:bg-red-700">
              Publish
            </Button>
            <Button
              onClick={() => {
                setShowPreview(false);
                setShowCreatePost(true);
              }}
              variant="outline"
              className="bg-gray-900 border-gray-800"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Overview;