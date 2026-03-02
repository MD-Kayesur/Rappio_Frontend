import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Pencil, Mail, Bell, Languages } from 'lucide-react';

function Settings() {
  const [isEditing, setIsEditing] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [loginNotifications, setLoginNotifications] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const [formData, setFormData] = useState({
    fullName: 'Cameron Williamson',
    dateOfBirth: 'January 1, 1987',
    gender: 'Male',
    nationality: 'American',
    address: 'California - United States',
    email: 'cameronwill@email.com',
  });

  const handleSaveChanges = () => {
    setIsEditing(false);
    // Handle save logic here
  };

  return (
    <div className="min-h-full bg-black text-white">
      {/* Profile Header */}
      <div className="relative mx-auto max-w-5xl">
        <div className="mx-4 mt-8 rounded-2xl bg-gradient-to-br from-yellow-700/80 to-yellow-900/80 p-8">
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src="/api/placeholder/100/100"
                alt="Profile"
                className="h-24 w-24 rounded-full border-4 border-white/20"
              />
            </div>
            <h1 className="mt-4 text-2xl font-semibold">
              Cameron Williamson
              <span className="ml-2 inline-block h-5 w-5 rounded-full bg-blue-500 text-center text-xs leading-5 text-white">
                ✓
              </span>
            </h1>
            <p className="mt-1 text-white/80">{formData.email}</p>
            <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
              <DialogTrigger asChild>
                <Button className="mt-4 bg-[#FACC15] hover:bg-[#EAB308] text-black font-semibold">
                  Update Password
                </Button>
              </DialogTrigger>
              <DialogContent className="border-gray-800 bg-black text-white">
                <DialogHeader>
                  <DialogTitle className="text-center text-xl">
                    Change Password
                  </DialogTitle>
                  <DialogDescription className="text-center text-gray-400">
                    You are able to change your password.
                    <br />
                    Please follow the steps to change password.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="relative">
                    <Input
                      type="password"
                      placeholder="Password"
                      className="border-gray-700 bg-[#1A1C1D] pr-10"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FACC15]">
                      👁
                    </button>
                  </div>
                  <div className="text-right">
                    <a href="#" className="text-sm text-gray-400 hover:text-white">
                      Forgot Password?
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      type="password"
                      placeholder="New Password"
                      className="border-gray-700 bg-[#1A1C1D] pr-10"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FACC15]">
                      👁
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      type="password"
                      placeholder="Retype Password"
                      className="border-gray-700 bg-[#1A1C1D] pr-10"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FACC15]">
                      👁
                    </button>
                  </div>
                  <Button className="w-full bg-[#FACC15] hover:bg-[#EAB308] text-black font-semibold">
                    Change Password
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Content Grid */}
        <div className="mx-4 mt-8 grid gap-6 pb-8 lg:grid-cols-2">
          {/* Personal Details */}
          <div className="rounded-2xl border border-gray-800 bg-[#1A1C1D]/50 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Personal details</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-[#FACC15] hover:text-yellow-400"
                >
                  <Pencil className="h-5 w-5" />
                </button>
              ) : (
                <Button
                  onClick={handleSaveChanges}
                  className="bg-[#FACC15] hover:bg-[#EAB308] text-black"
                  size="sm"
                >
                  Save Changes
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <Label className="text-gray-400">Full Name:</Label>
                {isEditing ? (
                  <Input
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-64 border-gray-700 bg-gray-800"
                  />
                ) : (
                  <span className="font-medium">{formData.fullName}</span>
                )}
              </div>

              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <Label className="text-gray-400">Date of Birth:</Label>
                {isEditing ? (
                  <Input
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                    className="w-64 border-gray-700 bg-gray-800"
                  />
                ) : (
                  <span className="font-medium">{formData.dateOfBirth}</span>
                )}
              </div>

              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <Label className="text-gray-400">Gender:</Label>
                {isEditing ? (
                  <Input
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="w-64 border-gray-700 bg-gray-800"
                  />
                ) : (
                  <span className="font-medium">{formData.gender}</span>
                )}
              </div>

              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <Label className="text-gray-400">Nationality:</Label>
                {isEditing ? (
                  <Input
                    value={formData.nationality}
                    onChange={(e) =>
                      setFormData({ ...formData, nationality: e.target.value })
                    }
                    className="w-64 border-gray-700 bg-gray-800"
                  />
                ) : (
                  <span className="font-medium">{formData.nationality}</span>
                )}
              </div>

              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <Label className="text-gray-400">Address:</Label>
                {isEditing ? (
                  <Select defaultValue="california">
                    <SelectTrigger className="w-64 border-gray-700 bg-gray-800">
                      <SelectValue placeholder="Choose One..." />
                    </SelectTrigger>
                    <SelectContent className="border-gray-700 bg-gray-800">
                      <SelectItem value="california">
                        🇺🇸 California - United States
                      </SelectItem>
                      <SelectItem value="newyork">
                        🇺🇸 New York - United States
                      </SelectItem>
                      <SelectItem value="texas">
                        🇺🇸 Texas - United States
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="font-medium">
                    🇺🇸 {formData.address}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pb-3">
                <Label className="text-gray-400">Email:</Label>
                <span className="font-medium">{formData.email}</span>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="rounded-2xl border border-gray-800 bg-[#1A1C1D]/50 p-6">
            <h2 className="mb-6 text-xl font-semibold">Account Details</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <Label className="text-gray-400">Display Name:</Label>
                <span className="font-medium">Cameron Williamson</span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <Label className="text-gray-400">Account Created:</Label>
                <span className="font-medium">March 20, 2020</span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <Label className="text-gray-400">Last Login:</Label>
                <span className="font-medium">August 22, 2024</span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <Label className="text-gray-400">Language Preference:</Label>
                <span className="font-medium">English</span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <Label className="text-gray-400">Time Zone:</Label>
                <span className="font-medium">GMT-5 (Eastern Time)</span>
              </div>

              <div className="flex items-center justify-between pb-3">
                <Label className="text-gray-400">Password Last Changed:</Label>
                <span className="font-medium">Jul 15, 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="mx-4 mb-8 rounded-2xl border border-gray-800 bg-[#1A1C1D]/50 p-6">
          <h2 className="mb-6 text-xl font-semibold">Preferences</h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <Label className="text-base">Email Notifications:</Label>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
                className="data-[state=checked]:bg-[#FACC15]"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-gray-400" />
                <Label className="text-base">Login Notifications:</Label>
              </div>
              <Switch
                checked={loginNotifications}
                onCheckedChange={setLoginNotifications}
                className="data-[state=checked]:bg-[#FACC15]"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Languages className="h-5 w-5 text-gray-400" />
                <Label className="text-base">Content Preferences:</Label>
              </div>
              <Select defaultValue="english">
                <SelectTrigger className="w-40 border-gray-700 bg-gray-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-gray-700 bg-gray-800">
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}

export default Settings;