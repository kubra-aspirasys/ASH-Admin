import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Users, Trophy, Target, FolderKanban, Clock } from 'lucide-react';

interface TopAspirant {
  name: string;
  xp: number;
  rank: number;
  batch: 'Full-Time' | 'Evening';
}

const BranchDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Sample data - would normally come from an API
  const branchData = {
    id,
    name: 'Ambur Central',
    location: 'Ambur',
    admin: {
      name: 'Mohammed Imran',
      email: 'admin.ambur@aspirasys.com'
    },
    seats: {
      total: 200,
      fullTime: 150,
      evening: 50
    },
    enrollment: {
      total: 145,
      fullTime: 110,
      evening: 35
    },
    stats: {
      totalXP: 285000,
      projectSubmissions: 89,
      capstoneSubmissions: 12
    },
    topAspirants: [
      { name: 'Fatima Zahra', xp: 12450, rank: 1, batch: 'Full-Time' as const },
      { name: 'Abdul Rahman', xp: 11820, rank: 2, batch: 'Evening' as const },
      { name: 'Ayesha Siddiqui', xp: 10940, rank: 3, batch: 'Full-Time' as const }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard/branches')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Branches
        </button>
        <button
          onClick={() => navigate(`/dashboard/branches/${id}/edit`)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Edit2 size={20} className="mr-2" />
          Edit Branch
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{branchData.name}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Branch Information</h3>
            <div className="space-y-2">
              <p className="text-gray-600">Location: {branchData.location}</p>
              <div>
                <p className="text-gray-600">Branch Admin:</p>
                <p className="font-medium">{branchData.admin.name}</p>
                <p className="text-gray-500">{branchData.admin.email}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Seat Distribution</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Seats:</span>
                <span className="font-medium">{branchData.seats.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Full-Time Seats:</span>
                <span className="font-medium">{branchData.seats.fullTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Evening Batch Seats:</span>
                <span className="font-medium">{branchData.seats.evening}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Users className="text-indigo-600 mr-2" size={20} />
              <h4 className="text-sm font-medium text-gray-600">Total Enrollment</h4>
            </div>
            <p className="text-2xl font-bold text-indigo-600">{branchData.enrollment.total}</p>
            <div className="mt-2 text-sm">
              <p className="text-gray-500">Full-Time: {branchData.enrollment.fullTime}</p>
              <p className="text-gray-500">Evening: {branchData.enrollment.evening}</p>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Trophy className="text-emerald-600 mr-2" size={20} />
              <h4 className="text-sm font-medium text-gray-600">Total XP</h4>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{branchData.stats.totalXP.toLocaleString()}</p>
          </div>

          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Target className="text-amber-600 mr-2" size={20} />
              <h4 className="text-sm font-medium text-gray-600">Projects Submitted</h4>
            </div>
            <p className="text-2xl font-bold text-amber-600">{branchData.stats.projectSubmissions}</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <FolderKanban className="text-purple-600 mr-2" size={20} />
              <h4 className="text-sm font-medium text-gray-600">Capstone Submissions</h4>
            </div>
            <p className="text-2xl font-bold text-purple-600">{branchData.stats.capstoneSubmissions}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Top Performers</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            {branchData.topAspirants.map((aspirant, index) => (
              <div
                key={index}
                className={`flex items-center justify-between py-3 ${
                  index !== branchData.topAspirants.length - 1 ? 'border-b border-gray-200' : ''
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-amber-100 text-amber-600' :
                    index === 1 ? 'bg-gray-100 text-gray-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{aspirant.name}</p>
                    <p className="text-sm text-gray-500">{aspirant.batch}</p>
                  </div>
                </div>
                <span className="text-gray-600">{aspirant.xp.toLocaleString()} XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchDetails;