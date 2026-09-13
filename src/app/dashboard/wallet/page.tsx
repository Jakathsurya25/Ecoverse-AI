"use client";

import React, { useState } from "react";
import { Coins, Heart, ShoppingBag, Leaf, Gift, ArrowDownRight, ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function WalletPage() {
  const [balance, setBalance] = useState(2450);
  const [showRedeemSuccess, setShowRedeemSuccess] = useState(false);
  const [redeemedItem, setRedeemedItem] = useState("");

  const transactions = [
    { id: 1, desc: "Recycling Photo Upload (PET Plastic)", amount: 15, type: "EARN", date: "Today" },
    { id: 2, desc: "Completed Challenge: Plant-Based Power", amount: 150, type: "EARN", date: "Today" },
    { id: 3, desc: "Utility Bill OCR Bonus", amount: 100, type: "EARN", date: "Yesterday" },
    { id: 4, desc: "Redemption: Plant 1 Tree (WWF Initiative)", amount: -500, type: "SPEND", date: "2 days ago" },
    { id: 5, desc: "Completed Challenge: Phantom Load Patrol", amount: 80, type: "EARN", date: "3 days ago" },
  ];

  const handleRedeem = (item: string, cost: number) => {
    if (balance >= cost) {
      setBalance(balance - cost);
      setRedeemedItem(item);
      setShowRedeemSuccess(true);
      setTimeout(() => setShowRedeemSuccess(false), 3000);
    } else {
      alert("Insufficient EcoCoins balance.");
    }
  };

  const marketplaceItems = [
    { title: "Plant 1 Tree (WWF)", desc: "We'll plant a real mangrove tree in Kenya. Includes digital tree log.", cost: 500, type: "tree", icon: Leaf },
    { title: "$10 Donation to Greenpeace", desc: "Contribute to ocean conservation and anti-plastic campaigns.", cost: 1000, type: "ngo", icon: Heart },
    { title: "Eco-Friendly Bamboo Tumbler", desc: "A double-insulated tumbler to replace single-use coffee cups.", cost: 800, type: "product", icon: ShoppingBag },
    { title: "100kg CO₂ Carbon Offset", desc: "Purchase certified carbon credits to offset your transport activities.", cost: 400, type: "offset", icon: Gift },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display font-bold text-3xl tracking-tight">Carbon Wallet</h1>
          <p className="text-neutral-400 text-sm">Earn EcoCoins via sustainable activities and redeem them for offsets or products.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <Coins className="w-4 h-4 text-emerald-400" />
          <span className="font-display font-bold text-emerald-400">{balance.toLocaleString()} EcoCoins</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Equivalent Offsets</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-display font-bold text-white">2.45</span>
            <span className="text-xs text-neutral-500">Tons CO₂</span>
          </div>
          <p className="text-xs text-neutral-400 mt-2">Corresponds to your total accumulated EcoCoins</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Total Coins Earned</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-display font-bold text-emerald-400 glow-text-emerald">2,950</span>
            <span className="text-xs text-neutral-500">EcoCoins</span>
          </div>
          <p className="text-xs text-neutral-400 mt-2">Cumulative lifetime earnings</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Real-world Impact</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-display font-bold text-sky-400 glow-text-sky">1 Tree</span>
            <span className="text-xs text-neutral-500">Planted</span>
          </div>
          <p className="text-xs text-neutral-400 mt-2">Contributed via previous redemptions</p>
        </div>
      </div>

      {/* Success notification popup */}
      {showRedeemSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <div className="flex flex-col text-xs text-emerald-300">
            <span className="font-bold">Redemption Approved!</span>
            <span>Successfully redeemed <strong>{redeemedItem}</strong>. Your EcoCoins balance has been updated.</span>
          </div>
        </div>
      )}

      {/* Bottom Grid: Market vs Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Marketplace */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 space-y-6">
          <h3 className="font-bold text-lg">Eco-Marketplace</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketplaceItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-5 bg-white/5 border border-white/5 hover:border-emerald-500/25 rounded-2xl transition-all flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-emerald-400">{item.cost} Coins</span>
                    </div>
                    <h4 className="text-sm font-bold mt-4">{item.title}</h4>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                  <button 
                    onClick={() => handleRedeem(item.title, item.cost)}
                    className="w-full py-2 bg-white/5 hover:bg-emerald-500 hover:text-black rounded-lg text-xs font-semibold transition-colors"
                  >
                    Redeem Reward
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transactions Ledger */}
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <h3 className="font-bold text-lg">Carbon Ledger</h3>
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex justify-between items-center text-xs">
                <div className="flex gap-3 items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    tx.type === "EARN" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                  }`}>
                    {tx.type === "EARN" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-white max-w-[160px] truncate">{tx.desc}</span>
                    <span className="text-[10px] text-neutral-500">{tx.date}</span>
                  </div>
                </div>
                <span className={`font-bold ${tx.type === "EARN" ? "text-emerald-400" : "text-red-400"}`}>
                  {tx.type === "EARN" ? "+" : ""}{tx.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
