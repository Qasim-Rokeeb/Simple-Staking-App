import React, { useState } from 'react';

const StakeForm = ({ onStake }) => {
  const [amount, setAmount] = useState('');

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Stake Tokens</h2>
      <input
        type="number"
        placeholder="Amount to stake"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="p-2 border rounded mr-2"
      />
      <button
        onClick={() => onStake(amount)}
        className="bg-green-600 text-white py-2 px-4 rounded"
      >
        Stake
      </button>
    </div>
  );
};

export default StakeForm;
