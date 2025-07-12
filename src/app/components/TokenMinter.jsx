"use client"

import { useState } from "react";
import { TEST_TOKEN_ADDRESS, TEST_TOKEN_ABI } from "../constats";
import { ethers } from "ethers";

export default function TokenMinter() {
  const [mintAmount, setMintAmount] = useState('');
  const [burnAmount, setBurnAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [isBurning, setIsBurning] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [balance, setBalance] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Check if wallet is connected
  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        return accounts.length > 0;
      } catch (error) {
        return false;
      }
    }
    return false;
  };

  // Initialize contract connection
  const getContract = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return null;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(TEST_TOKEN_ADDRESS, TEST_TOKEN_ABI, signer);
      return contract;
    } catch (error) {
      console.error("Error getting contract:", error);
      return null;
    }
  };

  // Update balance
  const updateBalance = async (contract) => {
    try {
      const userBalance = await contract.getUserBalance();
      setBalance(ethers.formatEther(userBalance));
    } catch (error) {
      console.error("Error updating balance:", error);
    }
  };

  const mintTokens = async () => {
    if (!mintAmount || parseFloat(mintAmount) <= 0) {
      alert("Please enter a valid amount to mint");
      return;
    }

    const connected = await checkConnection();
    if (!connected) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      setIsMinting(true);
      setTxHash('');
      
      const contract = await getContract();
      if (!contract) return;

      const amount = ethers.parseEther(mintAmount);
      const tx = await contract.mint(amount);
      setTxHash(tx.hash);
      
      await tx.wait();
      await updateBalance(contract);
      
      alert(`Successfully minted ${mintAmount} DG tokens!`);
      setMintAmount('');
      setTxHash('');
    } catch (error) {
      console.error("Error minting tokens:", error);
      alert("Error minting tokens. Please try again.");
      setTxHash('');
    } finally {
      setIsMinting(false);
    }
  };

  const burnTokens = async () => {
    if (!burnAmount || parseFloat(burnAmount) <= 0) {
      alert("Please enter a valid amount to burn");
      return;
    }

    const connected = await checkConnection();
    if (!connected) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      setIsBurning(true);
      setTxHash('');
      
      const contract = await getContract();
      if (!contract) return;

      const amount = ethers.parseEther(burnAmount);
      const tx = await contract.burnToken(amount);
      setTxHash(tx.hash);
      
      await tx.wait();
      await updateBalance(contract);
      
      alert(`Successfully burned ${burnAmount} DG tokens!`);
      setBurnAmount('');
      setTxHash('');
    } catch (error) {
      console.error("Error burning tokens:", error);
      alert("Error burning tokens. Please check your balance and try again.");
      setTxHash('');
    } finally {
      setIsBurning(false);
    }
  };

  const transferTokens = async () => {
    if (!transferAmount || parseFloat(transferAmount) <= 0) {
      alert("Please enter a valid amount to transfer");
      return;
    }

    if (!transferTo || !ethers.isAddress(transferTo)) {
      alert("Please enter a valid recipient address");
      return;
    }

    const connected = await checkConnection();
    if (!connected) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      setIsTransferring(true);
      setTxHash('');
      
      const contract = await getContract();
      if (!contract) return;

      const amount = ethers.parseEther(transferAmount);
      const tx = await contract.transfer(transferTo, amount);
      setTxHash(tx.hash);
      
      await tx.wait();
      await updateBalance(contract);
      
      alert(`Successfully transferred ${transferAmount} DG tokens!`);
      setTransferAmount('');
      setTransferTo('');
      setTxHash('');
    } catch (error) {
      console.error("Error transferring tokens:", error);
      alert("Error transferring tokens. Please check your balance and recipient address.");
      setTxHash('');
    } finally {
      setIsTransferring(false);
    }
  };

  const refreshBalance = async () => {
    const connected = await checkConnection();
    if (!connected) {
      alert("Please connect your wallet first");
      return;
    }

    const contract = await getContract();
    if (contract) {
      await updateBalance(contract);
    }
  };

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Token Management
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Mint, burn, and transfer your DG tokens with ease
            </p>
          </div>

          {/* Balance Display */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white text-center mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Your Current Balance</h3>
                <p className="text-3xl font-bold">
                  {balance !== null ? `${parseFloat(balance).toFixed(4)} DG` : 'Connect wallet to view'}
                </p>
              </div>
              <button
                onClick={refreshBalance}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-3 rounded-lg transition-all duration-200"
                title="Refresh Balance"
              >
                🔄
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Mint Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 dark:text-green-400 text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Mint Tokens</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount to Mint (DG)
                  </label>
                  <input
                    type="number"
                    value={mintAmount}
                    onChange={(e) => setMintAmount(e.target.value)}
                    placeholder="Enter amount (e.g., 100)"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <button
                  onClick={mintTokens}
                  disabled={isMinting || !mintAmount}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  {isMinting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Minting...</span>
                    </>
                  ) : (
                    <>
                      <span>🪙</span>
                      <span>Mint Tokens</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Burn Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mr-4">
                  <span className="text-red-600 dark:text-red-400 text-2xl">🔥</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Burn Tokens</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount to Burn (DG)
                  </label>
                  <input
                    type="number"
                    value={burnAmount}
                    onChange={(e) => setBurnAmount(e.target.value)}
                    placeholder="Enter amount (e.g., 50)"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <button
                  onClick={burnTokens}
                  disabled={isBurning || !burnAmount}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  {isBurning ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Burning...</span>
                    </>
                  ) : (
                    <>
                      <span>🔥</span>
                      <span>Burn Tokens</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Transfer Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 dark:text-blue-400 text-2xl">📤</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Transfer Tokens</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    value={transferTo}
                    onChange={(e) => setTransferTo(e.target.value)}
                    placeholder="0x742d35Cc6634C0532925a3b8D0C9"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm font-mono"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount to Transfer (DG)
                  </label>
                  <input
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="Enter amount (e.g., 25)"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <button
                  onClick={transferTokens}
                  disabled={isTransferring || !transferAmount || !transferTo}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  {isTransferring ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Transferring...</span>
                    </>
                  ) : (
                    <>
                      <span>📤</span>
                      <span>Transfer Tokens</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Transaction Hash Display */}
          {txHash && (
            <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-xl p-6 mb-8">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-800 rounded-full flex items-center justify-center mr-4">
                  <span className="text-yellow-600 dark:text-yellow-400 text-lg">⏳</span>
                </div>
                <div className="flex-1">
                  <p className="text-lg font-medium text-yellow-800 dark:text-yellow-200">
                    Transaction Pending
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1 break-all">
                    Hash: {txHash}
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    Please wait for the transaction to be confirmed on the blockchain.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setMintAmount('10')}
                className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-4 py-2 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors duration-200"
              >
                Mint 10 DG
              </button>
              <button
                onClick={() => setMintAmount('100')}
                className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-4 py-2 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors duration-200"
              >
                Mint 100 DG
              </button>
              <button
                onClick={() => setMintAmount('1000')}
                className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-4 py-2 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors duration-200"
              >
                Mint 1000 DG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}