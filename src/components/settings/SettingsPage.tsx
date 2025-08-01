import React, { useState } from 'react';
import { User, Lock, Camera, Check, Bell } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    fullName: 'Mohammed Imran',
    email: 'admin@aspirasys.com',
    contactNumber: '+91 9876543210',
    avatar: '/default-avatar.png'
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationPreferences, setNotificationPreferences] = useState({
    newAspirantRegistrations: {
      email: true,
      sms: true,
      inApp: true
    },
    interviewRequests: {
      email: true,
      inApp: true
    },
    capstoneSubmissions: {
      email: true,
      inApp: true
    },
    certificateApproval: {
      inApp: true
    },
    systemAnnouncements: {
      email: true,
      inApp: true
    }
  });

  const [passwordErrors, setPasswordErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const [successMessage, setSuccessMessage] = useState('');

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('Profile updated successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: typeof passwordErrors = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    } else if (!/\d/.test(passwordForm.newPassword)) {
      errors.newPassword = 'Password must include at least one number';
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setSuccessMessage('Password updated successfully');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordErrors({});
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('Notification preferences updated successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileForm(prev => ({
          ...prev,
          avatar: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const NotificationToggle: React.FC<{
    label: string;
    channels: { [key: string]: boolean };
    onChange: (channel: string, value: boolean) => void;
    availableChannels?: string[];
  }> = ({ label, channels, onChange, availableChannels = ['email', 'sms', 'inApp'] }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-0">
      <span className="text-sm font-medium text-gray-900">{label}</span>
      <div className="flex items-center space-x-4">
        {availableChannels.includes('email') && (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={channels.email}
              onChange={(e) => onChange('email', e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-600">Email</span>
          </label>
        )}
        {availableChannels.includes('sms') && (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={channels.sms}
              onChange={(e) => onChange('sms', e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-600">SMS</span>
          </label>
        )}
        {availableChannels.includes('inApp') && (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={channels.inApp}
              onChange={(e) => onChange('inApp', e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              disabled={label === 'System Announcements'}
            />
            <span className="text-sm text-gray-600">In-app</span>
          </label>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Settings</h2>

      {successMessage && (
        <div className="flex items-center p-4 bg-green-50 rounded-lg">
          <Check className="text-green-500 mr-2" size={20} />
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="border-b border-gray-200 px-6">
            <TabsTrigger value="profile" className="flex items-center">
              <User size={18} className="mr-2" />
              Profile Settings
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Lock size={18} className="mr-2" />
              Security Settings
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell size={18} className="mr-2" />
              Notification Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="p-6">
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img
                    src={profileForm.avatar}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 p-1 bg-gray-800 rounded-full cursor-pointer hover:bg-gray-700 transition-colors"
                  >
                    <Camera size={16} className="text-white" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Profile Picture</h3>
                  <p className="text-sm text-gray-500">
                    Upload a new profile picture (JPG or PNG)
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Email address cannot be changed
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  value={profileForm.contactNumber}
                  onChange={(e) => setProfileForm({ ...profileForm, contactNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value="Super Admin"
                  readOnly
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setProfileForm({
                    fullName: 'Mohammed Imran',
                    email: 'admin@aspirasys.com',
                    contactNumber: '+91 9876543210',
                    avatar: '/default-avatar.png'
                  })}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Reset to Default
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="security" className="p-6">
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className={`w-full px-4 py-2 border ${
                    passwordErrors.currentPassword ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                />
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className={`w-full px-4 py-2 border ${
                    passwordErrors.newPassword ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                />
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className={`w-full px-4 py-2 border ${
                    passwordErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                />
                {passwordErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setPasswordForm({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                    setPasswordErrors({});
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Update Password
                </button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="notifications" className="p-6">
            <form onSubmit={handleNotificationSubmit} className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600">
                  Choose how you want to receive notifications about platform activities.
                  In-app notifications are always enabled for system announcements.
                </p>
              </div>

              <div className="space-y-2">
                <NotificationToggle
                  label="New Aspirant Registrations"
                  channels={notificationPreferences.newAspirantRegistrations}
                  onChange={(channel, value) => setNotificationPreferences(prev => ({
                    ...prev,
                    newAspirantRegistrations: { ...prev.newAspirantRegistrations, [channel]: value }
                  }))}
                />

                <NotificationToggle
                  label="Interview Requests"
                  channels={notificationPreferences.interviewRequests}
                  onChange={(channel, value) => setNotificationPreferences(prev => ({
                    ...prev,
                    interviewRequests: { ...prev.interviewRequests, [channel]: value }
                  }))}
                  availableChannels={['email', 'inApp']}
                />

                <NotificationToggle
                  label="Capstone Submissions"
                  channels={notificationPreferences.capstoneSubmissions}
                  onChange={(channel, value) => setNotificationPreferences(prev => ({
                    ...prev,
                    capstoneSubmissions: { ...prev.capstoneSubmissions, [channel]: value }
                  }))}
                  availableChannels={['email', 'inApp']}
                />

                <NotificationToggle
                  label="Certificate Approval"
                  channels={notificationPreferences.certificateApproval}
                  onChange={(channel, value) => setNotificationPreferences(prev => ({
                    ...prev,
                    certificateApproval: { ...prev.certificateApproval, [channel]: value }
                  }))}
                  availableChannels={['inApp']}
                />

                <NotificationToggle
                  label="System Announcements"
                  channels={notificationPreferences.systemAnnouncements}
                  onChange={(channel, value) => setNotificationPreferences(prev => ({
                    ...prev,
                    systemAnnouncements: { ...prev.systemAnnouncements, [channel]: value }
                  }))}
                  availableChannels={['email', 'inApp']}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setNotificationPreferences({
                    newAspirantRegistrations: { email: true, sms: true, inApp: true },
                    interviewRequests: { email: true, inApp: true },
                    capstoneSubmissions: { email: true, inApp: true },
                    certificateApproval: { inApp: true },
                    systemAnnouncements: { email: true, inApp: true }
                  })}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Reset to Default
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save Preferences
                </button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;