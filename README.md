# ERC20 Token Minter DApp

A modern, full-featured decentralized application (DApp) for interacting with ERC20 tokens on the Ethereum blockchain. This project provides a clean, user-friendly interface for minting, burning, and transferring tokens with real-time balance updates.

## Features

- **Token Minting**: Create new tokens instantly with secure minting functionality
- **Token Burning**: Permanently remove tokens from circulation
- **Token Transfer**: Send tokens to any Ethereum address
- **Real-time Balance**: View your current token balance with auto-refresh
- **Wallet Integration**: Seamless MetaMask wallet connection
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Dark/Light Mode**: Automatic theme switching based on user preference
- **Transaction Monitoring**: Real-time transaction status and hash display

## Technologies Used

- **Frontend**: Next.js 14 with React
- **Styling**: Tailwind CSS
- **Blockchain**: Ethereum (Sepolia Testnet)
- **Web3**: ethers.js v6
- **Wallet**: MetaMask integration
- **Smart Contract**: ERC20 token standard

### Contract Functions

- `mint(uint256 amount)` - Mint new tokens
- `burnToken(uint256 amount)` - Burn existing tokens
- `transfer(address to, uint256 value)` - Transfer tokens
- `getUserBalance()` - Get current user balance
- `balanceOf(address account)` - Get balance of any address
- `totalSupply()` - Get total token supply

##  How to Use

### 1. Connect Your Wallet
- Click "Connect Wallet" in the header
- Approve the MetaMask connection
- Ensure you're on the Sepolia network

### 2. Mint Tokens
- Enter the amount you want to mint
- Click "Mint Tokens"
- Confirm the transaction in MetaMask
- Wait for blockchain confirmation

### 3. Burn Tokens
- Enter the amount you want to burn
- Click "Burn Tokens"
- Confirm the transaction in MetaMask
- Your balance will update automatically

### 4. Transfer Tokens
- Enter the recipient's Ethereum address
- Enter the amount to transfer
- Click "Transfer Tokens"
- Confirm the transaction in MetaMask

### 5. View Balance
- Your balance is displayed in the header
- Click "Refresh" to update your balance
- Balance updates automatically after transactions



## Links

- **Live Demo**: (https://erc-20-minter-dapp.vercel.app/)
- **Smart Contract**: [View on Etherscan](https://sepolia.etherscan.io/address/0x60a6AA5cA0F25cD5B6E387635c021D96e303904c)
- **GitHub Repository**: [https://github.com/dipeshgavit666/ERC20_Minter_Dapp](https://github.com/dipeshgavit666/ERC20_Minter_Dapp)


## Author

**Dipesh Gavit**
- GitHub: [@dipeshgavit666](https://github.com/dipeshgavit666)

---

**⚠️ Disclaimer**: This is a demonstration DApp deployed on Sepolia testnet. Do not use real ETH or mainnet for testing purposes. Always verify smart contract code before interacting with it on mainnet.