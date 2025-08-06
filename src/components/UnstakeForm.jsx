import React, { useState } from 'react';

const UnstakeForm = ({ onUnstake }) => {
  const [amount, setAmount] = useState('');

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Unstake Tokens</h2>
      <input
        type="number"
        placeholder="Amount to unstake"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="p-2 border rounded mr-2"
      />
      <button
        onClick={() => onUnstake(amount)}
        className="bg-red-600 text-white py-2 px-4 rounded"
      >
        Unstake
      </button>
    </div>
  );
};

export default UnstakeForm;
