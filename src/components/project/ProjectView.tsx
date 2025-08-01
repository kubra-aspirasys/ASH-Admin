import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Github, ExternalLink, Check, X, Upload, Paperclip, Target } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  aspirant: {
    id: string;
    name: string;
    branch: string;
    course: string;
  };
  githubUrl: string;
  netlifyUrl: string;
  submittedAt: string;
  rating: number;
  status: 'pending' | 'approved' | 'resubmitted';
  feedback?: string;
}

const ProjectView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Sample data - would normally come from an API
  const project: Project = {
    id: id!,
    title: 'E-Commerce Platform',
    description: 'A comprehensive full-stack e-commerce platform built with React, Node.js, and MongoDB. Features include user authentication, product catalog, shopping cart, order management, payment integration, and admin dashboard for inventory management.',
    aspirant: {
      id: '1',
      name: 'Mohammed Imran',
      branch: 'Ambur Central',
      course: 'Full Stack Development'
    },
    githubUrl: 'https://github.com/example/project1',
    netlifyUrl: 'https://project1.netlify.app',
    submittedAt: '2024-03-10T15:30:00Z',
    rating: 4,
    status: 'pending'
  };

  const [rating, setRating] = useState(project.rating);
  const [notes, setNotes] = useState(project.feedback || '');
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [isRatingHovered, setIsRatingHovered] = useState(false);
  const [showResubmitModal, setShowResubmitModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackDocument, setFeedbackDocument] = useState<File | null>(null);

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

  const handleApprove = () => {
    // Implement approval logic here
    console.log('Approving project:', id);
    console.log('Rating:', rating);
    console.log('Notes:', notes);
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

  const handleResubmit = () => {
    if (!feedback.trim()) return;
    
    // Here you would typically update the project status and send feedback
    console.log('Requesting resubmission for project:', id);
    console.log('Feedback:', feedback);
    if (feedbackDocument) {
      console.log('Feedback document:', feedbackDocument.name, feedbackDocument.size);
    }
    
    setShowResubmitModal(false);
    setFeedback('');
    setFeedbackDocument(null);
  };

  const getRatingLabel = (rating: number): string => {
    const labels = {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    return labels[rating as keyof typeof labels] || '';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard/projects')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Capstone Projects
        </button>
        {project.status === 'pending' && (
          <div className="flex space-x-3">
            <button
              onClick={() => setShowResubmitModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <X size={20} className="mr-2" />
              Request Resubmission
            </button>
            <button
              onClick={handleApprove}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Check size={20} className="mr-2" />
              Approve
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Project Details */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{project.title}</h2>
                <div className="flex items-center mt-2">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                    Capstone Project
                  </span>
                  <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                    getStatusBadge(project.status)
                  }`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Submitted on {formatDate(project.submittedAt)}
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-600">{project.description}</p>
            </div>

            <div className="mt-6 flex space-x-4">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
              >
                <Github size={20} className="mr-2" />
                View Code
              </a>
              <a
                href={project.netlifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <ExternalLink size={20} className="mr-2" />
                View Demo
              </a>
            </div>
          </div>

          {/* Admin Review Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Admin Review</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <div 
                  className="relative"
                  onMouseEnter={() => setIsRatingHovered(true)}
                  onMouseLeave={() => {
                    setIsRatingHovered(false);
                    setHoveredStar(null);
                  }}
                >
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(null)}
                        className="group relative p-1 focus:outline-none"
                      >
                        <Star
                          size={24}
                          className={`transform transition-all duration-200 ${
                            star <= (hoveredStar ?? rating)
                              ? 'text-yellow-400 fill-current scale-110'
                              : 'text-gray-300 group-hover:scale-105'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {isRatingHovered && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-sm rounded shadow-lg transition-opacity duration-200">
                      {hoveredStar ? getRatingLabel(hoveredStar) : getRatingLabel(rating)}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Add your review notes here..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Aspirant Info Sidebar */}
        <div className="bg-white rounded-xl shadow-md p-6 h-fit">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Aspirant Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Name</label>
              <p className="font-medium text-gray-900">{project.aspirant.name}</p>
            </div>
            
            <div>
              <label className="text-sm text-gray-500">Branch</label>
              <p className="font-medium text-gray-900">{project.aspirant.branch}</p>
            </div>
            
            <div>
              <label className="text-sm text-gray-500">Course</label>
              <p className="font-medium text-gray-900">{project.aspirant.course}</p>
            </div>

            <button
              onClick={() => navigate(`/dashboard/aspirants/${project.aspirant.id}`)}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              View Aspirant Profile
            </button>
          </div>
        </div>
      </div>

      {/* Resubmission Modal */}
      {showResubmitModal && (
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
                    setShowResubmitModal(false);
                    setFeedback('');
                    setFeedbackDocument(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResubmit}
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

export default ProjectView;