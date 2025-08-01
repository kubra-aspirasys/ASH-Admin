import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, Shield, Users, Settings } from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'aspirants' | 'courses' | 'interviews' | 'reports' | 'settings';
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isDefault?: boolean;
}

interface BatchSeats {
  fullTime: number;
  morningPartTime: number;
  eveningPartTime: number;
  remote: number;
}

interface BranchFormData {
  name: string;
  location: string;
  adminEmail: string | null;
  totalSeats: number;
  batchSeats: BatchSeats;
  status: boolean;
  roleId: string;
  customPermissions: string[];
  accessRestrictions: {
    canViewAllBranches: boolean;
    canManageAspirants: boolean;
    canViewReports: boolean;
    canManageInterviews: boolean;
    canAccessSettings: boolean;
  };
}

const BranchForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<BranchFormData>({
    name: '',
    location: '',
    adminEmail: null,
    totalSeats: 0,
    batchSeats: {
      fullTime: 0,
      morningPartTime: 0,
      eveningPartTime: 0,
      remote: 0
    },
    status: true,
    roleId: '',
    customPermissions: [],
    accessRestrictions: {
      canViewAllBranches: false,
      canManageAspirants: true,
      canViewReports: true,
      canManageInterviews: true,
      canAccessSettings: false
    }
  });

  const [errors, setErrors] = useState<Partial<BranchFormData>>({});
  const [activeTab, setActiveTab] = useState<'basic' | 'permissions'>('basic');

  // Available permissions
  const permissions: Permission[] = [
    // Aspirant Management
    { id: 'aspirants.view', name: 'View Aspirants', description: 'View aspirant profiles and progress', category: 'aspirants' },
    { id: 'aspirants.create', name: 'Add Aspirants', description: 'Register new aspirants', category: 'aspirants' },
    { id: 'aspirants.edit', name: 'Edit Aspirants', description: 'Modify aspirant information', category: 'aspirants' },
    { id: 'aspirants.delete', name: 'Remove Aspirants', description: 'Deactivate or remove aspirants', category: 'aspirants' },
    { id: 'aspirants.xp', name: 'Manage XP & Streaks', description: 'Award XP and restore streaks', category: 'aspirants' },
    
    // Course Management
    { id: 'courses.view', name: 'View Courses', description: 'Access course content and progress', category: 'courses' },
    { id: 'courses.assign', name: 'Assign Courses', description: 'Assign courses to aspirants', category: 'courses' },
    { id: 'courses.progress', name: 'Track Progress', description: 'Monitor course completion', category: 'courses' },
    
    // Interview Management
    { id: 'interviews.view', name: 'View Interviews', description: 'See scheduled interviews', category: 'interviews' },
    { id: 'interviews.schedule', name: 'Schedule Interviews', description: 'Create and manage interview slots', category: 'interviews' },
    { id: 'interviews.conduct', name: 'Conduct Interviews', description: 'Submit interview results', category: 'interviews' },
    
    // Reports & Analytics
    { id: 'reports.branch', name: 'Branch Reports', description: 'View branch-specific reports', category: 'reports' },
    { id: 'reports.aspirant', name: 'Aspirant Reports', description: 'Generate aspirant progress reports', category: 'reports' },
    { id: 'reports.export', name: 'Export Data', description: 'Download reports and data', category: 'reports' },
    
    // Settings & Configuration
    { id: 'settings.branch', name: 'Branch Settings', description: 'Modify branch configuration', category: 'settings' },
    { id: 'settings.notifications', name: 'Notification Settings', description: 'Configure alerts and notifications', category: 'settings' }
  ];

  // Predefined roles
  const roles: Role[] = [
    {
      id: 'branch_admin_full',
      name: 'Branch Admin (Full Access)',
      description: 'Complete access to all branch operations',
      permissions: permissions.map(p => p.id),
      isDefault: true
    },
    {
      id: 'branch_admin_limited',
      name: 'Branch Admin (Limited)',
      description: 'Basic branch management with restricted access',
      permissions: [
        'aspirants.view', 'aspirants.edit', 'aspirants.xp',
        'courses.view', 'courses.assign', 'courses.progress',
        'interviews.view', 'interviews.schedule',
        'reports.branch', 'reports.aspirant'
      ],
      isDefault: true
    },
    {
      id: 'branch_coordinator',
      name: 'Branch Coordinator',
      description: 'Coordination role with view and basic management access',
      permissions: [
        'aspirants.view', 'aspirants.edit',
        'courses.view', 'courses.progress',
        'interviews.view',
        'reports.branch'
      ],
      isDefault: true
    },
    {
      id: 'custom',
      name: 'Custom Role',
      description: 'Define custom permissions for this branch',
      permissions: [],
      isDefault: false
    }
  ];

  useEffect(() => {
    if (isEditMode) {
      // Fetch branch data and populate form
      setFormData({
        name: 'Ambur Central',
        location: 'Ambur',
        adminEmail: 'admin.ambur@aspirasys.com',
        totalSeats: 200,
        batchSeats: {
          fullTime: 120,
          morningPartTime: 40,
          eveningPartTime: 30,
          remote: 10
        },
        status: true,
        roleId: 'branch_admin_full',
        customPermissions: [],
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

  const validateForm = (): boolean => {
    const newErrors: Partial<BranchFormData> = {};

    if (!formData.name) newErrors.name = 'Branch name is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (formData.totalSeats <= 0) newErrors.totalSeats = 'Total seats must be greater than 0';
    if (!formData.roleId) newErrors.roleId = 'Please select a role for this branch';
    
    const totalBatchSeats = formData.batchSeats.fullTime + formData.batchSeats.morningPartTime + 
                           formData.batchSeats.eveningPartTime + formData.batchSeats.remote;
    
    if (totalBatchSeats !== formData.totalSeats) {
      newErrors.totalSeats = 'Sum of all batch seats must equal total seats';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      navigate('/dashboard/branches');
    }
  };

  const handleTotalSeatsChange = (value: number) => {
    setFormData(prev => {
      // Auto-distribute seats proportionally
      const newBatchSeats = {
        fullTime: Math.floor(value * 0.6), // 60%
        morningPartTime: Math.floor(value * 0.2), // 20%
        eveningPartTime: Math.floor(value * 0.15), // 15%
        remote: Math.floor(value * 0.05) // 5%
      };
      
      // Adjust for rounding differences
      const currentTotal = newBatchSeats.fullTime + newBatchSeats.morningPartTime + 
                          newBatchSeats.eveningPartTime + newBatchSeats.remote;
      const difference = value - currentTotal;
      
      if (difference > 0) {
        newBatchSeats.fullTime += difference;
      }
      
      return {
        ...prev,
        totalSeats: value,
        batchSeats: newBatchSeats
      };
    });
  };

  const handleBatchSeatChange = (batchType: keyof BatchSeats, value: number) => {
    setFormData(prev => ({
      ...prev,
      batchSeats: {
        ...prev.batchSeats,
        [batchType]: value
      }
    }));
  };

  const handleRoleChange = (roleId: string) => {
    const selectedRole = roles.find(r => r.id === roleId);
    setFormData(prev => ({
      ...prev,
      roleId,
      customPermissions: selectedRole?.permissions || []
    }));
  };

  const handlePermissionToggle = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      customPermissions: prev.customPermissions.includes(permissionId)
        ? prev.customPermissions.filter(id => id !== permissionId)
        : [...prev.customPermissions, permissionId]
    }));
  };

  const getPermissionsByCategory = (category: string) => {
    return permissions.filter(p => p.category === category);
  };

  const isPermissionSelected = (permissionId: string) => {
    if (formData.roleId === 'custom') {
      return formData.customPermissions.includes(permissionId);
    }
    const selectedRole = roles.find(r => r.id === formData.roleId);
    return selectedRole?.permissions.includes(permissionId) || false;
  };

  const selectedRole = roles.find(r => r.id === formData.roleId);
  const totalBatchSeats = formData.batchSeats.fullTime + formData.batchSeats.morningPartTime + 
                         formData.batchSeats.eveningPartTime + formData.batchSeats.remote;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard/branches')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Branches
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
                Roles & Permissions
              </div>
            </button>
          </nav>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {isEditMode ? 'Edit Branch' : 'Add New Branch'}
            </h2>

            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Enter branch name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className={`w-full px-4 py-2 border ${errors.location ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Enter location"
                  />
                  {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                </div>

                {formData.adminEmail !== null && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Branch Admin (already assigned)
                    </label>
                    <input
                      type="email"
                      value={formData.adminEmail}
                      readOnly
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      To change the Branch Admin, please visit the Branch Admins tab.
                    </p>
                  </div>
                )}

                {formData.adminEmail === null && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Branch Admin
                    </label>
                    <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500">
                      No Branch Admin assigned yet
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      To assign a Branch Admin, go to the Branch Admins tab.
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Seats
                    </label>
                    <input
                      type="number"
                      value={formData.totalSeats}
                      onChange={(e) => handleTotalSeatsChange(parseInt(e.target.value) || 0)}
                      className={`w-full px-4 py-2 border ${errors.totalSeats ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                      min="0"
                    />
                    {errors.totalSeats && <p className="mt-1 text-sm text-red-600">{errors.totalSeats}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Batch Type Distribution
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Full Time
                        </label>
                        <input
                          type="number"
                          value={formData.batchSeats.fullTime}
                          onChange={(e) => handleBatchSeatChange('fullTime', parseInt(e.target.value) || 0)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          min="0"
                          max={formData.totalSeats}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Morning Part Time
                        </label>
                        <input
                          type="number"
                          value={formData.batchSeats.morningPartTime}
                          onChange={(e) => handleBatchSeatChange('morningPartTime', parseInt(e.target.value) || 0)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          min="0"
                          max={formData.totalSeats}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Evening Part Time
                        </label>
                        <input
                          type="number"
                          value={formData.batchSeats.eveningPartTime}
                          onChange={(e) => handleBatchSeatChange('eveningPartTime', parseInt(e.target.value) || 0)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          min="0"
                          max={formData.totalSeats}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Remote
                        </label>
                        <input
                          type="number"
                          value={formData.batchSeats.remote}
                          onChange={(e) => handleBatchSeatChange('remote', parseInt(e.target.value) || 0)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          min="0"
                          max={formData.totalSeats}
                        />
                      </div>
                    </div>

                    {/* Seat Distribution Summary */}
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Seat Distribution Summary</span>
                        <span className={`text-sm font-medium ${
                          totalBatchSeats === formData.totalSeats ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {totalBatchSeats} / {formData.totalSeats} seats allocated
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-medium text-gray-900">{formData.batchSeats.fullTime}</div>
                          <div className="text-gray-500">Full Time</div>
                          <div className="text-xs text-gray-400">
                            {formData.totalSeats > 0 ? Math.round((formData.batchSeats.fullTime / formData.totalSeats) * 100) : 0}%
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-gray-900">{formData.batchSeats.morningPartTime}</div>
                          <div className="text-gray-500">Morning PT</div>
                          <div className="text-xs text-gray-400">
                            {formData.totalSeats > 0 ? Math.round((formData.batchSeats.morningPartTime / formData.totalSeats) * 100) : 0}%
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-gray-900">{formData.batchSeats.eveningPartTime}</div>
                          <div className="text-gray-500">Evening PT</div>
                          <div className="text-xs text-gray-400">
                            {formData.totalSeats > 0 ? Math.round((formData.batchSeats.eveningPartTime / formData.totalSeats) * 100) : 0}%
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-gray-900">{formData.batchSeats.remote}</div>
                          <div className="text-gray-500">Remote</div>
                          <div className="text-xs text-gray-400">
                            {formData.totalSeats > 0 ? Math.round((formData.batchSeats.remote / formData.totalSeats) * 100) : 0}%
                          </div>
                        </div>
                      </div>
                    </div>

                    {totalBatchSeats !== formData.totalSeats && (
                      <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                        <AlertCircle className="text-yellow-400 mr-2" size={20} />
                        <p className="text-sm text-yellow-700">
                          Batch seats ({totalBatchSeats}) must equal total seats ({formData.totalSeats})
                        </p>
                      </div>
                    )}
                  </div>
                </div>

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
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Role Template
                  </label>
                  <select
                    value={formData.roleId}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className={`w-full px-4 py-2 border ${errors.roleId ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  >
                    <option value="">Select a role template</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                  {selectedRole && (
                    <p className="mt-1 text-sm text-gray-500">{selectedRole.description}</p>
                  )}
                  {errors.roleId && <p className="mt-1 text-sm text-red-600">{errors.roleId}</p>}
                </div>

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

                {/* Detailed Permissions */}
                {formData.roleId && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                      <Users className="mr-2" size={20} />
                      Detailed Permissions
                      {formData.roleId !== 'custom' && (
                        <span className="ml-2 text-sm text-gray-500">(Read-only for predefined roles)</span>
                      )}
                    </h3>

                    <div className="space-y-6">
                      {['aspirants', 'courses', 'interviews', 'reports', 'settings'].map(category => (
                        <div key={category} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-800 mb-3 capitalize">
                            {category} Management
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {getPermissionsByCategory(category).map(permission => (
                              <label key={permission.id} className="flex items-start">
                                <input
                                  type="checkbox"
                                  checked={isPermissionSelected(permission.id)}
                                  onChange={() => handlePermissionToggle(permission.id)}
                                  disabled={formData.roleId !== 'custom'}
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
                      ))}
                    </div>
                  </div>
                )}

                {formData.roleId && selectedRole && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="text-blue-500 mr-2" size={20} />
                      <div>
                        <p className="text-sm font-medium text-blue-800">
                          Role: {selectedRole.name}
                        </p>
                        <p className="text-sm text-blue-700">
                          {selectedRole.description}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          {formData.roleId === 'custom' 
                            ? `${formData.customPermissions.length} custom permissions selected`
                            : `${selectedRole.permissions.length} permissions included`
                          }
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
              onClick={() => navigate('/dashboard/branches')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Save size={20} className="mr-2" />
              Save Branch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BranchForm;