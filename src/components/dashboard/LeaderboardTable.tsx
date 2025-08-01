import React from 'react';
import { Trophy } from 'lucide-react';

interface Aspirant {
  rank: number;
  name: string;
  branch: string;
  xp: number;
}

const LeaderboardTable: React.FC = () => {
  // Sample data for leaderboard
  const aspirants: Aspirant[] = [
    { rank: 1, name: 'Mohammed Imran', branch: 'Ambur Central', xp: 28450 },
    { rank: 2, name: 'Fatima Zahra', branch: 'Vaniyambadi North', xp: 27820 },
    { rank: 3, name: 'Abdul Rahman', branch: 'Pernambut Tech Park', xp: 26540 },
    { rank: 4, name: 'Ayesha Siddiqui', branch: 'Chennai East', xp: 25780 },
    { rank: 5, name: 'Omar Farooq', branch: 'Chennai Central', xp: 24950 },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rank
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Branch
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              XP
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {aspirants.map((aspirant) => (
            <tr 
              key={aspirant.rank} 
              className={`hover:bg-gray-50 transition-colors ${aspirant.rank === 1 ? 'bg-amber-50' : ''}`}
            >
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {aspirant.rank === 1 ? (
                    <div className="mr-1 text-amber-500">
                      <Trophy size={18} />
                    </div>
                  ) : (
                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 mr-1">
                      <span className="text-xs font-medium">{aspirant.rank}</span>
                    </div>
                  )}
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{aspirant.name}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{aspirant.branch}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-right">
                <div className={`text-sm font-medium ${aspirant.rank === 1 ? 'text-amber-600' : 'text-gray-900'}`}>
                  {aspirant.xp.toLocaleString()}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;