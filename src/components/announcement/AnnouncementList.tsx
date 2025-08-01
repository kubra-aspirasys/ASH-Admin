import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Trash2, Calendar, Users, Building2, User, Flag } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  target: 'all' | 'branch' | 'individual';
  audience: {
    type: 'all' | 'branch' | 'individual';
    value: string;
  };
  createdAt: string;
  views: number;
  totalRecipients: number;
  status: 'active' | 'expired';
  attachments?: {
    name: string;
    url: string;
  }[];
}

const AnnouncementList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    target: '',
    priority: '',
    branch: '',
    startDate: '',
    endDate: ''
  });

  // Sample data with priority levels
  const announcements: Announcement[] = [
    {
      id: '1',
      title: 'Important Update: New Course Materials',
      message: 'We have updated the course materials for Full Stack Development...',
      priority: 'high',
      target: 'all',
      audience: {
        type: 'all',
        value: 'All Branches'
      },
      createdAt: '2024-03-15T10:00:00Z',
      views: 245,
      totalRecipients: 300,
      status: 'active',
      attachments: [
        { name: 'course_update.pdf', url: '#' }
      ]
    },
    {
      id: '2',
      title: 'URGENT: System Maintenance Tonight',
      message: 'The platform will be down for maintenance from 11 PM to 2 AM...',
      priority: 'urgent',
      target: 'all',
      audience: {
        type: 'all',
        value: 'All Branches'
      },
      createdAt: '2024-03-14T16:00:00Z',
      views: 280,
      totalRecipients: 300,
      status: 'active'
    },
    {
      id: '3',
      title: 'Branch-Specific: Infrastructure Update',
      message: 'The Ambur Central branch will be undergoing renovations...',
      priority: 'normal',
      target: 'branch',
      audience: {
        type: 'branch',
        value: 'Ambur Central'
      },
      createdAt: '2024-03-14T15:30:00Z',
      views: 48,
      totalRecipients: 50,
      status: 'active'
    },
    {
      id: '4',
      title: 'Weekly Newsletter',
      message: 'Here are the highlights from this week...',
      priority: 'low',
      target: 'all',
      audience: {
        type: 'all',
        value: 'All Branches'
      },
      createdAt: '2024-03-13T09:00:00Z',
      views: 180,
      totalRecipients: 300,
      status: 'active'
    },
    {
      id: '5',
      title: 'Personal: Interview Preparation Guide',
      message: 'Here are some personalized interview preparation tips...',
      priority: 'normal',
      target: 'individual',
      audience: {
        type: 'individual',
        value: 'Mohammed Imran'
      },
      createdAt: '2024-03-10T09:15:00Z',
      views: 1,
      totalRecipients: 1,
      status: 'expired'
    }
  ];

  const branches = [
    'Ambur Central',
    'Vaniyambadi North',
    'Chennai East'
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low Priority', color: 'bg-gray-100 text-gray-800', icon: 'text-gray-500' },
    { value: 'normal', label: 'Normal', color: 'bg-blue-100 text-blue-800', icon: 'text-blue-500' },
    { value: 'high', label: 'High Priority', color: 'bg-orange-100 text-orange-800', icon: 'text-orange-500' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800', icon: 'text-red-500' }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-gray-100 text-gray-800'
    };
    return badges[status as keyof typeof badges];
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = priorityLevels.find(p => p.value === priority);
    return priorityConfig || priorityLevels[1]; // Default to normal
  };

  const getTargetIcon = (target: string) => {
    switch (target) {
      case 'all':
        return <Users size={16} className="text-indigo-600" />;
      case 'branch':
        return <Building2 size={16} className="text-blue-600" />;
      case 'individual':
        return <User size={16} className="text-green-600" />;
      default:
        return null;
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      // Delete logic here
      console.log('Deleting announcement:', id);
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTarget = !filters.target || announcement.target === filters.target;
    const matchesPriority = !filters.priority || announcement.priority === filters.priority;
    const matchesBranch = !filters.branch || 
      (announcement.audience.type === 'branch' && announcement.audience.value === filters.branch);
    
    let matchesDate = true;
    if (filters.startDate && filters.endDate) {
      const announcementDate = new Date(announcement.createdAt);
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      matchesDate = announcementDate >= startDate && announcementDate <= endDate;
    }

    return matchesSearch && matchesTarget && matchesPriority && matchesBranch && matchesDate;
  });

  // Sort announcements by priority and date
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    // Priority order: urgent > high > normal > low
    const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    
    if (priorityDiff !== 0) return priorityDiff;
    
    // If same priority, sort by date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Announcements</h2>
        <button
          onClick={() => navigate('/dashboard/announcements/new')}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus size={20} className="mr-2" />
          Create Announcement
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Priorities</option>
          {priorityLevels.map(priority => (
            <option key={priority.value} value={priority.value}>{priority.label}</option>
          ))}
        </select>

        <select
          value={filters.target}
          onChange={(e) => setFilters({ ...filters, target: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Targets</option>
          <option value="all">All Branches</option>
          <option value="branch">Branch Specific</option>
          <option value="individual">Individual</option>
        </select>

        <select
          value={filters.branch}
          onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Branches</option>
          {branches.map(branch => (
            <option key={branch} value={branch}>{branch}</option>
          ))}
        </select>

        <div className="flex space-x-2">
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title & Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Target
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created On
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedAnnouncements.map((announcement) => {
              const priorityConfig = getPriorityBadge(announcement.priority);
              
              return (
                <tr key={announcement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{announcement.title}</div>
                        <div className="flex items-center mt-1">
                          <Flag className={`w-4 h-4 mr-1 ${priorityConfig.icon}`} />
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${priorityConfig.color}`}>
                            {priorityConfig.label}
                          </span>
                          {announcement.attachments && announcement.attachments.length > 0 && (
                            <span className="ml-2 px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
                              {announcement.attachments.length} attachment{announcement.attachments.length !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getTargetIcon(announcement.target)}
                      <span className="ml-2 text-sm text-gray-900">
                        {announcement.audience.value}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500">
                        {formatDate(announcement.createdAt)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {announcement.views}/{announcement.totalRecipients}
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.round((announcement.views / announcement.totalRecipients) * 100)}% viewed
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      getStatusBadge(announcement.status)
                    }`}>
                      {announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => navigate(`/dashboard/announcements/${announcement.id}`)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Announcement"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnnouncementList;