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
  CreditCard,
  TrendingUp,
  Share2,
  ThumbsUp,
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
    image: '/api/placeholder/60/60',
    views: '41k',
    likes: '522',
    shares: '2k',
  },
  {
    id: 2,
    title: 'Total Published Items',
    subtitle: 'Total Published Items',
    image: '/api/placeholder/60/60',
    views: '41k',
    likes: '522',
    shares: '2k',
  },
  {
    id: 3,
    title: 'Total Published Items',
    subtitle: 'Total Published Items',
    image: '/api/placeholder/60/60',
    views: '41k',
    likes: '522',
    shares: '2k',
  },
  {
    id: 4,
    title: 'Total Published Items',
    subtitle: 'Total Published Items',
    image: '/api/placeholder/60/60',
    views: '41k',
    likes: '522',
    shares: '2k',
  },
  {
    id: 5,
    title: 'Total Published Items',
    subtitle: 'Total Published Items',
    image: '/api/placeholder/60/60',
    views: '41k',
    likes: '522',
    shares: '2k',
  },
];

const Overview = () => {
  const [timeFilter, setTimeFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('2026');
  const [feedView, setFeedView] = useState('web');

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Overview</h1>
          
          {/* Dropdowns */}
          

        <Button className="bg-red-600 hover:bg-red-700">New Post</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Published Items */}
        <div className="bg-gray-900 rounded-lg p-6 relative overflow-hidden border border-gray-800">
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

        {/* Favourite Count Trend */}
        <div className="bg-gray-900 rounded-lg p-6 relative overflow-hidden border border-gray-800">
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
        <div className="bg-gray-900 rounded-lg p-6 relative overflow-hidden border border-gray-800">
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

        {/* Clicks over time */}
        <div className="bg-gray-900 rounded-lg p-6 relative overflow-hidden border border-gray-800">
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
        

        {/* Feed Performance */}
    

          {/* Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="month"
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
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

          {/* Restore Up Button (as shown in image) */}
          <div className="absolute top-24 left-1/2 transform -translate-x-1/2">
            <button className="px-4 py-2 bg-white text-black rounded-md text-sm font-medium hover:bg-gray-100 transition-colors">
              Restore Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;