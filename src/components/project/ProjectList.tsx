import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Star, Github, ExternalLink, Check, X, FolderGit2, Trophy, Clock, Users, Target, Upload, Paperclip } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  aspirant: {
    id: string;
    name: string;
    branch: string;
  };
  githubUrl: string;
  netlifyUrl: string;
  submittedAt: string;
  rating: number;
  status: 'pending' | 'approved' | 'resubmitted';
  feedback?: string;
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

const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    dateRange: {
      start: '',
      end: ''
    }
  });

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [feedbackDocument, setFeedbackDocument] = useState<File | null>(null);

  // Sample data with all projects as capstone projects
  const projects: Project[] = [
    {
      id: '1',
      title: 'E-Commerce Platform',
      aspirant: {
        id: '1',
        name: 'Mohammed Imran',
        branch: 'Ambur Central'
      },
      githubUrl: 'https://github.com/example/project1',
      netlifyUrl: 'https://project1.netlify.app',
      submittedAt: '2024-03-10T15:30:00Z',
      rating: 4,
      status: 'pending'
    },
    {
      id: '2',
      title: 'Learning Management System',
      aspirant: {
        id: '2',
        name: 'Fatima Zahra',
        branch: 'Vaniyambadi North'
      },
      githubUrl: 'https://github.com/example/project2',
      netlifyUrl: 'https://project2.netlify.app',
      submittedAt: '2024-03-09T10:15:00Z',
      rating: 5,
      status: 'approved'
    },
    {
      id: '3',
      title: 'Task Management App',
      aspirant: {
        id: '3',
        name: 'Abdul Rahman',
        branch: 'Chennai East'
      },
      githubUrl: 'https://github.com/example/project3',
      netlifyUrl: 'https://project3.netlify.app',
      submittedAt: '2024-03-08T14:20:00Z',
      rating: 3,
      status: 'resubmitted',
      feedback: 'Good concept but needs better UI/UX design and error handling.'
    },
    {
      id: '4',
      title: 'Real Estate Portal',
      aspirant: {
        id: '4',
        name: 'Ayesha Siddiqui',
        branch: 'Ambur Central'
      },
      githubUrl: 'https://github.com/example/project4',
      netlifyUrl: 'https://project4.netlify.app',
      submittedAt: '2024-03-12T09:45:00Z',
      rating: 4,
      status: 'approved'
    },
    {
      id: '5',
      title: 'Social Media Dashboard',
      aspirant: {
        id: '5',
        name: 'Omar Farooq',
        branch: 'Pernambut Tech Park'
      },
      githubUrl: 'https://github.com/example/project5',
      netlifyUrl: 'https://project5.netlify.app',
      submittedAt: '2024-03-11T16:30:00Z',
      rating: 5,
      status: 'approved'
    },
    {
      id: '6',
      title: 'Healthcare Management System',
      aspirant: {
        id: '6',
        name: 'Zainab Ali',
        branch: 'Chennai East'
      },
      githubUrl: 'https://github.com/example/project6',
      netlifyUrl: 'https://project6.netlify.app',
      submittedAt: '2024-03-13T11:00:00Z',
      rating: 0,
      status: 'pending'
    },
    {
      id: '7',
      title: 'Financial Analytics Platform',
      aspirant: {
        id: '7',
        name: 'Hassan Ahmed',
        branch: 'Vaniyambadi North'
      },
      githubUrl: 'https://github.com/example/project7',
      netlifyUrl: 'https://project7.netlify.app',
      submittedAt: '2024-03-07T13:15:00Z',
      rating: 2,
      status: 'resubmitted',
      feedback: 'Missing key features and has several bugs. Please review requirements.'
    },
    {
      id: '8',
      title: 'Event Management System',
      aspirant: {
        id: '8',
        name: 'Mariam Khan',
        branch: 'Pernambut Tech Park'
      },
      githubUrl: 'https://github.com/example/project8',
      netlifyUrl: 'https://project8.netlify.app',
      submittedAt: '2024-03-14T08:30:00Z',
      rating: 0,
      status: 'pending'
    }
  ];

  // Get unique branches for filter dropdown
  const branches = Array.from(new Set(projects.map(p => p.aspirant.branch))).sort();

  // Filter projects based on all criteria
  const filteredProjects = projects.filter(project => {
    const matchesSearch = (
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.aspirant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesBranch = !selectedBranch || project.aspirant.branch === selectedBranch;
    const matchesStatus = !filters.status || project.status === filters.status;
    
    let matchesDate = true;
    if (filters.dateRange.start && filters.dateRange.end) {
      const submittedDate = new Date(project.submittedAt);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      matchesDate = submittedDate >= startDate && submittedDate <= endDate;
    }

    return matchesSearch && matchesBranch && matchesStatus && matchesDate;
  });

  // Calculate metrics based on filtered data
  const calculateMetrics = () => {
    const totalProjects = filteredProjects.length;
    const pendingProjects = filteredProjects.filter(p => p.status === 'pending').length;
    const approvedProjects = filteredProjects.filter(p => p.status === 'approved').length;
    const resubmittedProjects = filteredProjects.filter(p => p.status === 'resubmitted').length;
    
    const approvalRate = totalProjects > 0 
      ? Math.round((approvedProjects / totalProjects) * 100)
      : 0;

    // Calculate average rating for approved projects
    const approvedWithRatings = filteredProjects.filter(p => p.status === 'approved' && p.rating > 0);
    const averageRating = approvedWithRatings.length > 0
      ? (approvedWithRatings.reduce((sum, p) => sum + p.rating, 0) / approvedWithRatings.length).toFixed(1)
      : '0';

    return {
      totalProjects,
      pendingProjects,
      approvedProjects,
      resubmittedProjects,
      approvalRate,
      averageRating
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
      resubmitted: 'bg-blue-100 text-blue-800'
    };
    return badges[status as keyof typeof badges];
  };

  const handleResubmit = (projectId: string) => {
    setSelectedProjectId(projectId);
    setFeedback('');
    setFeedbackDocument(null);
    setShowFeedbackModal(true);
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeedbackDocument(file);
    }
  };

  const removeFeedbackDocument = () => {
    setFeedbackDocument(null);
    // Reset the file input
    const fileInput = document.getElementById('feedback-document') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const submitFeedback = () => {
    if (!feedback.trim()) return;
    
    // Here you would typically update the project status and feedback in your backend
    console.log('Project:', selectedProjectId, 'Feedback:', feedback);
    if (feedbackDocument) {
      console.log('Feedback document:', feedbackDocument.name, feedbackDocument.size);
    }
    
    setShowFeedbackModal(false);
    setSelectedProjectId(null);
    setFeedback('');
    setFeedbackDocument(null);
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Capstone Projects</h2>
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
          title="Total Capstone Projects"
          value={metrics.totalProjects}
          icon={<Trophy size={24} className="text-white" />}
          color="bg-indigo-600"
          subtitle={selectedBranch ? `in ${selectedBranch}` : 'across all branches'}
        />
        <MetricCard
          title="Pending Review"
          value={metrics.pendingProjects}
          icon={<Clock size={24} className="text-white" />}
          color="bg-amber-600"
          subtitle="awaiting evaluation"
        />
        <MetricCard
          title="Approved"
          value={metrics.approvedProjects}
          icon={<Check size={24} className="text-white" />}
          color="bg-green-600"
          subtitle={`${metrics.approvalRate}% approval rate`}
        />
        <MetricCard
          title="Resubmitted"
          value={metrics.resubmittedProjects}
          icon={<X size={24} className="text-white" />}
          color="bg-blue-600"
          subtitle="needs improvement"
        />
      </div>

      {/* Secondary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Average Rating"
          value={`${metrics.averageRating}/5`}
          icon={<Star size={24} className="text-white" />}
          color="bg-yellow-600"
          subtitle="for approved projects"
        />
        <MetricCard
          title="Unique Contributors"
          value={new Set(filteredProjects.map(p => p.aspirant.id)).size}
          icon={<Users size={24} className="text-white" />}
          color="bg-rose-600"
          subtitle="aspirants with submissions"
        />
        <MetricCard
          title="This Month"
          value={filteredProjects.filter(p => {
            const submittedDate = new Date(p.submittedAt);
            const now = new Date();
            return submittedDate.getMonth() === now.getMonth() && 
                   submittedDate.getFullYear() === now.getFullYear();
          }).length}
          icon={<FolderGit2 size={24} className="text-white" />}
          color="bg-purple-600"
          subtitle="projects submitted"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
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
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="resubmitted">Resubmitted</option>
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
            {(selectedBranch || searchTerm || filters.status || filters.dateRange.start || filters.dateRange.end) && (
              <button
                onClick={() => {
                  setSelectedBranch('');
                  setSearchTerm('');
                  setFilters({
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
                Capstone Project
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aspirant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Links
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
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
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  {selectedBranch 
                    ? `No capstone projects found in ${selectedBranch}${searchTerm ? ` matching "${searchTerm}"` : ''}`
                    : `No capstone projects found${searchTerm ? ` matching "${searchTerm}"` : ''}`
                  }
                </td>
              </tr>
            ) : (
              filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => navigate(`/dashboard/projects/${project.id}`)}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                    >
                      {project.title}
                    </button>
                    <div className="text-xs text-gray-500 mt-1">
                      Submitted: {formatDate(project.submittedAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{project.aspirant.name}</div>
                    <div className="text-sm text-gray-500">{project.aspirant.branch}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-700"
                        title="View Source Code"
                      >
                        <Github size={20} />
                      </a>
                      <a
                        href={project.netlifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-700"
                        title="View Live Demo"
                      >
                        <ExternalLink size={20} />
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {project.rating > 0 ? (
                        <div className="flex items-center space-x-1">
                          {renderStars(project.rating)}
                          <span className="ml-1 text-sm text-gray-600">({project.rating}/5)</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Not rated</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      getStatusBadge(project.status)
                    }`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {project.status === 'pending' && (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleResubmit(project.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Request Resubmission"
                        >
                          <X size={20} />
                        </button>
                        <button
                          onClick={() => {
                            // Approve logic here
                          }}
                          className="text-green-600 hover:text-green-900"
                          title="Approve Project"
                        >
                          <Check size={20} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Resubmission Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Request Resubmission</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Feedback & Instructions *
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={6}
                  placeholder="Provide detailed feedback and instructions for improvement..."
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Be specific about what needs to be improved and provide clear guidance for the aspirant.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Supporting Document (Optional)
                </label>
                <div className="space-y-3">
                  {!feedbackDocument ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                      <div className="space-y-2">
                        <label
                          htmlFor="feedback-document"
                          className="cursor-pointer inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          <Paperclip size={18} className="mr-2" />
                          Choose File
                        </label>
                        <input
                          id="feedback-document"
                          type="file"
                          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                          onChange={handleDocumentUpload}
                          className="hidden"
                        />
                        <p className="text-sm text-gray-500">
                          Upload reference materials, examples, or detailed instructions
                        </p>
                        <p className="text-xs text-gray-400">
                          Supported formats: PDF, DOC, DOCX, TXT, PNG, JPG (Max 10MB)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Paperclip className="text-gray-500 mr-2" size={18} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{feedbackDocument.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(feedbackDocument.size)}</p>
                          </div>
                        </div>
                        <button
                          onClick={removeFeedbackDocument}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Remove document"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Target className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-amber-800">Resubmission Guidelines</h4>
                    <div className="mt-2 text-sm text-amber-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Provide specific, actionable feedback</li>
                        <li>Include examples or references when possible</li>
                        <li>Set clear expectations for the resubmission</li>
                        <li>Consider uploading supporting documents for complex requirements</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowFeedbackModal(false);
                    setSelectedProjectId(null);
                    setFeedback('');
                    setFeedbackDocument(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitFeedback}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={!feedback.trim()}
                >
                  Request Resubmission
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;