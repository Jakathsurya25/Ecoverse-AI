"use client";

import React, { useState, useEffect } from "react";
import {
  Zap, Award, TrendingUp, Sparkles, Leaf, Shield,
  ChevronRight, Calendar, Info, RefreshCw, CheckCircle2
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area
} from "recharts";

import TrackActivityModal from "@/components/TrackActivityModal";

interface Recommendation {
  category: string;
  title: string;
  description: string;
  potentialSavingsCo2?: number;
  difficulty?: string;
}

interface DailyTrend {
  name: string;
  date: string;
  carbon: number;
  water: number;
  electricity: number;
}

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
  dailyTrends: DailyTrend[];
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
  co2SavedTransport?: number;
  ecoScoreImpact?: number;
  recordedAt?: string;
}

export default function DashboardConsole() {
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [ecoScore, setEcoScore] = useState(742);
  const [missions, setMissions] = useState([
    { id: 1, title: "Zero-Emission Commute", pts: 50, coins: 120, done: false },
    { id: 2, title: "Plant-Based Power Lunch", pts: 60, coins: 150, done: true },
    { id: 3, title: "Phantom Load Patrol", pts: 30, coins: 80, done: false },
  ]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loadingRecs, setLoadingRecs] = useState<boolean>(true);
  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary | null>(null);
  const [activitiesList, setActivitiesList] = useState<ActivityRecord[]>([]);

  const fetchEcoScore = () => {
    fetch("http://localhost:8080/api/eco-score")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data && typeof data.ecoScore === "number") {
          setEcoScore(data.ecoScore);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch persistent Eco Score:", err);
      });
  };

  const fetchChallenges = () => {
    fetch("http://localhost:8080/api/challenges")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            pts: item.pts || 50,
            coins: item.coins || item.ecoCoinsReward || 100,
            done: Boolean(item.done || item.completed),
            progressValue: item.progressValue,
            targetValue: item.targetValue,
            unit: item.unit,
          }));
          setMissions(mapped.slice(0, 5));
        }
      })
      .catch((err) => {
        console.error("Failed to fetch persistent challenges:", err);
      });
  };

  const fetchAnalyticsSummary = () => {
    fetch("http://localhost:8080/api/activities/summary")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data) {
          setAnalyticsSummary(data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch analytics summary:", err);
      });
  };

  const fetchActivitiesHistory = () => {
    fetch("http://localhost:8080/api/activities")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setActivitiesList(data.reverse());
        }
      })
      .catch((err) => {
        console.error("Failed to fetch activity history:", err);
      });
  };

  useEffect(() => {
    Promise.allSettled([
      fetchEcoScore(),
      fetchChallenges(),
      fetchAnalyticsSummary(),
      fetchActivitiesHistory(),
      fetch("http://localhost:8080/api/recommendations")
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setRecommendations(data.slice(0, 3));
          }
        })
        .catch((err) => {
          console.error("Failed to fetch AI recommendations:", err);
        })
        .finally(() => {
          setLoadingRecs(false);
        }),
    ]);
  }, []);

  const toggleMission = (id: number) => {
    fetch(`http://localhost:8080/api/challenges/${id}/complete`, {
      method: "POST",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data && (data.completed === true || data.done === true)) {
          setMissions((prev) =>
            prev.map((m) => (m.id === id ? { ...m, done: true } : m))
          );
          fetchEcoScore();
          fetchChallenges();
          fetchAnalyticsSummary();
          fetchActivitiesHistory();
        }
      })
      .catch((err) => {
        console.error("Failed to complete challenge:", err);
      });
  };

  const getCategoryStyle = (cat: string) => {
    const upper = cat?.toUpperCase() || "";
    if (upper.includes("ENERGY") || upper.includes("ELECTRICITY")) return "bg-yellow-500/20 text-yellow-400";
    if (upper.includes("FOOD")) return "bg-emerald-500/20 text-emerald-400";
    if (upper.includes("TRANSPORT")) return "bg-sky-500/20 text-sky-400";
    if (upper.includes("WATER")) return "bg-teal-500/20 text-teal-400";
    if (upper.includes("WASTE") || upper.includes("PLASTIC")) return "bg-purple-500/20 text-purple-400";
    return "bg-emerald-500/20 text-emerald-400";
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Track Activity Modal */}
      <TrackActivityModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        onSuccess={() => {
          fetchEcoScore();
          fetchChallenges();
          fetchAnalyticsSummary();
          fetchActivitiesHistory();
        }}
      />


      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">OS Console</h1>
          <p className="text-neutral-400 text-xs sm:text-sm">Welcome back, John. EcoVerse OS is running optimally.</p>
        </div>
        <div className="flex flex-wrap gap-2.5 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsTrackModalOpen(true)}
            className="flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg glow-border-emerald"
          >
            <Sparkles className="w-3.5 h-3.5" /> Track Activity
          </button>
          <button
            onClick={() => {
              fetchEcoScore();
              fetchAnalyticsSummary();
              fetchActivitiesHistory();
            }}
            className="px-3.5 sm:px-4 py-2 text-xs font-semibold glass-panel rounded-xl hover:bg-white/5 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-sync Devices
          </button>
          <div className="px-3.5 sm:px-4 py-2 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl flex items-center gap-2">
            <Shield className="w-3.5 h-3.5" /> EcoScore: Excellent ({ecoScore})
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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
            <span className="text-4xl font-display font-bold">
              {analyticsSummary ? analyticsSummary.totalCo2SavedTransportKg : 0}
            </span>
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
            <span className="text-4xl font-display font-bold text-sky-400 glow-text-sky">
              {analyticsSummary ? analyticsSummary.totalWaterLitres.toLocaleString("en-US") : 0}
            </span>
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
            <span className="text-4xl font-display font-bold">
              {analyticsSummary ? analyticsSummary.totalElectricityKwh : 0}
            </span>
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
              <AreaChart data={analyticsSummary?.dailyTrends && analyticsSummary.dailyTrends.length > 0 ? analyticsSummary.dailyTrends : []}>
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
            {loadingRecs ? (
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-neutral-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>Generating live AI directives from your activities...</span>
              </div>
            ) : recommendations.length > 0 ? (
              recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/25 transition-all"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getCategoryStyle(rec.category)}`}>
                        {rec.category}
                      </span>
                      {rec.difficulty && (
                        <span className="text-[10px] font-semibold text-neutral-400">
                          &bull; {rec.difficulty}
                        </span>
                      )}
                    </div>
                    {rec.potentialSavingsCo2 !== undefined && rec.potentialSavingsCo2 > 0 && (
                      <span className="text-[10px] font-semibold text-emerald-400">
                        -{rec.potentialSavingsCo2} kg CO₂
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{rec.title}</h4>
                  <p className="text-xs text-neutral-400">{rec.description}</p>
                </div>
              ))
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>

        {/* Interactive Eco Timeline */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-lg">Eco Timeline</h3>
          <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
            {activitiesList.length > 0 ? (
              activitiesList.slice(0, 5).map((act, idx) => (
                <div key={act.id || idx} className="relative flex items-start gap-4">
                  <div className={`absolute -left-[19px] w-2.5 h-2.5 rounded-full ring-4 ${
                    (act.transportDistanceKm || 0) > 0 ? "bg-sky-500 ring-sky-500/25" :
                    (act.electricityKwh || 0) > 0 ? "bg-yellow-500 ring-yellow-500/25" : "bg-emerald-500 ring-emerald-500/25"
                  }`} />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold">
                      {act.transportMode ? `${act.transportMode} Logged` : "Activity Logged"}
                    </span>
                    <span className="text-[10px] text-neutral-500">
                      {act.recordedAt ? new Date(act.recordedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recently"} &bull; {act.estimatedCo2EmissionsKg} kg CO₂
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-neutral-400 py-2">
                No activity history logged yet. Track your first activity above!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
