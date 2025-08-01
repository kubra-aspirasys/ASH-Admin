import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, Calendar, User, Mail, Phone, GraduationCap, Clock, MapPin, BookOpen, Plus, Copy } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface Application {
  id: string;
  name: string;
  phone: string;
  email: string;
  education: {
    qualification: string;
    institution: string;
    yearOfPassing: string;
    percentage: string;
  };
  preferredTiming: 'fulltime' | 'morning-parttime' | 'evening-parttime' | 'remote';
  preferredCourse: string;
  preferredBranch: string;
  additionalInfo?: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

const ApplicationList: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('received-forms');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    course: '',
    branch: '',
    timing: '',
    dateRange: {
      start: '',
      end: ''
    }
  });

  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);

  // Sample applications data
  const applications: Application[] = [
    {
      id: '1',
      name: 'Mohammed Imran',
      phone: '+91 9876543210',
      email: 'imran@example.com',
      education: {
        qualification: 'B.Tech/B.E',
        institution: 'Anna University',
        yearOfPassing: '2023',
        percentage: '8.5 CGPA'
      },
      preferredTiming: 'fulltime',
      preferredCourse: 'Full Stack Development',
      preferredBranch: 'Ambur',
      additionalInfo: 'Interested in React and Node.js development',
      submittedAt: '2024-03-15T10:30:00Z',
      status: 'pending'
    },
    {
      id: '2',
      name: 'Fatima Zahra',
      phone: '+91 9876543211',
      email: 'fatima@example.com',
      education: {
        qualification: 'BCA',
        institution: 'Bharathiar University',
        yearOfPassing: '2022',
        percentage: '85%'
      },
      preferredTiming: 'evening-parttime',
      preferredCourse: 'Data Science',
      preferredBranch: 'Chennai',
      submittedAt: '2024-03-14T14:20:00Z',
      status: 'approved',
      reviewedBy: 'Super Admin',
      reviewedAt: '2024-03-15T09:00:00Z'
    },
    {
      id: '3',
      name: 'Abdul Rahman',
      phone: '+91 9876543212',
      email: 'abdul@example.com',
      education: {
        qualification: 'MCA',
        institution: 'VIT University',
        yearOfPassing: '2021',
        percentage: '7.8 CGPA'
      },
      preferredTiming: 'remote',
      preferredCourse: 'Cloud Computing',
      preferredBranch: 'Vaniyambadi',
      submittedAt: '2024-03-13T16:45:00Z',
      status: 'rejected',
      reviewedBy: 'Super Admin',
      reviewedAt: '2024-03-14T11:30:00Z',
      rejectionReason: 'Insufficient technical background for the selected course'
    }
  ];

  const courses = ['Full Stack Development', 'Data Science', 'Cloud Computing', 'Mobile App Development'];
  const branches = ['Ambur', 'Chennai', 'Vaniyambadi', 'Pernambut'];

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone.includes(searchTerm);
    
    const matchesStatus = !filters.status || app.status === filters.status;
    const matchesCourse = !filters.course || app.preferredCourse === filters.course;
    const matchesBranch = !filters.branch || app.preferredBranch === filters.branch;
    const matchesTiming = !filters.timing || app.preferredTiming === filters.timing;

    let matchesDate = true;
    if (filters.dateRange.start && filters.dateRange.end) {
      const submittedDate = new Date(app.submittedAt);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      matchesDate = submittedDate >= startDate && submittedDate <= endDate;
    }

    return matchesSearch && matchesStatus && matchesCourse && matchesBranch && matchesTiming && matchesDate;
  });

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

  const getTimingLabel = (timing: string) => {
    const labels = {
      'fulltime': 'Full Time',
      'morning-parttime': 'Morning Part Time',
      'evening-parttime': 'Evening Part Time',
      'remote': 'Remote'
    };
    return labels[timing as keyof typeof labels];
  };

  const handleSelectApplication = (applicationId: string) => {
    setSelectedApplications(prev =>
      prev.includes(applicationId)
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  const handleSelectAll = () => {
    const pendingApplications = filteredApplications.filter(app => app.status === 'pending');
    if (selectedApplications.length === pendingApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(pendingApplications.map(app => app.id));
    }
  };

  const pendingApplications = filteredApplications.filter(app => app.status === 'pending');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">New Applications</h2>
        <button
          onClick={() => navigate('/dashboard/aspirants')}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Back to Aspirants
        </button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="received-forms" className="flex items-center">
            <Eye size={18} className="mr-2" />
            Received Applications
            {pendingApplications.length > 0 && (
              <span className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                {pendingApplications.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received-forms">
          <div className="space-y-6">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={filters.course}
                onChange={(e) => setFilters({ ...filters, course: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Courses</option>
                {courses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>

              <select
                value={filters.branch}
                onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Branches</option>
                {branches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>

              <select
                value={filters.timing}
                onChange={(e) => setFilters({ ...filters, timing: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Timings</option>
                <option value="fulltime">Full Time</option>
                <option value="morning-parttime">Morning Part Time</option>
                <option value="evening-parttime">Evening Part Time</option>
                <option value="remote">Remote</option>
              </select>

              <div className="flex space-x-2">
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => setFilters({
                    ...filters,
                    dateRange: { ...filters.dateRange, start: e.target.value }
                  })}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => setFilters({
                    ...filters,
                    dateRange: { ...filters.dateRange, end: e.target.value }
                  })}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedApplications.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between">
                <span className="text-blue-800 font-medium">
                  {selectedApplications.length} application(s) selected
                </span>
              </div>
            )}

            {/* Applications Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {pendingApplications.length > 0 && (
                <div className="p-4 border-b border-gray-200 bg-yellow-50">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedApplications.length === pendingApplications.length && pendingApplications.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      Select All Pending ({pendingApplications.length} applications)
                    </span>
                  </label>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Select
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applicant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Education
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preferences
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        View
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApplications.map((application) => (
                      <tr key={application.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {application.status === 'pending' && (
                            <input
                              type="checkbox"
                              checked={selectedApplications.includes(application.id)}
                              onChange={() => handleSelectApplication(application.id)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User size={16} className="text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{application.name}</div>
                              <div className="text-sm text-gray-500">{application.email}</div>
                              <div className="text-sm text-gray-500">{application.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{application.education.qualification}</div>
                          <div className="text-sm text-gray-500">{application.education.institution}</div>
                          <div className="text-sm text-gray-500">
                            {application.education.yearOfPassing} • {application.education.percentage}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{application.preferredCourse}</div>
                          <div className="text-sm text-gray-500">{application.preferredBranch}</div>
                          <div className="text-sm text-gray-500">{getTimingLabel(application.preferredTiming)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar size={16} className="text-gray-400 mr-1" />
                            <span className="text-sm text-gray-500">
                              {formatDate(application.submittedAt)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            getStatusBadge(application.status)
                          }`}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                          {application.status === 'rejected' && application.rejectionReason && (
                            <div className="text-xs text-red-600 mt-1" title={application.rejectionReason}>
                              Reason provided
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => navigate(`/dashboard/aspirants/applications/${application.id}`)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApplicationList;