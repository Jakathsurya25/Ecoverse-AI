"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Globe, LayoutDashboard, Scan, Wallet, Users, 
  MessageSquare, FileText, LogOut 
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { name: "OS Console", path: "/dashboard", icon: LayoutDashboard },
    { name: "Digital Twin", path: "/dashboard/digital-twin", icon: Globe },
    { name: "Receipt & Bill Scan", path: "/dashboard/scan", icon: Scan },
    { name: "Carbon Wallet", path: "/dashboard/wallet", icon: Wallet },
    { name: "Community Forest", path: "/dashboard/community", icon: Users },
    { name: "AI Coach", path: "/dashboard/ai-chat", icon: MessageSquare },
    { name: "Eco Resume", path: "/dashboard/resume", icon: FileText },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      {/* Sidebar */}
      <aside className="w-64 glass-panel border-r border-white/5 flex flex-col justify-between fixed top-0 bottom-0 left-0 z-30">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-white/5 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-sky-500 flex items-center justify-center font-bold text-white shadow-lg glow-border-emerald">
              E
            </div>
            <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              EcoVerse <span className="text-emerald-500">OS</span>
            </span>
          </div>

          {/* Menu Items */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                      : "text-neutral-400 hover:bg-white/5 hover:text-white border border-transparent"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-neutral-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-white/5 space-y-3">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-xs">
              JD
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold">John Doe</span>
              <span className="text-[10px] text-neutral-500">Eco-Score Rank #42</span>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl text-xs font-medium transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout Session
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 pl-64 min-h-screen">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
