"use client";

import React from "react";
import { Users, Award, ShieldAlert, Leaf, CheckCircle2 } from "lucide-react";

export default function CommunityPage() {
  const departments = [
    { rank: 1, name: "Computer Science & Eng", index: 86.4, members: 342, trees: 124 },
    { rank: 2, name: "Business School", index: 81.2, members: 290, trees: 98 },
    { rank: 3, name: "Mechanical Engineering", index: 78.5, members: 215, trees: 82 },
    { rank: 4, name: "Biotechnology Dept", index: 74.0, members: 160, trees: 45 },
    { rank: 5, name: "School of Design", index: 72.8, members: 198, trees: 52 },
  ];

  const friendsList = [
    { rank: 1, name: "Alice Smith", score: 795, co2Saved: 190 },
    { rank: 2, name: "John Doe (You)", score: 742, co2Saved: 148 },
    { rank: 3, name: "Bob Johnson", score: 710, co2Saved: 120 },
    { rank: 4, name: "Charlie Brown", score: 685, co2Saved: 95 },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-3xl tracking-tight">Community Forest</h1>
        <p className="text-neutral-400 text-sm">Join teams, compare campus metrics, and grow the shared university forest.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Campus Sustainability Index</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-display font-bold text-emerald-400 glow-text-emerald">78.5%</span>
            <span className="text-xs text-neutral-500">Tier A</span>
          </div>
          <p className="text-xs text-neutral-400 mt-2">Calculated from 1,200 active campus profiles</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Community Forest Size</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-display font-bold text-white">401</span>
            <span className="text-xs text-neutral-500">Active Trees</span>
          </div>
          <p className="text-xs text-neutral-400 mt-2">Total trees planted collectively this semester</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Campus Active Rank</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-display font-bold text-sky-400 glow-text-sky">#3</span>
            <span className="text-xs text-neutral-500">out of 12 colleges</span>
          </div>
          <p className="text-xs text-neutral-400 mt-2">Updated daily at midnight</p>
        </div>
      </div>

      {/* Community Forest Grid */}
      <div className="glass-panel p-6 rounded-2xl space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">Shared Campus Forest Canopy</h3>
            <p className="text-xs text-neutral-400">Interactive representation of trees grown through completed campus challenges.</p>
          </div>
          <Leaf className="w-5 h-5 text-emerald-400" />
        </div>

        {/* Forest Grid Mock */}
        <div className="p-8 bg-black/40 rounded-xl border border-white/5 flex flex-wrap gap-4 justify-center">
          {Array.from({ length: 48 }).map((_, idx) => {
            const growthStage = idx % 3 === 0 ? "mature" : idx % 3 === 1 ? "young" : "sapling";
            return (
              <div 
                key={idx}
                className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-300 hover:scale-115 ${
                  growthStage === "mature" 
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)]" 
                    : growthStage === "young"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                    : "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
                }`}
                title={`Tree #${idx + 1} - Stage: ${growthStage.toUpperCase()}`}
              >
                <Leaf className="w-4 h-4" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Rankings */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-lg">Department Leaderboard</h3>
          <div className="space-y-3">
            {departments.map((dept) => (
              <div key={dept.rank} className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-xl text-xs">
                <div className="flex gap-3 items-center">
                  <span className="w-5 font-bold text-neutral-500">#{dept.rank}</span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">{dept.name}</span>
                    <span className="text-[10px] text-neutral-500">{dept.members} Members &bull; {dept.trees} Trees</span>
                  </div>
                </div>
                <span className="font-bold text-emerald-400">{dept.index} Index</span>
              </div>
            ))}
          </div>
        </div>

        {/* Friends Rankings */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-lg">Friends Standing</h3>
          <div className="space-y-3">
            {friendsList.map((friend) => (
              <div key={friend.rank} className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-xl text-xs">
                <div className="flex gap-3 items-center">
                  <span className="w-5 font-bold text-neutral-500">#{friend.rank}</span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">{friend.name}</span>
                    <span className="text-[10px] text-neutral-500">CO₂ Saved: {friend.co2Saved} kg</span>
                  </div>
                </div>
                <span className="font-bold text-sky-400">{friend.score} XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
