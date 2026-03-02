import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  MoreVertical, 
  Trash2, 
  ShieldAlert, 
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  ip: string;
  joinedDate: string;
  status: 'active' | 'banned';
  banReason?: string;
  banUntil?: string;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  date: string;
  postTitle: string;
}

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'comments'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [banDuration, setBanDuration] = useState<'24h' | '7d' | 'perm'>('24h');

  // Mock data for users
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'James Wilson', email: 'james.w@example.com', ip: '192.168.1.45', joinedDate: '2026-01-15', status: 'active' },
    { id: '2', name: 'Sarah Parker', email: 's.parker@test.com', ip: '192.168.2.110', joinedDate: '2026-02-01', status: 'active' },
    { id: '3', name: 'Mike Johnson', email: 'mike.j@domain.io', ip: '172.16.254.1', joinedDate: '2026-02-12', status: 'banned', banReason: 'Spamming', banUntil: 'Permanent' },
    { id: '4', name: 'Elena Rodriguez', email: 'elena.r@web.es', ip: '10.0.0.8', joinedDate: '2026-02-18', status: 'active' },
    { id: '5', name: 'David Smith', email: 'd.smith@corp.com', ip: '192.168.0.22', joinedDate: '2026-02-22', status: 'active' },
  ]);

  // Mock data for comments
  const [comments, setComments] = useState<Comment[]>([
    { id: 'c1', userId: '1', userName: 'James Wilson', postTitle: 'Mega Win Slots', content: 'This is a great deal! Already won twice.', date: '2026-03-01 14:20' },
    { id: 'c2', userId: '2', userName: 'Sarah Parker', postTitle: 'Royal Flush Poker', content: 'Anyone knows the withdrawal limit?', date: '2026-03-01 15:45' },
    { id: 'c3', userId: '4', userName: 'Elena Rodriguez', postTitle: 'Mega Win Slots', content: 'Support was very helpful with my bonus.', date: '2026-03-01 16:10' },
  ]);

  const handleBanUser = (user: User) => {
    setSelectedUser(user);
    setIsBanModalOpen(true);
  };

  const confirmBan = () => {
    if (!selectedUser) return;
    
    const durationText = banDuration === '24h' ? '24 hours' : banDuration === '7d' ? '7 days' : 'Permanent';
    
    setUsers(prev => prev.map(u => 
      u.id === selectedUser.id 
        ? { ...u, status: 'banned', banUntil: durationText } 
        : u
    ));
    
    toast.success(`${selectedUser.name} banned for ${durationText} (IP: ${selectedUser.ip})`);
    setIsBanModalOpen(false);
    setSelectedUser(null);
  };

  const unbanUser = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status: 'active', banUntil: undefined } : u
    ));
    toast.success('User unbanned successfully');
  };

  const deleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
    toast.success('Comment deleted successfully');
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.ip.includes(searchQuery) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredComments = comments.filter(c => 
    c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-full bg-transparent text-white p-4 sm:p-6 lg:p-10">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">User Management</h1>
            <p className="text-white/50">Moderate comments and manage user permissions</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users or IPs..." 
                className="pl-10 bg-white/5 border-white/10 rounded-xl focus:border-[#FACC15] transition-all"
              />
            </div>
            <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
              <button 
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'users' ? 'bg-[#FACC15] text-black shadow-lg shadow-[#FACC15]/20' : 'text-white/60 hover:text-white'}`}
              >
                <Users size={16} />
                Users
              </button>
              <button 
                onClick={() => setActiveTab('comments')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'comments' ? 'bg-[#FACC15] text-black shadow-lg shadow-[#FACC15]/20' : 'text-white/60 hover:text-white'}`}
              >
                <MessageSquare size={16} />
                Comments
              </button>
            </div>
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            {activeTab === 'users' ? (
              <motion.div
                key="users-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="overflow-x-auto"
              >
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="px-6 py-5 text-sm font-bold uppercase tracking-wider text-white/40">User</th>
                      <th className="px-6 py-5 text-sm font-bold uppercase tracking-wider text-white/40">IP Address</th>
                      <th className="px-6 py-5 text-sm font-bold uppercase tracking-wider text-white/40">Joined</th>
                      <th className="px-6 py-5 text-sm font-bold uppercase tracking-wider text-white/40">Status</th>
                      <th className="px-6 py-5 text-sm font-bold uppercase tracking-wider text-white/40 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#FACC15]/10 flex items-center justify-center text-[#FACC15] font-bold border border-[#FACC15]/20 shadow-sm">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-white text-[15px]">{user.name}</div>
                              <div className="text-white/40 text-xs">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <code className="text-[13px] bg-white/5 px-2 py-1 rounded-md text-white/80 border border-white/5">
                            {user.ip}
                          </code>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm text-white/60">{user.joinedDate}</span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            {user.status === 'active' ? (
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20 shadow-sm">
                                <CheckCircle2 size={12} />
                                Active
                              </div>
                            ) : (
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20 shadow-sm">
                                  <XCircle size={12} />
                                  Banned
                                </div>
                                <span className="text-[10px] text-white/30 italic">Until: {user.banUntil}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <Popover>
                            <PopoverTrigger asChild>
                              <button className="p-2 hover:bg-white/10 rounded-full transition-all text-white/40 hover:text-white active:scale-90">
                                <MoreVertical size={20} />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent side="left" className="w-48 bg-neutral-900/90 backdrop-blur-xl border-white/10 p-1.5 shadow-2xl rounded-2xl animate-in fade-in zoom-in-95">
                              {user.status === 'active' ? (
                                <button 
                                  onClick={() => handleBanUser(user)}
                                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all text-left"
                                >
                                  <ShieldAlert size={16} />
                                  Ban User
                                </button>
                              ) : (
                                <button 
                                  onClick={() => unbanUser(user.id)}
                                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-emerald-400 hover:bg-emerald-500/10 transition-all text-left"
                                >
                                  <CheckCircle2 size={16} />
                                  Unban User
                                </button>
                              )}
                              <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 transition-all text-left">
                                <Users size={16} />
                                View Profile
                              </button>
                            </PopoverContent>
                          </Popover>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            ) : (
              <motion.div
                key="comments-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="overflow-x-auto"
              >
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="px-6 py-5 text-sm font-bold uppercase tracking-wider text-white/40">User</th>
                      <th className="px-6 py-5 text-sm font-bold uppercase tracking-wider text-white/40">Comment</th>
                      <th className="px-6 py-5 text-sm font-bold uppercase tracking-wider text-white/40">Post</th>
                      <th className="px-6 py-5 text-sm font-bold uppercase tracking-wider text-white/40">Date</th>
                      <th className="px-6 py-5 text-sm font-bold uppercase tracking-wider text-white/40 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredComments.map((comment) => (
                      <tr key={comment.id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-5">
                          <div className="font-bold text-white text-sm">{comment.userName}</div>
                          <div className="text-[10px] text-white/30 uppercase tracking-tighter">ID: {comment.userId}</div>
                        </td>
                        <td className="px-6 py-5 max-w-[300px]">
                          <p className="text-sm text-white/80 line-clamp-2 italic italic">"{comment.content}"</p>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-xs bg-white/5 px-2 py-1 rounded-full border border-white/10 text-[#FACC15]">{comment.postTitle}</span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="text-xs text-white/40">{comment.date}</span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button 
                            onClick={() => deleteComment(comment.id)}
                            className="p-2 hover:bg-red-500/10 rounded-lg text-red-500 transition-all opacity-0 group-hover:opacity-100 active:scale-95 shadow-lg shadow-red-500/0 hover:shadow-red-500/10"
                            title="Delete comment"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer - Mock Pagination */}
          <div className="px-6 py-5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
            <span className="text-xs text-white/40 font-medium tracking-wide uppercase">Showing 5 of 12 items</span>
            <div className="flex items-center gap-2">
              <button className="p-1 px-2.5 rounded-lg border border-white/10 text-white/40 hover:bg-white/5 transition-all text-sm flex items-center gap-1 cursor-not-allowed">
                <ChevronLeft size={14} />
                Prev
              </button>
              <button className="p-1 px-2.5 rounded-lg border border-white/10 text-white/80 hover:bg-white/10 transition-all text-sm flex items-center gap-1">
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ban Modal */}
      <AnimatePresence>
        {isBanModalOpen && (
          <div className="fixed inset-0 z-[12000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsBanModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-neutral-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FACC15]/10 rounded-full blur-3xl -mr-16 -mt-16" />
              
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-6 shadow-lg shadow-red-500/5">
                  <ShieldAlert size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Ban User</h2>
                <p className="text-white/40 text-sm">You are about to ban <span className="text-white font-bold">{selectedUser?.name}</span> by their IP address.</p>
                <div className="mt-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="text-xs font-mono text-white/60">IP: {selectedUser?.ip}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[11px] font-bold text-white/30 uppercase tracking-widest block mb-3">Ban Duration</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: '24h', label: '24 Hours', icon: Clock },
                      { id: '7d', label: '7 Days', icon: Clock },
                      { id: 'perm', label: 'Permanent', icon: ShieldAlert },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setBanDuration(option.id as any)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${banDuration === option.id ? 'bg-[#FACC15] border-[#FACC15] text-black shadow-lg shadow-[#FACC15]/20' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'}`}
                      >
                        <option.icon size={18} />
                        <span className="text-xs font-bold whitespace-nowrap">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={confirmBan}
                    className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20 active:scale-95"
                  >
                    Confirm Ban
                  </Button>
                  <Button 
                    onClick={() => setIsBanModalOpen(false)}
                    variant="outline"
                    className="w-full h-12 border-white/10 hover:bg-white/5 text-white font-medium rounded-xl transition-all"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;
