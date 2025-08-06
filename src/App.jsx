import React from 'react';
import './index.css';
import Header from './components/Header';
import WalletStatus from './components/WalletStatus';
import InfoSection from './components/InfoSection';
import StatsOverview from './components/StatsOverview';
import StakeForm from './components/StakeForm';
import UnstakeForm from './components/UnstakeForm';
import RewardsSection from './components/RewardsSection';

import useStaking from './hooks/useStaking';

function App() {
  const {
    walletAddress,
    connectWallet,
    stakeAmount,
    setStakeAmount,
    handleStake,
    handleUnstake,
    stakedBalance,
    rewardBalance,
    isLoading,
  } = useStaking();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 px-4 py-6">
      <Header />
      <WalletStatus walletAddress={walletAddress} connectWallet={connectWallet} />

      <main className="max-w-3xl mx-auto space-y-6">
        <InfoSection />
        <StatsOverview stakedBalance={stakedBalance} rewardBalance={rewardBalance} />

        <StakeForm
          stakeAmount={stakeAmount}
          setStakeAmount={setStakeAmount}
          handleStake={handleStake}
        />

        <UnstakeForm handleUnstake={handleUnstake} />

        <RewardsSection rewardBalance={rewardBalance} />
      </main>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg">
          Processing transaction...
        </div>
      )}
    </div>
  );
}

export default App;
