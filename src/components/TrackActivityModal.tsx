"use client";

import React, { useState } from "react";
import { X, Car, Zap, Droplets, Trash2, Box, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

interface TrackActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function TrackActivityModal({ isOpen, onClose, onSuccess }: TrackActivityModalProps) {
  const [formData, setFormData] = useState({
    transportMode: "BICYCLE_WALKING",
    transportDistanceKm: "",
    electricityKwh: "",
    waterLitres: "",
    plasticKg: "",
    wasteKg: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const payload = {
      transportMode: formData.transportMode,
      transportDistanceKm: formData.transportDistanceKm ? parseFloat(formData.transportDistanceKm) : 0,
      electricityKwh: formData.electricityKwh ? parseFloat(formData.electricityKwh) : 0,
      waterLitres: formData.waterLitres ? parseFloat(formData.waterLitres) : 0,
      plasticKg: formData.plasticKg ? parseFloat(formData.plasticKg) : 0,
      wasteKg: formData.wasteKg ? parseFloat(formData.wasteKg) : 0,
    };

    try {
      const res = await fetch("http://localhost:8080/api/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to submit activity to Spring Boot backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFormData({
      transportMode: "BICYCLE_WALKING",
      transportDistanceKm: "",
      electricityKwh: "",
      waterLitres: "",
      plasticKg: "",
      wasteKg: "",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg glow-border-emerald">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-white">Track Today's Activity</h2>
            <p className="text-xs text-neutral-400">Record your daily inputs to calculate environmental impact.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        {result ? (
          /* Result Summary View */
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-emerald-300">Activity Logged & Calculated</h4>
                <p className="text-xs text-neutral-400">{result.message || "Calculated via Spring Boot Backend."}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-panel p-4 rounded-xl text-center">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Estimated CO₂ Footprint</span>
                <p className="text-2xl font-bold text-white mt-1">{result.estimatedCo2EmissionsKg} <span className="text-xs text-neutral-400">kg</span></p>
              </div>

              <div className="glass-panel p-4 rounded-xl text-center">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">CO₂ Saved vs Baseline</span>
                <p className="text-2xl font-bold text-emerald-400 glow-text-emerald mt-1">{result.co2SavedTransport} <span className="text-xs text-neutral-400">kg</span></p>
              </div>

              <div className="glass-panel p-4 rounded-xl text-center">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Eco Score Impact</span>
                <p className="text-2xl font-bold text-sky-400 glow-text-sky mt-1">+{result.ecoScoreImpact} <span className="text-xs text-neutral-400">pts</span></p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleReset}
                className="flex-1 py-3 text-xs font-semibold glass-panel rounded-xl hover:bg-white/10 transition-colors"
              >
                Log Another Activity
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all shadow-lg glow-border-emerald"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Activity Form Input View */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. Transportation */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-2">
                <Car className="w-4 h-4 text-emerald-400" /> Transportation
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  name="transportMode"
                  value={formData.transportMode}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-900/80 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="BICYCLE_WALKING">Bicycle / Walking (Zero Emission)</option>
                  <option value="PUBLIC_BUS">Public Bus</option>
                  <option value="TRAIN">Train / Metro</option>
                  <option value="CAR_EV">Electric Vehicle (EV)</option>
                  <option value="CAR_GASOLINE">Gasoline / Diesel Car</option>
                </select>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    name="transportDistanceKm"
                    placeholder="Distance"
                    value={formData.transportDistanceKm}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-900/80 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 pr-12"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-neutral-500 font-medium">km</span>
                </div>
              </div>
            </div>

            {/* 2. Electricity */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" /> Electricity
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  name="electricityKwh"
                  placeholder="Electricity Consumption"
                  value={formData.electricityKwh}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-900/80 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 pr-14"
                />
                <span className="absolute right-3 top-2.5 text-xs text-neutral-500 font-medium">kWh</span>
              </div>
            </div>

            {/* 3. Water */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-sky-400" /> Water
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="1"
                  min="0"
                  name="waterLitres"
                  placeholder="Water Usage"
                  value={formData.waterLitres}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-900/80 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 pr-14"
                />
                <span className="absolute right-3 top-2.5 text-xs text-neutral-500 font-medium">litres</span>
              </div>
            </div>

            {/* 4. Plastic */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-2">
                <Box className="w-4 h-4 text-purple-400" /> Plastic
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="plasticKg"
                  placeholder="Plastic Quantity"
                  value={formData.plasticKg}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-900/80 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 pr-12"
                />
                <span className="absolute right-3 top-2.5 text-xs text-neutral-500 font-medium">kg</span>
              </div>
            </div>

            {/* 5. Waste */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-orange-400" /> Waste
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="wasteKg"
                  placeholder="Waste Quantity"
                  value={formData.wasteKg}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-900/80 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 pr-12"
                />
                <span className="absolute right-3 top-2.5 text-xs text-neutral-500 font-medium">kg</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all flex items-center justify-center gap-2 shadow-lg glow-border-emerald disabled:opacity-50"
            >
              {loading ? (
                "Calculating Impact via Backend..."
              ) : (
                <>
                  Submit Activity <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
