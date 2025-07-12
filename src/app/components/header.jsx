"use client"

import { useState } from "react";
import { TEST_TOKEN_ADDRESS, TEST_TOKEN_ABI } from "../constats";
import { ethers } from "ethers";


export default function Header() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const accounts = await provider.send('eth_requestAccounts', []);
        setAccount(accounts[0]);
        const newContract = new ethers.Contract(TEST_TOKEN_ADDRESS, TEST_TOKEN_ABI, signer);
        setContract(newContract);
        console.log("contract set", newContract);
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

  const getBalance = async () =>{
    if(contract){
        try {
            const userBalance = await contract.getUserBalance();
            setBalance(ethers.formatEther(userBalance)); //convert from gwei to ETH 
        } catch (error) {
            console.log("Error fetching balance");
        }
    }
  }

  return (
    <div className="Header">
      <header className="main-header">
        <h1>ERC20 Minter Dapp</h1>
        {account ? (
          <>
            <p>Connected Account: {account}</p>
            <button onClick={getBalance}>Get balance:</button>
            {balance && <p>Token Balance: {balance} STT</p>}
          </>
          ) : (
          
            <button onClick={connectWallet}>Connect Wallet</button>
        )}
      </header>
    </div>
  );
}