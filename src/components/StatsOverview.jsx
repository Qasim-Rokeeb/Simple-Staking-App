import React from 'react';

const StatsOverview = ({ staked, rewards }) => (
  <div className="bg-gray-100 p-4 rounded shadow mb-6">
    <p><strong>Staked Tokens:</strong> {staked}</p>
    <p><strong>Rewards:</strong> {rewards}</p>
  </div>
);

export default StatsOverview;
