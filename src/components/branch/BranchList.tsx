import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Edit2, Power, Filter, Building2, CheckCircle2, Users, AlertTriangle } from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  location: string;
  admin: {
    name: string;
    email: string;
  } | null;
  totalSeats: number;
  batchSeats: {
    fullTime: number;
    morningPartTime: number;
    eveningPartTime: number;
    remote: number;
  };
  aspirantCount: number;
  enrollment: {
    fullTime: number;
    morningPartTime: number;
    eveningPartTime: number;
    remote: number;
  };
  status: 'active' | 'inactive';
}

interface MetricCardProps {
  title: string;
  value: number | string;
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

const BranchList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showUnassignedOnly, setShowUnassignedOnly] = useState(false);

  // Sample data with updated batch types
  const branches: Branch[] = [
    {
      id: '1',
      name: 'Ambur Central',
      location: 'Ambur',
      admin: {
        name: 'Mohammed Imran',
        email: 'admin.ambur@aspirasys.com'
      },
      totalSeats: 200,
      batchSeats: {
        fullTime: 120,
        morningPartTime: 40,
        eveningPartTime: 30,
        remote: 10
      },
      aspirantCount: 145,
      enrollment: {
        fullTime: 95,
        morningPartTime: 28,
        eveningPartTime: 18,
        remote: 4
      },
      status: 'active'
    },
    {
      id: '2',
      name: 'Vaniyambadi North',
      location: 'Vaniyambadi',
      admin: null,
      totalSeats: 180,
      batchSeats: {
        fullTime: 108,
        morningPartTime: 36,
        eveningPartTime: 27,
        remote: 9
      },
      aspirantCount: 128,
      enrollment: {
        fullTime: 82,
        morningPartTime: 24,
        eveningPartTime: 18,
        remote: 4
      },
      status: 'active'
    },
    {
      id: '3',
      name: 'Pernambut Tech Park',
      location: 'Pernambut',
      admin: {
        name: 'Fatima Zahra',
        email: 'admin.pernambut@aspirasys.com'
      },
      totalSeats: 150,
      batchSeats: {
        fullTime: 90,
        morningPartTime: 30,
        eveningPartTime: 22,
        remote: 8
      },
      aspirantCount: 98,
      enrollment: {
        fullTime: 58,
        morningPartTime: 20,
        eveningPartTime: 15,
        remote: 5
      },
      status: 'inactive'
    },
    {
      id: '4',
      name: 'Chennai East',
      location: 'Chennai',
      admin: {
        name: 'Abdul Rahman',
        email: 'admin.chennai@aspirasys.com'
      },
      totalSeats: 220,
      batchSeats: {
        fullTime: 132,
        morningPartTime: 44,
        eveningPartTime: 33,
        remote: 11
      },
      aspirantCount: 165,
      enrollment: {
        fullTime: 105,
        morningPartTime: 32,
        eveningPartTime: 22,
        remote: 6
      },
      status: 'active'
    }
  ];

  // Calculate metrics
  const metrics = {
    totalBranches: branches.length,
    activeBranches: branches.filter(b => b.status === 'active').length,
    totalSeats: branches.reduce((sum, b) => sum + b.totalSeats, 0),
    unassignedBranches: branches.filter(b => b.admin === null).length
  };

  const filteredBranches = branches.filter(branch => {
    const matchesSearch = (
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (branch.admin?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (branch.admin?.email.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    );
    const matchesStatus = statusFilter === 'all' || branch.status === statusFilter;
    const matchesUnassigned = !showUnassignedOnly || branch.admin === null;
    return matchesSearch && matchesStatus && matchesUnassigned;
  });

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-100 text-red-800';
    if (percentage >= 75) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const toggleUnassignedFilter = () => {
    setShowUnassignedOnly(!showUnassignedOnly);
  };

  const getBatchTypeColor = (batchType: string) => {
    const colors = {
      'Full Time': 'bg-blue-500',
      'Morning PT': 'bg-green-500',
      'Evening PT': 'bg-purple-500',
      'Remote': 'bg-orange-500'
    };
    return colors[batchType as keyof typeof colors] || 'bg-gray-500';
  };

  const getBatchTypeLabel = (key: string) => {
    const labels = {
      fullTime: 'Full Time',
      morningPartTime: 'Morning PT',
      eveningPartTime: 'Evening PT',
      remote: 'Remote'
    };
    return labels[key as keyof typeof labels] || key;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Branch Management</h2>
        <button
          onClick={() => navigate('/dashboard/branches/new')}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add New Branch
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Branches"
          value={metrics.totalBranches}
          icon={<Building2 size={24} className="text-white" />}
          color="bg-indigo-600"
        />
        <MetricCard
          title="Active Branches"
          value={metrics.activeBranches}
          icon={<CheckCircle2 size={24} className="text-white" />}
          color="bg-green-600"
          subtitle={`${((metrics.activeBranches / metrics.totalBranches) * 100).toFixed(0)}% active`}
        />
        <MetricCard
          title="Total Available Seats"
          value={metrics.totalSeats.toLocaleString()}
          icon={<Users size={24} className="text-white" />}
          color="bg-blue-600"
        />
        <MetricCard
          title="Unassigned Branches"
          value={metrics.unassignedBranches}
          icon={<AlertTriangle size={24} className="text-white" />}
          color={metrics.unassignedBranches > 0 ? 'bg-amber-600' : 'bg-gray-600'}
          onClick={metrics.unassignedBranches > 0 ? toggleUnassignedFilter : undefined}
          subtitle={metrics.unassignedBranches > 0 ? 'Click to filter' : 'All branches assigned'}
        />
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search branches, admins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="relative">
          <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch Admin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats & Enrollment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBranches.map((branch) => {
                const totalOccupancy = (branch.aspirantCount / branch.totalSeats) * 100;

                return (
                  <tr key={branch.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{branch.name}</div>
                      <div className="text-sm text-gray-500">ID: {branch.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {branch.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {branch.admin ? (
                        <div className="text-sm font-medium text-gray-800">{branch.admin.email}</div>
                      ) : (
                        <button
                          onClick={() => navigate(`/dashboard/branch-admins/new?branch=${branch.id}`)}
                          className="text-sm text-blue-600 hover:underline cursor-pointer"
                        >
                          Assign Branch Admin
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-3">
                        {/* Total Occupancy */}
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">Total Occupancy</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${getOccupancyColor(totalOccupancy)}`}>
                              {branch.aspirantCount}/{branch.totalSeats} ({Math.round(totalOccupancy)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${Math.min(totalOccupancy, 100)}%` }}
                            />
                          </div>
                        </div>

                        {/* Batch Type Breakdown */}
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(branch.batchSeats).map(([key, seats]) => {
                            const enrolled = branch.enrollment[key as keyof typeof branch.enrollment];
                            const occupancy = seats > 0 ? (enrolled / seats) * 100 : 0;
                            const label = getBatchTypeLabel(key);
                            const color = getBatchTypeColor(label);

                            return (
                              <div key={key} className="min-w-0">
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="truncate font-medium text-gray-700">{label}</span>
                                  <span className={`px-1.5 py-0.5 rounded text-xs ${getOccupancyColor(occupancy)}`}>
                                    {enrolled}/{seats}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className={`${color} h-1.5 rounded-full transition-all duration-300`}
                                    style={{ width: `${Math.min(occupancy, 100)}%` }}
                                  />
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5">
                                  {Math.round(occupancy)}% filled
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Summary Stats */}
                        <div className="pt-2 border-t border-gray-100">
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Available:</span>
                            <span className="font-medium">{branch.totalSeats - branch.aspirantCount} seats</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        branch.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {branch.status.charAt(0).toUpperCase() + branch.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => navigate(`/dashboard/branches/${branch.id}`)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => navigate(`/dashboard/branches/${branch.id}/edit`)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Edit Branch"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          // Toggle status logic here
                        }}
                        className={`${
                          branch.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                        }`}
                        title={branch.status === 'active' ? 'Deactivate Branch' : 'Activate Branch'}
                      >
                        <Power size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BranchList;