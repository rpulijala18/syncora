"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Search,
  Bot,
  User,
  Send,
  Sparkles,
  Phone,
  Mail,
  ShoppingBag,
  ExternalLink,
  CheckCheck,
  Zap,
  Play,
  Clock,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

export default function WhatsAppInboxPage() {
  const { toast } = useToast();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [activeConversation, setActiveConversation] = useState<any | null>(null);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [search, setSearch] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = async (selectId?: string) => {
    try {
      const url = selectId
        ? `/api/inbox?conversationId=${selectId}`
        : activeConvId
        ? `/api/inbox?conversationId=${activeConvId}`
        : "/api/inbox";

      const res = await fetch(url);
      const data = await res.json();
      setConversations(data.conversations || []);
      if (data.activeConversation) {
        setActiveConversation(data.activeConversation);
        setActiveConvId(data.activeConversation.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages]);

  const handleSelectConversation = (conv: any) => {
    setActiveConvId(conv.id);
    fetchConversations(conv.id);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConvId || sending) return;

    try {
      setSending(true);
      const text = messageText;
      setMessageText("");

      const res = await fetch("/api/inbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConvId,
          content: text,
          sender: "HUMAN",
        }),
      });

      if (res.ok) {
        await fetchConversations(activeConvId);
      }
    } catch (err) {
      toast({ title: "Failed to send message", type: "error" });
    } finally {
      setSending(false);
    }
  };

  const handleToggleMode = async () => {
    if (!activeConversation) return;
    const newMode = activeConversation.mode === "AI_MODE" ? "HUMAN_MODE" : "AI_MODE";

    try {
      const res = await fetch("/api/inbox", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConversation.id,
          mode: newMode,
        }),
      });

      if (res.ok) {
        toast({
          title: `Switched to ${newMode === "AI_MODE" ? "AI Employee Mode" : "Human Takeover Mode"}`,
        });
        setActiveConversation({ ...activeConversation, mode: newMode });
        fetchConversations(activeConversation.id);
      }
    } catch (err) {
      toast({ title: "Failed to change mode", type: "error" });
    }
  };

  const handleSimulateInbound = async (scenario: "SHOES_QUERY" | "ORDER_CONFIRM" | "DISCOUNT_QUERY") => {
    if (simulating) return;
    setSimulating(true);

    let customerName = "Rahul Sharma";
    let customerPhone = "+91 98201 12345";
    let messageText = "Do you have black shoes in size 9?";

    if (scenario === "ORDER_CONFIRM") {
      messageText = "Great! I need size 9. Please create the order.";
    } else if (scenario === "DISCOUNT_QUERY") {
      customerName = "Kiran Patel";
      customerPhone = "+91 98980 98765";
      messageText = "Do you have white sneakers under ₹2,000 for college?";
    }

    try {
      const res = await fetch("/api/inbox/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          messageText,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        toast({
          title: "Inbound message received!",
          message: json.aiMessage ? "AI responded automatically using store inventory." : "Received.",
        });
        await fetchConversations(json.conversationId);
      }
    } catch (err) {
      toast({ title: "Simulation failed", type: "error" });
    } finally {
      setSimulating(false);
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.customerName.toLowerCase().includes(search.toLowerCase()) ||
    c.customerPhone.includes(search)
  );

  return (
    <div className="space-y-4">
      {/* Top Banner with Inbound Simulation Tools */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white text-sm flex items-center gap-2">
              <span>WhatsApp Omnichannel Live Inbox</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Official API Architecture Ready
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous AI agent handles inquiries, retrieves catalog prices, and closes orders 24/7.
            </p>
          </div>
        </div>

        {/* Live Simulator Triggers */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden lg:inline">
            Test Scenarios:
          </span>
          <button
            onClick={() => handleSimulateInbound("SHOES_QUERY")}
            disabled={simulating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition hover:border-emerald-500"
          >
            <Play className="w-3 h-3 text-emerald-400" />
            <span>&quot;Black shoes size 9?&quot;</span>
          </button>
          <button
            onClick={() => handleSimulateInbound("ORDER_CONFIRM")}
            disabled={simulating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition hover:border-blue-500"
          >
            <Zap className="w-3 h-3 text-blue-400" />
            <span>&quot;Create Order&quot;</span>
          </button>
        </div>
      </div>

      {/* 3-Column Unified Inbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[720px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950">
        {/* COLUMN 1: Conversations List (3.5 cols) */}
        <div className="lg:col-span-4 border-r border-slate-800/80 flex flex-col h-full bg-slate-950">
          <div className="p-3.5 border-b border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">Conversations</span>
              <span className="text-[11px] text-slate-400 font-semibold">{conversations.length} Active</span>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs flex flex-col items-center">
                <MessageSquare className="w-8 h-8 text-slate-600 mb-2 opacity-50" />
                <p className="font-semibold text-slate-400">No conversations yet</p>
                <p className="text-[11px] text-slate-600 mt-1 max-w-[200px]">
                  Simulate a customer inquiry above or receive inbound WhatsApp messages.
                </p>
              </div>
            ) : (
              filteredConversations.map((c) => {
                const isSelected = activeConvId === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => handleSelectConversation(c)}
                  className={`p-3.5 transition cursor-pointer flex items-start gap-3 ${
                    isSelected ? "bg-slate-900/90 border-l-4 border-blue-500" : "hover:bg-slate-900/40"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-md">
                    {c.customerName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-white text-xs truncate">{c.customerName}</div>
                      <span className="text-[10px] text-slate-400">
                        {c.lastMessageAt ? formatTime(c.lastMessageAt) : ""}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {c.lastMessage || "No messages yet"}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                          c.mode === "AI_MODE"
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        }`}
                      >
                        {c.mode === "AI_MODE" ? "🤖 AI Mode" : "👤 Human"}
                      </span>
                      {c.unreadCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-emerald-500 text-white font-bold text-[9px] flex items-center justify-center ml-auto">
                          {c.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            }))}
          </div>
        </div>

        {/* COLUMN 2: Chat Feed & Input (5 cols) */}
        <div className="lg:col-span-5 flex flex-col h-full bg-slate-900/40 border-r border-slate-800/80">
          {activeConversation ? (
            <>
              {/* Chat Top Bar with AI vs Human Switcher */}
              <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                    {activeConversation.customerName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <span>{activeConversation.customerName}</span>
                      <span className="text-[10px] text-slate-400">{activeConversation.customerPhone}</span>
                    </div>
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> WhatsApp Active
                    </div>
                  </div>
                </div>

                {/* AI / Human Mode Switcher Toggle */}
                <button
                  onClick={handleToggleMode}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition border ${
                    activeConversation.mode === "AI_MODE"
                      ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20"
                      : "bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/20"
                  }`}
                >
                  {activeConversation.mode === "AI_MODE" ? (
                    <>
                      <Bot className="w-3.5 h-3.5" />
                      <span>AI Mode (Auto)</span>
                    </>
                  ) : (
                    <>
                      <User className="w-3.5 h-3.5" />
                      <span>Human Takeover</span>
                    </>
                  )}
                </button>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeConversation.messages?.map((msg: any) => {
                  const isCustomer = msg.sender === "CUSTOMER";
                  const isAI = msg.sender === "AI";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isCustomer ? "items-start" : "items-end"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                          isCustomer
                            ? "bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700"
                            : isAI
                            ? "bg-blue-600 text-white rounded-br-none shadow-blue-600/20 border border-blue-500"
                            : "bg-purple-600 text-white rounded-br-none shadow-purple-600/20 border border-purple-500"
                        }`}
                      >
                        {!isCustomer && (
                          <div className="flex items-center gap-1 text-[10px] font-bold opacity-90 mb-1">
                            {isAI ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                            <span>{isAI ? "BizPilot AI Agent" : "Store Manager"}</span>
                          </div>
                        )}
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                        <div className="flex items-center justify-end gap-1 mt-1 text-[9px] opacity-70">
                          <span>{formatTime(msg.timestamp)}</span>
                          <CheckCheck className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Input Box */}
              <div className="p-3 border-t border-slate-800 bg-slate-950">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={
                      activeConversation.mode === "AI_MODE"
                        ? "AI is responding automatically, or type to intervene..."
                        : "Type reply to WhatsApp customer..."
                    }
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={sending || !messageText.trim()}
                    className="p-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl transition shrink-0 shadow-md shadow-emerald-600/20"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
              Select a conversation to start chatting.
            </div>
          )}
        </div>

        {/* COLUMN 3: Customer Context & AI Insights (3.5 cols) */}
        <div className="lg:col-span-3 p-4 flex flex-col h-full overflow-y-auto bg-slate-950 space-y-5">
          {activeConversation ? (
            <>
              {/* Customer Profile Summary */}
              <div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  CRM Profile
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="font-bold text-white text-sm">{activeConversation.customerName}</div>
                  <div className="text-slate-400 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-400" />
                    <span>{activeConversation.customerPhone}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                    <span className="text-slate-400">Total Spend:</span>
                    <span className="font-bold text-emerald-400">
                      {formatCurrency(activeConversation.customer?.totalSpend || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Active / Past Orders */}
              <div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Recent Orders
                </div>
                <div className="space-y-2">
                  {activeConversation.customer?.orders?.length > 0 ? (
                    activeConversation.customer.orders.map((ord: any) => (
                      <div
                        key={ord.id}
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between font-bold text-white">
                          <span>#{ord.orderNumber}</span>
                          <span className="text-blue-400">{formatCurrency(ord.totalAmount)}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>Status: {ord.status}</span>
                          <span>{formatDate(ord.createdAt)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
                      No past orders for this customer yet.
                    </div>
                  )}
                </div>
              </div>

              {/* AI Autonomous Actions */}
              <div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  AI Automated Actions
                </div>
                <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 space-y-2">
                  <div className="flex items-center gap-1.5 font-semibold text-blue-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Catalog Synchronized</span>
                  </div>
                  <p className="text-[11px] text-blue-300/80 leading-relaxed">
                    AI automatically inspects sizes and inventory before quoting prices to customers.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-slate-500 text-xs">Customer context will appear here.</div>
          )}
        </div>
      </div>
    </div>
  );
}
