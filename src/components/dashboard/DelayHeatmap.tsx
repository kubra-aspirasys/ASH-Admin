import React from 'react';

interface DelayData {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

const DelayHeatmap: React.FC = () => {
  // Sample data for delay heatmap
  const delayData: DelayData[] = [
    { 
      label: '0-15 days', 
      count: 820, 
      percentage: 65.6, 
      color: 'bg-green-500' 
    },
    { 
      label: '16-30 days', 
      count: 320, 
      percentage: 25.6, 
      color: 'bg-yellow-400' 
    },
    { 
      label: '30+ days', 
      count: 110, 
      percentage: 8.8, 
      color: 'bg-red-500' 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Visual heatmap bar */}
      <div className="h-12 flex rounded-lg overflow-hidden">
        {delayData.map((item, index) => (
          <div 
            key={index}
            className={`${item.color} transition-all duration-500 ease-in-out hover:opacity-90`}
            style={{ width: `${item.percentage}%` }}
            title={`${item.label}: ${item.count} aspirants (${item.percentage}%)`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {delayData.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-4 h-4 rounded ${item.color} mr-2`}></div>
            <div>
              <p className="text-sm font-medium text-gray-800">{item.label}</p>
              <p className="text-xs text-gray-500">{item.count} aspirants ({item.percentage}%)</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DelayHeatmap;