import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Calendar, Video, Users, Clock, Check, X, Filter, CheckCircle, UserCheck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface Interview {
  id: string;
  week: number;
  aspirant: {
    id: string;
    name: string;
    branch: string;
  };
  mode: 'offline' | 'meet' | 'zoom';
  status: 'scheduled' | 'completed' | 'missed';
  score?: number;
  feedback?: string;
  scheduledFor: string;
  meetingLink?: string;
}

interface InterviewRequest {
  id: string;
  aspirant: {
    id: string;
    name: string;
    branch: string;
  };
  requestedFor: string;
  preferredMode: 'offline' | 'online';
  status: 'pending' | 'accepted' | 'declined';
  requestedAt: string;
  reason?: string;
}

interface ScheduleFormData {
  branchId: string;
  aspirantId: string;
  mode: 'offline' | 'online';
  meetingUrl?: string;
  dateTime: string;
  notes?: string;
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

const InterviewList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('scheduled');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [filters, setFilters] = useState({
    week: '',
    status: '',
  });

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  
  const [scheduleForm, setScheduleForm] = useState<ScheduleFormData>({
    branchId: '',
    aspirantId: '',
    mode: 'offline',
    dateTime: '',
  });

  // Sample data with more interviews across different branches
  const interviews: Interview[] = [
    {
      id: '1',
      week: 1,
      aspirant: {
        id: '1',
        name: 'Mohammed Imran',
        branch: 'Ambur Central'
      },
      mode: 'meet',
      status: 'scheduled',
      scheduledFor: '2024-03-15T10:00:00Z',
      meetingLink: 'https://meet.google.com/abc-defg-hij'
    },
    {
      id: '2',
      week: 2,
      aspirant: {
        id: '2',
        name: 'Fatima Zahra',
        branch: 'Vaniyambadi North'
      },
      mode: 'offline',
      status: 'completed',
      score: 8,
      feedback: 'Excellent communication skills and technical knowledge.',
      scheduledFor: '2024-03-10T14:30:00Z'
    },
    {
      id: '3',
      week: 1,
      aspirant: {
        id: '3',
        name: 'Abdul Rahman',
        branch: 'Chennai East'
      },
      mode: 'zoom',
      status: 'completed',
      score: 7,
      feedback: 'Good technical skills, needs improvement in communication.',
      scheduledFor: '2024-03-12T11:00:00Z'
    },
    {
      id: '4',
      week: 3,
      aspirant: {
        id: '4',
        name: 'Ayesha Siddiqui',
        branch: 'Ambur Central'
      },
      mode: 'meet',
      status: 'missed',
      scheduledFor: '2024-03-11T16:00:00Z'
    },
    {
      id: '5',
      week: 2,
      aspirant: {
        id: '5',
        name: 'Omar Farooq',
        branch: 'Pernambut Tech Park'
      },
      mode: 'offline',
      status: 'scheduled',
      scheduledFor: '2024-03-16T09:30:00Z'
    },
    {
      id: '6',
      week: 1,
      aspirant: {
        id: '6',
        name: 'Zainab Ali',
        branch: 'Chennai East'
      },
      mode: 'meet',
      status: 'completed',
      score: 9,
      feedback: 'Outstanding performance in all areas.',
      scheduledFor: '2024-03-09T13:00:00Z'
    }
  ];

  const requests: InterviewRequest[] = [
    {
      id: '1',
      aspirant: {
        id: '7',
        name: 'Hassan Ahmed',
        branch: 'Vaniyambadi North'
      },
      requestedFor: '2024-03-20',
      preferredMode: 'online',
      status: 'pending',
      requestedAt: '2024-03-12T09:15:00Z'
    },
    {
      id: '2',
      aspirant: {
        id: '8',
        name: 'Mariam Khan',
        branch: 'Ambur Central'
      },
      requestedFor: '2024-03-22',
      preferredMode: 'offline',
      status: 'pending',
      requestedAt: '2024-03-13T11:30:00Z'
    },
    {
      id: '3',
      aspirant: {
        id: '9',
        name: 'Yusuf Ibrahim',
        branch: 'Pernambut Tech Park'
      },
      requestedFor: '2024-03-21',
      preferredMode: 'online',
      status: 'pending',
      requestedAt: '2024-03-14T08:45:00Z'
    }
  ];

  // Sample data for dropdowns
  const branches = [
    { id: '1', name: 'Ambur Central' },
    { id: '2', name: 'Vaniyambadi North' },
    { id: '3', name: 'Chennai East' },
    { id: '4', name: 'Pernambut Tech Park' }
  ];

  const aspirants = [
    { id: '1', name: 'Fatima Zahra', branchId: '1' },
    { id: '2', name: 'Omar Farooq', branchId: '2' },
    { id: '3', name: 'Abdul Qadir', branchId: '3' },
    { id: '4', name: 'Nadia Hassan', branchId: '4' }
  ];

  // Filter data based on selected branch
  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = (
      interview.aspirant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.aspirant.branch.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesBranch = !selectedBranch || interview.aspirant.branch === selectedBranch;
    const matchesWeek = !filters.week || interview.week.toString() === filters.week;
    const matchesStatus = !filters.status || interview.status === filters.status;
    
    return matchesSearch && matchesBranch && matchesWeek && matchesStatus;
  });

  const filteredRequests = requests.filter(request => {
    const matchesSearch = (
      request.aspirant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.aspirant.branch.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesBranch = !selectedBranch || request.aspirant.branch === selectedBranch;
    
    return matchesSearch && matchesBranch;
  });

  // Calculate metrics based on filtered data
  const calculateMetrics = () => {
    const totalInterviews = filteredInterviews.length;
    const completedInterviews = filteredInterviews.filter(i => i.status === 'completed').length;
    const scheduledInterviews = filteredInterviews.filter(i => i.status === 'scheduled').length;
    const pendingRequests = filteredRequests.filter(r => r.status === 'pending').length;

    const completionRate = totalInterviews > 0 
      ? Math.round((completedInterviews / totalInterviews) * 100)
      : 0;

    return {
      totalInterviews,
      completedInterviews,
      scheduledInterviews,
      pendingRequests,
      completionRate
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
      scheduled: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      missed: 'bg-red-100 text-red-800',
      pending: 'bg-gray-100 text-gray-800',
      accepted: 'bg-blue-100 text-blue-800',
      declined: 'bg-red-100 text-red-800'
    };
    return badges[status as keyof typeof badges];
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form
    if (!scheduleForm.branchId || !scheduleForm.aspirantId || !scheduleForm.dateTime) {
      return;
    }

    if (scheduleForm.mode === 'online' && !scheduleForm.meetingUrl) {
      return;
    }

    // Handle form submission
    console.log('Scheduling interview:', scheduleForm);
    setShowScheduleModal(false);
    setScheduleForm({
      branchId: '',
      aspirantId: '',
      mode: 'offline',
      dateTime: '',
    });
  };

  const handleApproveRequest = (request: InterviewRequest) => {
    const branch = branches.find(b => b.name === request.aspirant.branch);
    if (branch) {
      setScheduleForm({
        branchId: branch.id,
        aspirantId: request.aspirant.id,
        mode: request.preferredMode === 'offline' ? 'offline' : 'online',
        dateTime: request.requestedFor,
      });
      setShowScheduleModal(true);
    }
  };

  const handleDeclineRequest = (requestId: string) => {
    setSelectedRequestId(requestId);
    setShowDeclineModal(true);
  };

  const submitDecline = () => {
    if (!declineReason.trim()) {
      return;
    }
    console.log('Declining request:', selectedRequestId, 'Reason:', declineReason);
    setShowDeclineModal(false);
    setDeclineReason('');
    setSelectedRequestId(null);
  };

  const filteredAspirants = aspirants.filter(
    aspirant => aspirant.branchId === scheduleForm.branchId
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Interview Management</h2>
          {selectedBranch && (
            <p className="text-sm text-gray-600 mt-1">
              Viewing: <span className="font-medium">{selectedBranch}</span>
            </p>
          )}
        </div>
        <button
          onClick={() => setShowScheduleModal(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus size={20} className="mr-2" />
          Schedule Interview
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Interviews"
          value={metrics.totalInterviews}
          icon={<Calendar size={24} className="text-white" />}
          color="bg-indigo-600"
          subtitle={selectedBranch ? `in ${selectedBranch}` : 'across all branches'}
        />
        <MetricCard
          title="Completed"
          value={metrics.completedInterviews}
          icon={<CheckCircle size={24} className="text-white" />}
          color="bg-green-600"
          subtitle={`${metrics.completionRate}% completion rate`}
        />
        <MetricCard
          title="Scheduled"
          value={metrics.scheduledInterviews}
          icon={<Clock size={24} className="text-white" />}
          color="bg-blue-600"
        />
        <MetricCard
          title="Pending Requests"
          value={metrics.pendingRequests}
          icon={<UserCheck size={24} className="text-white" />}
          color="bg-amber-600"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard
          title="This Week"
          value={filteredInterviews.filter(i => {
            const interviewDate = new Date(i.scheduledFor);
            const now = new Date();
            const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            return interviewDate >= weekStart && interviewDate <= weekEnd;
          }).length}
          icon={<Calendar size={24} className="text-white" />}
          color="bg-emerald-600"
          subtitle="interviews scheduled"
        />
        <MetricCard
          title="Completion Rate"
          value={`${metrics.completionRate}%`}
          icon={<CheckCircle size={24} className="text-white" />}
          color="bg-purple-600"
          subtitle={`${metrics.completedInterviews} of ${metrics.totalInterviews} completed`}
        />
      </div>

      {/* Branch Filter */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white min-w-[200px]"
            >
              <option value="">All Branches</option>
              {branches.map(branch => (
                <option key={branch.id} value={branch.name}>{branch.name}</option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search interviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-w-[300px]"
            />
          </div>

          {(selectedBranch || searchTerm) && (
            <button
              onClick={() => {
                setSelectedBranch('');
                setSearchTerm('');
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <h3 className="text-xl font-semibold mb-4">Schedule Interview</h3>
            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Branch
                  </label>
                  <select
                    value={scheduleForm.branchId}
                    onChange={(e) => setScheduleForm({
                      ...scheduleForm,
                      branchId: e.target.value,
                      aspirantId: '' // Reset aspirant when branch changes
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select a branch</option>
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>

                {scheduleForm.branchId && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Aspirant
                    </label>
                    <select
                      value={scheduleForm.aspirantId}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, aspirantId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select an aspirant</option>
                      {filteredAspirants.map(aspirant => (
                        <option key={aspirant.id} value={aspirant.id}>
                          {aspirant.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interview Mode
                  </label>
                  <select
                    value={scheduleForm.mode}
                    onChange={(e) => setScheduleForm({
                      ...scheduleForm,
                      mode: e.target.value as 'offline' | 'online',
                      meetingUrl: undefined
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="offline">Offline</option>
                    <option value="online">Online</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduleForm.dateTime}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, dateTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                {scheduleForm.mode === 'online' && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meeting URL
                    </label>
                    <input
                      type="url"
                      value={scheduleForm.meetingUrl}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, meetingUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="https://meet.google.com/..."
                      required
                    />
                  </div>
                )}

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={scheduleForm.notes}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                    placeholder="Add any additional notes..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Schedule Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Decline Request Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Decline Interview Request</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Declining
                </label>
                <textarea
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  placeholder="Please provide a reason..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeclineModal(false);
                    setDeclineReason('');
                    setSelectedRequestId(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitDecline}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  disabled={!declineReason.trim()}
                >
                  Decline Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="scheduled" className="flex items-center">
            <Calendar size={18} className="mr-2" />
            Scheduled Interviews
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center">
            <Clock size={18} className="mr-2" />
            Interview Requests
            {metrics.pendingRequests > 0 && (
              <span className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                {metrics.pendingRequests}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={filters.week}
                onChange={(e) => setFilters({ ...filters, week: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Weeks</option>
                <option value="1">Week 1</option>
                <option value="2">Week 2</option>
                <option value="3">Week 3</option>
              </select>

              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="missed">Missed</option>
              </select>

              <button
                onClick={() => setFilters({ week: '', status: '' })}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interview Week
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aspirant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mode
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInterviews.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        {selectedBranch 
                          ? `No interviews found in ${selectedBranch}${searchTerm ? ` matching "${searchTerm}"` : ''}`
                          : `No interviews found${searchTerm ? ` matching "${searchTerm}"` : ''}`
                        }
                      </td>
                    </tr>
                  ) : (
                    filteredInterviews.map((interview) => (
                      <tr key={interview.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">Week {interview.week}</div>
                          <div className="text-sm text-gray-500">{formatDate(interview.scheduledFor)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{interview.aspirant.name}</div>
                          <div className="text-sm text-gray-500">{interview.aspirant.branch}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {interview.mode === 'offline' ? (
                              <Users size={18} className="text-gray-500 mr-1" />
                            ) : (
                              <Video size={18} className="text-gray-500 mr-1" />
                            )}
                            <span className="text-sm text-gray-900">
                              {interview.mode.charAt(0).toUpperCase() + interview.mode.slice(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            getStatusBadge(interview.status)
                          }`}>
                            {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {interview.score ? (
                            <div className="text-sm font-medium text-gray-900">{interview.score}/10</div>
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => navigate(`/dashboard/interviews/${interview.id}`)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="requests">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aspirant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested For
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preferred Mode
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
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      {selectedBranch 
                        ? `No interview requests found in ${selectedBranch}${searchTerm ? ` matching "${searchTerm}"` : ''}`
                        : `No interview requests found${searchTerm ? ` matching "${searchTerm}"` : ''}`
                      }
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{request.aspirant.name}</div>
                        <div className="text-sm text-gray-500">{request.aspirant.branch}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(request.requestedFor)}</div>
                        <div className="text-sm text-gray-500">Requested: {formatDate(request.requestedAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {request.preferredMode === 'offline' ? (
                            <Users size={18} className="text-gray-500 mr-1" />
                          ) : (
                            <Video size={18} className="text-gray-500 mr-1" />
                          )}
                          <span className="text-sm text-gray-900">
                            {request.preferredMode.charAt(0).toUpperCase() + request.preferredMode.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          getStatusBadge(request.status)
                        }`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {request.status === 'pending' && (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleApproveRequest(request)}
                              className="text-green-600 hover:text-green-900"
                              title="Approve Request"
                            >
                              <Check size={20} />
                            </button>
                            <button
                              onClick={() => handleDeclineRequest(request.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Decline Request"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        )}
                        {request.status === 'declined' && request.reason && (
                          <span className="text-sm text-gray-500" title={request.reason}>
                            Declined
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InterviewList;