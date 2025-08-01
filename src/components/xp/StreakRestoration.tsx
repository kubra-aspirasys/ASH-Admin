import React, { useState } from 'react';
import { Search, RefreshCw, Check, X, Calendar, Users, CreditCard, Filter } from 'lucide-react';

interface AspirantStreak {
  id: string;
  name: string;
  email: string;
  branch: string;
  currentStreak: number;
  lastActiveDate: string;
  daysBroken: number;
  streakFreezes: number;
  maxFreezes: number;
}

interface RestoreRequest {
  aspirantId: string;
  daysToRestore: number;
  reason: string;
  paymentRequired: boolean;
  amount?: number;
}

const StreakRestoration: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedAspirants, setSelectedAspirants] = useState<string[]>([]);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [restoreRequest, setRestoreRequest] = useState<RestoreRequest>({
    aspirantId: '',
    daysToRestore: 1,
    reason: '',
    paymentRequired: false
  });

  // Sample data with more aspirants from different branches
  const aspirants: AspirantStreak[] = [
    {
      id: '1',
      name: 'Mohammed Imran',
      email: 'imran@example.com',
      branch: 'Ambur Central',
      currentStreak: 0,
      lastActiveDate: '2024-03-10',
      daysBroken: 3,
      streakFreezes: 1,
      maxFreezes: 2
    },
    {
      id: '2',
      name: 'Fatima Zahra',
      email: 'fatima@example.com',
      branch: 'Vaniyambadi North',
      currentStreak: 0,
      lastActiveDate: '2024-03-08',
      daysBroken: 5,
      streakFreezes: 0,
      maxFreezes: 2
    },
    {
      id: '3',
      name: 'Abdul Rahman',
      email: 'abdul@example.com',
      branch: 'Chennai East',
      currentStreak: 15,
      lastActiveDate: '2024-03-14',
      daysBroken: 0,
      streakFreezes: 2,
      maxFreezes: 2
    },
    {
      id: '4',
      name: 'Ayesha Siddiqui',
      email: 'ayesha@example.com',
      branch: 'Ambur Central',
      currentStreak: 0,
      lastActiveDate: '2024-03-09',
      daysBroken: 4,
      streakFreezes: 1,
      maxFreezes: 2
    },
    {
      id: '5',
      name: 'Omar Farooq',
      email: 'omar@example.com',
      branch: 'Pernambut Tech Park',
      currentStreak: 22,
      lastActiveDate: '2024-03-14',
      daysBroken: 0,
      streakFreezes: 0,
      maxFreezes: 2
    },
    {
      id: '6',
      name: 'Zainab Ali',
      email: 'zainab@example.com',
      branch: 'Chennai East',
      currentStreak: 0,
      lastActiveDate: '2024-03-07',
      daysBroken: 6,
      streakFreezes: 0,
      maxFreezes: 2
    },
    {
      id: '7',
      name: 'Hassan Ahmed',
      email: 'hassan@example.com',
      branch: 'Vaniyambadi North',
      currentStreak: 8,
      lastActiveDate: '2024-03-14',
      daysBroken: 0,
      streakFreezes: 1,
      maxFreezes: 2
    },
    {
      id: '8',
      name: 'Mariam Khan',
      email: 'mariam@example.com',
      branch: 'Pernambut Tech Park',
      currentStreak: 0,
      lastActiveDate: '2024-03-11',
      daysBroken: 2,
      streakFreezes: 2,
      maxFreezes: 2
    }
  ];

  // Get unique branches for filter dropdown
  const branches = Array.from(new Set(aspirants.map(a => a.branch))).sort();

  const filteredAspirants = aspirants.filter(aspirant => {
    const matchesSearch = aspirant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aspirant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aspirant.branch.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBranch = !selectedBranch || aspirant.branch === selectedBranch;
    
    return matchesSearch && matchesBranch;
  });

  const brokenStreakAspirants = filteredAspirants.filter(a => a.daysBroken > 0);

  const handleSelectAspirant = (aspirantId: string) => {
    setSelectedAspirants(prev =>
      prev.includes(aspirantId)
        ? prev.filter(id => id !== aspirantId)
        : [...prev, aspirantId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAspirants.length === brokenStreakAspirants.length) {
      setSelectedAspirants([]);
    } else {
      setSelectedAspirants(brokenStreakAspirants.map(a => a.id));
    }
  };

  const openRestoreModal = (aspirantId?: string) => {
    if (aspirantId) {
      setRestoreRequest({
        aspirantId,
        daysToRestore: 1,
        reason: '',
        paymentRequired: false
      });
    } else {
      setRestoreRequest({
        aspirantId: '',
        daysToRestore: 1,
        reason: '',
        paymentRequired: false
      });
    }
    setShowRestoreModal(true);
  };

  const handleBulkRestore = () => {
    if (selectedAspirants.length === 0) return;
    openRestoreModal();
  };

  const calculateAmount = (days: number) => {
    const costPerDay = 25; // This should come from settings
    return days * costPerDay;
  };

  const handleRestoreSubmit = () => {
    if (!restoreRequest.reason.trim()) {
      alert('Please provide a reason for streak restoration');
      return;
    }

    const amount = restoreRequest.paymentRequired ? calculateAmount(restoreRequest.daysToRestore) : 0;
    
    console.log('Restoring streak:', {
      ...restoreRequest,
      amount,
      aspirantIds: restoreRequest.aspirantId ? [restoreRequest.aspirantId] : selectedAspirants
    });

    setShowRestoreModal(false);
    setSelectedAspirants([]);
    setRestoreRequest({
      aspirantId: '',
      daysToRestore: 1,
      reason: '',
      paymentRequired: false
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysSinceLastActive = (lastActiveDate: string) => {
    const today = new Date();
    const lastActive = new Date(lastActiveDate);
    const diffTime = Math.abs(today.getTime() - lastActive.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Calculate branch-specific stats
  const branchStats = {
    totalAspirants: filteredAspirants.length,
    brokenStreaks: brokenStreakAspirants.length,
    activeStreaks: filteredAspirants.filter(a => a.currentStreak > 0).length,
    averageStreak: filteredAspirants.filter(a => a.currentStreak > 0).length > 0 
      ? Math.round(filteredAspirants.filter(a => a.currentStreak > 0).reduce((sum, a) => sum + a.currentStreak, 0) / filteredAspirants.filter(a => a.currentStreak > 0).length)
      : 0
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Streak Restoration Management</h3>
          {selectedBranch && (
            <p className="text-sm text-gray-600 mt-1">
              Viewing: <span className="font-medium">{selectedBranch}</span>
            </p>
          )}
        </div>
        <div className="flex space-x-3">
          {selectedAspirants.length > 0 && (
            <button
              onClick={handleBulkRestore}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <RefreshCw size={18} className="mr-2" />
              Restore Selected ({selectedAspirants.length})
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search aspirants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="relative">
          <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
          >
            <option value="">All Branches</option>
            {branches.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedBranch('');
              setSelectedAspirants([]);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Branch Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Users className="text-blue-600 mr-2" size={20} />
            <div>
              <p className="text-sm text-blue-600">Total Aspirants</p>
              <p className="text-xl font-bold text-blue-800">{branchStats.totalAspirants}</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <X className="text-red-600 mr-2" size={20} />
            <div>
              <p className="text-sm text-red-600">Broken Streaks</p>
              <p className="text-xl font-bold text-red-800">{branchStats.brokenStreaks}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Check className="text-green-600 mr-2" size={20} />
            <div>
              <p className="text-sm text-green-600">Active Streaks</p>
              <p className="text-xl font-bold text-green-800">{branchStats.activeStreaks}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <RefreshCw className="text-purple-600 mr-2" size={20} />
            <div>
              <p className="text-sm text-purple-600">Avg. Streak</p>
              <p className="text-xl font-bold text-purple-800">
                {branchStats.averageStreak > 0 ? `${branchStats.averageStreak} days` : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Aspirants Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {brokenStreakAspirants.length > 0 && (
          <div className="p-4 border-b border-gray-200 bg-yellow-50">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedAspirants.length === brokenStreakAspirants.length && brokenStreakAspirants.length > 0}
                onChange={handleSelectAll}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Select All Broken Streaks ({brokenStreakAspirants.length} aspirants)
              </span>
            </label>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Select
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aspirant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Streak
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days Broken
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Freezes Available
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAspirants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    {selectedBranch 
                      ? `No aspirants found in ${selectedBranch}${searchTerm ? ` matching "${searchTerm}"` : ''}`
                      : `No aspirants found${searchTerm ? ` matching "${searchTerm}"` : ''}`
                    }
                  </td>
                </tr>
              ) : (
                filteredAspirants.map((aspirant) => (
                  <tr key={aspirant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {aspirant.daysBroken > 0 && (
                        <input
                          type="checkbox"
                          checked={selectedAspirants.includes(aspirant.id)}
                          onChange={() => handleSelectAspirant(aspirant.id)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{aspirant.name}</div>
                      <div className="text-sm text-gray-500">{aspirant.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {aspirant.branch}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {aspirant.currentStreak > 0 ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {aspirant.currentStreak} days
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            Broken
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar size={16} className="text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500">
                          {formatDate(aspirant.lastActiveDate)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {getDaysSinceLastActive(aspirant.lastActiveDate)} days ago
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {aspirant.daysBroken > 0 ? (
                        <span className="text-sm font-medium text-red-600">
                          {aspirant.daysBroken} days
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {aspirant.streakFreezes}/{aspirant.maxFreezes}
                      </div>
                      <div className="w-16 h-1 bg-gray-200 rounded-full mt-1">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(aspirant.streakFreezes / aspirant.maxFreezes) * 100}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {aspirant.daysBroken > 0 && (
                        <button
                          onClick={() => openRestoreModal(aspirant.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Restore Streak
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restore Modal */}
      {showRestoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {restoreRequest.aspirantId ? 'Restore Streak' : 'Bulk Restore Streaks'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Days to Restore
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={restoreRequest.daysToRestore}
                  onChange={(e) => setRestoreRequest({
                    ...restoreRequest,
                    daysToRestore: parseInt(e.target.value) || 1
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Restoration
                </label>
                <textarea
                  value={restoreRequest.reason}
                  onChange={(e) => setRestoreRequest({
                    ...restoreRequest,
                    reason: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  placeholder="Provide a reason for streak restoration..."
                  required
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={restoreRequest.paymentRequired}
                    onChange={(e) => setRestoreRequest({
                      ...restoreRequest,
                      paymentRequired: e.target.checked
                    })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Require payment from aspirant
                  </span>
                </label>
                {restoreRequest.paymentRequired && (
                  <div className="mt-2 p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center">
                      <CreditCard className="text-yellow-600 mr-2" size={16} />
                      <span className="text-sm text-yellow-800">
                        Amount: ₹{calculateAmount(restoreRequest.daysToRestore)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {!restoreRequest.aspirantId && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Users className="text-blue-600 mr-2" size={16} />
                    <span className="text-sm text-blue-800">
                      This will restore streaks for {selectedAspirants.length} aspirants
                      {selectedBranch && ` from ${selectedBranch}`}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowRestoreModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRestoreSubmit}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  disabled={!restoreRequest.reason.trim()}
                >
                  Restore Streak{!restoreRequest.aspirantId ? 's' : ''}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreakRestoration;