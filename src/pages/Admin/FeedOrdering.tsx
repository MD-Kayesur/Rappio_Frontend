import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';

interface Feed {
  id: number;
  name: string;
  image: string;
  link: string;
  views: string;
  clicks: string;
  device: 'Phone' | 'Desktop';
  status: 'Active' | 'Disabled';
}

const AllFeeds = () => {
  const [timeFilter, setTimeFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('2026');

  const feeds: Feed[] = [
    {
      id: 1,
      name: 'The Top Most Casino',
      image: 'https://via.placeholder.com/40',
      link: 'https://www.google.com/search?q=sun%20bat...',
      views: '1k',
      clicks: '29',
      device: 'Phone',
      status: 'Active',
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
    },
    {
      id: 4,
      name: 'The Top Most Casino',
      image: 'https://via.placeholder.com/40',
      link: 'https://www.google.com/search?q=sun%20bat...',
      views: '78k',
      clicks: '5k',
      device: 'Phone',
      status: 'Active',
    },
    {
      id: 5,
      name: 'The Top Most Casino',
      image: 'https://via.placeholder.com/40',
      link: 'https://www.google.com/search?q=sun%20bat...',
      views: '998k',
      clicks: '200k',
      device: 'Phone',
      status: 'Active',
    },
    {
      id: 6,
      name: 'The Top Most Casino',
      image: 'https://via.placeholder.com/40',
      link: 'https://www.google.com/search?q=sun%20bat...',
      views: '32k',
      clicks: '1.5k',
      device: 'Phone',
      status: 'Active',
    },
    {
      id: 7,
      name: 'The Top Most Casino',
      image: 'https://via.placeholder.com/40',
      link: 'https://www.google.com/search?q=sun%20bat...',
      views: '33.5k',
      clicks: '505',
      device: 'Phone',
      status: 'Active',
    },
    {
      id: 8,
      name: 'The Top Most Casino',
      image: 'https://via.placeholder.com/40',
      link: 'https://www.google.com/search?q=sun%20bat...',
      views: '58k',
      clicks: '12k',
      device: 'Desktop',
      status: 'Active',
    },
    {
      id: 9,
      name: 'The Top Most Casino',
      image: 'https://via.placeholder.com/40',
      link: 'https://www.google.com/search?q=sun%20bat...',
      views: '5k',
      clicks: '980',
      device: 'Phone',
      status: 'Disabled',
    },
    {
      id: 10,
      name: 'The Top Most Casino',
      image: 'https://via.placeholder.com/40',
      link: 'https://www.google.com/search?q=sun%20bat...',
      views: '1M',
      clicks: '1M',
      device: 'Phone',
      status: 'Active',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
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

        <Button className="bg-red-600 hover:bg-red-700">New Post</Button>
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
                      className={`text-sm font-medium ${
                        feed.views.includes('M')
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
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                        feed.status === 'Active'
                          ? 'text-green-400 bg-green-900/30'
                          : 'text-orange-400 bg-orange-900/30'
                      }`}
                    >
                      {feed.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllFeeds;