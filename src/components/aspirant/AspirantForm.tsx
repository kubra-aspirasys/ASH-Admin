import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, User, GraduationCap, Clock, MapPin, Phone, Mail, Briefcase, Linkedin, Upload, Calendar, BookOpen } from 'lucide-react';

interface AspirantFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  mobileNumber: string;
  gender: 'male' | 'female' | '';
  fatherName: string;
  fathersMobileNumber: string;
  lastGraduation: string;
  technology: string;
  linkedIn: string;
  resume: File | null;
  session: 'fulltime' | 'morning-parttime' | 'evening-parttime' | 'remote';
  currentlyWorking: 'yes' | 'no' | '';
  systemFacility: 'yes' | 'no' | '';
  branchId: string;
  assignedCourses: string[];
  password: string;
  enrollmentDate: string;
}

interface Course {
  id: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  description: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

const AspirantForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<AspirantFormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    mobileNumber: '',
    gender: '',
    fatherName: '',
    fathersMobileNumber: '',
    lastGraduation: '',
    technology: '',
    linkedIn: '',
    resume: null,
    session: 'fulltime',
    currentlyWorking: '',
    systemFacility: '',
    branchId: '',
    assignedCourses: [],
    password: '',
    enrollmentDate: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState<Partial<AspirantFormData>>({});

  // Sample data for dropdowns
  const branches = [
    { id: '1', name: 'Ambur Central', seats: { fullTime: 20, morningPartTime: 15, eveningPartTime: 10, remote: 5 } },
    { id: '2', name: 'Vaniyambadi North', seats: { fullTime: 15, morningPartTime: 10, eveningPartTime: 8, remote: 3 } },
    { id: '3', name: 'Chennai East', seats: {fullTime: 25, morningPartTime: 20, eveningPartTime: 15, remote: 8 } },
    { id: '4', name: 'Pernambut Tech Park', seats: { fullTime: 18, morningPartTime: 12, eveningPartTime: 10, remote: 5 } }
  ];

  const technologies = [
    'Basic web development',
    'Python',
    'Java',
    'Node JS',
    'React JS',
    'Angular JS',
    'Digital marketing',
    'Flutter',
    'Asp.net',
    'Internship program'
  ];

  // Sample courses data
  const availableCourses: Course[] = [
    {
      id: '1',
      title: 'Full Stack Development',
      status: 'published',
      description: 'Complete web development course covering frontend and backend',
      duration: '6 months',
      level: 'intermediate'
    },
    {
      id: '2',
      title: 'Data Science Fundamentals',
      status: 'published',
      description: 'Introduction to data science, analytics, and machine learning',
      duration: '4 months',
      level: 'beginner'
    },
    {
      id: '3',
      title: 'Cloud Computing Essentials',
      status: 'published',
      description: 'AWS, Azure, and Google Cloud platform fundamentals',
      duration: '3 months',
      level: 'intermediate'
    },
    {
      id: '4',
      title: 'Mobile App Development',
      status: 'published',
      description: 'React Native and Flutter mobile development',
      duration: '5 months',
      level: 'advanced'
    },
    {
      id: '5',
      title: 'Digital Marketing Mastery',
      status: 'published',
      description: 'SEO, SEM, social media marketing, and analytics',
      duration: '3 months',
      level: 'beginner'
    }
  ];

  // Filter only published courses
  const publishedCourses = availableCourses.filter(course => course.status === 'published');

  useEffect(() => {
    if (isEditMode) {
      // Fetch aspirant data and populate form
      setFormData({
        firstName: 'Mohammed',
        lastName: 'Imran',
        dateOfBirth: '1995-06-15',
        email: 'imran@example.com',
        mobileNumber: '+91 9876543210',
        gender: 'male',
        fatherName: 'Abdul Rahman',
        fathersMobileNumber: '+91 9876543211',
        lastGraduation: 'B.Tech Computer Science',
        technology: 'Full Stack Development',
        linkedIn: 'https://linkedin.com/in/imran',
        resume: null,
        session: 'fulltime',
        currentlyWorking: 'no',
        systemFacility: 'yes',
        branchId: '1',
        assignedCourses: ['1', '3'], // Pre-assigned courses
        password: '',
        enrollmentDate: '2024-01-15'
      });
    }
  }, [isEditMode]);

  const validateForm = (): boolean => {
    const newErrors: Partial<AspirantFormData> = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.mobileNumber) newErrors.mobileNumber = 'Mobile number is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.fatherName) newErrors.fatherName = 'Father name is required';
    if (!formData.fathersMobileNumber) newErrors.fathersMobileNumber = 'Father\'s mobile number is required';
    if (!formData.lastGraduation) newErrors.lastGraduation = 'Last graduation is required';
    if (!formData.technology) newErrors.technology = 'Technology selection is required';
    if (!formData.currentlyWorking) newErrors.currentlyWorking = 'Currently working status is required';
    if (!formData.systemFacility) newErrors.systemFacility = 'System facility preference is required';
    if (!formData.branchId) newErrors.branchId = 'Branch assignment is required';
    if (!isEditMode && !formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      navigate('/dashboard/aspirants');
    }
  };

  const generatePassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData({ ...formData, password });
  };

  const getSessionLabel = (session: string) => {
    const labels = {
      'fulltime': 'Full Time',
      'morning-parttime': 'Morning Part Time',
      'evening-parttime': 'Evening Part Time',
      'remote': 'Remote'
    };
    return labels[session as keyof typeof labels] || session;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, resume: file });
    }
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleCourseToggle = (courseId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedCourses: prev.assignedCourses.includes(courseId)
        ? prev.assignedCourses.filter(id => id !== courseId)
        : [...prev.assignedCourses, courseId]
    }));
  };

  const getLevelBadgeColor = (level: string) => {
    const colors = {
      'beginner': 'bg-green-100 text-green-800',
      'intermediate': 'bg-yellow-100 text-yellow-800',
      'advanced': 'bg-red-100 text-red-800'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard/aspirants')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Aspirants
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {isEditMode ? 'Edit Aspirant' : 'Add New Aspirant'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <User className="mr-2" size={20} />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className={`w-full px-4 py-2 border ${errors.firstName ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500`}
                  placeholder="Enter first name"
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className={`w-full px-4 py-2 border ${errors.lastName ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500`}
                  placeholder="Enter last name"
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  value={formatDateForInput(formData.dateOfBirth)}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className={`w-full px-4 py-2 border ${errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500`}
                />
                {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  className={`w-full px-4 py-2 border ${errors.mobileNumber ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500`}
                  placeholder="Enter mobile number"
                />
                {errors.mobileNumber && <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Gender *
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Male</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Female</span>
                  </label>
                </div>
                {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
              </div>
            </div>
          </div>

          {/* Family Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <User className="mr-2" size={20} />
              Family Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Father Name *
                </label>
                <input
                  type="text"
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  className={`w-full px-4 py-2 border ${errors.fatherName ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500`}
                  placeholder="Enter father's name"
                />
                {errors.fatherName && <p className="mt-1 text-sm text-red-600">{errors.fatherName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Father's Mobile Number *
                </label>
                <input
                  type="tel"
                  value={formData.fathersMobileNumber}
                  onChange={(e) => setFormData({ ...formData, fathersMobileNumber: e.target.value })}
                  className={`w-full px-4 py-2 border ${errors.fathersMobileNumber ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500`}
                  placeholder="Enter father's mobile number"
                />
                {errors.fathersMobileNumber && <p className="mt-1 text-sm text-red-600">{errors.fathersMobileNumber}</p>}
              </div>
            </div>
          </div>

          {/* Education & Technology */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <GraduationCap className="mr-2" size={20} />
              Education & Technology
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Graduation *
                </label>
                <input
                  type="text"
                  value={formData.lastGraduation}
                  onChange={(e) => setFormData({ ...formData, lastGraduation: e.target.value })}
                  className={`w-full px-4 py-2 border ${errors.lastGraduation ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500`}
                  placeholder="Enter last graduation"
                />
                {errors.lastGraduation && <p className="mt-1 text-sm text-red-600">{errors.lastGraduation}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Technology *
                </label>
                <select
                  value={formData.technology}
                  onChange={(e) => setFormData({ ...formData, technology: e.target.value })}
                  className={`w-full px-4 py-2 border ${errors.technology ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500`}
                >
                  <option value="">Select the technology</option>
                  {technologies.map(tech => (
                    <option key={tech} value={tech}>{tech}</option>
                  ))}
                </select>
                {errors.technology && <p className="mt-1 text-sm text-red-600">{errors.technology}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={formData.linkedIn}
                  onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter LinkedIn"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resume
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <p className="mt-1 text-xs text-gray-500">Upload resume (PDF, DOC, DOCX)</p>
              </div>
            </div>
          </div>

          {/* Course Assignment */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <BookOpen className="mr-2" size={20} />
              Course Assignment
            </h3>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Select the courses to assign to this aspirant. Multiple courses can be assigned.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {publishedCourses.map((course) => (
                  <label
                    key={course.id}
                    className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      formData.assignedCourses.includes(course.id)
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.assignedCourses.includes(course.id)}
                      onChange={() => handleCourseToggle(course.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900">{course.title}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelBadgeColor(course.level)}`}>
                          {course.level}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{course.description}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock size={12} className="mr-1" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {formData.assignedCourses.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <BookOpen className="text-blue-600 mr-2" size={16} />
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        {formData.assignedCourses.length} course{formData.assignedCourses.length !== 1 ? 's' : ''} selected
                      </p>
                      <p className="text-sm text-blue-700">
                        {publishedCourses
                          .filter(course => formData.assignedCourses.includes(course.id))
                          .map(course => course.title)
                          .join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {formData.assignedCourses.length === 0 && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="text-yellow-600 mr-2" size={16} />
                    <p className="text-sm text-yellow-800">
                      No courses assigned. The aspirant can be assigned courses later from their profile.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Session & Work Status */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Clock className="mr-2" size={20} />
              Session & Work Status
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Session *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {['fulltime', 'morning-parttime', 'evening-parttime', 'remote'].map((session) => (
                    <label key={session} className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="session"
                        value={session}
                        checked={formData.session === session}
                        onChange={(e) => setFormData({ ...formData, session: e.target.value as any })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {getSessionLabel(session)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Currently Working *
                  </label>
                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="currentlyWorking"
                        value="yes"
                        checked={formData.currentlyWorking === 'yes'}
                        onChange={(e) => setFormData({ ...formData, currentlyWorking: e.target.value as 'yes' | 'no' })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="currentlyWorking"
                        value="no"
                        checked={formData.currentlyWorking === 'no'}
                        onChange={(e) => setFormData({ ...formData, currentlyWorking: e.target.value as 'yes' | 'no' })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">No</span>
                    </label>
                  </div>
                  {errors.currentlyWorking && <p className="mt-1 text-sm text-red-600">{errors.currentlyWorking}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    System Facility *
                  </label>
                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="systemFacility"
                        value="yes"
                        checked={formData.systemFacility === 'yes'}
                        onChange={(e) => setFormData({ ...formData, systemFacility: e.target.value as 'yes' | 'no' })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="systemFacility"
                        value="no"
                        checked={formData.systemFacility === 'no'}
                        onChange={(e) => setFormData({ ...formData, systemFacility: e.target.value as 'yes' | 'no' })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">No</span>
                    </label>
                  </div>
                  {errors.systemFacility && <p className="mt-1 text-sm text-red-600">{errors.systemFacility}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Branch Assignment */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <MapPin className="mr-2" size={20} />
              Branch Assignment
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign Branch *
              </label>
              <select
                value={formData.branchId}
                onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                className={`w-full px-4 py-2 border ${errors.branchId ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500`}
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
          </div>

          {!isEditMode && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Setup</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`flex-1 px-4 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500`}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Generate
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/aspirants')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Save size={20} className="mr-2" />
              Save Aspirant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AspirantForm;