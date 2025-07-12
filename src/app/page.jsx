"use client"

import { useState, useEffect } from "react";
import { TEST_TOKEN_ADDRESS, TEST_TOKEN_ABI } from "./constats";
import { ethers } from "ethers";
import TokenMinter from "./components/TokenMinter";

export default function Home() {
  const [tokenInfo, setTokenInfo] = useState({
    name: '',
    symbol: '',
    decimals: 0,
    totalSupply: '0'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getTokenInfo = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(TEST_TOKEN_ADDRESS, TEST_TOKEN_ABI, provider);
          
          const [name, symbol, decimals, totalSupply] = await Promise.all([
            contract.name(),
            contract.symbol(),
            contract.decimals(),
            contract.totalSupply()
          ]);
          
          setTokenInfo({
            name,
            symbol,
            decimals: decimals.toString(),
            totalSupply: ethers.formatEther(totalSupply)
          });
        }
      } catch (error) {
        console.error("Error fetching token info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getTokenInfo();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Address copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Welcome to DG Token
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              A powerful ERC20 token with minting, burning, and transfer capabilities. 
              Built on Ethereum blockchain for maximum security and transparency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200">
                Get Started
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200">
                Learn More
              </button> */}
            </div>
          </div>
        </div>
      </section>

      {/* Token Info Section */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Token Information
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Learn about the DG token specifications
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">Loading token information...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Token Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Name:</span>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {tokenInfo.name || 'SimpleTeDGoken'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Symbol:</span>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {tokenInfo.symbol || 'DG'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Decimals:</span>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {tokenInfo.decimals || '18'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Total Supply:</span>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {parseFloat(tokenInfo.totalSupply).toFixed(4)} DG
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Contract Address
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        Contract Address:
                      </p>
                      <div className="flex items-center justify-between">
                        <code className="text-sm font-mono text-gray-800 dark:text-white break-all">
                          {TEST_TOKEN_ADDRESS}
                        </code>
                        <button
                          onClick={() => copyToClipboard(TEST_TOKEN_ADDRESS)}
                          className="ml-2 p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Copy address"
                        >
                          📋
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      You can view this contract on Etherscan or add it to your wallet using the address above.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Features
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Discover what makes DG token special
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-green-600 dark:text-green-400">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Mint Tokens
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create new tokens instantly with our secure minting functionality. Perfect for expanding token supply when needed.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-red-600 dark:text-red-400">🔥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Burn Tokens
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Permanently remove tokens from circulation to manage supply and increase scarcity.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-blue-600 dark:text-blue-400">📤</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Transfer Tokens
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Send tokens to any Ethereum address quickly and securely with low gas fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Token Management Section */}
      <TokenMinter />

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Token Statistics</h2>
            <p className="text-blue-100">Real-time data from the blockchain</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                {parseFloat(tokenInfo.totalSupply).toFixed(0)}
              </div>
              <div className="text-blue-200">Total Supply</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">18</div>
              <div className="text-blue-200">Decimals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">ERC20</div>
              <div className="text-blue-200">Token Standard</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">✓</div>
              <div className="text-blue-200">Verified Contract</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold">🪙</span>
              </div>
              <h3 className="text-xl font-bold">DG Token</h3>
            </div>
            <p className="text-gray-400 mb-6">
              A secure and feature-rich ERC20 token built on Ethereum blockchain.
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Documentation
              </a>
              <a href="https://github.com/dipeshgavit666/ERC20_Minter_Dapp" className="text-gray-400 hover:text-white transition-colors">
                GitHub
              </a>
              <a href="https://sepolia.etherscan.io/address/0x60a6AA5cA0F25cD5B6E387635c021D96e303904c" className="text-gray-400 hover:text-white transition-colors">
                Etherscan
              </a>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-gray-400 text-sm">
                © 2025 DG Token
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}