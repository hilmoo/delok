# DELOK

<div align="center">
  <img src="./app/icons/logo.svg" alt="delok logo" width="120" height="120" />

<strong>Decentralized Certificate Verification Platform</strong>

<span>A blockchain-based certification system that connects Learning Management Systems (LMS) with verifiable NFT certificates through oracle integration</span>

</div>

## Overview

DELOK is a comprehensive dApp that bridges traditional Learning Management Systems with blockchain technology. It enables students to obtain verifiable NFT certificates for completed courses, with grades and certificates stored on IPFS and validated through smart contracts.

### Key Features

- 🎓 **LMS Integration**: Connect with existing learning platforms like Elemes
- 🔐 **SIWE Authentication**: Sign-In with Ethereum for secure wallet-based login
- 📜 **NFT Certificates**: Mint verifiable certificates as ERC-721 tokens
- 🌐 **IPFS Storage**: Decentralized storage for certificates and metadata
- 🤖 **Oracle System**: Automated verification and certificate issuance
- ⚡ **Local Development**: Complete local blockchain environment (100% self-hostable)

## 🚀 Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [VS Code](https://code.visualstudio.com/) with [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- [MetaMask browser extension](https://metamask.io/download)

### 1. Clone and Setup

```bash
git clone <repository-url>
cd delok
npm install
```

### 2. **Open in DevContainer:**

- Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
- Select "Dev Containers: Clone Repository in Container Volume"
- Wait for the container to build and start

### 3. **Start development:**
   ```bash
   npm run dev
   ```

### 4. Access the Application

- **Web App**: http://localhost:5173
- **LMS (Elemes)**: http://localhost:3000
- **IPFS Gateway**: http://localhost:8080
- **Hardhat Node**: http://localhost:8545
- **Block Explorer**: http://localhost:4000

## 🐳 Production Deployment

### Docker Compose Services

For reference, check the [compose file](./docker/compose.yml).

## 🛠️ Development

### Project Structure

```
delok/
├── app                   # React frontend application
├── _hardhat              # Smart contract development
└── _oracle               # Oracle service
```

### Smart Contracts

#### LMS_Elemes Contract

- **Address**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`

#### DelokCertificate Contract

- **Address**: `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`


## 📦 Tech Stack

### Frontend

- **React Router v7**: Client-side routing
- **Mantine**: UI component library
- **TanStack Query**: Server state management
- **wagmi**: Ethereum interaction hooks
- **viem**: TypeScript Ethereum library

### Blockchain

- **Hardhat**: Development environment
- **Solidity 0.8.22**: Smart contract language
- **OpenZeppelin**: Security-audited contract libraries
- **UUPS Proxy**: Upgradeable contract pattern

## 📝 License

This project is open-sourced software licensed under the [MIT License](./LICENSE).

## 🙏 Acknowledgments

- **OpenZeppelin**: For battle-tested smart contract libraries
- **wagmi Team**: For excellent Ethereum React hooks
- **Hardhat**: For the comprehensive development environment
- **IPFS**: For decentralized storage infrastructure
- **Mantine**: For the beautiful UI component library