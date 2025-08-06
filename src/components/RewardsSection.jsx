import React from 'react';

const RewardsSection = ({ onClaim }) => (
  <div className="mb-6">
    <button
      onClick={onClaim}
      className="bg-purple-600 text-white py-2 px-4 rounded"
    >
      Claim Rewards
    </button>
  </div>
);

export default RewardsSection;
