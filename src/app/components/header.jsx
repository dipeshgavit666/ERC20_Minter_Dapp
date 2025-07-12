"use client"

import { useState, useEffect } from "react";
import { TEST_TOKEN_ADDRESS, TEST_TOKEN_ABI } from "../constats";
import { ethers } from "ethers";

export default function Header() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [network, setNetwork] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setIsConnecting(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const accounts = await provider.send('eth_requestAccounts', []);
        const network = await provider.getNetwork();
        
        setAccount(accounts[0]);
        setNetwork(network.name);
        
        const newContract = new ethers.Contract(TEST_TOKEN_ADDRESS, TEST_TOKEN_ABI, signer);
        setContract(newContract);
        
        // Auto-fetch balance on connect
        const userBalance = await newContract.getUserBalance();
        setBalance(ethers.formatEther(userBalance));
        
        console.log("Connected account:", accounts[0]);
      } catch (error) {
        console.log("Error connecting to wallet:", error);
        if (error.code === 4001) {
          alert("Please connect to MetaMask.");
        } else {
          alert("Error connecting to wallet. Please try again.");
        }
      } finally {
        setIsConnecting(false);
      }
    } else {
      alert("Please install MetaMask wallet");
    }
  };

  const getBalance = async () => {
    if (contract) {
      try {
        const userBalance = await contract.getUserBalance();
        setBalance(ethers.formatEther(userBalance));
      } catch (error) {
        console.log("Error fetching balance:", error);
      }
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setContract(null);
    setBalance(null);
    setNetwork(null);
  };

  // Format address for display
  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== account) {
          setAccount(accounts[0]);
          // Reconnect contract with new account
          connectWallet();
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [account]);

  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold">🪙</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">ERC20 Minter DApp</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {account ? (
              <div className="flex items-center space-x-4">
                <div className="bg-black bg-opacity-20 rounded-lg px-4 py-2 backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Connected</span>
                  </div>
                  <div className="text-xs opacity-80">
                    {formatAddress(account)}
                  </div>
                  {network && (
                    <div className="text-xs opacity-60">
                      Network: {network}
                    </div>
                  )}
                </div>
                
                {balance !== null && (
                  <div className="bg-black bg-opacity-20 rounded-lg px-4 py-2 backdrop-blur-sm">
                    <div className="text-sm font-medium">
                      {parseFloat(balance).toFixed(4)} DG
                    </div>
                    <div className="text-xs opacity-80">Token Balance</div>
                  </div>
                )}
                
                <button
                  onClick={getBalance}
                  className="bg-black bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
                >
                  Refresh
                </button>
                
                <button
                  onClick={disconnectWallet}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-all duration-200"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isConnecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <span>🦊</span>
                    <span>Connect Wallet</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}