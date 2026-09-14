"use client";

import React, { useState, useEffect } from "react";
import { Award, ShieldCheck, Mail, MapPin, Printer } from "lucide-react";

interface AnalyticsSummary {
  totalActivities: number;
  totalCo2EmissionsKg: number;
  totalCo2SavedTransportKg: number;
  totalTransportDistanceKm: number;
  totalElectricityKwh: number;
  totalWaterLitres: number;
  totalPlasticKg: number;
  totalWasteKg: number;
  activeDays: number;
}

interface WalletData {
  id: number;
  balance: number;
  lifetimeEarned: number;
  equivalentOffsetsTons: number;
  treesPlanted: number;
  realWorldImpactText: string;
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  category: string;
  targetValue: number;
  unit: string;
  ecoCoinsReward: number;
  difficulty: string;
  completed: boolean;
  done?: boolean;
}

interface ActivityRecord {
  id: number;
  transportMode?: string;
  transportDistanceKm?: number;
  electricityKwh?: number;
  waterLitres?: number;
  plasticKg?: number;
  wasteKg?: number;
  estimatedCo2EmissionsKg?: number;
  recordedAt?: string;
}

export default function ResumePage() {
  const [ecoScore, setEcoScore] = useState<number>(0);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<Challenge[]>([]);
  const [activitiesList, setActivitiesList] = useState<ActivityRecord[]>([]);

  useEffect(() => {
    Promise.allSettled([
      fetch("http://localhost:8080/api/eco-score")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && typeof data.ecoScore === "number") setEcoScore(data.ecoScore);
        }),
      fetch("http://localhost:8080/api/activities/summary")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setAnalytics(data);
        }),
      fetch("http://localhost:8080/api/wallet")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setWallet(data);
        }),
      fetch("http://localhost:8080/api/challenges")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data)) {
            const doneOnly = data.filter((c: any) => Boolean(c.completed || c.done));
            setCompletedChallenges(doneOnly);
          }
        }),
      fetch("http://localhost:8080/api/activities")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data)) setActivitiesList(data.reverse());
        }),
    ]);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const getImpactLabel = () => {
    if (wallet && typeof wallet.treesPlanted === "number" && wallet.treesPlanted > 0) {
      return `${wallet.treesPlanted} Tree${wallet.treesPlanted > 1 ? "s" : ""} Planted`;
    }
    return "Prototype Impact Tracking";
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="font-display font-bold text-3xl tracking-tight">Eco Resume</h1>
          <p className="text-neutral-400 text-sm">Generate and export a certified resume showcasing your environmental accomplishments.</p>
        </div>
        <button 
          onClick={handlePrint}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/10 transition-all hover:scale-105"
        >
          <Printer className="w-3.5 h-3.5" /> Print / Export PDF
        </button>
      </div>

      {/* Printable Resume Card */}
      <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent max-w-4xl mx-auto shadow-2xl space-y-8 relative overflow-hidden print:bg-white print:text-black print:p-0 print:border-none print:shadow-none">
        {/* Glow grid lines in resume */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none print:hidden" />
        
        {/* Profile Card */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-white/10 print:border-black/10">
          <div>
            <h2 className="font-display font-bold text-2xl text-white print:text-black">John Doe</h2>
            <p className="text-emerald-400 text-sm font-semibold mt-1">Sustainability Practitioner &bull; Rank #42</p>
            <div className="flex gap-4 text-xs text-neutral-400 mt-3 print:text-neutral-700">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Campus Section B</span>
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> john.doe@university.edu</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 px-4 py-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 rounded-2xl flex items-center gap-2 print:border-black/20 print:text-black">
            <ShieldCheck className="w-5 h-5 text-emerald-400 print:text-black" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-neutral-400 print:text-neutral-700 uppercase font-bold leading-none">EcoScore index</span>
              <span className="text-lg font-bold font-display leading-tight">{ecoScore} / 1000</span>
            </div>
          </div>
        </div>

        {/* Impact Numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center print:border-black/10">
            <span className="text-[10px] text-neutral-500 print:text-neutral-700 font-bold uppercase">CO₂ Saved Transport</span>
            <p className="text-xl font-bold mt-1 text-emerald-400">{analytics ? analytics.totalCo2SavedTransportKg : 0} kg</p>
          </div>
          <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center print:border-black/10">
            <span className="text-[10px] text-neutral-500 print:text-neutral-700 font-bold uppercase">Water Tracked</span>
            <p className="text-xl font-bold mt-1 text-sky-400">{analytics ? analytics.totalWaterLitres.toLocaleString("en-US") : 0} L</p>
          </div>
          <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center print:border-black/10">
            <span className="text-[10px] text-neutral-500 print:text-neutral-700 font-bold uppercase">Energy Tracked</span>
            <p className="text-xl font-bold mt-1 text-white print:text-black">{analytics ? analytics.totalElectricityKwh : 0} kWh</p>
          </div>
          <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center print:border-black/10">
            <span className="text-[10px] text-neutral-500 print:text-neutral-700 font-bold uppercase">Eco Impact Record</span>
            <p className="text-xl font-bold mt-1 text-yellow-400">{getImpactLabel()}</p>
          </div>
        </div>

        {/* Badges Achievements */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-neutral-400 print:text-neutral-800 uppercase tracking-wider">Completed Eco Challenges</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {completedChallenges.length > 0 ? (
              completedChallenges.map((item) => (
                <div key={item.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex gap-3 print:border-black/10">
                  <Award className={`w-8 h-8 ${
                    item.difficulty === "HARD" ? "text-sky-400 animate-pulse" : item.difficulty === "MEDIUM" ? "text-yellow-400" : "text-emerald-400"
                  }`} />
                  <div className="flex flex-col text-xs">
                    <span className="font-bold text-white print:text-black">{item.title}</span>
                    <span className="text-neutral-400 mt-1 leading-relaxed print:text-neutral-700">{item.description}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl col-span-3 text-xs text-neutral-400 text-center">
                No eco achievements earned yet.
              </div>
            )}
          </div>
        </div>

        {/* Recent Ledger */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-neutral-400 print:text-neutral-800 uppercase tracking-wider">Verified Activities Log</h3>
          <div className="space-y-3">
            {activitiesList.length > 0 ? (
              activitiesList.slice(0, 5).map((item) => (
                <div key={item.id} className="flex gap-4 items-start text-xs border-b border-white/5 pb-3 print:border-black/10">
                  <span className="font-bold text-emerald-400 w-24 shrink-0 print:text-emerald-600">
                    {item.recordedAt ? new Date(item.recordedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Recent"}
                  </span>
                  <span className="text-neutral-300 print:text-black">
                    {item.transportMode ? `${item.transportMode} commute (${item.transportDistanceKm} km)` : "Logged environmental activity"} &bull; {item.estimatedCo2EmissionsKg} kg CO₂
                  </span>
                </div>
              ))
            ) : (
              <div className="text-xs text-neutral-400 py-2">
                No activity history logged yet. Track your first activity to update your resume!
              </div>
            )}
          </div>
        </div>

        {/* Footer verification info */}
        <div className="pt-6 border-t border-white/10 text-center text-[10px] text-neutral-500 flex justify-between items-center print:border-black/10 print:text-neutral-700">
          <span>Verification Hash: SHA256-EC0V3RS3A1L0G</span>
          <span>EcoVerse Autonomous OS Certified</span>
        </div>
      </div>
    </div>
  );
}
