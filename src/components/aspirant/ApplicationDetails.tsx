import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, User, Mail, Phone, GraduationCap, Clock, MapPin, BookOpen, Calendar, FileText, Edit2, Save, Key, Send, Copy, Eye, EyeOff, RefreshCw, Shield, Briefcase, Linkedin, Download, Upload } from 'lucide-react';

interface Application {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  mobileNumber: string;
  gender: 'male' | 'female';
  fatherName: string;
  fathersMobileNumber: string;
  lastGraduation: string;
  technology: string;
  linkedIn?: string;
  resume?: {
    name: string;
    url: string;
  };
  session: 'fulltime' | 'morning-parttime' | 'evening-parttime' | 'remote';
  currentlyWorking: 'yes' | 'no';
  systemFacility: 'yes' | 'no';
  preferredBranch: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

const ApplicationDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedApplication, setEditedApplication] = useState<Application | null>(null);
  
  // Password generation states
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [loginLinkSent, setLoginLinkSent] = useState(false);
  const [isGeneratingPassword, setIsGeneratingPassword] = useState(false);
  const [isSendingLogin, setIsSendingLogin] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  
  const [passwordOptions, setPasswordOptions] = useState<PasswordOptions>({
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true
  });

  // Sample data - would normally come from an API
  const [application, setApplication] = useState<Application>({
    id: id!,
    firstName: 'Mohammed',
    lastName: 'Imran',
    dateOfBirth: '1998-05-15',
    email: 'imran@example.com',
    mobileNumber: '+91 9876543210',
    gender: 'male',
    fatherName: 'Abdul Rahman',
    fathersMobileNumber: '+91 9876543211',
    lastGraduation: 'B.Tech Computer Science',
    technology: 'React JS',
    linkedIn: 'https://linkedin.com/in/mohammed-imran',
    resume: {
      name: 'Mohammed_Imran_Resume.pdf',
      url: '#'
    },
    session: 'fulltime',
    currentlyWorking: 'no',
    systemFacility: 'yes',
    preferredBranch: 'Ambur Central',
    submittedAt: '2024-03-15T10:30:00Z',
    status: 'pending'
  });

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

  const branches = [
    'Ambur Central',
    'Chennai East',
    'Vaniyambadi North',
    'Pernambut Tech Park'
  ];

  const getPasswordStrength = (password: string): PasswordStrength => {
    if (!password) return { score: 0, label: 'None', color: 'bg-gray-200' };

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const strengths: PasswordStrength[] = [
      { score: 0, label: 'Very Weak', color: 'bg-red-500' },
      { score: 1, label: 'Weak', color: 'bg-orange-500' },
      { score: 2, label: 'Fair', color: 'bg-yellow-500' },
      { score: 3, label: 'Good', color: 'bg-blue-500' },
      { score: 4, label: 'Strong', color: 'bg-green-500' },
      { score: 5, label: 'Very Strong', color: 'bg-emerald-500' }
    ];

    return strengths[score];
  };

  const generatePassword = () => {
    setIsGeneratingPassword(true);
    
    // Simulate password generation delay
    setTimeout(() => {
      const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const lowercase = 'abcdefghijklmnopqrstuvwxyz';
      const numbers = '0123456789';
      const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

      let chars = '';
      if (passwordOptions.includeUppercase) chars += uppercase;
      if (passwordOptions.includeLowercase) chars += lowercase;
      if (passwordOptions.includeNumbers) chars += numbers;
      if (passwordOptions.includeSymbols) chars += symbols;

      if (!chars) {
        chars = lowercase; // Fallback to lowercase if no options selected
      }

      let password = '';
      for (let i = 0; i < passwordOptions.length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
      }

      setGeneratedPassword(password);
      setShowPassword(true);
      setIsGeneratingPassword(false);
    }, 800);
  };

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setPasswordCopied(true);
      setTimeout(() => setPasswordCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  const sendLoginLink = async () => {
    if (!generatedPassword) {
      alert('Please generate a password first');
      return;
    }

    setIsSendingLogin(true);
    
    try {
      // Simulate API call to send login credentials
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const loginData = {
        email: application.email,
        password: generatedPassword,
        loginUrl: `${window.location.origin}/login`,
        aspirantName: `${application.firstName} ${application.lastName}`
      };

      console.log('Sending login credentials:', loginData);
      
      setLoginLinkSent(true);
      setTimeout(() => setLoginLinkSent(false), 5000);
    } catch (error) {
      alert('Failed to send login credentials. Please try again.');
    } finally {
      setIsSendingLogin(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateOfBirth = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  const getSessionLabel = (session: string) => {
    const labels = {
      'fulltime': 'Full Time',
      'morning-parttime': 'Morning Part Time',
      'evening-parttime': 'Evening Part Time',
      'remote': 'Remote'
    };
    return labels[session as keyof typeof labels];
  };

  const handleEditStart = () => {
    setEditedApplication({ ...application });
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setEditedApplication(null);
    setIsEditing(false);
  };

  const handleEditSave = () => {
    if (editedApplication) {
      setApplication(editedApplication);
      setIsEditing(false);
      setEditedApplication(null);
      console.log('Updated application:', editedApplication);
    }
  };

  const handleApproveClick = () => {
    setShowApprovalModal(true);
  };

  const handleFinalApproval = () => {
    if (!generatedPassword) {
      alert('Please generate a password first');
      return;
    }

    console.log('Approving application with final preferences and credentials:', {
      application: application,
      password: generatedPassword,
      loginCredentialsSent: loginLinkSent
    });
    
    setShowApprovalModal(false);
    setShowSuccessNotification(true);
    
    // Hide notification after 5 seconds
    setTimeout(() => {
      setShowSuccessNotification(false);
      navigate('/dashboard/aspirants');
    }, 5000);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) return;
    
    console.log('Rejecting application:', id, 'Reason:', rejectionReason);
    setShowRejectModal(false);
    navigate('/dashboard/aspirants/applications');
  };

  const currentApplication = editedApplication || application;
  const passwordStrength = getPasswordStrength(generatedPassword);

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard/aspirants/applications')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Applications
        </button>
        {application.status === 'pending' && (
          <div className="flex space-x-3">
            {!isEditing ? (
              <>
                <button
                  onClick={handleEditStart}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Edit2 size={20} className="mr-2" />
                  Edit Application
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <X size={20} className="mr-2" />
                  Reject
                </button>
                <button
                  onClick={handleApproveClick}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Check size={20} className="mr-2" />
                  Approve & Add to Platform
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEditCancel}
                  className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <X size={20} className="mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Save size={20} className="mr-2" />
                  Save Changes
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Application Header */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{application.firstName} {application.lastName}</h2>
                <div className="flex items-center mt-2">
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    getStatusBadge(application.status)
                  }`}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                  {isEditing && (
                    <span className="ml-2 px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                      Editing Application
                    </span>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  Submitted on {formatDate(application.submittedAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className={`bg-white rounded-xl shadow-md p-6 ${isEditing ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <User className="mr-2" size={20} />
              Personal Information
              {isEditing && <span className="ml-2 text-sm text-blue-600">(Editable)</span>}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentApplication.firstName}
                      onChange={(e) => setEditedApplication(prev => prev ? {
                        ...prev,
                        firstName: e.target.value
                      } : null)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter first name"
                    />
                  ) : (
                    <p className="font-medium text-gray-900">{currentApplication.firstName}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm text-gray-500">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentApplication.lastName}
                      onChange={(e) => setEditedApplication(prev => prev ? {
                        ...prev,
                        lastName: e.target.value
                      } : null)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter last name"
                    />
                  ) : (
                    <p className="font-medium text-gray-900">{currentApplication.lastName}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm text-gray-500">Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={formatDateForInput(currentApplication.dateOfBirth)}
                      onChange={(e) => setEditedApplication(prev => prev ? {
                        ...prev,
                        dateOfBirth: e.target.value
                      } : null)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="font-medium text-gray-900">{formatDateOfBirth(currentApplication.dateOfBirth)}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm text-gray-500">Gender</label>
                  {isEditing ? (
                    <div className="mt-1 space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={currentApplication.gender === 'male'}
                          onChange={(e) => setEditedApplication(prev => prev ? {
                            ...prev,
                            gender: e.target.value as 'male' | 'female'
                          } : null)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Male</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={currentApplication.gender === 'female'}
                          onChange={(e) => setEditedApplication(prev => prev ? {
                            ...prev,
                            gender: e.target.value as 'male' | 'female'
                          } : null)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Female</span>
                      </label>
                    </div>
                  ) : (
                    <p className="font-medium text-gray-900">{currentApplication.gender === 'male' ? 'Male' : 'Female'}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={currentApplication.email}
                      onChange={(e) => setEditedApplication(prev => prev ? {
                        ...prev,
                        email: e.target.value
                      } : null)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter email address"
                    />
                  ) : (
                    <div className="flex items-center">
                      <Mail size={16} className="text-gray-400 mr-2" />
                      <p className="font-medium text-gray-900">{currentApplication.email}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="text-sm text-gray-500">Mobile Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={currentApplication.mobileNumber}
                      onChange={(e) => setEditedApplication(prev => prev ? {
                        ...prev,
                        mobileNumber: e.target.value
                      } : null)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter mobile number"
                    />
                  ) : (
                    <div className="flex items-center">
                      <Phone size={16} className="text-gray-400 mr-2" />
                      <p className="font-medium text-gray-900">{currentApplication.mobileNumber}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Family Information */}
          <div className={`bg-white rounded-xl shadow-md p-6 ${isEditing ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <User className="mr-2" size={20} />
              Family Information
              {isEditing && <span className="ml-2 text-sm text-blue-600">(Editable)</span>}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Father's Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentApplication.fatherName}
                      onChange={(e) => setEditedApplication(prev => prev ? {
                        ...prev,
                        fatherName: e.target.value
                      } : null)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter father's name"
                    />
                  ) : (
                    <p className="font-medium text-gray-900">{currentApplication.fatherName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Father's Mobile Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={currentApplication.fathersMobileNumber}
                      onChange={(e) => setEditedApplication(prev => prev ? {
                        ...prev,
                        fathersMobileNumber: e.target.value
                      } : null)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter father's mobile number"
                    />
                  ) : (
                    <div className="flex items-center">
                      <Phone size={16} className="text-gray-400 mr-2" />
                      <p className="font-medium text-gray-900">{currentApplication.fathersMobileNumber}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Education & Technology */}
          <div className={`bg-white rounded-xl shadow-md p-6 ${isEditing ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <GraduationCap className="mr-2" size={20} />
              Education & Technology
              {isEditing && <span className="ml-2 text-sm text-blue-600">(Editable)</span>}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Last Graduation</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentApplication.lastGraduation}
                      onChange={(e) => setEditedApplication(prev => prev ? {
                        ...prev,
                        lastGraduation: e.target.value
                      } : null)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter last graduation"
                    />
                  ) : (
                    <p className="font-medium text-gray-900">{currentApplication.lastGraduation}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm text-gray-500">Technology</label>
                  {isEditing ? (
                    <select
                      value={currentApplication.technology}
                      onChange={(e) => setEditedApplication(prev => prev ? {
                        ...prev,
                        technology: e.target.value
                      } : null)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {technologies.map(tech => (
                        <option key={tech} value={tech}>{tech}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="font-medium text-gray-900">{currentApplication.technology}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">LinkedIn</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={currentApplication.linkedIn || ''}
                      onChange={(e) => setEditedApplication(prev => prev ? {
                        ...prev,
                        linkedIn: e.target.value
                      } : null)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter LinkedIn URL"
                    />
                  ) : (
                    currentApplication.linkedIn ? (
                      <div className="flex items-center">
                        <Linkedin size={16} className="text-gray-400 mr-2" />
                        <a 
                          href={currentApplication.linkedIn} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:text-blue-800"
                        >
                          {currentApplication.linkedIn}
                        </a>
                      </div>
                    ) : (
                      <p className="text-gray-500">Not provided</p>
                    )
                  )}
                </div>
                
                <div>
                  <label className="text-sm text-gray-500">Resume</label>
                  {isEditing ? (
                    <div className="flex items-center mt-1">
                      {currentApplication.resume && (
                        <div className="flex items-center mr-2 bg-gray-100 px-2 py-1 rounded">
                          <span className="text-sm text-gray-700 mr-2">{currentApplication.resume.name}</span>
                          <button 
                            type="button" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => setEditedApplication(prev => prev ? {
                              ...prev,
                              resume: undefined
                            } : null)}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}
                      <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-gray-700 flex items-center">
                        <Upload size={16} className="mr-2" />
                        <span>Change Resume</span>
                        <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                      </label>
                    </div>
                  ) : (
                    currentApplication.resume ? (
                      <div className="flex items-center">
                        <Download size={16} className="text-gray-400 mr-2" />
                        <a 
                          href={currentApplication.resume.url} 
                          className="font-medium text-blue-600 hover:text-blue-800"
                        >
                          {currentApplication.resume.name}
                        </a>
                      </div>
                    ) : (
                      <p className="text-gray-500">Not provided</p>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Session & Work Status */}
          <div className={`bg-white rounded-xl shadow-md p-6 ${isEditing ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Clock className="mr-2" size={20} />
              Session & Work Status
              {isEditing && <span className="ml-2 text-sm text-blue-600">(Editable)</span>}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Session</label>
                  {isEditing ? (
                    <div className="mt-1 space-y-2">
                      {[
                        { value: 'fulltime', label: 'Full Time' },
                        { value: 'morning-parttime', label: 'Morning Part Time' },
                        { value: 'evening-parttime', label: 'Evening Part Time' },
                        { value: 'remote', label: 'Remote' }
                      ].map(timing => (
                        <label key={timing.value} className="flex items-center">
                          <input
                            type="radio"
                            name="session"
                            value={timing.value}
                            checked={currentApplication.session === timing.value}
                            onChange={(e) => setEditedApplication(prev => prev ? {
                              ...prev,
                              session: e.target.value as Application['session']
                            } : null)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">{timing.label}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Clock size={16} className="text-gray-400 mr-2" />
                      <p className="font-medium text-gray-900">{getSessionLabel(currentApplication.session)}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Currently Working</label>
                  {isEditing ? (
                    <div className="mt-1 space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="currentlyWorking"
                          value="yes"
                          checked={currentApplication.currentlyWorking === 'yes'}
                          onChange={(e) => setEditedApplication(prev => prev ? {
                            ...prev,
                            currentlyWorking: e.target.value as 'yes' | 'no'
                          } : null)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="currentlyWorking"
                          value="no"
                          checked={currentApplication.currentlyWorking === 'no'}
                          onChange={(e) => setEditedApplication(prev => prev ? {
                            ...prev,
                            currentlyWorking: e.target.value as 'yes' | 'no'
                          } : null)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">No</span>
                      </label>
                    </div>
                  ) : (
                    <p className="font-medium text-gray-900">{currentApplication.currentlyWorking === 'yes' ? 'Yes' : 'No'}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm text-gray-500">System Facility</label>
                  {isEditing ? (
                    <div className="mt-1 space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="systemFacility"
                          value="yes"
                          checked={currentApplication.systemFacility === 'yes'}
                          onChange={(e) => setEditedApplication(prev => prev ? {
                            ...prev,
                            systemFacility: e.target.value as 'yes' | 'no'
                          } : null)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="systemFacility"
                          value="no"
                          checked={currentApplication.systemFacility === 'no'}
                          onChange={(e) => setEditedApplication(prev => prev ? {
                            ...prev,
                            systemFacility: e.target.value as 'yes' | 'no'
                          } : null)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">No</span>
                      </label>
                    </div>
                  ) : (
                    <p className="font-medium text-gray-900">{currentApplication.systemFacility === 'yes' ? 'Yes' : 'No'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Branch Preference */}
          <div className={`bg-white rounded-xl shadow-md p-6 ${isEditing ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <BookOpen className="mr-2" size={20} />
                Branch Preference
                {isEditing && <span className="ml-2 text-sm text-blue-600">(Editable)</span>}
              </h3>
              {!isEditing && application.status === 'pending' && (
                <button
                  onClick={handleEditStart}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                >
                  <Edit2 size={16} className="mr-1" />
                  Edit
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Preferred Branch</label>
                  {isEditing ? (
                    <select
                      value={currentApplication.preferredBranch}
                      onChange={(e) => setEditedApplication(prev => prev ? {
                        ...prev,
                        preferredBranch: e.target.value
                      } : null)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {branches.map(branch => (
                        <option key={branch} value={branch}>{branch}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center">
                      <MapPin size={16} className="text-gray-400 mr-2" />
                      <p className="font-medium text-gray-900">{currentApplication.preferredBranch}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> These changes will be applied when the aspirant is added to the platform. 
                  The original application data will be preserved for reference.
                </p>
              </div>
            )}
          </div>

          {/* Review History */}
          {(application.reviewedBy || application.rejectionReason) && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Review History</h3>
              
              <div className="space-y-4">
                {application.reviewedBy && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {application.status === 'approved' ? 'Approved' : 'Rejected'} by {application.reviewedBy}
                      </p>
                      {application.reviewedAt && (
                        <p className="text-sm text-gray-500">
                          {formatDate(application.reviewedAt)}
                        </p>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      getStatusBadge(application.status)
                    }`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>
                )}
                
                {application.rejectionReason && (
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
                    <p className="text-sm text-red-700">{application.rejectionReason}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Sidebar */}
        <div className="bg-white rounded-xl shadow-md p-6 h-fit">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Actions</h3>
          
          <div className="space-y-4">
            {application.status === 'pending' ? (
              <>
                {!isEditing ? (
                  <>
                    <button
                      onClick={handleEditStart}
                      className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Edit2 size={20} className="mr-2" />
                      Edit Application
                    </button>
                    
                    <button
                      onClick={handleApproveClick}
                      className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Check size={20} className="mr-2" />
                      Approve & Add to Platform
                    </button>
                    
                    <button
                      onClick={() => setShowRejectModal(true)}
                      className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <X size={20} className="mr-2" />
                      Reject Application
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleEditSave}
                      className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Save size={20} className="mr-2" />
                      Save Changes
                    </button>
                    
                    <button
                      onClick={handleEditCancel}
                      className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      <X size={20} className="mr-2" />
                      Cancel Editing
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">
                  This application has been {application.status}
                </p>
                {application.status === 'approved' && (
                  <button
                    onClick={() => navigate(`/dashboard/aspirants`)}
                    className="mt-2 text-indigo-600 hover:text-indigo-800"
                  >
                    View in Aspirants List
                  </button>
                )}
              </div>
            )}

            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-800 mb-2">
                {isEditing ? 'Updated Information' : 'Application Summary'}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Branch:</span>
                  <span className={`font-medium ${isEditing && currentApplication.preferredBranch !== application.preferredBranch ? 'text-blue-600' : ''}`}>
                    {currentApplication.preferredBranch}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Technology:</span>
                  <span className={`font-medium ${isEditing && currentApplication.technology !== application.technology ? 'text-blue-600' : ''}`}>
                    {currentApplication.technology}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Session:</span>
                  <span className={`font-medium ${isEditing && currentApplication.session !== application.session ? 'text-blue-600' : ''}`}>
                    {getSessionLabel(currentApplication.session)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Currently Working:</span>
                  <span className={`font-medium ${isEditing && currentApplication.currentlyWorking !== application.currentlyWorking ? 'text-blue-600' : ''}`}>
                    {currentApplication.currentlyWorking === 'yes' ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">System Facility:</span>
                  <span className={`font-medium ${isEditing && currentApplication.systemFacility !== application.systemFacility ? 'text-blue-600' : ''}`}>
                    {currentApplication.systemFacility === 'yes' ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
              
              {isEditing && (
                currentApplication.firstName !== application.firstName || 
                currentApplication.lastName !== application.lastName ||
                currentApplication.dateOfBirth !== application.dateOfBirth ||
                currentApplication.gender !== application.gender ||
                currentApplication.email !== application.email ||
                currentApplication.mobileNumber !== application.mobileNumber ||
                currentApplication.fatherName !== application.fatherName ||
                currentApplication.fathersMobileNumber !== application.fathersMobileNumber ||
                currentApplication.lastGraduation !== application.lastGraduation ||
                currentApplication.technology !== application.technology ||
                currentApplication.linkedIn !== application.linkedIn ||
                currentApplication.preferredBranch !== application.preferredBranch ||
                currentApplication.session !== application.session ||
                currentApplication.currentlyWorking !== application.currentlyWorking ||
                currentApplication.systemFacility !== application.systemFacility
              ) && (
                <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
                  <strong>Changes detected:</strong> Blue text indicates modified information
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Check size={32} className="text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Success!</h3>
            <p className="text-gray-600 mb-6">
              Password has been successfully generated and login credentials sent to the aspirant. You can manage the aspirant from Aspirant list.
            </p>
            <button
              onClick={() => {
                setShowSuccessNotification(false);
                navigate('/dashboard/aspirants');
              }}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Thank You
            </button>
          </div>
        </div>
      )}

      {/* Approval Modal with Password Generation */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Key className="mr-2" size={24} />
              Approve Application & Generate Login Credentials
            </h3>
            
            <div className="space-y-6">
              {/* Application Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Application Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <span className="ml-2 font-medium">{currentApplication.firstName} {currentApplication.lastName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <span className="ml-2 font-medium">{currentApplication.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Branch:</span>
                    <span className="ml-2 font-medium">{currentApplication.preferredBranch}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Technology:</span>
                    <span className="ml-2 font-medium">{currentApplication.technology}</span>
                  </div>
                </div>
              </div>

              {/* Password Generation */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">Generate Login Password</h4>
                
                {!generatedPassword ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="text-sm font-medium text-blue-800 mb-3">Password Options</h5>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-blue-700 mb-1">Length: {passwordOptions.length}</label>
                          <input
                            type="range"
                            min="8"
                            max="32"
                            value={passwordOptions.length}
                            onChange={(e) => setPasswordOptions({ ...passwordOptions, length: parseInt(e.target.value) })}
                            className="w-full"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={passwordOptions.includeUppercase}
                              onChange={(e) => setPasswordOptions({ ...passwordOptions, includeUppercase: e.target.checked })}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-blue-700">Uppercase</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={passwordOptions.includeLowercase}
                              onChange={(e) => setPasswordOptions({ ...passwordOptions, includeLowercase: e.target.checked })}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-blue-700">Lowercase</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={passwordOptions.includeNumbers}
                              onChange={(e) => setPasswordOptions({ ...passwordOptions, includeNumbers: e.target.checked })}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-blue-700">Numbers</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={passwordOptions.includeSymbols}
                              onChange={(e) => setPasswordOptions({ ...passwordOptions, includeSymbols: e.target.checked })}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-blue-700">Symbols</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={generatePassword}
                      disabled={isGeneratingPassword}
                      className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {isGeneratingPassword ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <RefreshCw size={20} className="mr-2" />
                          Generate Password & Add to Platform
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-sm font-medium text-green-800">Generated Password</h5>
                        <div className="flex items-center space-x-2">
                          <Shield size={14} className={`${passwordStrength.score >= 3 ? 'text-green-500' : 'text-gray-400'}`} />
                          <span className="text-xs font-medium text-green-700">
                            {passwordStrength.label}
                          </span>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={generatedPassword}
                          readOnly
                          className="w-full px-3 py-2 pr-20 bg-white border border-green-200 rounded-lg font-mono text-sm"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          <button
                            type="button"
                            onClick={copyPassword}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            {passwordCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                          </button>
                        </div>
                      </div>

                      <div className="mt-2">
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${passwordStrength.color} transition-all duration-300`}
                            style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={generatePassword}
                        className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        <RefreshCw size={16} className="mr-1" />
                        Regenerate
                      </button>
                      
                      <button
                        onClick={sendLoginLink}
                        disabled={isSendingLogin}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isSendingLogin ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={16} className="mr-2" />
                            Send Login Credentials
                          </>
                        )}
                      </button>
                    </div>

                    {loginLinkSent && (
                      <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                        <div className="flex items-center">
                          <Check className="text-green-500 mr-2" size={16} />
                          <span className="text-sm text-green-800 font-medium">
                            Login credentials sent successfully to {application.email}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowApprovalModal(false);
                    setGeneratedPassword('');
                    setLoginLinkSent(false);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinalApproval}
                  disabled={!generatedPassword}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Complete Approval & Add to Platform
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Reject Application</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Rejection
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  placeholder="Please provide a reason for rejection..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  disabled={!rejectionReason.trim()}
                >
                  Reject Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetails;