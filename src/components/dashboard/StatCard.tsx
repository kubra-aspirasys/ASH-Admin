import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  // Format numbers over 1000 to K format
  const formatValue = (value: number): string => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toString();
  };

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`${color} rounded-lg p-3 mr-4`}>
            <div className="text-white">{icon}</div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{formatValue(value)}</h3>
          </div>
        </div>
      </div>
      <div className="h-1 bg-gray-100">
        <div className={`h-full ${color.replace('bg-', 'bg-')} w-2/3`}></div>
      </div>
    </div>
  );
};

export default StatCard;