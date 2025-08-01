import React, { useState } from 'react';
import { 
  Users, 
  UserCheck,
  Briefcase,
  Trophy,
  Building2,
  MonitorSmartphone,
  Award,
  Repeat2,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Filter
} from 'lucide-react';
import XPTrendChart from './XPTrendChart';
import DelayHeatmap from './DelayHeatmap';
import LeaderboardTable from './LeaderboardTable';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  progress?: {
    current: number;
    total: number;
    label?: string;
  };
  chart?: {
    data: number[];
    color: string;
  };
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon, 
  color, 
  subtitle, 
  trend, 
  progress,
  chart 
}) => {
  const renderMiniChart = () => {
    if (!chart) return null;
    
    const maxValue = Math.max(...chart.data);
    const points = chart.data.map((value, index) => {
      const x = (index / (chart.data.length - 1)) * 100;
      const y = 100 - (value / maxValue) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="absolute bottom-0 right-0 w-20 h-12 opacity-20">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            points={points}
          />
        </svg>
      </div>
    );
  };

  const renderProgress = () => {
    if (!progress) return null;
    
    const percentage = (progress.current / progress.total) * 100;
    
    return (
      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>{progress.label || 'Progress'}</span>
          <span>{progress.current}/{progress.total}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-white/30 to-white/60 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={`${color} rounded-xl shadow-lg p-6 text-white relative overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-xl`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white transform translate-x-8 -translate-y-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white transform -translate-x-4 translate-y-4" />
      </div>
      
      {/* Mini Chart */}
      {renderMiniChart()}
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
            {icon}
          </div>
          {trend && (
            <div className={`flex items-center text-sm font-medium ${
              trend.isPositive ? 'text-green-200' : 'text-red-200'
            }`}>
              {trend.isPositive ? (
                <ArrowUp size={16} className="mr-1" />
              ) : (
                <ArrowDown size={16} className="mr-1" />
              )}
              {trend.value}%
            </div>
          )}
        </div>
        
        <div>
          <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-white mb-1">{value}</p>
          {subtitle && (
            <p className="text-white/70 text-sm">{subtitle}</p>
          )}
        </div>
        
        {renderProgress()}
      </div>
    </div>
  );
};

const DashboardHome: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState('');
  const [dateRange, setDateRange] = useState('last-30-days');

  // Sample branch data
  const branches = [
    { id: 'ambur', name: 'Ambur Central' },
    { id: 'vaniyambadi', name: 'Vaniyambadi North' },
    { id: 'chennai', name: 'Chennai East' },
    { id: 'pernambut', name: 'Pernambut Tech Park' }
  ];

  // Sample data for different branches
  const branchData = {
    'ambur': {
      enrolled: 320,
      active: 280,
      jobReady: 95,
      placements: 82,
      availableSeats: 80,
      remote: 45,
      certificates: 78,
      restorations: 15
    },
    'vaniyambadi': {
      enrolled: 280,
      active: 240,
      jobReady: 78,
      placements: 65,
      availableSeats: 70,
      remote: 38,
      certificates: 62,
      restorations: 12
    },
    'chennai': {
      enrolled: 380,
      active: 320,
      jobReady: 110,
      placements: 95,
      availableSeats: 60,
      remote: 55,
      certificates: 98,
      restorations: 18
    },
    'pernambut': {
      enrolled: 270,
      active: 140,
      jobReady: 57,
      placements: 43,
      availableSeats: 30,
      remote: 37,
      certificates: 47,
      restorations: 8
    }
  };

  // Calculate data based on selected branch
  const getFilteredData = () => {
    if (!selectedBranch) {
      // Return aggregated data for all branches
      return {
        enrolled: 1250,
        active: 980,
        jobReady: 340,
        placements: 285,
        availableSeats: 240,
        remote: 175,
        certificates: 285,
        restorations: 53
      };
    }
    
    return branchData[selectedBranch as keyof typeof branchData] || branchData.ambur;
  };

  const data = getFilteredData();

  // Sample chart data for mini visualizations (would be filtered by branch in real app)
  const enrollmentTrend = selectedBranch ? [280, 290, 300, 310, 320] : [1100, 1150, 1200, 1220, 1250];
  const activeTrend = selectedBranch ? [240, 250, 260, 270, 280] : [850, 900, 920, 950, 980];
  const jobReadyTrend = selectedBranch ? [80, 85, 88, 92, 95] : [280, 300, 320, 330, 340];
  const placementTrend = selectedBranch ? [65, 70, 75, 78, 82] : [200, 230, 250, 270, 285];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
          {selectedBranch && (
            <p className="text-sm text-gray-600 mt-1">
              Viewing: <span className="font-medium">{branches.find(b => b.id === selectedBranch)?.name}</span>
            </p>
          )}
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select 
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white min-w-[200px]"
            >
              <option value="">All Branches</option>
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>
          </div>
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="last-7-days">Last 7 days</option>
            <option value="last-30-days">Last 30 days</option>
            <option value="last-90-days">Last 90 days</option>
            <option value="this-year">This year</option>
          </select>
          {selectedBranch && (
            <button
              onClick={() => setSelectedBranch('')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* First Row - Overall Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Enrolled"
          value={data.enrolled.toLocaleString()}
          icon={<Users size={24} />}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          trend={{ value: 8.2, isPositive: true }}
          chart={{ data: enrollmentTrend, color: 'white' }}
          progress={{ 
            current: data.enrolled, 
            total: selectedBranch ? 400 : 1500, 
            label: 'Capacity' 
          }}
        />
        <MetricCard
          title="Total Active"
          value={data.active.toLocaleString()}
          icon={<UserCheck size={24} />}
          color="bg-gradient-to-br from-green-500 to-green-600"
          trend={{ value: 5.4, isPositive: true }}
          chart={{ data: activeTrend, color: 'white' }}
          progress={{ 
            current: data.active, 
            total: data.enrolled, 
            label: 'Active Rate' 
          }}
        />
        <MetricCard
          title="Job Ready"
          value={data.jobReady.toLocaleString()}
          icon={<Briefcase size={24} />}
          color="bg-gradient-to-br from-amber-500 to-amber-600"
          trend={{ value: 12.3, isPositive: true }}
          chart={{ data: jobReadyTrend, color: 'white' }}
          progress={{ 
            current: data.jobReady, 
            total: data.active, 
            label: 'Of Active' 
          }}
        />
        <MetricCard
          title="Successful Placements"
          value={data.placements.toLocaleString()}
          icon={<Trophy size={24} />}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
          trend={{ value: 18.7, isPositive: true }}
          chart={{ data: placementTrend, color: 'white' }}
          progress={{ 
            current: data.placements, 
            total: data.jobReady, 
            label: 'Placement Rate' 
          }}
        />
      </div>

      {/* Second Row - Enrollment Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Active Aspirants"
          value={data.active.toLocaleString()}
          icon={<Users size={24} />}
          color="bg-gradient-to-br from-indigo-500 to-indigo-600"
          subtitle={`${Math.round(data.active * 0.84)} Full-Time • ${Math.round(data.active * 0.16)} Part-Time`}
          progress={{ 
            current: Math.round(data.active * 0.84), 
            total: data.active, 
            label: 'Full-Time Ratio' 
          }}
        />
        <MetricCard
          title="Available Seats"
          value={data.availableSeats.toLocaleString()}
          icon={<Building2 size={24} />}
          color="bg-gradient-to-br from-emerald-500 to-emerald-600"
          subtitle={`${Math.round(data.availableSeats * 0.75)} Full-Time • ${Math.round(data.availableSeats * 0.25)} Part-Time`}
          progress={{ 
            current: Math.round(data.availableSeats * 0.75), 
            total: data.availableSeats, 
            label: 'Full-Time Available' 
          }}
        />
        <MetricCard
          title="Remote Aspirants"
          value={data.remote.toLocaleString()}
          icon={<MonitorSmartphone size={24} />}
          color="bg-gradient-to-br from-rose-500 to-rose-600"
          subtitle={`${Math.round(data.remote * 0.71)} Full-Time • ${Math.round(data.remote * 0.29)} Part-Time`}
          progress={{ 
            current: Math.round(data.remote * 0.71), 
            total: data.remote, 
            label: 'Full-Time Remote' 
          }}
        />
      </div>

      {/* Third Row - Progress Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard
          title="Certificates Issued"
          value={data.certificates.toLocaleString()}
          icon={<Award size={24} />}
          color="bg-gradient-to-br from-amber-500 to-orange-500"
          subtitle="This month"
          trend={{ value: 15.2, isPositive: true }}
          progress={{ 
            current: data.certificates, 
            total: data.jobReady, 
            label: 'Of Job Ready' 
          }}
        />
        <MetricCard
          title="Streak Restorations"
          value={data.restorations.toLocaleString()}
          icon={<Repeat2 size={24} />}
          color="bg-gradient-to-br from-cyan-500 to-blue-500"
          subtitle="Total restorations"
          progress={{ 
            current: data.restorations * 25 * 100, 
            total: 60000, 
            label: `₹${(data.restorations * 25 * 100 / 1000).toFixed(1)}K Revenue` 
          }}
        />
      </div>

      {/* Branch-specific insights */}
      {selectedBranch && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {branches.find(b => b.id === selectedBranch)?.name} - Key Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800">Enrollment Rate</h4>
              <p className="text-2xl font-bold text-blue-900">
                {Math.round((data.enrolled / (selectedBranch === 'ambur' ? 400 : selectedBranch === 'chennai' ? 440 : 350)) * 100)}%
              </p>
              <p className="text-sm text-blue-600">of total capacity</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-800">Success Rate</h4>
              <p className="text-2xl font-bold text-green-900">
                {Math.round((data.placements / data.jobReady) * 100)}%
              </p>
              <p className="text-sm text-green-600">job placement rate</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-800">Engagement</h4>
              <p className="text-2xl font-bold text-purple-900">
                {Math.round((data.active / data.enrolled) * 100)}%
              </p>
              <p className="text-sm text-purple-600">active participation</p>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            XP Trend (Last 6 Weeks)
            {selectedBranch && (
              <span className="text-sm font-normal text-gray-600 ml-2">
                - {branches.find(b => b.id === selectedBranch)?.name}
              </span>
            )}
          </h3>
          <XPTrendChart />
        </div>
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Delay Heatmap
            {selectedBranch && (
              <span className="text-sm font-normal text-gray-600 ml-2">
                - {branches.find(b => b.id === selectedBranch)?.name}
              </span>
            )}
          </h3>
          <DelayHeatmap />
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="bg-white p-5 rounded-xl shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Top Aspirants
            {selectedBranch && (
              <span className="text-sm font-normal text-gray-600 ml-2">
                - {branches.find(b => b.id === selectedBranch)?.name}
              </span>
            )}
          </h3>
          <button className="text-sm text-indigo-600 hover:text-indigo-800">View All</button>
        </div>
        <LeaderboardTable />
      </div>
    </div>
  );
};

export default DashboardHome;