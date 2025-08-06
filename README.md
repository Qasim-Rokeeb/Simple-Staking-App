Here's an **updated version** of your `README.md` that reflects your project's structure, frontend architecture, and usability. I’ve improved formatting, added clarity, and made minor enhancements for better developer experience and readability.

---

```md
# 🧱 Simple Staking dApp - Day 14

A decentralized staking application where users can stake tokens to earn yield over time. This dApp demonstrates essential DeFi concepts like staking, real-time reward calculation, APY logic, and token interaction using a user-friendly interface.

---

## 🚀 Features

### Core dApp Functionality
- ✅ **Token Staking** – Stake ERC-20 tokens to earn rewards
- ✅ **Flexible Unstaking** – Withdraw staked tokens anytime
- ✅ **Reward System** – Accrue rewards automatically over time
- ✅ **APY Display** – See current APY and reward rates
- ✅ **Claim Rewards** – Claim accumulated staking rewards separately

### Frontend Highlights
- 🎨 **Responsive UI** with Tailwind CSS
- ⚡ **Live Stats** – Real-time staking and rewards data
- 👛 **Wallet Integration** with MetaMask & Web3 wallets
- 🌐 **Base Sepolia Support** (Chain ID: 84532)
- 🧭 **Component-Based Architecture** using React + Hooks
- 📦 Modular folder structure for scalability

---

## 🧱 Project Structure

```

simple-staking-dapp/
│
├── node\_modules/
├── public/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── WalletStatus.jsx
│   │   ├── StakeForm.jsx
│   │   ├── UnstakeForm.jsx
│   │   ├── StatsOverview\.jsx
│   │   ├── RewardsSection.jsx
│   │   └── InfoSection.jsx
│   ├── hooks/
│   │   └── useStaking.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── README.md
├── package.json
├── tailwind.config.js
├── vite.config.js
└── index.html

````

---

## 🛠 Technical Stack

### 💻 Frontend
- **React 18** – UI library for components
- **Tailwind CSS** – Styling framework
- **ethers.js** – Ethereum blockchain interaction
- **Lucide React** – Icon components
- **Vite** – Fast dev bundler

### ⚙️ Smart Contracts
- **Solidity ^0.8.19**
- **OpenZeppelin Contracts**
- **Hardhat** or **Foundry** for local development

### 🌐 Network
- **Base Sepolia Testnet**
- **Chain ID:** `84532`
- **RPC URL:** `https://sepolia.base.org`

---

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ Node.js (v16+)
- ✅ MetaMask Extension
- ✅ Base Sepolia ETH (get from faucet)
- ✅ ERC-20 test tokens (for staking)

---

## 🔐 Smart Contract Overview

### Core Contract Interface

```solidity
function stake(uint256 amount) external;
function unstake(uint256 amount) external;
function claimRewards() external;

function getStakedAmount(address user) external view returns (uint256);
function getEarnedRewards(address user) external view returns (uint256);
function getTotalStaked() external view returns (uint256);
function getAPY() external view returns (uint256);
````

### 🔑 Key Contract Features

* APY-based reward system
* Full access control and safety checks
* Pausable emergency mechanism
* Event-driven state tracking

---

## 🚀 Getting Started

### 1. Clone the Project

```bash
git clone <repository-url>
cd simple-staking-dapp
npm install
```

### 2. Environment Setup

Create a `.env` file:

```env
VITE_STAKING_CONTRACT_ADDRESS=0xYourStakingContract
VITE_TOKEN_CONTRACT_ADDRESS=0xYourTokenContract
VITE_BASE_SEPOLIA_RPC=https://sepolia.base.org
```

> ⚠️ Use `VITE_` prefix for frontend environment variables.

---

## 🧪 Smart Contract Deployment

### Deploy via Hardhat

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat compile
npx hardhat run scripts/deploy.js --network base-sepolia
```

### Example Deploy Script

```js
const { ethers } = require("hardhat");

async function main() {
  const Token = await ethers.getContractFactory("StakeToken");
  const token = await Token.deploy("Stake Token", "STAKE", ethers.utils.parseEther("1000000"));

  const Staking = await ethers.getContractFactory("SimpleStaking");
  const staking = await Staking.deploy(token.address, 12); // 12% APY

  console.log("Token:", token.address);
  console.log("Staking:", staking.address);
}

main().catch(console.error);
```

---

## ⚛️ Frontend Development

```bash
# Start local dev server
npm run dev

# Build for production
npm run build
```

---

## 💡 Usage Guide

### For Users

1. Connect your MetaMask wallet
2. Acquire test tokens and gas from Base Sepolia faucet
3. Stake tokens via UI
4. Monitor rewards and claim when ready
5. Unstake tokens anytime

### For Developers

```js
// Load contracts
const staking = new ethers.Contract(address, abi, signer);

// Stake
await token.approve(staking.address, amount);
await staking.stake(amount);

// Claim rewards
await staking.claimRewards();
```

---

## 📊 Reward Model

```
Daily Reward = (Staked Amount × APY) / 365
```

* Rewards accrue automatically
* APY can be adjusted via admin
* No lock-up period

---

## ✅ Test Coverage

### Smart Contracts

```bash
npx hardhat test
npx hardhat coverage
```

### Frontend

```bash
npm test
```

> Includes edge cases like staking zero, insufficient balance, reward claiming, and unstaking.

---

## 🌐 Deployment

### Frontend

```bash
npm run build
vercel --prod  # or netlify deploy
```

### Smart Contracts

1. Deploy to Base Sepolia
2. Verify via [BaseScan](https://sepolia.basescan.org/)
3. Update frontend `.env` with deployed addresses

---

## 🔍 Analytics & Monitoring

### Suggested Metrics

* Total Value Locked (TVL)
* # of Active Stakers
* Rewards Claimed
* Average Stake Size

### Emit Events

```solidity
event Staked(address indexed user, uint256 amount);
event Unstaked(address indexed user, uint256 amount);
event RewardsClaimed(address indexed user, uint256 amount);
event APYUpdated(uint256 newAPY);
```

---

## 🔐 Security Practices

* ✅ Reentrancy guard (via `nonReentrant`)
* ✅ Role-based access control
* ✅ Safe math via Solidity ≥0.8
* ✅ Emergency pause switch
* ✅ OpenZeppelin best practices

---

## 📬 Feedback & Contributions

Feel free to open issues, PRs, or feature requests!

---

## 🏁 License
```
MIT License © 2025 Qasim Rokeeb

```

