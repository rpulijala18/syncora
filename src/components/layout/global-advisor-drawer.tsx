"use client";

import React, { useState } from "react";
import { Sparkles, Send, X, Bot, TrendingUp, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";

interface GlobalAdvisorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: "USER" | "AI";
  text: string;
  metricHighlight?: string;
  dataPoints?: Array<{ label: string; value: string | number }>;
  suggestedAction?: string;
}

export function GlobalAdvisorDrawer({ isOpen, onClose }: GlobalAdvisorDrawerProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "AI",
      text: "Hello Rohan! I am your BizPilot AI Executive Advisor. Ask me anything about your revenue, inventory, unpaid orders, or best-sellers.",
    },
  ]);

  const quickQuestions = [
    "How much did I sell this month?",
    "What are my best-selling products?",
    "Which products are low in stock?",
    "Show me unpaid orders.",
    "Who is my top customer by spend?",
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { sender: "USER", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: textToSend }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "AI",
            text: data.answer,
            metricHighlight: data.metricHighlight,
            dataPoints: data.dataPoints,
            suggestedAction: data.suggestedAction,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "AI", text: "Sorry, I had trouble analyzing your data. Please try again." },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "AI", text: "Network connection error while contacting AI advisor." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-slate-900 border-l border-slate-700/80 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">BizPilot AI Advisor</h3>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Business Data Connected
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Questions Pills */}
        <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex gap-1.5 overflow-x-auto text-xs scrollbar-none">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-blue-600/30 hover:text-blue-300 hover:border-blue-500/50 border border-slate-700 text-slate-300 transition text-[11px]"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === "USER" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[90%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  m.sender === "USER"
                    ? "bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-600/20"
                    : "bg-slate-800/90 border border-slate-700/80 text-slate-200 rounded-bl-none shadow-sm"
                }`}
              >
                {m.sender === "AI" && (
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-blue-400 uppercase tracking-wider mb-1.5">
                    <Bot className="w-3.5 h-3.5" /> AI Executive Insight
                  </div>
                )}
                <div className="whitespace-pre-wrap">{m.text}</div>

                {/* Highlight Badge */}
                {m.metricHighlight && (
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 font-bold text-xs">
                    <TrendingUp className="w-3.5 h-3.5" /> {m.metricHighlight}
                  </div>
                )}

                {/* Structured Data Points */}
                {m.dataPoints && m.dataPoints.length > 0 && (
                  <div className="mt-3 grid grid-cols-1 gap-1.5 pt-2 border-t border-slate-700/60">
                    {m.dataPoints.map((dp, dpi) => (
                      <div
                        key={dpi}
                        className="flex items-center justify-between text-[11px] bg-slate-900/60 px-2.5 py-1.5 rounded-md"
                      >
                        <span className="text-slate-400">{dp.label}</span>
                        <span className="font-semibold text-white">{dp.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggested Action */}
                {m.suggestedAction && (
                  <div className="mt-2.5 text-[11px] bg-amber-500/10 border border-amber-500/20 text-amber-300 p-2 rounded-lg flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-semibold">Recommended action:</strong> {m.suggestedAction}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 w-fit">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span>Analyzing live store database...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your store data..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl transition shrink-0 shadow-lg shadow-blue-600/25"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
