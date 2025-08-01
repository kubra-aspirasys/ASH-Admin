import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Check, X, Filter, Calendar, Award, BookOpen, Clock, Users, Target, TrendingUp, CheckCircle } from 'lucide-react';

interface Certificate {
  id: string;
  aspirant: {
    id: string;
    name: string;
    email: string;
    branch: string;
  };
  course: {
    id: string;
    name: string;
  };
  completionDate: string;
  capstoneStatus: 'approved' | 'pending';
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  certificateId?: string;
}

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color, subtitle }) => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <div className="flex items-center mb-2">
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

const CertificateList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [filters, setFilters] = useState({
    course: '',
    status: '',
    dateRange: {
      start: '',
      end: ''
    }
  });

  // Sample data with more certificates across different branches
  const certificates: Certificate[] = [
    {
      id: '1',
      aspirant: {
        id: '1',
        name: 'Mohammed Imran',
        email: 'imran@example.com',
        branch: 'Ambur Central'
      },
      course: {
        id: '1',
        name: 'Full Stack Development'
      },
      completionDate: '2024-03-10T15:30:00Z',
      capstoneStatus: 'approved',
      status: 'pending'
    },
    {
      id: '2',
      aspirant: {
        id: '2',
        name: 'Fatima Zahra',
        email: 'fatima@example.com',
        branch: 'Vaniyambadi North'
      },
      course: {
        id: '1',
        name: 'Full Stack Development'
      },
      completionDate: '2024-03-08T10:15:00Z',
      capstoneStatus: 'approved',
      status: 'approved',
      certificateId: 'CERT-2024-001'
    },
    {
      id: '3',
      aspirant: {
        id: '3',
        name: 'Abdul Rahman',
        email: 'abdul@example.com',
        branch: 'Chennai East'
      },
      course: {
        id: '2',
        name: 'Data Science'
      },
      completionDate: '2024-03-12T14:20:00Z',
      capstoneStatus: 'approved',
      status: 'approved',
      certificateId: 'CERT-2024-002'
    },
    {
      id: '4',
      aspirant: {
        id: '4',
        name: 'Ayesha Siddiqui',
        email: 'ayesha@example.com',
        branch: 'Ambur Central'
      },
      course: {
        id: '3',
        name: 'Cloud Computing'
      },
      completionDate: '2024-03-09T16:45:00Z',
      capstoneStatus: 'pending',
      status: 'pending'
    },
    {
      id: '5',
      aspirant: {
        id: '5',
        name: 'Omar Farooq',
        email: 'omar@example.com',
        branch: 'Pernambut Tech Park'
      },
      course: {
        id: '1',
        name: 'Full Stack Development'
      },
      completionDate: '2024-03-11T11:30:00Z',
      capstoneStatus: 'approved',
      status: 'rejected',
      rejectionReason: 'Incomplete course requirements'
    },
    {
      id: '6',
      aspirant: {
        id: '6',
        name: 'Zainab Ali',
        email: 'zainab@example.com',
        branch: 'Chennai East'
      },
      course: {
        id: '2',
        name: 'Data Science'
      },
      completionDate: '2024-03-13T09:00:00Z',
      capstoneStatus: 'approved',
      status: 'approved',
      certificateId: 'CERT-2024-003'
    },
    {
      id: '7',
      aspirant: {
        id: '7',
        name: 'Hassan Ahmed',
        email: 'hassan@example.com',
        branch: 'Vaniyambadi North'
      },
      course: {
        id: '4',
        name: 'Mobile App Development'
      },
      completionDate: '2024-03-07T13:15:00Z',
      capstoneStatus: 'approved',
      status: 'pending'
    },
    {
      id: '8',
      aspirant: {
        id: '8',
        name: 'Mariam Khan',
        email: 'mariam@example.com',
        branch: 'Pernambut Tech Park'
      },
      course: {
        id: '5',
        name: 'Digital Marketing'
      },
      completionDate: '2024-03-14T08:30:00Z',
      capstoneStatus: 'pending',
      status: 'pending'
    }
  ];

  // Sample data for filters
  const branches = Array.from(new Set(certificates.map(c => c.aspirant.branch))).sort();

  const courses = Array.from(new Set(certificates.map(c => c.course.name))).sort();

  // Filter certificates based on all criteria
  const filteredCertificates = certificates.filter(certificate => {
    const matchesSearch = (
      certificate.aspirant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certificate.aspirant.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesBranch = !selectedBranch || certificate.aspirant.branch === selectedBranch;
    const matchesCourse = !filters.course || certificate.course.name === filters.course;
    const matchesStatus = !filters.status || certificate.status === filters.status;
    
    let matchesDate = true;
    if (filters.dateRange.start && filters.dateRange.end) {
      const completionDate = new Date(certificate.completionDate);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      matchesDate = completionDate >= startDate && completionDate <= endDate;
    }

    return matchesSearch && matchesBranch && matchesCourse && matchesStatus && matchesDate;
  });

  // Calculate metrics based on filtered data
  const calculateMetrics = () => {
    const totalCertificates = filteredCertificates.length;
    const pendingCertificates = filteredCertificates.filter(c => c.status === 'pending').length;
    const approvedCertificates = filteredCertificates.filter(c => c.status === 'approved').length;
    const rejectedCertificates = filteredCertificates.filter(c => c.status === 'rejected').length;
    
    const pendingCapstones = filteredCertificates.filter(c => c.capstoneStatus === 'pending').length;
    const approvedCapstones = filteredCertificates.filter(c => c.capstoneStatus === 'approved').length;
    
    const approvalRate = totalCertificates > 0 
      ? Math.round((approvedCertificates / totalCertificates) * 100)
      : 0;

    // Calculate this month's certificates
    const thisMonth = new Date();
    const startOfMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);
    const thisMonthCertificates = filteredCertificates.filter(c => {
      const completionDate = new Date(c.completionDate);
      return completionDate >= startOfMonth && c.status === 'approved';
    }).length;

    // Calculate unique contributors
    const uniqueContributors = new Set(filteredCertificates.map(c => c.aspirant.id)).size;

    return {
      totalCertificates,
      pendingCertificates,
      approvedCertificates,
      rejectedCertificates,
      pendingCapstones,
      approvedCapstones,
      approvalRate,
      thisMonthCertificates,
      uniqueContributors
    };
  };

  const metrics = calculateMetrics();

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
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return badges[status as keyof typeof badges];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Certificate Management</h2>
          {selectedBranch && (
            <p className="text-sm text-gray-600 mt-1">
              Viewing: <span className="font-medium">{selectedBranch}</span>
            </p>
          )}
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Certificates"
          value={metrics.totalCertificates}
          icon={<Award size={24} className="text-white" />}
          color="bg-indigo-600"
          subtitle={selectedBranch ? `in ${selectedBranch}` : 'across all branches'}
        />
        <MetricCard
          title="Pending Review"
          value={metrics.pendingCertificates}
          icon={<Clock size={24} className="text-white" />}
          color="bg-amber-600"
          subtitle="awaiting approval"
        />
        <MetricCard
          title="Approved"
          value={metrics.approvedCertificates}
          icon={<CheckCircle size={24} className="text-white" />}
          color="bg-green-600"
          subtitle={`${metrics.approvalRate}% approval rate`}
        />
        <MetricCard
          title="Rejected"
          value={metrics.rejectedCertificates}
          icon={<X size={24} className="text-white" />}
          color="bg-red-600"
          subtitle="needs attention"
        />
      </div>

      {/* Secondary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Pending Capstones"
          value={metrics.pendingCapstones}
          icon={<Target size={24} className="text-white" />}
          color="bg-blue-600"
          subtitle="awaiting capstone approval"
        />
        <MetricCard
          title="Approved Capstones"
          value={metrics.approvedCapstones}
          icon={<Check size={24} className="text-white" />}
          color="bg-emerald-600"
          subtitle="ready for certificate"
        />
        <MetricCard
          title="This Month"
          value={metrics.thisMonthCertificates}
          icon={<TrendingUp size={24} className="text-white" />}
          color="bg-purple-600"
          subtitle="certificates issued"
        />
        <MetricCard
          title="Unique Aspirants"
          value={metrics.uniqueContributors}
          icon={<Users size={24} className="text-white" />}
          color="bg-rose-600"
          subtitle="with certificate requests"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search aspirants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="relative">
            <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
            >
              <option value="">All Branches</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>

          <select
            value={filters.course}
            onChange={(e) => setFilters({ ...filters, course: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Courses</option>
            {courses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <input
            type="date"
            value={filters.dateRange.start}
            onChange={(e) => setFilters({
              ...filters,
              dateRange: { ...filters.dateRange, start: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Start date"
          />

          <div className="flex space-x-2">
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => setFilters({
                ...filters,
                dateRange: { ...filters.dateRange, end: e.target.value }
              })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="End date"
            />
            {(selectedBranch || searchTerm || filters.course || filters.status || filters.dateRange.start || filters.dateRange.end) && (
              <button
                onClick={() => {
                  setSelectedBranch('');
                  setSearchTerm('');
                  setFilters({
                    course: '',
                    status: '',
                    dateRange: { start: '', end: '' }
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 whitespace-nowrap"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aspirant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Completion Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capstone Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Certificate Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCertificates.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  {selectedBranch 
                    ? `No certificates found in ${selectedBranch}${searchTerm ? ` matching "${searchTerm}"` : ''}`
                    : `No certificates found${searchTerm ? ` matching "${searchTerm}"` : ''}`
                  }
                </td>
              </tr>
            ) : (
              filteredCertificates.map((certificate) => (
                <tr key={certificate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {certificate.aspirant.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {certificate.aspirant.branch}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BookOpen size={16} className="text-indigo-600 mr-2" />
                      <span className="text-sm text-gray-900">
                        {certificate.course.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500">
                        {formatDate(certificate.completionDate)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      certificate.capstoneStatus === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {certificate.capstoneStatus.charAt(0).toUpperCase() + certificate.capstoneStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        getStatusBadge(certificate.status)
                      }`}>
                        {certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1)}
                      </span>
                      {certificate.certificateId && (
                        <span className="text-xs text-gray-500">
                          {certificate.certificateId}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => navigate(`/dashboard/certificates/${certificate.id}`)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    {certificate.status === 'pending' && (
                      <>
                        <button
                          onClick={() => navigate(`/dashboard/certificates/${certificate.id}?action=approve`)}
                          className="text-green-600 hover:text-green-900 mr-3"
                          title="Approve Certificate"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => navigate(`/dashboard/certificates/${certificate.id}?action=reject`)}
                          className="text-red-600 hover:text-red-900"
                          title="Reject Certificate"
                        >
                          <X size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CertificateList;