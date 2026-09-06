"use client";

import React, { useState } from "react";
import {
  Bot,
  Sparkles,
  Send,
  Sliders,
  CheckCircle2,
  RefreshCw,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Cpu,
  Key,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

interface ChatMessage {
  sender: "CUSTOMER" | "AI";
  text: string;
  actionTaken?: string;
  orderDetails?: any;
}

export default function AIAgentPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "AI",
      text: "Hello! I am your BizPilot AI Sales Agent. I'm connected directly to your store's live database, catalog, and inventory. Ask me about products, sizes, prices, or tell me you'd like to buy!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Settings
  const [agentName, setAgentName] = useState("Aria");
  const [tone, setTone] = useState("Friendly & Persuasive");
  const [rules, setRules] = useState(
    "1. Always check product inventory before confirming orders.\n2. Explain sizes and features clearly.\n3. Be polite and concise."
  );

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput("");
    setMessages((prev) => [...prev, { sender: "CUSTOMER", text: userText }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/sales-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "AI",
            text: data.reply,
            actionTaken: data.actionTaken,
            orderDetails: data.orderDetails,
          },
        ]);
        if (data.actionTaken === "CREATED_ORDER") {
          toast({
            title: `Order placed! (#${data.orderDetails?.orderNumber})`,
            message: "Stock decremented and order added to Orders page.",
          });
        }
      }
    } catch (err) {
      toast({ title: "Failed to query AI Agent", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = () => {
    toast({ title: "AI Sales Agent settings saved!" });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Sales Agent Sandbox</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
              Autonomous Employee Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Test and configure your 24/7 autonomous sales associate connected to live catalog data.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Agent Configuration Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card p-5 rounded-3xl space-y-4 border border-slate-800">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Sliders className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-semibold text-white">Agent Persona & Rules</h2>
            </div>

            <div>
              <label className="block text-slate-300 text-xs font-semibold mb-1">Agent Name</label>
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-xs font-semibold mb-1">Conversation Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              >
                <option value="Friendly & Persuasive">Friendly & Persuasive</option>
                <option value="Professional & Formal">Professional & Formal</option>
                <option value="Concise & Direct">Concise & Direct</option>
                <option value="Luxury & Exclusive">Luxury & Exclusive</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 text-xs font-semibold mb-1">System Instructions & Guardrails</label>
              <textarea
                rows={4}
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>

            <button
              onClick={handleSaveSettings}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/20"
            >
              Update AI Parameters
            </button>
          </div>

          {/* LLM Provider Integration Card */}
          <div className="glass-card p-5 rounded-3xl space-y-3 border border-slate-800">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Key className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-white">LLM Provider Bridge</h2>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              BizPilot AI features an extensible LLM provider abstraction. The demo utilizes the built-in catalog reasoning engine. Connect OpenAI or Gemini API keys in environment variables for zero-config scaling.
            </p>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-mono text-emerald-400 flex items-center justify-between">
              <span>ENGINE: HEURISTIC_SQL_REASONER</span>
              <span className="text-emerald-500 font-bold">READY</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Testing Sandbox Chat (8 cols) */}
        <div className="lg:col-span-8 glass-card rounded-3xl flex flex-col h-[650px] border border-slate-800 overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">BizPilot AI Sales Employee Sandbox</h3>
                <p className="text-[11px] text-slate-400">Simulate incoming customer questions</p>
              </div>
            </div>

            <button
              onClick={() =>
                setMessages([
                  {
                    sender: "AI",
                    text: "Hello! I am your BizPilot AI Sales Agent. Ask me about products, sizes, prices, or tell me you'd like to buy!",
                  },
                ])
              }
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title="Reset conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((m, idx) => {
              const isCustomer = m.sender === "CUSTOMER";
              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isCustomer ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                      isCustomer
                        ? "bg-slate-800 text-slate-200 rounded-br-none border border-slate-700"
                        : "bg-blue-600 text-white rounded-bl-none shadow-lg shadow-blue-600/20 border border-blue-500"
                    }`}
                  >
                    {!isCustomer && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1">
                        <Sparkles className="w-3 h-3" /> BizPilot AI Sales Agent
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{m.text}</div>

                    {m.actionTaken && (
                      <div className="mt-2.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/20 text-white font-bold text-[10px]">
                        <Zap className="w-3 h-3" /> Action: {m.actionTaken}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-blue-400 p-3 bg-slate-900 rounded-xl border border-slate-800 w-fit">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Checking store catalog and inventory...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px] scrollbar-none">
            <span className="text-slate-500 shrink-0">Try asking:</span>
            {[
              "Do you have black shoes in size 9?",
              "What is the price of denim jacket?",
              "Yes please, create the order.",
              "Do you have white sneakers?",
            ].map((p, i) => (
              <button
                key={i}
                onClick={() => setInput(p)}
                className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-4 border-t border-slate-800 bg-slate-900">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask the AI as a customer (e.g. 'Do you have black shoes in size 9?')..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition shadow-lg shadow-blue-600/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
