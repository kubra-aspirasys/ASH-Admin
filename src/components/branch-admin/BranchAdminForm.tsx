import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, RefreshCw, Eye, EyeOff, Copy, Check, Shield, Users, Settings } from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'dashboard' | 'aspirants' | 'branches' | 'courses' | 'interviews' | 'projects' | 'certificates' | 'announcements' | 'xp' | 'reports' | 'settings';
}

interface BranchAdminFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  branchId: string;
  status: boolean;
  permissions: string[];
  accessRestrictions: {
    canViewAllBranches: boolean;
    canManageAspirants: boolean;
    canViewReports: boolean;
    canManageInterviews: boolean;
    canAccessSettings: boolean;
  };
}

interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

const BranchAdminForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<BranchAdminFormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    branchId: '',
    status: true,
    permissions: [],
    accessRestrictions: {
      canViewAllBranches: false,
      canManageAspirants: true,
      canViewReports: true,
      canManageInterviews: true,
      canAccessSettings: false
    }
  });

  const [passwordOptions, setPasswordOptions] = useState<PasswordOptions>({
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Partial<BranchAdminFormData>>({});
  const [activeTab, setActiveTab] = useState<'basic' | 'permissions'>('basic');

  // All dashboard feature permissions
  const permissions: Permission[] = [
    // Dashboard Overview
    { id: 'dashboard.view', name: 'Dashboard Overview', description: 'Access main dashboard with analytics and metrics', category: 'dashboard' },
    
    // Aspirant Management
    { id: 'aspirants.view', name: 'View Aspirants', description: 'View aspirant profiles and progress', category: 'aspirants' },
    { id: 'aspirants.create', name: 'Add Aspirants', description: 'Register new aspirants', category: 'aspirants' },
    { id: 'aspirants.edit', name: 'Edit Aspirants', description: 'Modify aspirant information', category: 'aspirants' },
    { id: 'aspirants.delete', name: 'Remove Aspirants', description: 'Deactivate or remove aspirants', category: 'aspirants' },
    { id: 'aspirants.details', name: 'Aspirant Details', description: 'View detailed aspirant profiles', category: 'aspirants' },
    
    // Branch Management
    { id: 'branches.view', name: 'View Branches', description: 'Access branch information and statistics', category: 'branches' },
    { id: 'branches.create', name: 'Create Branches', description: 'Add new branches to the system', category: 'branches' },
    { id: 'branches.edit', name: 'Edit Branches', description: 'Modify branch information and settings', category: 'branches' },
    { id: 'branches.details', name: 'Branch Details', description: 'View detailed branch analytics', category: 'branches' },
    
    // Course Management
    { id: 'courses.view', name: 'View Courses', description: 'Access course content and structure', category: 'courses' },
    { id: 'courses.create', name: 'Create Courses', description: 'Build new courses and curriculum', category: 'courses' },
    { id: 'courses.edit', name: 'Edit Courses', description: 'Modify existing course content', category: 'courses' },
    { id: 'courses.assign', name: 'Assign Courses', description: 'Assign courses to aspirants', category: 'courses' },
    
    // Interview Management
    { id: 'interviews.view', name: 'View Interviews', description: 'See scheduled interviews and results', category: 'interviews' },
    { id: 'interviews.schedule', name: 'Schedule Interviews', description: 'Create and manage interview slots', category: 'interviews' },
    { id: 'interviews.conduct', name: 'Conduct Interviews', description: 'Submit interview results and feedback', category: 'interviews' },
    { id: 'interviews.details', name: 'Interview Details', description: 'View detailed interview information', category: 'interviews' },
    
    // Project Management
    { id: 'projects.view', name: 'View Projects', description: 'Access project submissions and capstones', category: 'projects' },
    { id: 'projects.review', name: 'Review Projects', description: 'Evaluate and provide feedback on projects', category: 'projects' },
    { id: 'projects.approve', name: 'Approve Projects', description: 'Approve or request resubmission', category: 'projects' },
    
    // Certificate Management
    { id: 'certificates.view', name: 'View Certificates', description: 'Access certificate requests and status', category: 'certificates' },
    { id: 'certificates.approve', name: 'Approve Certificates', description: 'Approve or reject certificate requests', category: 'certificates' },
    { id: 'certificates.issue', name: 'Issue Certificates', description: 'Generate and issue certificates', category: 'certificates' },
    
    // Announcement Management
    { id: 'announcements.view', name: 'View Announcements', description: 'See all announcements and their status', category: 'announcements' },
    { id: 'announcements.create', name: 'Create Announcements', description: 'Send announcements to aspirants', category: 'announcements' },
    { id: 'announcements.edit', name: 'Edit Announcements', description: 'Modify announcement content', category: 'announcements' },
    
    // XP & Streak Management
    { id: 'xp.view', name: 'View XP Dashboard', description: 'Access XP and streak analytics', category: 'xp' },
    { id: 'xp.manage', name: 'Manage XP & Streaks', description: 'Award XP and restore streaks', category: 'xp' },
    { id: 'xp.settings', name: 'XP Settings', description: 'Configure XP rules and streak settings', category: 'xp' },
    { id: 'xp.restoration', name: 'Streak Restoration', description: 'Process streak restoration requests', category: 'xp' },
    
    // Reports & Analytics
    { id: 'reports.view', name: 'View Reports', description: 'Access all reports and analytics', category: 'reports' },
    { id: 'reports.export', name: 'Export Reports', description: 'Download reports in various formats', category: 'reports' },
    { id: 'reports.create', name: 'Create Custom Reports', description: 'Generate custom analytics reports', category: 'reports' },
    
    // Settings & Configuration
    { id: 'settings.view', name: 'View Settings', description: 'Access system configuration', category: 'settings' },
    { id: 'settings.edit', name: 'Edit Settings', description: 'Modify system settings and preferences', category: 'settings' },
    { id: 'settings.users', name: 'User Management', description: 'Manage user accounts and permissions', category: 'settings' }
  ];

  // Sample branches data
  const branches = [
    { id: '1', name: 'Ambur Central' },
    { id: '2', name: 'Vaniyambadi North' },
    { id: '3', name: 'Pernambut Tech Park' },
    { id: '4', name: 'Chennai East' }
  ];

  const getPasswordStrength = (password: string): PasswordStrength => {
    if (!password) return { score: 0, label: 'None', color: 'bg-gray-200' };

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const strengths: PasswordStrength[] = [
      { score: 0, label: 'Very Weak', color: 'bg-red-500' },
      { score: 1, label: 'Weak', color: 'bg-orange-500' },
      { score: 2, label: 'Fair', color: 'bg-yellow-500' },
      { score: 3, label: 'Good', color: 'bg-blue-500' },
      { score: 4, label: 'Strong', color: 'bg-green-500' },
      { score: 5, label: 'Very Strong', color: 'bg-emerald-500' }
    ];

    return strengths[score];
  };

  useEffect(() => {
    if (isEditMode) {
      // Fetch admin data and populate form
      setFormData({
        name: 'Mohammed Imran',
        email: 'admin.ambur@aspirasys.com',
        phone: '+91 9876543210',
        password: '',
        branchId: '1',
        status: true,
        permissions: [
          'dashboard.view', 'aspirants.view', 'aspirants.edit', 'courses.view', 
          'interviews.view', 'reports.view'
        ],
        accessRestrictions: {
          canViewAllBranches: false,
          canManageAspirants: true,
          canViewReports: true,
          canManageInterviews: true,
          canAccessSettings: false
        }
      });
    }
  }, [isEditMode]);

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = '';
    if (passwordOptions.includeUppercase) chars += uppercase;
    if (passwordOptions.includeLowercase) chars += lowercase;
    if (passwordOptions.includeNumbers) chars += numbers;
    if (passwordOptions.includeSymbols) chars += symbols;

    if (!chars) {
      chars = lowercase; // Fallback to lowercase if no options selected
    }

    let password = '';
    for (let i = 0; i < passwordOptions.length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }

    setFormData(prev => ({ ...prev, password }));
    setShowPassword(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formData.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<BranchAdminFormData> = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.branchId) newErrors.branchId = 'Branch assignment is required';
    if (!isEditMode && !formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      navigate('/dashboard/branch-admins');
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const handleSelectAllInCategory = (category: string) => {
    const categoryPermissions = permissions.filter(p => p.category === category).map(p => p.id);
    const allSelected = categoryPermissions.every(id => formData.permissions.includes(id));
    
    if (allSelected) {
      // Deselect all in category
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.filter(id => !categoryPermissions.includes(id))
      }));
    } else {
      // Select all in category
      setFormData(prev => ({
        ...prev,
        permissions: [...new Set([...prev.permissions, ...categoryPermissions])]
      }));
    }
  };

  const getPermissionsByCategory = (category: string) => {
    return permissions.filter(p => p.category === category);
  };

  const isPermissionSelected = (permissionId: string) => {
    return formData.permissions.includes(permissionId);
  };

  const isCategoryFullySelected = (category: string) => {
    const categoryPermissions = getPermissionsByCategory(category);
    return categoryPermissions.length > 0 && categoryPermissions.every(p => isPermissionSelected(p.id));
  };

  const getCategoryName = (category: string) => {
    const names: { [key: string]: string } = {
      dashboard: 'Dashboard Overview',
      aspirants: 'Aspirant Management',
      branches: 'Branch Management',
      courses: 'Course Management',
      interviews: 'Interview Management',
      projects: 'Project Management',
      certificates: 'Certificate Management',
      announcements: 'Announcement Management',
      xp: 'XP & Streak Management',
      reports: 'Reports & Analytics',
      settings: 'Settings & Configuration'
    };
    return names[category] || category;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const categories = ['dashboard', 'aspirants', 'branches', 'courses', 'interviews', 'projects', 'certificates', 'announcements', 'xp', 'reports', 'settings'];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard/branch-admins')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Branch Admins
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('basic')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'basic'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Settings size={18} className="mr-2" />
                Basic Information
              </div>
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'permissions'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Shield size={18} className="mr-2" />
                Access Permissions
              </div>
            </button>
          </nav>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {isEditMode ? 'Edit Branch Admin' : 'Add New Branch Admin'}
            </h2>

            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Enter full name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Enter email address"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assign Branch
                  </label>
                  <select
                    value={formData.branchId}
                    onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                    className={`w-full px-4 py-2 border ${errors.branchId ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  >
                    <option value="">Select a branch</option>
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                  {errors.branchId && <p className="mt-1 text-sm text-red-600">{errors.branchId}</p>}
                </div>

                {!isEditMode && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className={`w-full px-4 py-2 pr-24 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                          placeholder="Enter password"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          <button
                            type="button"
                            onClick={copyToClipboard}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            disabled={!formData.password}
                          >
                            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                          </button>
                          <button
                            type="button"
                            onClick={generatePassword}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <RefreshCw size={16} />
                          </button>
                        </div>
                      </div>
                      {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                      
                      {/* Password Strength Indicator */}
                      {formData.password && (
                        <div className="mt-2">
                          <div className="flex items-center space-x-2 mb-1">
                            <Shield size={14} className={`${passwordStrength.score >= 3 ? 'text-green-500' : 'text-gray-400'}`} />
                            <span className="text-sm font-medium text-gray-600">
                              Password Strength: <span className={`font-semibold ${passwordStrength.score >= 3 ? 'text-green-600' : 'text-gray-600'}`}>{passwordStrength.label}</span>
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${passwordStrength.color} transition-all duration-300`}
                              style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Password Options</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Length: {passwordOptions.length}</label>
                          <input
                            type="range"
                            min="8"
                            max="32"
                            value={passwordOptions.length}
                            onChange={(e) => setPasswordOptions({ ...passwordOptions, length: parseInt(e.target.value) })}
                            className="w-full"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={passwordOptions.includeUppercase}
                              onChange={(e) => setPasswordOptions({ ...passwordOptions, includeUppercase: e.target.checked })}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-600">Uppercase</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={passwordOptions.includeLowercase}
                              onChange={(e) => setPasswordOptions({ ...passwordOptions, includeLowercase: e.target.checked })}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-600">Lowercase</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={passwordOptions.includeNumbers}
                              onChange={(e) => setPasswordOptions({ ...passwordOptions, includeNumbers: e.target.checked })}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-600">Numbers</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={passwordOptions.includeSymbols}
                              onChange={(e) => setPasswordOptions({ ...passwordOptions, includeSymbols: e.target.checked })}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-600">Symbols</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active Status</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'permissions' && (
              <div className="space-y-6">
                {/* Access Restrictions */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                    <Shield className="mr-2" size={20} />
                    Access Restrictions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.accessRestrictions.canViewAllBranches}
                        onChange={(e) => setFormData({
                          ...formData,
                          accessRestrictions: {
                            ...formData.accessRestrictions,
                            canViewAllBranches: e.target.checked
                          }
                        })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Can view other branches</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.accessRestrictions.canManageAspirants}
                        onChange={(e) => setFormData({
                          ...formData,
                          accessRestrictions: {
                            ...formData.accessRestrictions,
                            canManageAspirants: e.target.checked
                          }
                        })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Can manage aspirants</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.accessRestrictions.canViewReports}
                        onChange={(e) => setFormData({
                          ...formData,
                          accessRestrictions: {
                            ...formData.accessRestrictions,
                            canViewReports: e.target.checked
                          }
                        })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Can view reports</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.accessRestrictions.canManageInterviews}
                        onChange={(e) => setFormData({
                          ...formData,
                          accessRestrictions: {
                            ...formData.accessRestrictions,
                            canManageInterviews: e.target.checked
                          }
                        })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Can manage interviews</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.accessRestrictions.canAccessSettings}
                        onChange={(e) => setFormData({
                          ...formData,
                          accessRestrictions: {
                            ...formData.accessRestrictions,
                            canAccessSettings: e.target.checked
                          }
                        })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Can access settings</span>
                    </label>
                  </div>
                </div>

                {/* Dashboard Feature Permissions */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                    <Users className="mr-2" size={20} />
                    Dashboard Feature Access
                  </h3>

                  <div className="space-y-6">
                    {categories.map(category => {
                      const categoryPermissions = getPermissionsByCategory(category);
                      if (categoryPermissions.length === 0) return null;

                      return (
                        <div key={category} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-800">
                              {getCategoryName(category)}
                            </h4>
                            <button
                              type="button"
                              onClick={() => handleSelectAllInCategory(category)}
                              className={`text-sm px-3 py-1 rounded-md ${
                                isCategoryFullySelected(category)
                                  ? 'bg-indigo-100 text-indigo-700'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {isCategoryFullySelected(category) ? 'Deselect All' : 'Select All'}
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {categoryPermissions.map(permission => (
                              <label key={permission.id} className="flex items-start">
                                <input
                                  type="checkbox"
                                  checked={isPermissionSelected(permission.id)}
                                  onChange={() => handlePermissionToggle(permission.id)}
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-0.5"
                                />
                                <div className="ml-2">
                                  <span className="text-sm font-medium text-gray-700">
                                    {permission.name}
                                  </span>
                                  <p className="text-xs text-gray-500">{permission.description}</p>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {formData.permissions.length > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="text-blue-500 mr-2" size={20} />
                      <div>
                        <p className="text-sm font-medium text-blue-800">
                          Permissions Summary
                        </p>
                        <p className="text-sm text-blue-700">
                          {formData.permissions.length} dashboard features will be accessible to this admin
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/branch-admins')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Save size={20} className="mr-2" />
              Save Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BranchAdminForm;