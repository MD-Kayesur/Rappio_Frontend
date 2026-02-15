import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Clock,
  Eye,
  Sparkles,
  TrendingUp,
  ThumbsUp,
  Heart,
  Share2,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

// Chart data
const chartData = [
  { month: 'JAN', videos: 350, photos: 320 },
  { month: 'FEB', videos: 400, photos: 360 },
  { month: 'MAR', videos: 380, photos: 370 },
  { month: 'APR', videos: 420, photos: 400 },
  { month: 'MAY', videos: 450, photos: 410 },
  { month: 'JUN', videos: 470, photos: 440 },
  { month: 'JUL', videos: 500, photos: 460 },
  { month: 'AUG', videos: 520, photos: 480 },
  { month: 'SEP', videos: 490, photos: 470 },
  { month: 'OCT', videos: 540, photos: 500 },
  { month: 'NOV', videos: 560, photos: 520 },
  { month: 'DEC', videos: 580, photos: 540 },
];

// Top performing items
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

// Language performance data
const languageData = [
  { name: 'English', flag: '🇺🇸', percentage: 87 },
  { name: 'Finnish', flag: '🇫🇮', percentage: 42 },
  { name: 'Portuguese', flag: '🇵🇹', percentage: 56 },
  { name: 'Spanish', flag: '🇪🇸', percentage: 87 },
  { name: 'Hindi', flag: '🇮🇳', percentage: 32 },
];

const Analytics = () => {
  const [timeFilter, setTimeFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('2026');
  const [feedView, setFeedView] = useState('web');
  const [languageView, setLanguageView] = useState('web');

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Analytics</h1>

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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Search Usage */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-gray-800 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-500 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>9.6%</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">12M+</h2>
          <p className="text-gray-400 text-sm">Search Usage</p>
        </div>

        {/* Favourite Count Trend */}
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

        {/* Total Views */}
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
          <h2 className="text-3xl font-bold mb-2">25M+</h2>
          <p className="text-gray-400 text-sm">Total Views</p>
        </div>

        {/* Clicks to affiliate link */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-gray-800 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-500 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>12%</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">29K+</h2>
          <p className="text-gray-400 text-sm">Clicks to affiliate link</p>
        </div>
      </div>

      {/* Bottom Section - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Left Column - Top performing items */}
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
                    <Heart className="h-4 w-4" />
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

        {/* Right Column - Feed Performance Chart */}
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

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="month"
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <Line
                  type="monotone"
                  dataKey="videos"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={{ fill: '#EF4444', r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="photos"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-400">Videos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-400">Photos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Language Performance - Full Width */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Top performing feed by language</h3>
          <Select value={languageView} onValueChange={setLanguageView}>
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

        <div className="space-y-4">
          {languageData.map((language, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{language.flag}</span>
                  <span className="text-sm font-medium text-white">
                    {language.name}
                  </span>
                </div>
                <span className="text-sm font-semibold text-white">
                  {language.percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${language.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;