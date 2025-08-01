import React, { useState } from 'react';
import { Trophy, Zap, Target, Calendar, ArrowUp, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import DailyGoals from './DailyGoals';
import StreakRules from './StreakRules';
import StreakRestoration from './StreakRestoration';

const XPDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data
  const stats = {
    totalXP: 28450,
    currentStreak: 15,
    longestStreak: 30,
    weeklyGoalProgress: 85,
    weeklyXPTarget: 5000,
    weeklyXPEarned: 4250
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">XP & Streaks Management</h2>
        <button
          onClick={() => window.location.href = '/dashboard/xp/settings'}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          XP Settings
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Zap className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total XP Awarded</p>
              <p className="text-2xl font-bold text-gray-900">2.95M</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <Trophy className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Streaks</p>
              <p className="text-2xl font-bold text-gray-900">820</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center">
            <div className="bg-amber-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Broken Streaks</p>
              <p className="text-2xl font-bold text-gray-900">45</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <RefreshCw className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Restorations</p>
              <p className="text-2xl font-bold text-gray-900">₹45.6K</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center">
            <Target size={18} className="mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="restoration" className="flex items-center">
            <RefreshCw size={18} className="mr-2" />
            Streak Restoration
          </TabsTrigger>
          <TabsTrigger value="rules" className="flex items-center">
            <Trophy size={18} className="mr-2" />
            Rules & Goals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Weekly Progress */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Platform XP Progress (This Week)</h3>
              <div className="flex items-center text-green-600">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">+12% from last week</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total XP Earned This Week</span>
                <span className="font-medium">285,450 XP</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: '78%' }}
                />
              </div>
              <div className="text-sm text-gray-500">
                Target: 365,000 XP per week
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DailyGoals />
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab('restoration')}
                  className="w-full flex items-center justify-between p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                >
                  <div className="flex items-center">
                    <RefreshCw className="text-yellow-600 mr-3" size={20} />
                    <span className="font-medium text-yellow-800">Manage Streak Restorations</span>
                  </div>
                  <span className="text-sm text-yellow-600">45 pending</span>
                </button>
                
                <button
                  onClick={() => window.location.href = '/dashboard/xp/settings'}
                  className="w-full flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center">
                    <Target className="text-blue-600 mr-3" size={20} />
                    <span className="font-medium text-blue-800">Configure XP Settings</span>
                  </div>
                </button>
                
                <button
                  onClick={() => window.location.href = '/dashboard/reports'}
                  className="w-full flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <div className="flex items-center">
                    <Trophy className="text-green-600 mr-3" size={20} />
                    <span className="font-medium text-green-800">View XP Reports</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="restoration">
          <StreakRestoration />
        </TabsContent>

        <TabsContent value="rules">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DailyGoals />
            <StreakRules />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default XPDashboard;