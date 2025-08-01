import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Video, Save } from 'lucide-react';

interface Interview {
  id: string;
  week: number;
  aspirant: {
    id: string;
    name: string;
    branch: string;
    course: string;
  };
  mode: 'offline' | 'meet' | 'zoom';
  status: 'scheduled' | 'completed' | 'missed';
  interviewer: string;
  score?: number;
  feedback?: string;
  scheduledFor: string;
  meetingLink?: string;
}

const InterviewDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Sample data - would normally come from an API
  const interview: Interview = {
    id: id!,
    week: 1,
    aspirant: {
      id: '1',
      name: 'Mohammed Imran',
      branch: 'Ambur Central',
      course: 'Full Stack Development'
    },
    mode: 'meet',
    status: 'scheduled',
    interviewer: 'Abdul Rahman',
    scheduledFor: '2024-03-15T10:00:00Z',
    meetingLink: 'https://meet.google.com/abc-defg-hij'
  };

  const [score, setScore] = useState(interview.score || 0);
  const [feedback, setFeedback] = useState(interview.feedback || '');

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
      missed: 'bg-red-100 text-red-800'
    };
    return badges[status as keyof typeof badges];
  };

  const handleSubmit = () => {
    // Implement result submission logic here
    console.log('Submitting result:', { score, feedback });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard/interviews')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Interviews
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Interview Details */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Week {interview.week} Interview</h2>
                <div className="flex items-center mt-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    getStatusBadge(interview.status)
                  }`}>
                    {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Scheduled for {formatDate(interview.scheduledFor)}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center">
                {interview.mode === 'offline' ? (
                  <Users size={20} className="text-gray-500 mr-2" />
                ) : (
                  <Video size={20} className="text-gray-500 mr-2" />
                )}
                <span className="text-gray-700">
                  {interview.mode.charAt(0).toUpperCase() + interview.mode.slice(1)} Interview
                </span>
              </div>

              {interview.meetingLink && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium mb-2">Meeting Link</p>
                  <a
                    href={interview.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 break-all"
                  >
                    {interview.meetingLink}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Result Entry */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Interview Result</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Score (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={score}
                  onChange={(e) => setScore(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Feedback
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Add your feedback here..."
                />
              </div>

              <button
                onClick={handleSubmit}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Save size={20} className="mr-2" />
                Submit Result
              </button>
            </div>
          </div>
        </div>

        {/* Aspirant Info Sidebar */}
        <div className="bg-white rounded-xl shadow-md p-6 h-fit">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Aspirant Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Name</label>
              <p className="font-medium text-gray-900">{interview.aspirant.name}</p>
            </div>
            
            <div>
              <label className="text-sm text-gray-500">Branch</label>
              <p className="font-medium text-gray-900">{interview.aspirant.branch}</p>
            </div>
            
            <div>
              <label className="text-sm text-gray-500">Course</label>
              <p className="font-medium text-gray-900">{interview.aspirant.course}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Interviewer</label>
              <p className="font-medium text-gray-900">{interview.interviewer}</p>
            </div>

            <button
              onClick={() => navigate(`/dashboard/aspirants/${interview.aspirant.id}`)}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              View Aspirant Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewDetails