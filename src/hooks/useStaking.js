import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Replace with your real contract address and ABI
const STAKING_CONTRACT_ADDRESS = '0xYourContractAddress';
const STAKING_CONTRACT_ABI = [
  'function stake() external payable',
  'function unstake() external',
  'function getStakedBalance(address user) external view returns (uint256)',
  'function getRewards(address user) external view returns (uint256)',
];

const useStaking = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [stakedBalance, setStakedBalance] = useState(0);
  const [rewardBalance, setRewardBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const getProvider = () => new ethers.providers.Web3Provider(window.ethereum);
  const getSigner = () => getProvider().getSigner();
  const getContract = () =>
    new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_CONTRACT_ABI, getSigner());

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install MetaMask.');
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setWalletAddress(accounts[0]);
  };

  const fetchBalances = async () => {
    if (!walletAddress) return;
    const contract = getContract();
    const staked = await contract.getStakedBalance(walletAddress);
    const rewards = await contract.getRewards(walletAddress);
    setStakedBalance(ethers.utils.formatEther(staked));
    setRewardBalance(ethers.utils.formatEther(rewards));
  };

  const handleStake = async () => {
    try {
      if (!stakeAmount || isNaN(stakeAmount)) return alert('Enter a valid amount');
      setIsLoading(true);
      const contract = getContract();
      const tx = await contract.stake({ value: ethers.utils.parseEther(stakeAmount) });
      await tx.wait();
      setStakeAmount('');
      await fetchBalances();
    } catch (err) {
      console.error('Stake error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnstake = async () => {
    try {
      setIsLoading(true);
      const contract = getContract();
      const tx = await contract.unstake();
      await tx.wait();
      await fetchBalances();
    } catch (err) {
      console.error('Unstake error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setWalletAddress(accounts[0] || null);
      });
    }
  }, []);

  useEffect(() => {
    fetchBalances();
  }, [walletAddress]);

  return {
    walletAddress,
    connectWallet,
    stakeAmount,
    setStakeAmount,
    handleStake,
    handleUnstake,
    stakedBalance,
    rewardBalance,
    isLoading,
  };
};

export default useStaking;
