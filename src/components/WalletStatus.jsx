import React from 'react';

const WalletStatus = ({ walletConnected, account, connectWallet }) => (
  <div className="text-center mb-4">
    {walletConnected ? (
      <p className="text-green-600">Connected: {account}</p>
    ) : (
      <button
        onClick={connectWallet}
        className="bg-blue-600 text-white py-2 px-4 rounded"
      >
        Connect Wallet
      </button>
    )}
  </div>
);

export default WalletStatus;
