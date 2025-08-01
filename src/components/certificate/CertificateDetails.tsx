import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, X, Download, Award, BookOpen, Calendar, Github, ExternalLink, Star } from 'lucide-react';

interface Certificate {
  id: string;
  aspirant: {
    id: string;
    name: string;
    email: string;
    branch: string;
    course: string;
  };
  course: {
    id: string;
    name: string;
    totalVideos: number;
    completedVideos: number;
  };
  capstone: {
    title: string;
    githubUrl: string;
    demoUrl: string;
    rating: number;
    status: 'approved' | 'pending';
  };
  completionDate: string;
  status: 'pending' | 'approved' | 'rejected';
  certificateId?: string;
  rejectionReason?: string;
}

const CertificateDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const showApproveModal = searchParams.get('action') === 'approve';
  const showRejectModal = searchParams.get('action') === 'reject';

  const [rejectionReason, setRejectionReason] = useState('');

  // Sample data - would normally come from an API
  const certificate: Certificate = {
    id: id!,
    aspirant: {
      id: '1',
      name: 'Mohammed Imran',
      email: 'imran@example.com',
      branch: 'Ambur Central',
      course: 'Full Stack Development'
    },
    course: {
      id: '1',
      name: 'Full Stack Development',
      totalVideos: 48,
      completedVideos: 48
    },
    capstone: {
      title: 'E-Commerce Platform',
      githubUrl: 'https://github.com/example/project',
      demoUrl: 'https://project-demo.netlify.app',
      rating: 4,
      status: 'approved'
    },
    completionDate: '2024-03-10T15:30:00Z',
    status: 'pending'
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

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return badges[status as keyof typeof badges];
  };

  const handleApprove = () => {
    // Implement approval logic here
    console.log('Approving certificate:', id);
    navigate('/dashboard/certificates');
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) return;
    
    // Implement rejection logic here
    console.log('Rejecting certificate:', id, 'Reason:', rejectionReason);
    navigate('/dashboard/certificates');
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
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard/certificates')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Certificates
        </button>
        {certificate.status === 'pending' && (
          <div className="flex space-x-3">
            <button
              onClick={() => navigate(`/dashboard/certificates/${id}?action=approve`)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Check size={20} className="mr-2" />
              Approve
            </button>
            <button
              onClick={() => navigate(`/dashboard/certificates/${id}?action=reject`)}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <X size={20} className="mr-2" />
              Reject
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Course Progress */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Progress</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BookOpen size={20} className="text-indigo-600 mr-2" />
                  <span className="font-medium text-gray-900">{certificate.course.name}</span>
                </div>
                <span className="text-sm text-gray-500">
                  Completed on {formatDate(certificate.completionDate)}
                </span>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">Video Progress</span>
                  <span>{certificate.course.completedVideos}/{certificate.course.totalVideos} completed</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${(certificate.course.completedVideos / certificate.course.totalVideos) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Capstone Project */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Capstone Project</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">{certificate.capstone.title}</h4>
                <div className="flex items-center mt-2">
                  {renderStars(certificate.capstone.rating)}
                  <span className="ml-2 text-sm text-gray-500">
                    {certificate.capstone.rating}/5 rating
                  </span>
                </div>
              </div>

              <div className="flex space-x-4">
                <a
                  href={certificate.capstone.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                >
                  <Github size={20} className="mr-2" />
                  View Code
                </a>
                <a
                  href={certificate.capstone.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <ExternalLink size={20} className="mr-2" />
                  View Demo
                </a>
              </div>

              <div className="mt-4">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  certificate.capstone.status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  Capstone {certificate.capstone.status.charAt(0).toUpperCase() + certificate.capstone.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Certificate Preview */}
          {certificate.status === 'approved' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Certificate</h3>
                <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  <Download size={20} className="mr-2" />
                  Download PDF
                </button>
              </div>

              <div className="border rounded-lg p-8 text-center space-y-4">
                <div className="flex justify-center mb-6">
                  <Award size={48} className="text-indigo-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Certificate of Completion</h2>
                <p className="text-lg text-gray-700">
                  This certifies that
                </p>
                <p className="text-2xl font-bold text-indigo-600">
                  {certificate.aspirant.name}
                </p>
                <p className="text-lg text-gray-700">
                  has successfully completed the
                </p>
                <p className="text-xl font-semibold text-gray-900">
                  {certificate.course.name}
                </p>
                <p className="text-lg text-gray-700">
                  on {new Date(certificate.completionDate).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                {certificate.certificateId && (
                  <p className="text-sm text-gray-500 mt-6">
                    Certificate ID: {certificate.certificateId}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Aspirant Info Sidebar */}
        <div className="bg-white rounded-xl shadow-md p-6 h-fit">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Aspirant Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Name</label>
              <p className="font-medium text-gray-900">{certificate.aspirant.name}</p>
            </div>
            
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="font-medium text-gray-900">{certificate.aspirant.email}</p>
            </div>
            
            <div>
              <label className="text-sm text-gray-500">Branch</label>
              <p className="font-medium text-gray-900">{certificate.aspirant.branch}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Certificate Status</label>
              <div className="mt-1">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  getStatusBadge(certificate.status)
                }`}>
                  {certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1)}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/dashboard/aspirants/${certificate.aspirant.id}`)}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              View Aspirant Profile
            </button>
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Approve Certificate</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to approve this certificate? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => navigate(`/dashboard/certificates/${id}`)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Approve Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Reject Certificate</h3>
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
                  placeholder="Please provide a reason..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => navigate(`/dashboard/certificates/${id}`)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  disabled={!rejectionReason.trim()}
                >
                  Reject Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateDetails;