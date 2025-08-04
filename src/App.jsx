import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Coins, TrendingUp, Clock, Award, Wallet, RefreshCw } from 'lucide-react';

const SimpleStaking = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State for staking data
  const [tokenBalance, setTokenBalance] = useState('0');
  const [stakedAmount, setStakedAmount] = useState('0');
  const [earnedRewards, setEarnedRewards] = useState('0');
  const [stakingInput, setStakingInput] = useState('');
  const [unstakeInput, setUnstakeInput] = useState('');
  const [apy, setApy] = useState('12'); // 12% APY
  const [totalStaked, setTotalStaked] = useState('0');

  // Contract addresses (you'll need to replace these with actual deployed addresses)
  const STAKING_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";
  const TOKEN_CONTRACT_ADDRESS = "0x0987654321098765432109876543210987654321";

  // Contract ABIs (simplified)
  const STAKING_ABI = [
    "function stake(uint256 amount) external",
    "function unstake(uint256 amount) external",
    "function claimRewards() external",
    "function getStakedAmount(address user) external view returns (uint256)",
    "function getEarnedRewards(address user) external view returns (uint256)",
    "function getTotalStaked() external view returns (uint256)",
    "function getAPY() external view returns (uint256)",
    "event Staked(address indexed user, uint256 amount)",
    "event Unstaked(address indexed user, uint256 amount)",
    "event RewardsClaimed(address indexed user, uint256 amount)"
  ];

  const TOKEN_ABI = [
    "function balanceOf(address owner) external view returns (uint256)",
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function decimals() external view returns (uint8)",
    "function symbol() external view returns (string)"
  ];

  // Initialize provider and contracts
  useEffect(() => {
    initializeProvider();
  }, []);

  // Load user data when connected
  useEffect(() => {
    if (isConnected && account) {
      loadUserData();
    }
  }, [isConnected, account]);

  const initializeProvider = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);
        
        // Check if already connected
        const accounts = await web3Provider.listAccounts();
        if (accounts.length > 0) {
          const web3Signer = web3Provider.getSigner();
          setSigner(web3Signer);
          setAccount(accounts[0]);
          setIsConnected(true);
          initializeContracts(web3Provider, web3Signer);
        }
      } catch (error) {
        console.error('Error initializing provider:', error);
      }
    }
  };

  const initializeContracts = (web3Provider, web3Signer) => {
    try {
      const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, web3Signer);
      const tokenContract = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_ABI, web3Signer);
      
      setContract(stakingContract);
      setTokenContract(tokenContract);
    } catch (error) {
      console.error('Error initializing contracts:', error);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setLoading(true);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        const web3Signer = web3Provider.getSigner();
        const address = await web3Signer.getAddress();
        
        setProvider(web3Provider);
        setSigner(web3Signer);
        setAccount(address);
        setIsConnected(true);
        
        initializeContracts(web3Provider, web3Signer);
        
        // Switch to Base Sepolia if needed
        await switchToBaseSepolia();
      } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Error connecting wallet: ' + error.message);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const switchToBaseSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x14a34' }], // Base Sepolia chain ID
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x14a34',
              chainName: 'Base Sepolia',
              nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://sepolia.base.org'],
              blockExplorerUrls: ['https://sepolia.basescan.org/'],
            }],
          });
        } catch (addError) {
          console.error('Error adding Base Sepolia network:', addError);
        }
      }
    }
  };

  const loadUserData = async () => {
    if (!contract || !tokenContract || !account) return;

    try {
      setLoading(true);
      
      // Load token balance
      const balance = await tokenContract.balanceOf(account);
      setTokenBalance(ethers.utils.formatEther(balance));
      
      // Load staked amount
      const staked = await contract.getStakedAmount(account);
      setStakedAmount(ethers.utils.formatEther(staked));
      
      // Load earned rewards
      const rewards = await contract.getEarnedRewards(account);
      setEarnedRewards(ethers.utils.formatEther(rewards));
      
      // Load total staked
      const total = await contract.getTotalStaked();
      setTotalStaked(ethers.utils.formatEther(total));
      
      // Load APY
      const contractAPY = await contract.getAPY();
      setApy(contractAPY.toString());
      
    } catch (error) {
      console.error('Error loading user data:', error);
      // Mock data for demo purposes
      setTokenBalance('1000.0');
      setStakedAmount('250.0');
      setEarnedRewards('15.75');
      setTotalStaked('50000.0');
    } finally {
      setLoading(false);
    }
  };

  const handleStake = async () => {
    if (!contract || !tokenContract || !stakingInput) return;

    try {
      setLoading(true);
      
      const amount = ethers.utils.parseEther(stakingInput);
      
      // Check allowance
      const allowance = await tokenContract.allowance(account, STAKING_CONTRACT_ADDRESS);
      
      if (allowance.lt(amount)) {
        // Approve tokens
        const approveTx = await tokenContract.approve(STAKING_CONTRACT_ADDRESS, amount);
        await approveTx.wait();
      }
      
      // Stake tokens
      const stakeTx = await contract.stake(amount);
      await stakeTx.wait();
      
      setStakingInput('');
      await loadUserData();
      alert('Tokens staked successfully!');
      
    } catch (error) {
      console.error('Error staking:', error);
      alert('Error staking tokens: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnstake = async () => {
    if (!contract || !unstakeInput) return;

    try {
      setLoading(true);
      
      const amount = ethers.utils.parseEther(unstakeInput);
      
      const unstakeTx = await contract.unstake(amount);
      await unstakeTx.wait();
      
      setUnstakeInput('');
      await loadUserData();
      alert('Tokens unstaked successfully!');
      
    } catch (error) {
      console.error('Error unstaking:', error);
      alert('Error unstaking tokens: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimRewards = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      
      const claimTx = await contract.claimRewards();
      await claimTx.wait();
      
      await loadUserData();
      alert('Rewards claimed successfully!');
      
    } catch (error) {
      console.error('Error claiming rewards:', error);
      alert('Error claiming rewards: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const calculateDailyRewards = () => {
    const dailyRate = parseFloat(apy) / 365 / 100;
    return (parseFloat(stakedAmount) * dailyRate).toFixed(4);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Coins className="w-12 h-12 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Simple Staking</h1>
          </div>
          <p className="text-gray-600 text-lg">Stake your tokens and earn rewards</p>
        </div>

        {/* Connection Status */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Wallet className="w-6 h-6 text-indigo-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Wallet Status</h3>
                {isConnected ? (
                  <p className="text-green-600">Connected: {formatAddress(account)}</p>
                ) : (
                  <p className="text-gray-500">Not connected</p>
                )}
              </div>
            </div>
            
            {!isConnected ? (
              <button
                onClick={connectWallet}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            ) : (
              <button
                onClick={loadUserData}
                disabled={loading}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            )}
          </div>
        </div>

        {isConnected && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <Wallet className="w-8 h-8 text-blue-600 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Token Balance</h3>
                    <p className="text-xl font-bold text-gray-800">{parseFloat(tokenBalance).toFixed(2)} STAKE</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Staked Amount</h3>
                    <p className="text-xl font-bold text-gray-800">{parseFloat(stakedAmount).toFixed(2)} STAKE</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <Award className="w-8 h-8 text-yellow-600 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Earned Rewards</h3>
                    <p className="text-xl font-bold text-gray-800">{parseFloat(earnedRewards).toFixed(4)} STAKE</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-purple-600 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">APY</h3>
                    <p className="text-xl font-bold text-gray-800">{apy}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Staking Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Stake Tokens */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
                  Stake Tokens
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount to Stake
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={stakingInput}
                        onChange={(e) => setStakingInput(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <button
                        onClick={() => setStakingInput(tokenBalance)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-indigo-600 text-sm font-medium hover:text-indigo-700"
                      >
                        MAX
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleStake}
                    disabled={loading || !stakingInput || parseFloat(stakingInput) <= 0}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Staking...' : 'Stake Tokens'}
                  </button>
                </div>
              </div>

              {/* Unstake Tokens */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <TrendingUp className="w-6 h-6 text-red-600 mr-2 transform rotate-180" />
                  Unstake Tokens
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount to Unstake
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={unstakeInput}
                        onChange={(e) => setUnstakeInput(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <button
                        onClick={() => setUnstakeInput(stakedAmount)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-indigo-600 text-sm font-medium hover:text-indigo-700"
                      >
                        MAX
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleUnstake}
                    disabled={loading || !unstakeInput || parseFloat(unstakeInput) <= 0}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Unstaking...' : 'Unstake Tokens'}
                  </button>
                </div>
              </div>
            </div>

            {/* Rewards Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <Award className="w-6 h-6 text-yellow-600 mr-2" />
                  Rewards
                </h3>
                
                <button
                  onClick={handleClaimRewards}
                  disabled={loading || parseFloat(earnedRewards) <= 0}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Claiming...' : 'Claim Rewards'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Available Rewards</h4>
                  <p className="text-2xl font-bold text-yellow-600">{parseFloat(earnedRewards).toFixed(4)} STAKE</p>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Daily Rewards</h4>
                  <p className="text-2xl font-bold text-blue-600">{calculateDailyRewards()} STAKE</p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Total Pool</h4>
                  <p className="text-2xl font-bold text-green-600">{parseFloat(totalStaked).toFixed(0)} STAKE</p>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">How Staking Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">✨ Earn Rewards</h4>
                  <p className="opacity-90">Stake your tokens to earn {apy}% APY in rewards</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🔒 Secure Staking</h4>
                  <p className="opacity-90">Your staked tokens are secured by smart contracts</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">📈 Compound Growth</h4>
                  <p className="opacity-90">Claim and restake rewards for compound growth</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🚀 Flexible Terms</h4>
                  <p className="opacity-90">Stake and unstake anytime without lock periods</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SimpleStaking;