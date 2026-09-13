"use client";

import React, { useState, useEffect } from "react";
import { Globe, AlertTriangle, ArrowRight, ShieldAlert, Sparkles, TrendingUp, Info } from "lucide-react";
import { AISustainabilityEngine } from "@/services/ai";

export default function DigitalTwinPage() {
  const [timelineMode, setTimelineMode] = useState<"current" | "unsustainable" | "hyper">("current");
  const [selectedYear, setSelectedYear] = useState<1 | 5 | 10>(5);
  const [projections, setProjections] = useState<any[]>([]);

  useEffect(() => {
    const baseCo2 = 420; // kg CO2 monthly average
    let multiplier = 1.0;
    if (timelineMode === "unsustainable") multiplier = 2.4;
    if (timelineMode === "hyper") multiplier = 0.35;

    AISustainabilityEngine.predictFutureEmissions(baseCo2, multiplier).then((res) => {
      setProjections(res);
    });
  }, [timelineMode]);

  const activeProj = projections.find(p => p.year === selectedYear) || {
    emissions: 0,
    moneyWasted: 0,
    treesLost: 0,
    waterWasted: 0
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Page Header */}
      <div>
        <h1 className="font-display font-bold text-3xl tracking-tight">AI Digital Twin & Future Simulator</h1>
        <p className="text-neutral-400 text-sm">Visualize your environmental shadow and run forward simulation models.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Globe / Digital Twin */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-1 space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">My Twin Earth</h3>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-semibold">Active State: Healthy</span>
            </div>
            <p className="text-xs text-neutral-400">Your real-life activities maintain your digital planet's health.</p>
          </div>

          {/* Glowing Mock Earth */}
          <div className="relative w-full h-64 flex items-center justify-center bg-black/40 rounded-xl overflow-hidden border border-white/5">
            <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />
            <div className={`w-36 h-36 rounded-full border-2 border-dashed flex items-center justify-center transition-colors duration-500 ${
              timelineMode === "unsustainable" ? "border-red-500/30" : "border-emerald-500/30"
            }`}>
              <Globe className={`w-20 h-20 transition-colors duration-500 ${
                timelineMode === "unsustainable" ? "text-red-400" : timelineMode === "hyper" ? "text-emerald-400 glow-text-emerald" : "text-sky-400"
              }`} />
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-neutral-400">Ocean Plastic Index</span>
              <span className={`font-semibold ${timelineMode === "unsustainable" ? "text-red-400" : "text-emerald-400"}`}>
                {timelineMode === "unsustainable" ? "High Risk (78%)" : "Optimal (12%)"}
              </span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-neutral-400">Forest Density</span>
              <span className={`font-semibold ${timelineMode === "unsustainable" ? "text-red-400" : "text-emerald-400"}`}>
                {timelineMode === "unsustainable" ? "34% Loss" : "94% Growth"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Wildlife Biodiversity</span>
              <span className="text-white font-semibold">
                {timelineMode === "unsustainable" ? "Severely Restricted" : "Thriving"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Simulator */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">Impact Timeline Projections</h3>
              <p className="text-xs text-neutral-400">Simulate where your current consumption path takes you.</p>
            </div>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>

          {/* Mode Selector */}
          <div className="grid grid-cols-3 gap-3 p-1 bg-black/40 rounded-xl border border-white/5">
            <button
              onClick={() => setTimelineMode("hyper")}
              className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
                timelineMode === "hyper" ? "bg-emerald-500 text-black" : "text-neutral-400 hover:text-white"
              }`}
            >
              Hyper Eco-Conscious
            </button>
            <button
              onClick={() => setTimelineMode("current")}
              className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
                timelineMode === "current" ? "bg-white/10 text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              Current Profile
            </button>
            <button
              onClick={() => setTimelineMode("unsustainable")}
              className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
                timelineMode === "unsustainable" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "text-neutral-400 hover:text-white"
              }`}
            >
              Unsustainable Life
            </button>
          </div>

          {/* Year Slider buttons */}
          <div className="flex justify-center gap-4">
            {[1, 5, 10].map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr as any)}
                className={`w-16 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  selectedYear === yr
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-neutral-400 border-white/10 hover:border-white/20"
                }`}
              >
                {yr} Year
              </button>
            ))}
          </div>

          {/* Simulation outputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-neutral-500">Projected CO₂ Footprint</span>
              <span className={`text-2xl font-bold font-display mt-2 ${
                timelineMode === "unsustainable" ? "text-red-400" : "text-white"
              }`}>
                {activeProj.emissions.toLocaleString()} kg
              </span>
              <span className="text-[10px] text-neutral-400 mt-1">Based on current lifestyle factors</span>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-neutral-500">Utility Cost Burn</span>
              <span className="text-2xl font-bold font-display mt-2 text-yellow-400">
                ${activeProj.moneyWasted.toLocaleString()}
              </span>
              <span className="text-[10px] text-neutral-400 mt-1">Energy and water expenses</span>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-neutral-500">Environmental Deforest Index</span>
              <span className="text-2xl font-bold font-display mt-2 text-emerald-400">
                {activeProj.treesLost.toLocaleString()} trees lost
              </span>
              <span className="text-[10px] text-neutral-400 mt-1">Offset absorption power lost</span>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-neutral-500">Freshwater Footprint</span>
              <span className="text-2xl font-bold font-display mt-2 text-sky-400">
                {activeProj.waterWasted.toLocaleString()} Liters
              </span>
              <span className="text-[10px] text-neutral-400 mt-1">Freshwater extraction volume</span>
            </div>
          </div>

          {timelineMode === "unsustainable" && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex flex-col text-xs text-red-300">
                <span className="font-bold">Unsustainability Spike Detected</span>
                <span>If your current footprint compounding rate goes unchecked, your environmental credit deficit will hit an unrecoverable index by year 10. Recommend launching AI coaching immediately.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
