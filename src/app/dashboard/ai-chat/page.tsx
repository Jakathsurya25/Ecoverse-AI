"use client";

import React, { useState } from "react";
import { MessageSquare, Send, Sparkles, User, ShieldAlert } from "lucide-react";
import { AISustainabilityEngine, ChatMessage } from "@/services/ai";

export default function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: "AI", message: "Hello John! I have analyzed your carbon history. Your electricity usage has a peak spike. How can I help you improve your sustainability standing today?", timestamp: "10:00 AM" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (presetText?: string) => {
    const text = presetText || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = { sender: "USER", message: text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    if (!presetText) setInput("");
    setLoading(true);

    setTimeout(async () => {
      const responseText = await AISustainabilityEngine.chatWithCoach(text, messages);
      const aiMsg: ChatMessage = { 
        sender: "AI", 
        message: responseText, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      setMessages(prev => [...prev, aiMsg]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fade-in-up h-[calc(100vh-8rem)] flex flex-col justify-between">
      {/* Header */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="font-display font-bold text-3xl tracking-tight">AI Sustainability Coach</h1>
          <p className="text-neutral-400 text-sm">Naturally consult with our AI sustainability model trained on your lifestyle logs.</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Active
        </div>
      </div>

      {/* Messages viewport */}
      <div className="flex-1 my-6 glass-panel rounded-2xl border border-white/5 p-6 overflow-y-auto space-y-4 min-h-[350px]">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 max-w-[75%] ${msg.sender === "USER" ? "ml-auto flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs ${
              msg.sender === "USER" ? "bg-sky-500 text-white" : "bg-emerald-500 text-black"
            }`}>
              {msg.sender === "USER" ? <User className="w-4 h-4" /> : "AI"}
            </div>
            <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
              msg.sender === "USER" ? "bg-sky-500/15 border border-sky-500/20 text-white rounded-tr-none" : "bg-white/5 border border-white/5 text-neutral-200 rounded-tl-none"
            }`}>
              <p>{msg.message}</p>
              <span className="text-[10px] text-neutral-500 mt-2 block text-right">{msg.timestamp}</span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 max-w-[70%]">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-black shrink-0 flex items-center justify-center font-bold text-xs">AI</div>
            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl rounded-tl-none text-sm text-neutral-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Inputs & Context chips */}
      <div className="space-y-4 shrink-0">
        {/* Preset suggestions */}
        <div className="flex flex-wrap gap-2 text-xs">
          <button 
            onClick={() => sendMessage("Why did my electricity bill spike?")}
            className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-neutral-400 hover:text-white transition-colors"
          >
            &bull; Peak Hour Bills
          </button>
          <button 
            onClick={() => sendMessage("Show me alternatives for grocery items")}
            className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-neutral-400 hover:text-white transition-colors"
          >
            &bull; Food Replacements
          </button>
          <button 
            onClick={() => sendMessage("How to reduce transport emissions?")}
            className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-neutral-400 hover:text-white transition-colors"
          >
            &bull; Commuting Footprint
          </button>
        </div>

        {/* Input box */}
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Consult with your Coach... (e.g. 'How can I optimize my food footprint?')"
            className="flex-1 bg-white/5 border border-white/10 focus:border-emerald-500/50 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors text-white"
          />
          <button 
            onClick={() => sendMessage()}
            className="px-5 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
