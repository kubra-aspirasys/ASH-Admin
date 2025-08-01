import React from 'react';

const StreakRules: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Streak Rules</h1>
      
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">How Streaks Work</h2>
          <ul className="space-y-3 list-disc list-inside text-gray-700">
            <li>Complete your daily goals to maintain your streak</li>
            <li>Miss a day and your streak resets to zero</li>
            <li>Longer streaks earn bonus XP multipliers</li>
            <li>You must complete at least 80% of your daily goals to maintain the streak</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Streak Bonuses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="font-medium">7 Day Streak</p>
              <p className="text-green-600">1.5x XP Multiplier</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="font-medium">14 Day Streak</p>
              <p className="text-green-600">2x XP Multiplier</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="font-medium">30 Day Streak</p>
              <p className="text-green-600">3x XP Multiplier</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="font-medium">60 Day Streak</p>
              <p className="text-green-600">4x XP Multiplier</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Streak Protection</h2>
          <ul className="space-y-3 list-disc list-inside text-gray-700">
            <li>You get 1 streak freeze every 30 days</li>
            <li>A streak freeze protects your streak for one missed day</li>
            <li>Maximum of 2 streak freezes can be saved at once</li>
            <li>Streak freezes are automatically applied when needed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StreakRules;