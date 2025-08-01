import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const XPTrendChart: React.FC = () => {
  // Sample data for XP over last 6 weeks
  const data = [
    { week: 'Week 1', xp: 45000 },
    { week: 'Week 2', xp: 52000 },
    { week: 'Week 3', xp: 49000 },
    { week: 'Week 4', xp: 63000 },
    { week: 'Week 5', xp: 58000 },
    { week: 'Week 6', xp: 72000 },
  ];

  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `${value / 1000}k`;
    }
    return value;
  };

  const formatTooltip = (value: number) => {
    return `${value.toLocaleString()} XP`;
  };

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="week" 
            axisLine={false} 
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            tickFormatter={formatYAxis}
          />
          <Tooltip 
            formatter={formatTooltip}
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
          />
          <Bar 
            dataKey="xp" 
            fill="#4F46E5" 
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default XPTrendChart;