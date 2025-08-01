import React from 'react';
import { Target, Trophy, Calendar, CheckCircle } from 'lucide-react';

const DailyGoals: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Daily Goals</h2>
        <Target className="w-6 h-6 text-indigo-600" />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-medium text-gray-700">Complete 3 Lessons</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">2/3</span>
            <div className="w-20 h-2 bg-gray-200 rounded-full">
              <div className="w-2/3 h-full bg-yellow-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-green-500" />
            <span className="font-medium text-gray-700">Study Time</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">45/60 min</span>
            <div className="w-20 h-2 bg-gray-200 rounded-full">
              <div className="w-3/4 h-full bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-blue-500" />
            <span className="font-medium text-gray-700">Practice Problems</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">5/5</span>
            <div className="w-20 h-2 bg-gray-200 rounded-full">
              <div className="w-full h-full bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <button className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200">
        View All Goals
      </button>
    </div>
  );
};

export default DailyGoals;