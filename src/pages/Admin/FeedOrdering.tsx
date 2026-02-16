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
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, Eye, Pin, Upload, X, Heart, MessageCircle, Bookmark, Share } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';

interface Feed {
  id: number;
  name: string;
  image: string;
  link: string;
  views: string;
  clicks: string;
  device: 'Phone' | 'Desktop';
  status: 'Active' | 'Disabled';
  title?: string;
  type?: string;
  bonuses?: string;
  description?: string;
  termsHighlights?: string;
  affiliateLink?: string;
  languages?: string;
  categories?: string;
  disclaimers?: string;
  isPinned?: boolean;
}

const FeedOrdering = () => {
  const [timeFilter, setTimeFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('2026');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState<Feed | null>(null);
  const [deviceVisibility, setDeviceVisibility] = useState({
    mobile: false,
    desktop: false,
    both: true,
  });
  const [contains18Plus, setContains18Plus] = useState(false);

  const [feeds, setFeeds] = useState<Feed[]>([
    {
      id: 1,
      name: 'The Top Most Casino',
      image: 'https://via.placeholder.com/40',
      link: 'https://www.google.com/search?q=sun%20bat...',
      views: '1k',
      clicks: '29',
      device: 'Phone',
      status: 'Active',
      title: "Fortune's Fortune Casino",
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      isPinned: false,
    },
    {
      id: 2,
      name: 'The Top Most Casino',
      image: 'https://via.placeholder.com/40',
      link: 'https://www.google.com/search?q=sun%20bat...',
      views: '325k',
      clicks: '1k',
      device: 'Desktop',
      status: 'Active',
      title: "Fortune's Fortune Casino",
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      isPinned: false,
    },
    {
      id: 3,
      name: 'The Top Most Casino',
      image: 'https://via.placeholder.com/40',
      link: 'https://www.google.com/search?q=sun%20bat...',
      views: '5k',
      clicks: '100',
      device: 'Phone',
      status: 'Active',
      isPinned: false,
    },
    // ... add more feeds
  ]);

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

  // Handle Edit
  const handleEdit = (feed: Feed) => {
    setSelectedFeed(feed);
    setFormData({
      title: feed.title || feed.name,
      type: feed.type || '',
      bonuses: feed.bonuses || '',
      description: feed.description || '',
      termsHighlights: feed.termsHighlights || '',
      affiliateLink: feed.affiliateLink || feed.link,
      languages: feed.languages || '',
      categories: feed.categories || '',
      disclaimers: feed.disclaimers || '',
      mediaFile: null,
      mediaPreview: feed.image,
      thumbnailFile: null,
      thumbnailPreview: '',
    });
    setShowEditModal(true);
  };

  // Handle View
  const handleView = (feed: Feed) => {
    setSelectedFeed(feed);
    setShowViewModal(true);
  };

  // Handle Delete
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this feed?')) {
      setFeeds(feeds.filter(feed => feed.id !== id));
    }
  };

  // Handle Pin/Unpin
  const handlePin = (id: number) => {
    setFeeds(feeds.map(feed =>
      feed.id === id ? { ...feed, isPinned: !feed.isPinned } : feed
    ));
  };

  // Handle Save Edit
  const handleSaveEdit = () => {
    if (selectedFeed) {
      setFeeds(feeds.map(feed =>
        feed.id === selectedFeed.id
          ? {
            ...feed,
            name: formData.title,
            title: formData.title,
            description: formData.description,
            link: formData.affiliateLink,
            image: formData.mediaPreview,
          }
          : feed
      ));
      setShowEditModal(false);
      setSelectedFeed(null);
    }
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

  return (
    <div className="min-h-full bg-black text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">All Feeds</h1>

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
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50 border-b border-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Link
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Clicks
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Device
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {feeds.map((feed) => (
                <tr
                  key={feed.id}
                  className="hover:bg-gray-800/30 transition-colors"
                >
                  {/* Name with Image */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {feed.isPinned && (
                        <Pin className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      )}
                      <img
                        src={feed.image}
                        alt={feed.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <span className="text-sm font-medium text-white">
                        {feed.name}
                      </span>
                    </div>
                  </td>

                  {/* Link */}
                  <td className="px-6 py-4">
                    <a
                      href={feed.link}
                      className="text-sm text-blue-400 hover:text-blue-300 truncate block max-w-xs"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {feed.link}
                    </a>
                  </td>

                  {/* Views */}
                  <td className="px-6 py-4">
                    <span
                      className={`text-sm font-medium ${feed.views.includes('M')
                          ? 'text-purple-400'
                          : feed.views.includes('k') &&
                            parseInt(feed.views) > 100
                            ? 'text-orange-400'
                            : feed.views.includes('k') &&
                              parseInt(feed.views) > 50
                              ? 'text-yellow-400'
                              : 'text-white'
                        }`}
                    >
                      {feed.views}
                    </span>
                  </td>

                  {/* Clicks */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-300">{feed.clicks}</span>
                  </td>

                  {/* Device */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-300">{feed.device}</span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${feed.status === 'Active'
                          ? 'text-green-400 bg-green-900/30'
                          : 'text-orange-400 bg-orange-900/30'
                        }`}
                    >
                      {feed.status}
                    </span>
                  </td>

                  {/* Actions Dropdown */}
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-gray-400 hover:text-white transition-colors">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-gray-900 border-gray-800 text-white">
                        <DropdownMenuItem
                          onClick={() => handleView(feed)}
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-800"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEdit(feed)}
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-800"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handlePin(feed.id)}
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-800"
                        >
                          <Pin className="h-4 w-4" />
                          {feed.isPinned ? 'Unpin' : 'Pin'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(feed.id)}
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-800 text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-7xl bg-gray-950 text-white border-gray-800 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Create New post</DialogTitle>
            <p className="text-sm text-gray-400">Fill out this form to publish a new post.</p>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Left Column - Form Fields */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm mb-2 block">Title / Casino name:</Label>
                <Input
                  placeholder="Title or casino name here..."
                  className="bg-gray-900 border-gray-800 text-white"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <Label className="text-sm mb-2 block">Type:</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger className="bg-gray-900 border-gray-800 text-white">
                    <SelectValue placeholder="Choose One..." />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800 text-white">
                    <SelectItem value="casino">Casino</SelectItem>
                    <SelectItem value="poker">Poker</SelectItem>
                    <SelectItem value="sports">Sports Betting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm mb-2 block">Bonuses:</Label>
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
                <Label className="text-sm mb-2 block">Affiliate link:</Label>
                <Input
                  placeholder="Type bonus points & press enter to add"
                  className="bg-gray-900 border-gray-800 text-white"
                  value={formData.affiliateLink}
                  onChange={(e) => setFormData({ ...formData, affiliateLink: e.target.value })}
                />
              </div>

              <div>
                <Label className="text-sm mb-2 block">Languages:</Label>
                <Select value={formData.languages} onValueChange={(value) => setFormData({ ...formData, languages: value })}>
                  <SelectTrigger className="bg-gray-900 border-gray-800 text-white">
                    <SelectValue placeholder="Choose One..." />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800 text-white">
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
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
                <Label className="text-sm mb-2 block">Upload Media:</Label>
                <div className="border-2 border-dashed border-gray-800 rounded-lg p-8 bg-gray-900/50 flex flex-col items-center justify-center min-h-[300px] relative">
                  {formData.mediaPreview ? (
                    <div className="relative w-full h-full">
                      <img src={formData.mediaPreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
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
                <div className="border-2 border-dashed border-gray-800 rounded-lg p-6 bg-gray-900/50 flex flex-col items-center justify-center relative">
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
            <Button onClick={handleSaveEdit} className="bg-red-600 hover:bg-red-700">
              Save Changes
            </Button>
            <Button
              onClick={() => setShowEditModal(false)}
              variant="outline"
              className="bg-gray-900 border-gray-800"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View/Preview Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-3xl bg-gray-950 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Preview Post</DialogTitle>
            <p className="text-sm text-gray-400">Your post will be like this preview.</p>
          </DialogHeader>

          {selectedFeed && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Left - Image */}
              <div className="relative">
                <img
                  src={selectedFeed.image}
                  alt={selectedFeed.name}
                  className="w-full rounded-lg object-cover"
                />
              </div>

              {/* Right - Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                    <span className="text-sm">🎰</span>
                  </div>
                  <h3 className="font-bold text-lg">
                    {selectedFeed.title || selectedFeed.name}
                  </h3>
                </div>

                <p className="text-sm text-gray-300">
                  {selectedFeed.description ||
                    'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'}
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
                    {selectedFeed.description ||
                      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'}
                  </p>
                </div>

                {/* Terms */}
                <div>
                  <h4 className="font-semibold mb-2">Terms highlights:</h4>
                  <p className="text-sm text-gray-300">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                  </p>
                </div>

                {/* Disclaimers */}
                <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-500">⚠</span>
                    <div>
                      <h4 className="font-semibold text-yellow-500 mb-1">Disclaimers:</h4>
                      <p className="text-xs text-gray-300">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-6">
            <Button
              onClick={() => setShowViewModal(false)}
              variant="outline"
              className="bg-gray-900 border-gray-800"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeedOrdering;