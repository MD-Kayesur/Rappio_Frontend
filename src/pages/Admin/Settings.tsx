import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { UserCircle, Shield, Upload, Edit, X } from 'lucide-react';

interface Language {
  id: number;
  name: string;
  flag: string;
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'languages'>('general');
  const [showUpdateInfoModal, setShowUpdateInfoModal] = useState(false);
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/80');
  
  // Form states
  const [userInfo, setUserInfo] = useState({
    name: '',
    address: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [languages, setLanguages] = useState<Language[]>([
    { id: 1, name: 'English', flag: '🇺🇸' },
    { id: 2, name: 'Portuguese', flag: '🇫🇮' },
    { id: 3, name: 'Portuguese', flag: '🇵🇹' },
    { id: 4, name: 'Spanish', flag: '🇪🇸' },
    { id: 5, name: 'Hindi', flag: '🇮🇳' },
  ]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveInfo = () => {
    console.log('Saving user info:', userInfo);
    setShowUpdateInfoModal(false);
  };

  const handleUpdatePassword = () => {
    console.log('Updating password:', passwordData);
    setShowUpdatePasswordModal(false);
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleRemoveLanguage = (id: number) => {
    setLanguages(languages.filter(lang => lang.id !== id));
  };

  const handleAddLanguage = () => {
    const newLang: Language = {
      id: Date.now(),
      name: 'New Language',
      flag: '🌐',
    };
    setLanguages([...languages, newLang]);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'general'
              ? 'bg-red-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          General
        </button>
        <button
          onClick={() => setActiveTab('languages')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'languages'
              ? 'bg-red-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Languages
        </button>
      </div>

      {/* Content */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
        {activeTab === 'general' ? (
          <div className="space-y-4">
            {/* Image Upload */}
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-800 hover:bg-gray-800 transition-colors">
              <div className="flex items-center gap-4">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-700"
                />
                <div>
                  <h3 className="font-semibold text-white">Image</h3>
                  <p className="text-sm text-gray-400">Update your image</p>
                </div>
              </div>
              <div>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label htmlFor="imageUpload">
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-gray-800 border-gray-700 hover:bg-gray-700"
                    onClick={() => document.getElementById('imageUpload')?.click()}
                  >
                    Upload
                  </Button>
                </label>
              </div>
            </div>

            {/* Personal Information */}
            <div
              onClick={() => setShowUpdateInfoModal(true)}
              className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                  <UserCircle className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Personal Information</h3>
                  <p className="text-sm text-gray-400">Update your name, email, address</p>
                </div>
              </div>
              <Edit className="w-5 h-5 text-gray-400" />
            </div>

            {/* Password */}
            <div
              onClick={() => setShowUpdatePasswordModal(true)}
              className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Password</h3>
                  <p className="text-sm text-gray-400">Update your password</p>
                </div>
              </div>
              <Edit className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Languages List */}
            {languages.map((language) => (
              <div
                key={language.id}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-800 hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{language.flag}</span>
                  <span className="font-medium text-white">{language.name}</span>
                </div>
                <button
                  onClick={() => handleRemoveLanguage(language.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}

            {/* Add New Button */}
            <div className="flex justify-end mt-6">
              <Button
                onClick={handleAddLanguage}
                variant="outline"
                className="bg-gray-800 border-gray-700 hover:bg-gray-700"
              >
                Add New
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Update Information Modal */}
      <Dialog open={showUpdateInfoModal} onOpenChange={setShowUpdateInfoModal}>
        <DialogContent className="bg-gray-950 border border-gray-800 text-white max-w-md">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Update your information</h2>
              <p className="text-sm text-gray-400">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.
              </p>
            </div>

            <div className="space-y-4">
              <Input
                placeholder="Name"
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
              />
              <Input
                placeholder="Address"
                value={userInfo.address}
                onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleSaveInfo}
                className="bg-red-600 hover:bg-red-700 px-8"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Password Modal */}
      <Dialog open={showUpdatePasswordModal} onOpenChange={setShowUpdatePasswordModal}>
        <DialogContent className="bg-gray-950 border border-gray-800 text-white max-w-md">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Update your password</h2>
              <p className="text-sm text-gray-400">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.
              </p>
            </div>

            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Old Password"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
              />
              <Input
                type="password"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
              />
              <Input
                type="password"
                placeholder="Confirm Password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleUpdatePassword}
                className="bg-red-600 hover:bg-red-700 px-8"
              >
                Update
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;