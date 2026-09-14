"use client";

import React, { useState } from "react";
import {
  Zap, Award, TrendingUp, Sparkles, Leaf, Shield,
  ChevronRight, Calendar, Info, RefreshCw, CheckCircle2
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area
} from "recharts";

import TrackActivityModal from "@/components/TrackActivityModal";

const data = [
  { name: "Mon", carbon: 18, water: 220, electricity: 14 },
  { name: "Tue", carbon: 15, water: 190, electricity: 12 },
  { name: "Wed", carbon: 14, water: 170, electricity: 11 },
  { name: "Thu", carbon: 22, water: 310, electricity: 19 },
  { name: "Fri", carbon: 12, water: 150, electricity: 10 },
  { name: "Sat", carbon: 9, water: 120, electricity: 8 },
  { name: "Sun", carbon: 8, water: 100, electricity: 7 },
];

export default function DashboardConsole() {
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [ecoScore, setEcoScore] = useState(742);
  const [missions, setMissions] = useState([
    { id: 1, title: "Zero-Emission Commute", pts: 50, coins: 120, done: false },
    { id: 2, title: "Plant-Based Power Lunch", pts: 60, coins: 150, done: true },
    { id: 3, title: "Phantom Load Patrol", pts: 30, coins: 80, done: false },
  ]);

  const toggleMission = (id: number) => {
    setMissions(missions.map(m => m.id === id ? { ...m, done: !m.done } : m));
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Track Activity Modal */}
      <TrackActivityModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        onSuccess={(result) => {
          if (result?.ecoScoreImpact !== undefined && result?.ecoScoreImpact !== null) {
            setEcoScore((prev) =>
              Math.max(0, Math.min(1000, prev + result.ecoScoreImpact))
            );
          }
        }}
      />


      {/* Top Welcome Bar */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display font-bold text-3xl tracking-tight">OS Console</h1>
          <p className="text-neutral-400 text-sm">Welcome back, John. EcoVerse OS is running optimally.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsTrackModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl transition-all flex items-center gap-2 shadow-lg glow-border-emerald"
          >
            <Sparkles className="w-3.5 h-3.5" /> Track Activity
          </button>
          <button className="px-4 py-2 text-xs font-semibold glass-panel rounded-xl hover:bg-white/5 transition-colors flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5" /> Re-sync Devices
          </button>
          <div className="px-4 py-2 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl flex items-center gap-2">
            <Shield className="w-3.5 h-3.5" /> EcoScore: Excellent ({ecoScore})
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Eco Score</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-display font-bold text-emerald-400 glow-text-emerald">
              {ecoScore}
            </span>
            <span className="text-xs text-neutral-500">/ 1000</span>
          </div>
          <p className="text-xs text-neutral-400 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> +4.2% since last week
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">CO₂ Saved</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-display font-bold">148.2</span>
            <span className="text-xs text-neutral-500">kg</span>
          </div>
          <p className="text-xs text-neutral-400 mt-2">Offset equivalent to 6 trees</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Water Conserved</span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-display font-bold text-sky-400 glow-text-sky">1,240</span>
            <span className="text-xs text-neutral-500">Liters</span>
          </div>
          <p className="text-xs text-neutral-400 mt-2">Saved via smart flow meters</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Energy Efficiency</span>
            <Zap className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-display font-bold">85.4</span>
            <span className="text-xs text-neutral-500">kWh</span>
          </div>
          <p className="text-xs text-neutral-400 mt-2">12% below campus baseline</p>
        </div>
      </div>

      {/* Center Grid: Charts & Missions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Trend Chart */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">Consumption Profiles</h3>
              <p className="text-xs text-neutral-400">Consolidated emissions and resources over 7 days.</p>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-400 font-semibold">Carbon</span>
              <span className="px-2.5 py-1 rounded bg-sky-500/15 text-sky-400 font-semibold">Water</span>
              <span className="px-2.5 py-1 rounded bg-yellow-500/15 text-yellow-500 font-semibold">Energy</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#111827", borderColor: "rgba(255,255,255,0.08)" }}
                  labelStyle={{ color: "#9ca3af" }}
                />
                <Area type="monotone" dataKey="carbon" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCarbon)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Smart Missions */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-lg">AI Smart Challenges</h3>
                <p className="text-xs text-neutral-400">Dynamic personalized missions for today.</p>
              </div>
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>

            <div className="space-y-4">
              {missions.map((m) => (
                <div
                  key={m.id}
                  onClick={() => toggleMission(m.id)}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${m.done
                      ? "bg-emerald-500/5 border-emerald-500/20 text-neutral-400"
                      : "bg-white/5 border-white/5 hover:border-white/10"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className={`w-5 h-5 ${m.done ? "text-emerald-500" : "text-neutral-600"}`} />
                    <div className="flex flex-col">
                      <span className={`text-sm font-semibold ${m.done ? "line-through" : ""}`}>{m.title}</span>
                      <span className="text-[10px] text-neutral-500">+{m.coins} EcoCoins &bull; +{m.pts} XP</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-500" />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/5 text-center">
            <span className="text-[10px] text-neutral-500 flex items-center justify-center gap-1">
              <Info className="w-3.5 h-3.5" /> AI refills challenges in 14 hours.
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Grid: AI recommendations & recent timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recommendation Engine */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-lg">AI Coaching Directives</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/25 transition-all">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 text-[10px] font-bold uppercase">Energy</span>
                <h4 className="text-sm font-bold">Reschedule High-Drain Appliances</h4>
              </div>
              <p className="text-xs text-neutral-400">Peak hours spikes detected. Shift laundry and dishwashing to after 8 PM to lower grid load carbon intensity.</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/25 transition-all">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">Food</span>
                <h4 className="text-sm font-bold">Replace imported red beef</h4>
              </div>
              <p className="text-xs text-neutral-400">Scanned receipt items show carbon intensive meat choices. Swapping beef for local poultry cuts 80% emissions.</p>
            </div>
          </div>
        </div>

        {/* Interactive Eco Timeline */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-lg">Eco Timeline</h3>
          <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
            <div className="relative flex items-start gap-4">
              <div className="absolute -left-[19px] w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/25" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold">Grocery Receipt Scanned</span>
                <span className="text-[10px] text-neutral-500">2 hours ago &bull; Organic Foods Market</span>
              </div>
            </div>
            <div className="relative flex items-start gap-4">
              <div className="absolute -left-[19px] w-2.5 h-2.5 rounded-full bg-sky-500 ring-4 ring-sky-500/25" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold">Commute log registered</span>
                <span className="text-[10px] text-neutral-500">6 hours ago &bull; 8.4 km bike ride</span>
              </div>
            </div>
            <div className="relative flex items-start gap-4">
              <div className="absolute -left-[19px] w-2.5 h-2.5 rounded-full bg-yellow-500 ring-4 ring-yellow-500/25" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold">Electricity Bill Processed</span>
                <span className="text-[10px] text-neutral-500">1 day ago &bull; KWh usage down 14%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
