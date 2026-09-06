"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  Sparkles,
  Send,
  Edit3,
  X,
  CheckCircle2,
  AlertTriangle,
  Phone,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";

export default function FollowUpsPage() {
  const { toast } = useToast();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [activeOpp, setActiveOpp] = useState<any | null>(null);
  const [customMsg, setCustomMsg] = useState("");

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/follow-ups");
      const data = await res.json();
      setOpportunities(data.opportunities || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleSendFollowUp = async (opp: any, messageToSend?: string) => {
    try {
      const res = await fetch("/api/follow-ups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: opp.id,
          action: "SEND",
          customMessage: messageToSend || opp.suggestedMessage,
        }),
      });

      if (res.ok) {
        toast({
          title: `WhatsApp Follow-up sent to ${opp.customerName}!`,
          message: "Conversation updated in WhatsApp Inbox.",
        });
        setEditModalOpen(false);
        fetchOpportunities();
      }
    } catch (err) {
      toast({ title: "Failed to send follow-up", type: "error" });
    }
  };

  const handleDismiss = async (oppId: string) => {
    try {
      const res = await fetch("/api/follow-ups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: oppId, action: "DISMISS" }),
      });
      if (res.ok) {
        toast({ title: "Follow-up dismissed" });
        fetchOpportunities();
      }
    } catch (err) {
      toast({ title: "Failed to dismiss", type: "error" });
    }
  };

  const pendingOpportunities = opportunities.filter((o) => o.status === "PENDING");
  const completedOpportunities = opportunities.filter((o) => o.status !== "PENDING");

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Autonomous Follow-ups</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">
              {pendingOpportunities.length} Active Opportunities
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            AI scans chat histories and checkout abandonments to re-engage prospective buyers.
          </p>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            Scanning CRM for follow-up triggers...
          </div>
        ) : pendingOpportunities.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-3xl border border-slate-800 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">All Caught Up!</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No pending customer follow-ups required. The AI will continue monitoring customer activities.
            </p>
          </div>
        ) : (
          pendingOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-blue-500/40 transition shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                    {opp.customerName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white text-base flex items-center gap-2">
                      <span>{opp.customerName}</span>
                      <span className="text-xs text-slate-400 font-normal">{opp.customerPhone}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{opp.reason}</span>
                    </div>
                  </div>
                </div>

                <div className="text-left md:text-right">
                  <div className="text-[11px] text-slate-400">Potential Order Value</div>
                  <div className="text-lg font-bold text-emerald-400">
                    {formatCurrency(opp.potentialValue)}
                  </div>
                </div>
              </div>

              {/* AI Suggested Message Box */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-200 space-y-1.5">
                <div className="flex items-center gap-1 text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" /> AI Personalized WhatsApp Message Draft
                </div>
                <p className="italic leading-relaxed text-slate-300">&quot;{opp.suggestedMessage}&quot;</p>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => handleDismiss(opp.id)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition"
                >
                  Dismiss
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveOpp(opp);
                      setCustomMsg(opp.suggestedMessage);
                      setEditModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Edit Message</span>
                  </button>

                  <button
                    onClick={() => handleSendFollowUp(opp)}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/25 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send WhatsApp Nudge</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Message Modal */}
      {activeOpp && (
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title={`Edit Follow-up Message for ${activeOpp.customerName}`}
          description="Customize the automated message before sending it to customer's WhatsApp."
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">WhatsApp Message</label>
              <textarea
                rows={4}
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSendFollowUp(activeOpp, customMsg)}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Now</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
