import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Edit2, Power, Filter, Clock, Zap, Trophy, Users, Briefcase, Clock4, AlertTriangle, FileText, CheckCircle, XCircle, UserX } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface Aspirant {
  id: string;
  name: string;
  email: string;
  branch: {
    id: string;
    name: string;
  };
  batchType: 'Full-Time' | 'Morning Part-Time' | 'Evening Part-Time' | 'Remote';
  course: {
    id: string;
    name: string;
  };
  xp: number;
  delayDays: number;
  streak: {
    status: 'active' | 'broken' | 'restored';
    count: number;
    daysBroken?: number; // Days since streak was broken
  };
  jobReady: boolean;
  status: 'active' | 'suspended' | 'terminated';
}

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color, onClick, subtitle }) => {
  const cardClasses = onClick ? 'cursor-pointer transform hover:scale-105 transition-transform' : '';

  return (
    <div 
      className={`bg-white rounded-xl shadow-md p-6 ${cardClasses}`}
      onClick={onClick}
    >
      <div className="flex items-center mb-4">
        <div className={`${color} p-3 rounded-lg mr-3`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

const AspirantList: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('aspirants');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    branch: '',
    batchType: '',
    jobReady: '',
    delay: '',
    status: '',
  });

  // Sample data with different statuses and broken streak durations
  const aspirants: Aspirant[] = [
    {
      id: '1',
      name: 'Fatima Zahra',
      email: 'fatima@example.com',
      branch: {
        id: '1',
        name: 'Ambur Central'
      },
      batchType: 'Full-Time',
      course: {
        id: '1',
        name: 'Full Stack Development'
      },
      xp: 12450,
      delayDays: 0,
      streak: {
        status: 'active',
        count: 15
      },
      jobReady: true,
      status: 'active'
    },
    {
      id: '2',
      name: 'Abdul Rahman',
      email: 'abdul@example.com',
      branch: {
        id: '2',
        name: 'Vaniyambadi North'
      },
      batchType: 'Evening Part-Time',
      course: {
        id: '1',
        name: 'Full Stack Development'
      },
      xp: 8920,
      delayDays: 5,
      streak: {
        status: 'broken',
        count: 3,
        daysBroken: 3 // 3 days since streak was broken
      },
      jobReady: false,
      status: 'suspended'
    },
    {
      id: '3',
      name: 'Mohammed Imran',
      email: 'imran@example.com',
      branch: {
        id: '3',
        name: 'Chennai East'
      },
      batchType: 'Remote',
      course: {
        id: '2',
        name: 'Data Science'
      },
      xp: 15680,
      delayDays: 0,
      streak: {
        status: 'active',
        count: 22
      },
      jobReady: true,
      status: 'active'
    },
    {
      id: '4',
      name: 'Ayesha Siddiqui',
      email: 'ayesha@example.com',
      branch: {
        id: '4',
        name: 'Pernambut Tech Park'
      },
      batchType: 'Morning Part-Time',
      course: {
        id: '3',
        name: 'Cloud Computing'
      },
      xp: 9340,
      delayDays: 2,
      streak: {
        status: 'restored',
        count: 8
      },
      jobReady: false,
      status: 'active'
    },
    {
      id: '5',
      name: 'Omar Farooq',
      email: 'omar@example.com',
      branch: {
        id: '1',
        name: 'Ambur Central'
      },
      batchType: 'Full-Time',
      course: {
        id: '1',
        name: 'Full Stack Development'
      },
      xp: 5240,
      delayDays: 12,
      streak: {
        status: 'broken',
        count: 7,
        daysBroken: 7 // 7 days since streak was broken
      },
      jobReady: false,
      status: 'terminated'
    }
  ];

  // Sample branches for filter
  const branches = [
    { id: '1', name: 'Ambur Central' },
    { id: '2', name: 'Vaniyambadi North' },
    { id: '3', name: 'Chennai East' },
    { id: '4', name: 'Pernambut Tech Park' }
  ];

  const filteredAspirants = aspirants.filter(aspirant => {
    const matchesSearch = (
      aspirant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aspirant.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesBranch = !filters.branch || aspirant.branch.id === filters.branch;
    const matchesBatchType = !filters.batchType || aspirant.batchType === filters.batchType;
    const matchesJobReady = !filters.jobReady || aspirant.jobReady.toString() === filters.jobReady;
    const matchesStatus = !filters.status || aspirant.status === filters.status;
    
    let matchesDelay = true;
    if (filters.delay) {
      switch (filters.delay) {
        case '0-15':
          matchesDelay = aspirant.delayDays >= 0 && aspirant.delayDays <= 15;
          break;
        case '15-30':
          matchesDelay = aspirant.delayDays > 15 && aspirant.delayDays <= 30;
          break;
        case '30+':
          matchesDelay = aspirant.delayDays > 30;
          break;
      }
    }

    return matchesSearch && matchesBranch && matchesBatchType && matchesJobReady && matchesStatus && matchesDelay;
  });

  // Calculate metrics
  const metrics = {
    totalAspirants: filteredAspirants.length,
    activeAspirants: filteredAspirants.filter(a => a.status === 'active').length,
    suspendedAspirants: filteredAspirants.filter(a => a.status === 'suspended').length,
    terminatedAspirants: filteredAspirants.filter(a => a.status === 'terminated').length,
    jobReadyAspirants: filteredAspirants.filter(a => a.jobReady && a.status === 'active').length,
    fullTimeAspirants: filteredAspirants.filter(a => a.batchType === 'Full-Time').length,
    partTimeAspirants: filteredAspirants.filter(a => a.batchType.includes('Part-Time')).length,
    remoteAspirants: filteredAspirants.filter(a => a.batchType === 'Remote').length,
    inactiveAspirants: filteredAspirants.filter(a => a.delayDays >= 15).length
  };

  const getStreakBadge = (streak: { status: string; count: number; daysBroken?: number }) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      broken: 'bg-red-100 text-red-800',
      restored: 'bg-yellow-100 text-yellow-800'
    };

    const getStreakText = () => {
      if (streak.status === 'active') {
        return 'Active';
      } else if (streak.status === 'broken') {
        // Include the broken duration in the same badge
        return `Broken (${streak.daysBroken || 0}d)`;
      } else if (streak.status === 'restored') {
        return 'Restored';
      }
      return streak.status;
    };

    return (
      <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${badges[streak.status as keyof typeof badges]}`}>
        <Trophy size={14} className="mr-1" />
        {getStreakText()}
      </span>
    );
  };

  const getInactiveBadge = (days: number) => {
    if (days === 0) return null;
    
    let color = 'bg-green-100 text-green-800';
    if (days > 30) color = 'bg-red-100 text-red-800';
    else if (days > 15) color = 'bg-yellow-100 text-yellow-800';

    return (
      <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${color}`}>
        <Clock size={14} className="mr-1" />
        Inactive
      </span>
    );
  };

  const getBatchTypeColor = (batchType: string) => {
    const colors = {
      'Full-Time': 'bg-blue-100 text-blue-800',
      'Morning Part-Time': 'bg-green-100 text-green-800',
      'Evening Part-Time': 'bg-purple-100 text-purple-800',
      'Remote': 'bg-orange-100 text-orange-800'
    };
    return colors[batchType as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: {
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle size={14} className="mr-1" />
      },
      suspended: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: <AlertTriangle size={14} className="mr-1" />
      },
      terminated: {
        color: 'bg-red-100 text-red-800',
        icon: <XCircle size={14} className="mr-1" />
      }
    };

    const badge = badges[status as keyof typeof badges];
    return (
      <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${badge.color}`}>
        {badge.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleStatusToggle = (aspirantId: string, currentStatus: string) => {
    // Navigate to detail page where status can be managed
    navigate(`/dashboard/aspirants/${aspirantId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Aspirant Management</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/dashboard/aspirants/applications')}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FileText size={20} className="mr-2" />
            New Applications
          </button>
          <button
            onClick={() => navigate('/dashboard/aspirants/new')}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add New Aspirant
          </button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="aspirants" className="flex items-center">
            <Users size={18} className="mr-2" />
            Aspirants
          </TabsTrigger>
        </TabsList>

        <TabsContent value="aspirants">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard
              title="Total Aspirants"
              value={metrics.totalAspirants}
              icon={<Users size={20} className="text-white" />}
              color="bg-indigo-600"
            />
            <MetricCard
              title="Active Aspirants"
              value={metrics.activeAspirants}
              icon={<CheckCircle size={20} className="text-white" />}
              color="bg-green-600"
            />
            <MetricCard
              title="Suspended"
              value={metrics.suspendedAspirants}
              icon={<AlertTriangle size={20} className="text-white" />}
              color="bg-yellow-600"
            />
            <MetricCard
              title="Terminated"
              value={metrics.terminatedAspirants}
              icon={<UserX size={20} className="text-white" />}
              color="bg-red-600"
            />
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard
              title="Job-Ready Aspirants"
              value={metrics.jobReadyAspirants}
              icon={<Briefcase size={20} className="text-white" />}
              color="bg-emerald-600"
            />
            <MetricCard
              title="Batch Distribution"
              value={metrics.fullTimeAspirants + metrics.partTimeAspirants + metrics.remoteAspirants}
              icon={<Clock4 size={20} className="text-white" />}
              color="bg-blue-600"
              subtitle={`${metrics.fullTimeAspirants} Full-Time • ${metrics.partTimeAspirants} Part-Time • ${metrics.remoteAspirants} Remote`}
            />
            <MetricCard
              title="Inactive Aspirants"
              value={metrics.inactiveAspirants}
              icon={<AlertTriangle size={20} className="text-white" />}
              color="bg-amber-600"
              subtitle="15+ days without activity"
            />
            <MetricCard
              title="Active Job Ready"
              value={metrics.jobReadyAspirants}
              icon={<Trophy size={20} className="text-white" />}
              color="bg-purple-600"
              subtitle={`${Math.round((metrics.jobReadyAspirants / metrics.activeAspirants) * 100)}% of active`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
            <div className="lg:col-span-2 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search aspirants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <select
                value={filters.branch}
                onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Branches</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>{branch.name}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={filters.batchType}
                onChange={(e) => setFilters({ ...filters, batchType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Batch Types</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Morning Part-Time">Morning Part-Time</option>
                <option value="Evening Part-Time">Evening Part-Time</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="terminated">Terminated</option>
              </select>
            </div>

            <div>
              <select
                value={filters.delay}
                onChange={(e) => setFilters({ ...filters, delay: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Activity</option>
                <option value="0-15">0-15 days</option>
                <option value="15-30">15-30 days</option>
                <option value="30+">30+ days</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aspirant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch & Batch</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAspirants.map((aspirant) => (
                    <tr key={aspirant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{aspirant.name}</div>
                        <div className="text-sm text-gray-500">{aspirant.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{aspirant.branch.name}</div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBatchTypeColor(aspirant.batchType)}`}>
                          {aspirant.batchType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{aspirant.course.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className="flex items-center text-sm font-medium text-indigo-600">
                            <Zap size={16} className="mr-1" />
                            {aspirant.xp.toLocaleString()} XP
                          </span>
                          <div className="flex items-center space-x-2">
                            {getStreakBadge(aspirant.streak)}
                            {getInactiveBadge(aspirant.delayDays)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(aspirant.status)}
                          {aspirant.jobReady && aspirant.status === 'active' && (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              Job Ready
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => navigate(`/dashboard/aspirants/${aspirant.id}`)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                          title="View Details & Manage Status"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => navigate(`/dashboard/aspirants/${aspirant.id}/edit`)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          title="Edit Aspirant"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleStatusToggle(aspirant.id, aspirant.status)}
                          className={`${
                            aspirant.status === 'active' ? 'text-yellow-600 hover:text-yellow-900' : 
                            aspirant.status === 'suspended' ? 'text-green-600 hover:text-green-900' :
                            'text-gray-400 cursor-not-allowed'
                          }`}
                          title={
                            aspirant.status === 'active' ? 'Manage Status' : 
                            aspirant.status === 'suspended' ? 'Manage Status' :
                            'Terminated - View Details'
                          }
                          disabled={aspirant.status === 'terminated'}
                        >
                          <Power size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AspirantList;