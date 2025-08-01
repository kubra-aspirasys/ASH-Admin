import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Save, User, Mail, Phone, GraduationCap, Clock, MapPin, BookOpen, Upload, Calendar, Briefcase, Linkedin } from 'lucide-react';

interface ApplicationFormData {
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
  preferredBranch: string;
}

const ApplicationForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ApplicationFormData>({
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
    preferredBranch: ''
  });

  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = 'Mobile number is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.fatherName.trim()) newErrors.fatherName = 'Father name is required';
    if (!formData.fathersMobileNumber.trim()) newErrors.fathersMobileNumber = 'Father\'s mobile number is required';
    if (!formData.lastGraduation.trim()) newErrors.lastGraduation = 'Last graduation is required';
    if (!formData.technology) newErrors.technology = 'Technology selection is required';
    if (!formData.currentlyWorking) newErrors.currentlyWorking = 'Currently working status is required';
    if (!formData.systemFacility) newErrors.systemFacility = 'System facility preference is required';
    if (!formData.preferredBranch) newErrors.preferredBranch = 'Preferred branch is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Application submitted:', formData);
      alert('Application submitted successfully! You will receive a confirmation email shortly.');
      navigate('/dashboard/aspirants/applications');
    } catch (error) {
      alert('Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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

  const getSessionLabel = (session: string) => {
    const labels = {
      'fulltime': 'Full Time',
      'morning-parttime': 'Morning Part Time',
      'evening-parttime': 'Evening Part Time',
      'remote': 'Remote'
    };
    return labels[session as keyof typeof labels];
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard/aspirants/applications')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Applications
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AspiraSys Application Form</h1>
          <p className="text-gray-600">Join our technology training programs and kickstart your career</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <User className="mr-2" size={24} />
              Personal Information
            </h2>
            
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
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <User className="mr-2" size={24} />
              Family Information
            </h2>
            
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
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <GraduationCap className="mr-2" size={24} />
              Education & Technology
            </h2>
            
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

          {/* Session & Work Status */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Clock className="mr-2" size={24} />
              Session & Work Status
            </h2>
            
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

          {/* Branch Preference */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <MapPin className="mr-2" size={24} />
              Branch Preference
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Branch *
              </label>
              <select
                value={formData.preferredBranch}
                onChange={(e) => setFormData({ ...formData, preferredBranch: e.target.value })}
                className={`w-full px-4 py-2 border ${errors.preferredBranch ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500`}
              >
                <option value="">Select preferred branch</option>
                {branches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
              {errors.preferredBranch && <p className="mt-1 text-sm text-red-600">{errors.preferredBranch}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/aspirants/applications')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={20} className="mr-2" />
                  Submit Application
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;