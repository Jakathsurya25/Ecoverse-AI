"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Zap, Globe, Sparkles, Award, ArrowRight, Activity, Leaf, Check } from "lucide-react";

export default function LandingPage() {
  const [globalStats, setGlobalStats] = useState({
    co2Saved: 1420580,
    treesPlanted: 84320,
    waterSaved: 54930200,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalStats((prev) => ({
        co2Saved: prev.co2Saved + Math.floor(Math.random() * 3) + 1,
        treesPlanted: prev.treesPlanted + (Math.random() > 0.85 ? 1 : 0),
        waterSaved: prev.waterSaved + Math.floor(Math.random() * 12) + 2,
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[55%] rounded-full bg-sky-500/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-sky-500 flex items-center justify-center font-bold text-white shadow-lg glow-border-emerald">
            E
          </div>
          <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            EcoVerse <span className="text-emerald-500">AI</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
          <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
          <a href="#twin" className="hover:text-emerald-400 transition-colors">Digital Twin</a>

        </nav>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="px-4 py-2 text-sm font-semibold text-neutral-300 hover:text-white transition-colors">
            Login
          </Link>
          <Link href="/dashboard" className="px-4 py-2 text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all duration-300 shadow-md shadow-emerald-500/20 hover:scale-105">
            Launch OS
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 md:px-12 flex flex-col items-center justify-center text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-white/10 text-xs text-neutral-400 font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          Autonomous Sustainability OS
        </div>

        <h1 className="font-display font-extrabold text-4xl md:text-7xl leading-tight max-w-5xl tracking-tight mb-6">
          The World's First <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">Autonomous Sustainability</span> Operating System
        </h1>

        <p className="text-neutral-400 text-base md:text-xl max-w-2xl mb-10 leading-relaxed">
          Say goodbye to manual calculators and generic lists. EcoVerse AI automatically parses bills, scans receipts, maps emissions, simulates your future, and grows a digital Twin Earth as you clean the real one.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link href="/dashboard" className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-105 flex items-center gap-2 justify-center">
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="#features" className="px-8 py-4 glass-panel border border-white/10 text-white font-semibold rounded-xl hover:bg-white/5 transition-colors flex items-center justify-center">
            Explore Engine
          </a>
        </div>

        {/* Floating animated earth / sphere mock */}
        <div className="relative w-80 h-80 md:w-[450px] md:h-[450px] rounded-full flex items-center justify-center mb-10">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/20 via-sky-500/10 to-transparent blur-3xl animate-pulse" />
          <div className="w-72 h-72 md:w-96 md:h-96 rounded-full glass-panel border-2 border-emerald-500/20 flex items-center justify-center relative overflow-hidden animate-spin-slow shadow-2xl shadow-emerald-500/10">
            {/* Mock Globe grid lines */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute top-1/4 left-1/4 w-12 h-12 rounded-full bg-sky-500/40 blur-lg" />
            <div className="absolute bottom-1/3 right-1/4 w-20 h-20 rounded-full bg-emerald-500/40 blur-lg" />
            <Globe className="w-32 h-32 md:w-44 md:h-44 text-emerald-400 opacity-60" />
          </div>
          {/* Orbiting particles */}
          <div className="absolute w-[360px] h-[360px] md:w-[500px] md:h-[500px] rounded-full border border-dashed border-white/10 animate-spin" style={{ animationDuration: '30s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-sky-400 shadow-[0_0_15px_#38bdf8] flex items-center justify-center">
              <Leaf className="w-2.5 h-2.5 text-black" />
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-[0_0_15px_#34d399]" />
          </div>
        </div>

        {/* Global Impact counters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mt-8">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col items-center">
            <span className="text-neutral-500 text-sm font-semibold uppercase tracking-wider mb-2">CO₂ Offsets Registered</span>
            <span className="text-3xl font-display font-bold text-emerald-400 glow-text-emerald">
              {globalStats.co2Saved.toLocaleString()} kg
            </span>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col items-center">
            <span className="text-neutral-500 text-sm font-semibold uppercase tracking-wider mb-2">Community Trees Planted</span>
            <span className="text-3xl font-display font-bold text-white">
              {globalStats.treesPlanted.toLocaleString()}
            </span>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col items-center">
            <span className="text-neutral-500 text-sm font-semibold uppercase tracking-wider mb-2">Clean Water Conserved</span>
            <span className="text-3xl font-display font-bold text-sky-400 glow-text-sky">
              {globalStats.waterSaved.toLocaleString()} L
            </span>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" className="py-24 px-6 md:px-12 relative z-10 border-t border-white/5 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl md:text-5xl mb-4">Sustainability, Re-Engineered.</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              We built an advanced framework to track and gamify sustainability seamlessly across campus, home, and commute.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Receipt Intelligence</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Scan grocery receipts, utility invoices, and retail receipts. Our AI automatically extracts line items, assesses plastic packaging risk, and estimates carbon impact.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Digital Twin Earth</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Your actions directly nurture a virtual environment. Reduce your electricity consumption to clean the virtual oceans, grow trees, and encourage wildlife in your digital ecosystem.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 mb-6 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Future Simulator</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                See direct long-term projections. Visualizes exactly where your current energy, eating, and travel footprints lead 1, 5, and 10 years down the line.
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-xs text-neutral-500">
        <div className="flex justify-center gap-6 mb-4">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Security</a>
        </div>
        <p>&copy; {new Date().getFullYear()} EcoVerse AI Inc. Building the OS for Earth.</p>
      </footer>
    </div>
  );
}
