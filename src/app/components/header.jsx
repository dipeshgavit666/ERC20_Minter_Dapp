"use client"

import { useState } from "react";

export default function Header() {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setAccount(accounts[0]);
        console.log("Connected account:", accounts[0]);
      } catch (error) {
        console.log("Error connecting to wallet:", error);
        // Handle specific error cases
        if (error.code === 4001) {
          alert("Please connect to MetaMask.");
        } else {
          alert("Error connecting to wallet. Please try again.");
        }
      }
    } else {
      alert("Please install MetaMask wallet");
    }
  };

  return (
    <div className="Header">
      <header className="main-header">
        <h1>ERC20 Minter Dapp</h1>
        {account ? (
          <p>Connected Account: {account}</p>
        ) : (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}
      </header>
    </div>
  );
}