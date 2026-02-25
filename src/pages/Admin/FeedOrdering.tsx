import { useState, useEffect } from 'react';
import { toast } from 'sonner';
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
import { useRef } from 'react';
import { MoreVertical, Edit, Trash2, Eye, Pin, Upload, X, Heart, MessageCircle, Bookmark, Share, ChevronLeft, ChevronRight } from 'lucide-react';
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
  subtitle?: string;
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
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch('/mediaData.json')
      .then(res => res.json())
      .then(data => {
        const formattedFeeds: Feed[] = data.map((item: any) => ({
          id: item.id,
          name: item.title,
          image: item.image_url,
          link: item.website_url,
          views: item.likes > 1000 ? (item.likes / 1000).toFixed(1) + 'k' : item.likes.toString(),
          clicks: (item.likes * 0.2).toFixed(0),
          device: 'Phone',
          status: 'Active',
          title: item.title,
          subtitle: item.subtitle,
          description: item.description,
          termsHighlights: item.terms_highlights?.join(', '),
          disclaimers: item.disclaimer,
          isPinned: false,
        }));
        setFeeds(formattedFeeds);
      })
      .catch(err => console.error('Error fetching feeds:', err));
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(feeds.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = feeds.slice(indexOfFirstItem, indexOfLastItem);

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

  // Handle Edit
  const handleEdit = (feed: Feed) => {
    setSelectedFeed(feed);
    setFormData({
      title: feed.title || feed.name,
      type: feed.type || '',
      bonuses: feed.bonuses || '',
      description: feed.description || '',
      termsHighlights: feed.termsHighlights || '',
      affiliateLink: feed.link,
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
    setFeeds(feeds.filter(feed => feed.id !== id));
    toast.success('Feed deleted successfully');
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
            termsHighlights: formData.termsHighlights,
            disclaimers: formData.disclaimers
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
    <div className="min-h-full text-white p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">All Feeds</h1>

          {/* Dropdowns */}
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
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1A1C1D] rounded-xl border border-gray-800 overflow-hidden mb-20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50 border-b border-gray-800">
              <tr>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Link
                </th>
                <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Views
                </th>
                <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Clicks
                </th>
                <th className="hidden xl:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Device
                </th>
                <th className="hidden sm:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {currentItems.map((feed) => (
                <tr
                  key={feed.id}
                  className="hover:bg-gray-800/30 transition-colors"
                >
                  {/* Name with Image */}
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      {feed.isPinned && (
                        <Pin className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                      )}
                      <img
                        src={feed.image}
                        alt={feed.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover flex-shrink-0"
                      />
                      <span className="text-sm font-medium text-white truncate max-w-[100px] sm:max-w-none">
                        {feed.name}
                      </span>
                    </div>
                  </td>

                  {/* Link */}
                  <td className="px-4 sm:px-6 py-4">
                    <a
                      href={feed.link}
                      className="text-sm text-blue-400 hover:text-blue-300 truncate block max-w-[120px] sm:max-w-xs"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {feed.link}
                    </a>
                  </td>

                  {/* Views */}
                  <td className="hidden md:table-cell px-6 py-4">
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
                  <td className="hidden lg:table-cell px-6 py-4">
                    <span className="text-sm text-gray-300">{feed.clicks}</span>
                  </td>

                  {/* Device */}
                  <td className="hidden xl:table-cell px-6 py-4">
                    <span className="text-sm text-gray-300">{feed.device}</span>
                  </td>

                  {/* Status */}
                  <td className="hidden sm:table-cell px-6 py-4">
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
                  <td className="px-4 sm:px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-gray-400 hover:text-white transition-colors">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-[#1A1C1D] border-gray-800 text-white">
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

        {/* Pagination Controls */}
        {feeds.length > itemsPerPage && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-4 bg-[#1A1C1D]/50 border-t border-gray-800">
            <div className="text-sm text-gray-400 text-center sm:text-left">
              Showing <span className="text-white font-medium">{indexOfFirstItem + 1}</span> to{' '}
              <span className="text-white font-medium">{Math.min(indexOfLastItem, feeds.length)}</span> of{' '}
              <span className="text-white font-medium">{feeds.length}</span> results
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-gray-800 border-gray-700 hover:bg-gray-700 disabled:opacity-50 h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    size="sm"
                    variant={currentPage === page ? 'default' : 'outline'}
                    className={`h-8 w-8 p-0 text-xs ${currentPage === page
                      ? 'bg-[#FACC15] hover:bg-[#EAB308] border-[#FACC15] text-black'
                      : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                      }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="bg-gray-800 border-gray-700 hover:bg-gray-700 disabled:opacity-50 h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="flex min-h-screen items-center justify-center p-2 sm:p-4">
            <div className="w-full max-w-7xl bg-gray-950 text-white border border-gray-800 rounded-lg shadow-xl relative">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                  <h2 className="text-xl font-bold">Create New post</h2>
                  <p className="text-sm text-gray-400">Fill out this form to publish a new post.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Left Column - Form Fields */}
                  <div className="space-y-8">
                    <div>
                      <Label className="text-sm mb-2 block">Title / Casino name:</Label>
                      <Input
                        placeholder="Title or casino name here..."
                        className="bg-[#1A1C1D] border-gray-800 text-white"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">Type:</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                        <SelectTrigger className="bg-[#1A1C1D] border-gray-800 text-white">
                          <SelectValue placeholder="Choose One..." />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1C1D] border-gray-800 text-white">
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
                      <Label className="text-sm mb-2 block">Affiliate link:</Label>
                      <Input
                        placeholder="Type bonus points & press enter to add"
                        className="bg-[#1A1C1D] border-gray-800 text-white"
                        value={formData.affiliateLink}
                        onChange={(e) => setFormData({ ...formData, affiliateLink: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">Languages:</Label>
                      <Select value={formData.languages} onValueChange={(value) => setFormData({ ...formData, languages: value })}>
                        <SelectTrigger className="bg-[#1A1C1D] border-gray-800 text-white">
                          <SelectValue placeholder="Choose One..." />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1C1D] border-gray-800 text-white">
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
                          className={`flex-1 ${deviceVisibility.mobile ? 'bg-white text-black' : 'bg-[#1A1C1D] border-gray-800'}`}
                          onClick={() => setDeviceVisibility({ mobile: true, desktop: false, both: false })}
                        >
                          Mobile
                        </Button>
                        <Button
                          type="button"
                          variant={deviceVisibility.desktop ? 'default' : 'outline'}
                          className={`flex-1 ${deviceVisibility.desktop ? 'bg-white text-black' : 'bg-[#1A1C1D] border-gray-800'}`}
                          onClick={() => setDeviceVisibility({ mobile: false, desktop: true, both: false })}
                        >
                          Desktop
                        </Button>
                        <Button
                          type="button"
                          variant={deviceVisibility.both ? 'default' : 'outline'}
                          className={`flex-1 ${deviceVisibility.both ? 'bg-white text-black' : 'bg-[#1A1C1D] border-gray-800'}`}
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
                      <Label className="text-sm mb-2 block">Upload Media:</Label>
                      <div className="border-2 border-dashed border-gray-800 rounded-lg p-8 bg-[#1A1C1D]/50 flex flex-col items-center justify-center min-h-[300px] relative">
                        {formData.mediaPreview ? (
                          <div className="relative w-full h-full">
                            <img src={formData.mediaPreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                            <button
                              onClick={() => setFormData({ ...formData, mediaFile: null, mediaPreview: '' })}
                              className="absolute top-2 right-2 p-1 bg-[#FACC15] rounded-full hover:bg-[#EAB308] text-black"
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
                              className="mt-4 bg-[#FACC15] hover:bg-[#EAB308] text-black font-semibold"
                            >
                              Upload
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">Upload Thumbnail:</Label>
                      <div className="border-2 border-dashed border-gray-800 rounded-lg p-6 bg-[#1A1C1D]/50 flex flex-col items-center justify-center relative">
                        {formData.thumbnailPreview ? (
                          <div className="relative w-full">
                            <img src={formData.thumbnailPreview} alt="Thumbnail" className="w-full h-32 object-cover rounded-lg" />
                            <button
                              onClick={() => setFormData({ ...formData, thumbnailFile: null, thumbnailPreview: '' })}
                              className="absolute top-2 right-2 p-1 bg-[#FACC15] rounded-full hover:bg-[#EAB308] text-black"
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
                  <Button onClick={handleSaveEdit} className="bg-[#FACC15] hover:bg-[#EAB308] text-black font-semibold">
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => setShowEditModal(false)}
                    variant="outline"
                    className="bg-[#1A1C1D] border-gray-800"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showViewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="flex min-h-screen items-center justify-center p-2 sm:p-4">
            <div className="w-full max-w-7xl bg-gray-950 text-white border border-gray-800 rounded-lg shadow-xl relative">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                  <h2 className="text-xl font-bold">Preview Post</h2>
                  <p className="text-sm text-gray-400">Your post will be like this preview.</p>
                </div>

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

                      <Button className="bg-[#FACC15] hover:bg-[#EAB308] text-black font-semibold">Claim Offer</Button>

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
                    className="bg-[#1A1C1D] border-gray-800"
                  >
                    Close
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

export default FeedOrdering;