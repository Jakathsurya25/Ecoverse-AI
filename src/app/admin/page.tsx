"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldAlert, Users, Server, FileText, CheckSquare, PlusCircle, Trash, RefreshCw } from "lucide-react";

export default function AdminDashboard() {
  const [challenges, setChallenges] = useState([
    { id: "c-1", title: "Zero-Emission Commute", metric: "TRANSPORT", reward: 120 },
    { id: "c-2", title: "Plant-Based Power Lunch", metric: "FOOD", reward: 150 },
    { id: "c-3", title: "Phantom Load Patrol", metric: "ENERGY", reward: 80 }
  ]);
  const [newTitle, setNewTitle] = useState("");
  const [newMetric, setNewMetric] = useState("ENERGY");
  const [newReward, setNewReward] = useState(100);

  const addChallenge = () => {
    if (!newTitle.trim()) return;
    const item = {
      id: `c-${challenges.length + 1}`,
      title: newTitle,
      metric: newMetric,
      reward: Number(newReward)
    };
    setChallenges([...challenges, item]);
    setNewTitle("");
  };

  const deleteChallenge = (id: string) => {
    setChallenges(challenges.filter(c => c.id !== id));
  };

  const auditLogs = [
    { time: "10:35 AM", user: "system-engine", action: "Triggered Daily AI Smart Challenges reset for 1,420 active users." },
    { time: "09:42 AM", user: "john.doe@university.edu", action: "Uploaded grocery receipt. OCR scan completed successfully." },
    { time: "08:15 AM", user: "admin-principal", action: "Modified marketplace item price for 'Plant 1 Tree (WWF)'." },
    { time: "07:00 AM", user: "cron-job", action: "Recalculated campus department rankings index." }
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-400" />
            <h1 className="font-display font-bold text-3xl tracking-tight">Admin Panel</h1>
          </div>
          <p className="text-neutral-400 text-sm">System oversight, challenge generation, audit trails and database health.</p>
        </div>
        <Link href="/dashboard" className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-semibold transition-colors">
          Return to Console
        </Link>
      </div>

      {/* Analytics widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel p-5 rounded-2xl">
          <div className="flex justify-between items-center text-neutral-400 text-xs uppercase font-bold">
            <span>Total Active Profiles</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-display mt-2">1,420</p>
          <span className="text-[10px] text-emerald-400">+12 registered today</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <div className="flex justify-between items-center text-neutral-400 text-xs uppercase font-bold">
            <span>OCR Queue Size</span>
            <Server className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold font-display mt-2">0 Pending</p>
          <span className="text-[10px] text-neutral-400">Processing speed: 1.2s avg</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <div className="flex justify-between items-center text-neutral-400 text-xs uppercase font-bold">
            <span>AI Token Load</span>
            <FileText className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold font-display mt-2">84.2K</p>
          <span className="text-[10px] text-neutral-400">Monthly budget: 15% used</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <div className="flex justify-between items-center text-neutral-400 text-xs uppercase font-bold">
            <span>Database Health</span>
            <Server className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <p className="text-2xl font-bold font-display mt-2">Nominal</p>
          <span className="text-[10px] text-emerald-400">Uptime: 99.98%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Challenge Manager */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 space-y-6">
          <h3 className="font-bold text-lg flex items-center gap-2"><CheckSquare className="w-5 h-5 text-emerald-400" /> Challenge Management</h3>
          
          {/* Add form */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
            <input 
              type="text" 
              placeholder="Challenge Title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none text-white md:col-span-2"
            />
            <select
              value={newMetric}
              onChange={(e) => setNewMetric(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-neutral-300 focus:outline-none"
            >
              <option value="ENERGY">ENERGY</option>
              <option value="FOOD">FOOD</option>
              <option value="TRANSPORT">TRANSPORT</option>
              <option value="WASTE">WASTE</option>
            </select>
            <button 
              onClick={addChallenge}
              className="py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-lg text-xs flex items-center justify-center gap-1 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Add Mission
            </button>
          </div>

          {/* Active Missions list */}
          <div className="space-y-3">
            {challenges.map((c) => (
              <div key={c.id} className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-xl text-xs">
                <div className="flex flex-col">
                  <span className="font-semibold text-white">{c.title}</span>
                  <span className="text-[10px] text-neutral-500">Metric: {c.metric} &bull; Reward: {c.reward} EcoCoins</span>
                </div>
                <button 
                  onClick={() => deleteChallenge(c.id)}
                  className="p-2 text-neutral-500 hover:text-red-400 transition-colors"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log */}
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <h3 className="font-bold text-lg flex items-center gap-2"><RefreshCw className="w-5 h-5 text-red-400" /> Security Audit Log</h3>
          <div className="space-y-4">
            {auditLogs.map((log, idx) => (
              <div key={idx} className="text-xs space-y-1 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-neutral-400">{log.user}</span>
                  <span className="text-[10px] text-neutral-500">{log.time}</span>
                </div>
                <p className="text-neutral-300 leading-relaxed">{log.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
