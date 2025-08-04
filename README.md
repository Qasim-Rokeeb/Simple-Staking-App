# Simple Staking dApp - Day 14

A decentralized staking application that allows users to stake tokens and earn rewards. This project demonstrates fundamental DeFi concepts including token staking, reward distribution, and APY calculations.

## 🚀 Features

### Core Functionality
- **Token Staking**: Stake tokens to earn rewards
- **Flexible Unstaking**: Withdraw staked tokens anytime
- **Reward System**: Earn rewards based on staked amount and time
- **Real-time APY**: Display current Annual Percentage Yield
- **Reward Claiming**: Claim earned rewards separately

### Smart Contract Features
- ERC20 token integration
- Secure staking mechanism
- Automatic reward calculation
- Emergency functions
- Gas-optimized operations

### Frontend Features
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Live balance and reward tracking
- **Wallet Integration**: MetaMask and other Web3 wallets
- **Network Support**: Base Sepolia testnet
- **User-friendly Interface**: Intuitive staking experience

## 🛠 Technical Stack

### Smart Contracts
- **Solidity ^0.8.19**: Smart contract development
- **OpenZeppelin**: Security standards and utilities
- **Hardhat/Foundry**: Development and testing framework

### Frontend
- **React 18**: Component-based UI framework
- **Tailwind CSS**: Utility-first styling
- **ethers.js**: Ethereum blockchain interaction
- **Lucide React**: Beautiful icons

### Network
- **Base Sepolia Testnet**: Testing environment
- **Chain ID**: 84532
- **RPC URL**: https://sepolia.base.org

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v16 or higher)
- **MetaMask** browser extension
- **Base Sepolia ETH** for gas fees
- **Test tokens** for staking

## 🏗 Smart Contract Architecture

### StakingContract.sol
```solidity
// Core functions
function stake(uint256 amount) external;
function unstake(uint256 amount) external;
function claimRewards() external;

// View functions
function getStakedAmount(address user) external view returns (uint256);
function getEarnedRewards(address user) external view returns (uint256);
function getTotalStaked() external view returns (uint256);
function getAPY() external view returns (uint256);
```

### Key Features
- **Access Control**: Only authorized users can modify parameters
- **Reward Calculation**: Time-based reward distribution
- **Safety Checks**: Prevents over-withdrawing and invalid operations
- **Event Logging**: Comprehensive event emission for frontend integration

## 🚀 Getting Started

### 1. Clone and Setup
```bash
git clone <repository-url>
cd simple-staking
npm install
```

### 2. Environment Configuration
Create a `.env` file:
```env
REACT_APP_STAKING_CONTRACT_ADDRESS=0x...
REACT_APP_TOKEN_CONTRACT_ADDRESS=0x...
REACT_APP_BASE_SEPOLIA_RPC=https://sepolia.base.org
```

### 3. Smart Contract Deployment

#### Using Hardhat
```bash
# Install dependencies
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Compile contracts
npx hardhat compile

# Deploy to Base Sepolia
npx hardhat run scripts/deploy.js --network base-sepolia
```

#### Sample Deploy Script
```javascript
const { ethers } = require("hardhat");

async function main() {
  // Deploy token first
  const Token = await ethers.getContractFactory("StakeToken");
  const token = await Token.deploy("Stake Token", "STAKE", ethers.utils.parseEther("1000000"));
  
  // Deploy staking contract
  const Staking = await ethers.getContractFactory("SimpleStaking");
  const staking = await Staking.deploy(token.address, 12); // 12% APY
  
  console.log("Token deployed to:", token.address);
  console.log("Staking deployed to:", staking.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

### 4. Frontend Development
```bash
# Start development server
npm start

# Build for production
npm run build
```

## 🎯 Usage Guide

### For Users

1. **Connect Wallet**
   - Click "Connect Wallet" button
   - Approve MetaMask connection
   - Switch to Base Sepolia if prompted

2. **Get Test Tokens**
   - Visit Base Sepolia faucet
   - Get test ETH for gas fees
   - Acquire test STAKE tokens from faucet

3. **Stake Tokens**
   - Enter amount to stake
   - Click "Stake Tokens"
   - Approve token spending (first time)
   - Confirm staking transaction

4. **Monitor Rewards**
   - View real-time reward accumulation
   - Check daily reward estimates
   - Monitor APY changes

5. **Claim Rewards**
   - Click "Claim Rewards" when ready
   - Confirm transaction
   - Rewards added to wallet balance

6. **Unstake Tokens**
   - Enter amount to unstake
   - Click "Unstake Tokens"
   - Confirm transaction

### For Developers

#### Contract Integration
```javascript
// Initialize contract
const stakingContract = new ethers.Contract(
  STAKING_ADDRESS,
  STAKING_ABI,
  signer
);

// Stake tokens
await tokenContract.approve(STAKING_ADDRESS, amount);
await stakingContract.stake(amount);

// Check rewards
const rewards = await stakingContract.getEarnedRewards(userAddress);
```

## 💡 Key Concepts

### Staking Mechanism
- Users lock tokens in the contract
- Rewards accrue based on time and amount staked
- APY determines reward rate
- No lock-up period for flexibility

### Reward Calculation
```
Daily Reward = (Staked Amount × APY) / 365
```

### Security Features
- **Reentrancy Protection**: Prevents recursive calls
- **Access Control**: Role-based permissions
- **Safe Math**: Overflow protection
- **Emergency Pause**: Circuit breaker functionality

## 🧪 Testing

### Smart Contract Tests
```bash
# Run contract tests
npx hardhat test

# Coverage report
npx hardhat coverage
```

### Frontend Tests
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e
```

### Test Scenarios
- Stake tokens successfully
- Unstake partial/full amounts
- Claim rewards correctly
- Handle edge cases (zero amounts, insufficient balance)
- Emergency functions work

## 🚀 Deployment

### Smart Contracts
1. Deploy to Base Sepolia testnet
2. Verify contracts on BaseScan
3. Update frontend with contract addresses

### Frontend
```bash
# Build production bundle
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod --dir=build
```

## 🔧 Configuration

### Network Configuration
```javascript
// hardhat.config.js
networks: {
  "base-sepolia": {
    url: "https://sepolia.base.org",
    accounts: [process.env.PRIVATE_KEY],
    chainId: 84532,
  }
}
```

### Contract Parameters
- **APY**: Configurable annual percentage yield
- **Min Stake**: Minimum staking amount
- **Reward Token**: Token used for rewards
- **Admin Controls**: Pause, parameter updates

## 📊 Analytics & Monitoring

### Key Metrics
- Total Value Locked (TVL)
- Number of stakers
- Average stake amount
- Reward distribution rate
- APY effectiveness

### Events to Monitor
```solidity
event Staked(address indexed user, uint256 amount);
event Unstaked(address indexed user, uint256 amount);
event RewardsClaimed(address indexed user, uint256 amount);
event APYUpdated(uint256 newAPY);
```

## 🚨 Security Considerations

### Smart Contract Security
- Use OpenZeppelin's battle-tested contracts
- Implement comprehensive access controls
- Add emergency pause functionality
- Regular security audits

