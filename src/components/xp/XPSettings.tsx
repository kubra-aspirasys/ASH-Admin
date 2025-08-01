import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Zap, Trophy, Target, Clock, AlertCircle } from 'lucide-react';

interface XPSettingsData {
  dailyGoals: {
    videosToWatch: number;
    studyTimeMinutes: number;
    practiceProblems: number;
    weeklyXpTarget: number;
  };
  streakSettings: {
    freezesPerMonth: number;
    maxSavedFreezes: number;
    streakBonusMultipliers: {
      week1: number;
      week2: number;
      month1: number;
      month2: number;
    };
  };
  xpRewards: {
    videoCompletion: number;
    quizCompletion: number;
    testTaskCompletion: number;
    capstoneSubmission: number;
    dailyGoalCompletion: number;
  };
  streakRestoration: {
    enabled: boolean;
    costPerDay: number;
    maxDaysRestoration: number;
  };
}

const XPSettings: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<XPSettingsData>({
    dailyGoals: {
      videosToWatch: 3,
      studyTimeMinutes: 60,
      practiceProblems: 5,
      weeklyXpTarget: 1400
    },
    streakSettings: {
      freezesPerMonth: 1,
      maxSavedFreezes: 2,
      streakBonusMultipliers: {
        week1: 1.5,
        week2: 2.0,
        month1: 3.0,
        month2: 4.0
      }
    },
    xpRewards: {
      videoCompletion: 50,
      quizCompletion: 100,
      testTaskCompletion: 200,
      capstoneSubmission: 500,
      dailyGoalCompletion: 100
    },
    streakRestoration: {
      enabled: true,
      costPerDay: 25,
      maxDaysRestoration: 7
    }
  });

  const [successMessage, setSuccessMessage] = useState('');

  const handleSave = () => {
    // Here you would typically save to your backend
    console.log('Saving XP settings:', settings);
    setSuccessMessage('XP settings saved successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const resetToDefaults = () => {
    setSettings({
      dailyGoals: {
        videosToWatch: 3,
        studyTimeMinutes: 60,
        practiceProblems: 5,
        weeklyXpTarget: 1400
      },
      streakSettings: {
        freezesPerMonth: 1,
        maxSavedFreezes: 2,
        streakBonusMultipliers: {
          week1: 1.5,
          week2: 2.0,
          month1: 3.0,
          month2: 4.0
        }
      },
      xpRewards: {
        videoCompletion: 50,
        quizCompletion: 100,
        testTaskCompletion: 200,
        capstoneSubmission: 500,
        dailyGoalCompletion: 100
      },
      streakRestoration: {
        enabled: true,
        costPerDay: 25,
        maxDaysRestoration: 7
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard/xp')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to XP Dashboard
        </button>
        <h2 className="text-2xl font-bold text-gray-800">XP & Streak Settings</h2>
      </div>

      {successMessage && (
        <div className="flex items-center p-4 bg-green-50 rounded-lg">
          <AlertCircle className="text-green-500 mr-2" size={20} />
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Goals Settings */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center mb-4">
            <Target className="text-indigo-600 mr-2" size={24} />
            <h3 className="text-lg font-semibold text-gray-800">Daily Goals Configuration</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Videos to Watch Daily
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={settings.dailyGoals.videosToWatch}
                onChange={(e) => setSettings({
                  ...settings,
                  dailyGoals: { ...settings.dailyGoals, videosToWatch: parseInt(e.target.value) || 1 }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Study Time (Minutes)
              </label>
              <input
                type="number"
                min="15"
                max="300"
                step="15"
                value={settings.dailyGoals.studyTimeMinutes}
                onChange={(e) => setSettings({
                  ...settings,
                  dailyGoals: { ...settings.dailyGoals, studyTimeMinutes: parseInt(e.target.value) || 15 }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Practice Problems
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={settings.dailyGoals.practiceProblems}
                onChange={(e) => setSettings({
                  ...settings,
                  dailyGoals: { ...settings.dailyGoals, practiceProblems: parseInt(e.target.value) || 1 }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weekly XP Target
              </label>
              <input
                type="number"
                min="350"
                max="7000"
                step="50"
                value={settings.dailyGoals.weeklyXpTarget}
                onChange={(e) => setSettings({
                  ...settings,
                  dailyGoals: { ...settings.dailyGoals, weeklyXpTarget: parseInt(e.target.value) || 350 }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Recommended: {Math.round(settings.dailyGoals.weeklyXpTarget / 7)} XP per day
              </p>
            </div>
          </div>
        </div>

        {/* XP Rewards Settings */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center mb-4">
            <Zap className="text-yellow-600 mr-2" size={24} />
            <h3 className="text-lg font-semibold text-gray-800">XP Rewards</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video Completion XP
              </label>
              <input
                type="number"
                min="10"
                max="200"
                step="10"
                value={settings.xpRewards.videoCompletion}
                onChange={(e) => setSettings({
                  ...settings,
                  xpRewards: { ...settings.xpRewards, videoCompletion: parseInt(e.target.value) || 10 }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quiz Completion XP
              </label>
              <input
                type="number"
                min="20"
                max="300"
                step="10"
                value={settings.xpRewards.quizCompletion}
                onChange={(e) => setSettings({
                  ...settings,
                  xpRewards: { ...settings.xpRewards, quizCompletion: parseInt(e.target.value) || 20 }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Test Task Completion XP
              </label>
              <input
                type="number"
                min="50"
                max="500"
                step="25"
                value={settings.xpRewards.testTaskCompletion}
                onChange={(e) => setSettings({
                  ...settings,
                  xpRewards: { ...settings.xpRewards, testTaskCompletion: parseInt(e.target.value) || 50 }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capstone Submission XP
              </label>
              <input
                type="number"
                min="200"
                max="1000"
                step="50"
                value={settings.xpRewards.capstoneSubmission}
                onChange={(e) => setSettings({
                  ...settings,
                  xpRewards: { ...settings.xpRewards, capstoneSubmission: parseInt(e.target.value) || 200 }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Daily Goal Completion Bonus XP
              </label>
              <input
                type="number"
                min="50"
                max="300"
                step="25"
                value={settings.xpRewards.dailyGoalCompletion}
                onChange={(e) => setSettings({
                  ...settings,
                  xpRewards: { ...settings.xpRewards, dailyGoalCompletion: parseInt(e.target.value) || 50 }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Streak Settings */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center mb-4">
            <Trophy className="text-green-600 mr-2" size={24} />
            <h3 className="text-lg font-semibold text-gray-800">Streak Configuration</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Streak Freezes Per Month
              </label>
              <input
                type="number"
                min="0"
                max="5"
                value={settings.streakSettings.freezesPerMonth}
                onChange={(e) => setSettings({
                  ...settings,
                  streakSettings: { ...settings.streakSettings, freezesPerMonth: parseInt(e.target.value) || 0 }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Saved Freezes
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={settings.streakSettings.maxSavedFreezes}
                onChange={(e) => setSettings({
                  ...settings,
                  streakSettings: { ...settings.streakSettings, maxSavedFreezes: parseInt(e.target.value) || 1 }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  7-Day Multiplier
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={settings.streakSettings.streakBonusMultipliers.week1}
                  onChange={(e) => setSettings({
                    ...settings,
                    streakSettings: {
                      ...settings.streakSettings,
                      streakBonusMultipliers: {
                        ...settings.streakSettings.streakBonusMultipliers,
                        week1: parseFloat(e.target.value) || 1
                      }
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  14-Day Multiplier
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={settings.streakSettings.streakBonusMultipliers.week2}
                  onChange={(e) => setSettings({
                    ...settings,
                    streakSettings: {
                      ...settings.streakSettings,
                      streakBonusMultipliers: {
                        ...settings.streakSettings.streakBonusMultipliers,
                        week2: parseFloat(e.target.value) || 1
                      }
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  30-Day Multiplier
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={settings.streakSettings.streakBonusMultipliers.month1}
                  onChange={(e) => setSettings({
                    ...settings,
                    streakSettings: {
                      ...settings.streakSettings,
                      streakBonusMultipliers: {
                        ...settings.streakSettings.streakBonusMultipliers,
                        month1: parseFloat(e.target.value) || 1
                      }
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  60-Day Multiplier
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={settings.streakSettings.streakBonusMultipliers.month2}
                  onChange={(e) => setSettings({
                    ...settings,
                    streakSettings: {
                      ...settings.streakSettings,
                      streakBonusMultipliers: {
                        ...settings.streakSettings.streakBonusMultipliers,
                        month2: parseFloat(e.target.value) || 1
                      }
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Streak Restoration Settings */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center mb-4">
            <Clock className="text-blue-600 mr-2" size={24} />
            <h3 className="text-lg font-semibold text-gray-800">Streak Restoration</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.streakRestoration.enabled}
                  onChange={(e) => setSettings({
                    ...settings,
                    streakRestoration: { ...settings.streakRestoration, enabled: e.target.checked }
                  })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Enable Streak Restoration
                </span>
              </label>
            </div>

            {settings.streakRestoration.enabled && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost Per Day (₹)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    step="5"
                    value={settings.streakRestoration.costPerDay}
                    onChange={(e) => setSettings({
                      ...settings,
                      streakRestoration: { ...settings.streakRestoration, costPerDay: parseInt(e.target.value) || 10 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Days for Restoration
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={settings.streakRestoration.maxDaysRestoration}
                    onChange={(e) => setSettings({
                      ...settings,
                      streakRestoration: { ...settings.streakRestoration, maxDaysRestoration: parseInt(e.target.value) || 1 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={resetToDefaults}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Reset to Defaults
        </button>
        <button
          onClick={handleSave}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Save size={20} className="mr-2" />
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default XPSettings;