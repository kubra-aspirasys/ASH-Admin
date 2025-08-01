import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Key, Power, Download, Award, Zap, Trophy, Clock, BookOpen, Target, AlertTriangle, CheckCircle, XCircle, UserX, Video, HelpCircle, Timer, Plus, X } from 'lucide-react';

interface AspirantStatus {
  current: 'active' | 'suspended' | 'terminated';
  lastChanged: string;
  changedBy: string;
  reason?: string;
}

interface DailyGoal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
}

interface AssignedCourse {
  id: string;
  title: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  enrolledDate: string;
  completedDate?: string;
  currentStage: string;
  totalStages: number;
}

const AspirantDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'active' | 'suspended' | 'terminated'>('active');
  const [statusReason, setStatusReason] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [editingGoals, setEditingGoals] = useState<DailyGoal[]>([]);
  const [showCourseModal, setShowCourseModal] = useState(false);

  // Sample data - would normally come from an API
  const [aspirantData, setAspirantData] = useState({
    id,
    name: 'Fatima Zahra',
    email: 'fatima@example.com',
    mobile: '+91 9876543210',
    branch: {
      id: '1',
      name: 'Ambur Central'
    },
    batchType: 'Full-Time',
    course: {
      id: '1',
      name: 'Full Stack Development'
    },
    assignedCourses: [
      {
        id: '1',
        title: 'Full Stack Development',
        progress: 75,
        status: 'in_progress' as const,
        enrolledDate: '2024-01-15',
        currentStage: 'Advanced',
        totalStages: 4
      },
      {
        id: '3',
        title: 'Cloud Computing Essentials',
        progress: 100,
        status: 'completed' as const,
        enrolledDate: '2024-02-01',
        completedDate: '2024-03-10',
        currentStage: 'Completed',
        totalStages: 3
      },
      {
        id: '2',
        title: 'Data Science Fundamentals',
        progress: 0,
        status: 'not_started' as const,
        enrolledDate: '2024-03-01',
        currentStage: 'Not Started',
        totalStages: 4
      }
    ] as AssignedCourse[],
    progress: {
      currentStage: 'Project Phase',
      xp: 12450,
      streak: {
        status: 'active',
        count: 15
      },
      delayDays: 0,
      hasResume: true,
      hasCertificate: false
    },
    status: {
      current: 'active' as 'active' | 'suspended' | 'terminated',
      lastChanged: '2024-03-01T10:00:00Z',
      changedBy: 'Super Admin',
      reason: 'Initial enrollment'
    } as AspirantStatus,
    dailyGoals: [
      {
        id: '1',
        title: 'Watch Course Videos',
        description: 'Complete daily video lessons',
        target: 3,
        current: 2,
        unit: 'videos',
        icon: <Video size={20} className="text-blue-600" />,
        color: 'bg-blue-50 border-blue-200'
      },
      {
        id: '2',
        title: 'Complete Daily Quiz',
        description: 'Take and pass daily quiz',
        target: 1,
        current: 0,
        unit: 'quiz',
        icon: <HelpCircle size={20} className="text-green-600" />,
        color: 'bg-green-50 border-green-200'
      },
      {
        id: '3',
        title: "Log Today's Hours",
        description: 'Record study time for the day',
        target: 4,
        current: 2.5,
        unit: 'hours',
        icon: <Timer size={20} className="text-purple-600" />,
        color: 'bg-purple-50 border-purple-200'
      }
    ] as DailyGoal[]
  });

  // Available courses for assignment
  const availableCourses = [
    { id: '4', title: 'Mobile App Development', description: 'React Native and Flutter development' },
    { id: '5', title: 'Digital Marketing Mastery', description: 'SEO, SEM, and social media marketing' },
    { id: '6', title: 'DevOps Fundamentals', description: 'CI/CD, Docker, and Kubernetes' }
  ];

  // Available goal templates
  const goalTemplates = [
    {
      title: 'Watch Course Videos',
      description: 'Complete daily video lessons',
      unit: 'videos',
      defaultTarget: 3,
      icon: <Video size={20} className="text-blue-600" />,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Complete Daily Quiz',
      description: 'Take and pass daily quiz',
      unit: 'quiz',
      defaultTarget: 1,
      icon: <HelpCircle size={20} className="text-green-600" />,
      color: 'bg-green-50 border-green-200'
    },
    {
      title: 'Study Hours',
      description: 'Record study time for the day',
      unit: 'hours',
      defaultTarget: 4,
      icon: <Timer size={20} className="text-purple-600" />,
      color: 'bg-purple-50 border-purple-200'
    },
    {
      title: 'Practice Problems',
      description: 'Solve coding problems',
      unit: 'problems',
      defaultTarget: 5,
      icon: <Target size={20} className="text-orange-600" />,
      color: 'bg-orange-50 border-orange-200'
    },
    {
      title: 'Read Documentation',
      description: 'Read technical documentation',
      unit: 'pages',
      defaultTarget: 10,
      icon: <BookOpen size={20} className="text-indigo-600" />,
      color: 'bg-indigo-50 border-indigo-200'
    },
    {
      title: 'Code Review',
      description: 'Review and analyze code',
      unit: 'reviews',
      defaultTarget: 2,
      icon: <CheckCircle size={20} className="text-emerald-600" />,
      color: 'bg-emerald-50 border-emerald-200'
    }
  ];

  const getStreakBadge = (status: string, count: number) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      broken: 'bg-red-100 text-red-800',
      restored: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <span className={`px-3 py-1 inline-flex items-center text-sm leading-5 font-semibold rounded-full ${badges[status as keyof typeof badges]}`}>
        <Trophy size={16} className="mr-2" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
        {count > 0 && ` (${count} days)`}
      </span>
    );
  };

  const getStatusInfo = (status: string) => {
    const statusConfig = {
      active: {
        label: 'Active',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle size={16} className="text-green-600" />,
        description: 'Aspirant is actively enrolled and participating'
      },
      suspended: {
        label: 'Suspended',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <AlertTriangle size={16} className="text-yellow-600" />,
        description: 'Aspirant access is temporarily suspended'
      },
      terminated: {
        label: 'Terminated',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <XCircle size={16} className="text-red-600" />,
        description: 'Aspirant enrollment has been terminated'
      }
    };

    return statusConfig[status as keyof typeof statusConfig];
  };

  const getCourseStatusBadge = (status: string) => {
    const badges = {
      not_started: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800'
    };
    
    const labels = {
      not_started: 'Not Started',
      in_progress: 'In Progress',
      completed: 'Completed'
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const handleStatusChange = (newStatus: 'active' | 'suspended' | 'terminated') => {
    setSelectedStatus(newStatus);
    setStatusReason('');
    setShowStatusModal(true);
  };

  const submitStatusChange = async () => {
    if (!statusReason.trim() && selectedStatus !== 'active') {
      alert('Please provide a reason for this status change');
      return;
    }

    setIsUpdatingStatus(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update local state
      setAspirantData(prev => ({
        ...prev,
        status: {
          current: selectedStatus,
          lastChanged: new Date().toISOString(),
          changedBy: 'Super Admin', // This would come from auth context
          reason: statusReason || 'Status updated to active'
        }
      }));

      console.log('Status updated:', {
        aspirantId: id,
        newStatus: selectedStatus,
        reason: statusReason,
        updatedBy: 'Super Admin',
        timestamp: new Date().toISOString()
      });

      setShowStatusModal(false);
      setStatusReason('');
      
      // Show success message
      alert(`Aspirant status successfully updated to ${selectedStatus}`);
      
    } catch (error) {
      alert('Failed to update status. Please try again.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleEditGoals = () => {
    setEditingGoals([...aspirantData.dailyGoals]);
    setShowGoalsModal(true);
  };

  const addNewGoal = (template?: typeof goalTemplates[0]) => {
    const newGoal: DailyGoal = {
      id: Math.random().toString(36).substr(2, 9),
      title: template?.title || 'New Goal',
      description: template?.description || 'Custom goal description',
      target: template?.defaultTarget || 1,
      current: 0,
      unit: template?.unit || 'items',
      icon: template?.icon || <Target size={20} className="text-gray-600" />,
      color: template?.color || 'bg-gray-50 border-gray-200'
    };

    setEditingGoals(prev => [...prev, newGoal]);
  };

  const removeGoal = (goalId: string) => {
    setEditingGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  const updateGoal = (goalId: string, updates: Partial<DailyGoal>) => {
    setEditingGoals(prev => 
      prev.map(goal => 
        goal.id === goalId ? { ...goal, ...updates } : goal
      )
    );
  };

  const updateGoalTarget = (goalId: string, newTarget: number) => {
    setEditingGoals(prev => 
      prev.map(goal => 
        goal.id === goalId ? { ...goal, target: Math.max(1, newTarget) } : goal
      )
    );
  };

  const saveGoals = () => {
    setAspirantData(prev => ({
      ...prev,
      dailyGoals: editingGoals
    }));
    setShowGoalsModal(false);
    console.log('Updated daily goals:', editingGoals);
  };

  const handleAssignCourse = (courseId: string) => {
    const course = availableCourses.find(c => c.id === courseId);
    if (!course) return;

    const newCourse: AssignedCourse = {
      id: courseId,
      title: course.title,
      progress: 0,
      status: 'not_started',
      enrolledDate: new Date().toISOString().split('T')[0],
      currentStage: 'Not Started',
      totalStages: 4
    };

    setAspirantData(prev => ({
      ...prev,
      assignedCourses: [...prev.assignedCourses, newCourse]
    }));

    console.log('Assigned course:', courseId);
  };

  const handleUnassignCourse = (courseId: string) => {
    if (window.confirm('Are you sure you want to unassign this course?')) {
      setAspirantData(prev => ({
        ...prev,
        assignedCourses: prev.assignedCourses.filter(course => course.id !== courseId)
      }));
      console.log('Unassigned course:', courseId);
    }
  };

  const getGoalProgress = (goal: DailyGoal) => {
    const percentage = Math.min((goal.current / goal.target) * 100, 100);
    return percentage;
  };

  const getGoalStatus = (goal: DailyGoal) => {
    const percentage = getGoalProgress(goal);
    if (percentage >= 100) return { status: 'completed', color: 'bg-green-500' };
    if (percentage >= 50) return { status: 'in-progress', color: 'bg-yellow-500' };
    return { status: 'not-started', color: 'bg-gray-300' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const currentStatusInfo = getStatusInfo(aspirantData.status.current);
  const unassignedCourses = availableCourses.filter(
    course => !aspirantData.assignedCourses.some(assigned => assigned.id === course.id)
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard/aspirants')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Aspirants
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{aspirantData.name}</h2>
                  <p className="text-gray-600">{aspirantData.email}</p>
                  {aspirantData.mobile && (
                    <p className="text-gray-600">{aspirantData.mobile}</p>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => navigate(`/dashboard/aspirants/${id}/edit`)}
                    className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                  >
                    <Edit2 size={18} className="mr-2" />
                    Edit
                  </button>
                  <button
                    className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100"
                  >
                    <Key size={18} className="mr-2" />
                    Reset Password
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Branch</p>
                <p className="font-medium">{aspirantData.branch.name}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Batch Type</p>
                <p className="font-medium">{aspirantData.batchType}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Primary Course</p>
                <div className="flex items-center">
                  <BookOpen size={18} className="text-indigo-600 mr-2" />
                  <p className="font-medium">{aspirantData.course.name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Courses Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <BookOpen className="mr-2" size={24} />
                Assigned Courses ({aspirantData.assignedCourses.length})
              </h3>
              <button
                onClick={() => setShowCourseModal(true)}
                className="flex items-center px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100"
              >
                <Plus size={16} className="mr-2" />
                Assign Course
              </button>
            </div>

            <div className="space-y-4">
              {aspirantData.assignedCourses.map((course) => (
                <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <BookOpen size={18} className="text-indigo-600 mr-2" />
                      <h4 className="font-medium text-gray-800">{course.title}</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getCourseStatusBadge(course.status)}
                      <button
                        onClick={() => handleUnassignCourse(course.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Unassign course"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Enrolled: {formatDate(course.enrolledDate)}</span>
                      <span>Stage: {course.currentStage}</span>
                    </div>
                    {course.completedDate && (
                      <div className="text-xs text-green-600">
                        Completed: {formatDate(course.completedDate)}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {aspirantData.assignedCourses.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No courses assigned yet.</p>
                  <button
                    onClick={() => setShowCourseModal(true)}
                    className="mt-2 text-indigo-600 hover:text-indigo-800"
                  >
                    Assign your first course
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Daily Goals Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Target className="mr-2" size={24} />
                Daily Goals
              </h3>
              <button
                onClick={handleEditGoals}
                className="flex items-center px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100"
              >
                <Edit2 size={16} className="mr-2" />
                Edit Goals
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aspirantData.dailyGoals.map((goal) => {
                const progress = getGoalProgress(goal);
                const status = getGoalStatus(goal);
                
                return (
                  <div key={goal.id} className={`p-4 rounded-lg border-2 ${goal.color}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        {goal.icon}
                        <h4 className="ml-2 font-medium text-gray-800">{goal.title}</h4>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        status.status === 'completed' ? 'bg-green-100 text-green-800' :
                        status.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {status.status === 'completed' ? 'Done' :
                         status.status === 'in-progress' ? 'In Progress' : 'Pending'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">
                          {goal.current} / {goal.target} {goal.unit}
                        </span>
                        <span className="text-gray-500">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${status.color}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Target className="text-blue-600 mr-2" size={20} />
                <div>
                  <p className="text-sm font-medium text-blue-800">Daily Goal Progress</p>
                  <p className="text-sm text-blue-700">
                    {aspirantData.dailyGoals.filter(g => getGoalProgress(g) >= 100).length} of {aspirantData.dailyGoals.length} goals completed today
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress & Achievements</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center text-indigo-600 mb-2">
                  <Target size={20} className="mr-2" />
                  <h4 className="font-medium">Current Stage</h4>
                </div>
                <p className="text-gray-800">{aspirantData.progress.currentStage}</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center text-emerald-600 mb-2">
                  <Zap size={20} className="mr-2" />
                  <h4 className="font-medium">XP Points</h4>
                </div>
                <p className="text-gray-800">{aspirantData.progress.xp.toLocaleString()}</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center text-amber-600 mb-2">
                  <Trophy size={20} className="mr-2" />
                  <h4 className="font-medium">Streak Status</h4>
                </div>
                {getStreakBadge(aspirantData.progress.streak.status, aspirantData.progress.streak.count)}
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center text-blue-600 mb-2">
                  <Clock size={20} className="mr-2" />
                  <h4 className="font-medium">Activity Status</h4>
                </div>
                <p className="text-gray-800">
                  {aspirantData.progress.delayDays === 0 
                    ? 'Active' 
                    : `${aspirantData.progress.delayDays} days inactive`}
                </p>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Documents</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Download size={20} className="text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-800">Resume</p>
                    <p className="text-sm text-gray-500">Last updated: 2 weeks ago</p>
                  </div>
                </div>
                {aspirantData.progress.hasResume ? (
                  <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Download
                  </button>
                ) : (
                  <span className="text-sm text-gray-500">Not uploaded yet</span>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Award size={20} className="text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-800">Course Certificate</p>
                    <p className="text-sm text-gray-500">Awarded upon course completion</p>
                  </div>
                </div>
                {aspirantData.progress.hasCertificate ? (
                  <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Download
                  </button>
                ) : (
                  <span className="text-sm text-gray-500">Not available yet</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Management Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Aspirant Status</h3>
            
            <div className="space-y-4">
              <div className={`flex items-center px-3 py-2 rounded-lg border ${currentStatusInfo.color}`}>
                {currentStatusInfo.icon}
                <span className="ml-2 font-medium">{currentStatusInfo.label}</span>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>Last updated: {formatDate(aspirantData.status.lastChanged)}</p>
                <p>By: {aspirantData.status.changedBy}</p>
              </div>
              
              {aspirantData.status.reason && (
                <p className="text-sm text-gray-600">
                  <strong>Reason:</strong> {aspirantData.status.reason}
                </p>
              )}

              <div className="space-y-2">
                {aspirantData.status.current !== 'active' && (
                  <button
                    onClick={() => handleStatusChange('active')}
                    className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <CheckCircle size={18} className="mr-2" />
                    Activate
                  </button>
                )}
                
                {aspirantData.status.current !== 'suspended' && (
                  <button
                    onClick={() => handleStatusChange('suspended')}
                    className="w-full flex items-center justify-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  >
                    <AlertTriangle size={18} className="mr-2" />
                    Suspend
                  </button>
                )}
                
                {aspirantData.status.current !== 'terminated' && (
                  <button
                    onClick={() => handleStatusChange('terminated')}
                    className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <UserX size={18} className="mr-2" />
                    Terminate
                  </button>
                )}
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">{currentStatusInfo.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Assignment Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <h3 className="text-xl font-semibold mb-4">Assign New Course</h3>
            
            <div className="space-y-4">
              {unassignedCourses.length > 0 ? (
                unassignedCourses.map((course) => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800">{course.title}</h4>
                        <p className="text-sm text-gray-600">{course.description}</p>
                      </div>
                      <button
                        onClick={() => {
                          handleAssignCourse(course.id);
                          setShowCourseModal(false);
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        Assign
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>All available courses have been assigned to this aspirant.</p>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowCourseModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Goals Modal */}
      {showGoalsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Edit Daily Goals</h3>
            
            <div className="space-y-6">
              {/* Current Goals */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-800">Current Goals</h4>
                {editingGoals.map((goal) => (
                  <div key={goal.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center flex-1">
                      {goal.icon}
                      <div className="ml-3 flex-1">
                        <input
                          type="text"
                          value={goal.title}
                          onChange={(e) => updateGoal(goal.id, { title: e.target.value })}
                          className="font-medium text-gray-800 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1"
                          placeholder="Goal title"
                        />
                        <input
                          type="text"
                          value={goal.description}
                          onChange={(e) => updateGoal(goal.id, { description: e.target.value })}
                          className="text-sm text-gray-600 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1 w-full mt-1"
                          placeholder="Goal description"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">Target:</label>
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={goal.target}
                          onChange={(e) => updateGoalTarget(goal.id, parseInt(e.target.value) || 1)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                          type="text"
                          value={goal.unit}
                          onChange={(e) => updateGoal(goal.id, { unit: e.target.value })}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-indigo-500"
                          placeholder="unit"
                        />
                      </div>
                      <button
                        onClick={() => removeGoal(goal.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Remove goal"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Goal Section */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-800">Add New Goal</h4>
                  <button
                    onClick={() => addNewGoal()}
                    className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    <Plus size={16} className="mr-2" />
                    Custom Goal
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {goalTemplates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => addNewGoal(template)}
                      className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors text-left"
                    >
                      <div className="flex items-center mb-2">
                        {template.icon}
                        <span className="ml-2 font-medium text-gray-800">{template.title}</span>
                      </div>
                      <p className="text-sm text-gray-600">{template.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Default: {template.defaultTarget} {template.unit}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {editingGoals.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Target size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No goals set. Add some goals to help track daily progress.</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <button
                onClick={() => setShowGoalsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveGoals}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Save Goals
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              Change Aspirant Status to {getStatusInfo(selectedStatus).label}
            </h3>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${getStatusInfo(selectedStatus).color}`}>
                <div className="flex items-center mb-2">
                  {getStatusInfo(selectedStatus).icon}
                  <span className="ml-2 font-medium">{getStatusInfo(selectedStatus).label}</span>
                </div>
                <p className="text-sm">{getStatusInfo(selectedStatus).description}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Status Change {selectedStatus !== 'active' && '*'}
                </label>
                <textarea
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  placeholder={`Please provide a reason for ${selectedStatus === 'active' ? 'activating' : selectedStatus === 'suspended' ? 'suspending' : 'terminating'} this aspirant...`}
                  required={selectedStatus !== 'active'}
                />
              </div>

              {selectedStatus === 'terminated' && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="text-red-500 mr-2" size={16} />
                    <span className="text-sm text-red-800 font-medium">
                      Warning: This action will permanently end the aspirant's enrollment
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setStatusReason('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitStatusChange}
                  disabled={isUpdatingStatus || (selectedStatus !== 'active' && !statusReason.trim())}
                  className={`px-4 py-2 text-white rounded-lg disabled:opacity-50 ${
                    selectedStatus === 'active' ? 'bg-green-600 hover:bg-green-700' :
                    selectedStatus === 'suspended' ? 'bg-yellow-600 hover:bg-yellow-700' :
                    'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isUpdatingStatus ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Updating...
                    </>
                  ) : (
                    `Change to ${getStatusInfo(selectedStatus).label}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AspirantDetails;