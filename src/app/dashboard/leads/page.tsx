"use client";

import React, { useState, useEffect } from "react";
import {
  Kanban,
  Plus,
  Phone,
  Tag,
  DollarSign,
  Clock,
  ArrowRight,
  MoreVertical,
  CheckCircle2,
  XCircle,
  MessageSquare,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";

export default function LeadsPage() {
  const { toast } = useToast();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    source: "WhatsApp",
    interestedProduct: "",
    stage: "NEW",
    value: "",
    notes: "",
  });

  const stages = [
    { id: "NEW", label: "New Leads", color: "border-blue-500/50 bg-blue-500/5" },
    { id: "CONTACTED", label: "Contacted", color: "border-purple-500/50 bg-purple-500/5" },
    { id: "INTERESTED", label: "Interested", color: "border-cyan-500/50 bg-cyan-500/5" },
    { id: "NEGOTIATION", label: "Negotiation", color: "border-amber-500/50 bg-amber-500/5" },
    { id: "WON", label: "Deals Won", color: "border-emerald-500/50 bg-emerald-500/5" },
  ];

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/leads");
      const json = await res.json();
      setLeads(json.leads || []);
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to load leads", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStageMove = async (leadId: string, newStage: string) => {
    try {
      const res = await fetch("/api/leads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, stage: newStage }),
      });
      if (res.ok) {
        toast({ title: `Lead moved to ${newStage} stage` });
        fetchLeads();
      }
    } catch (err) {
      toast({ title: "Failed to update stage", type: "error" });
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast({ title: "Lead added to pipeline!" });
        setModalOpen(false);
        fetchLeads();
      }
    } catch (err) {
      toast({ title: "Failed to create lead", type: "error" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Leads & Sales Pipeline</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">
              {leads.length} Deals
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Kanban visual tracking from initial inquiry to closed sale.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 transition self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add Lead</span>
        </button>
      </div>

      {/* Kanban Board Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage.id);
          const totalValue = stageLeads.reduce((sum, l) => sum + (l.value || 0), 0);

          return (
            <div
              key={stage.id}
              className={`rounded-2xl border p-3 flex flex-col min-w-[240px] bg-slate-900/50 ${stage.color}`}
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="font-bold text-white text-xs flex items-center gap-1.5">
                  <span>{stage.label}</span>
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] flex items-center justify-center font-mono">
                    {stageLeads.length}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-emerald-400">
                  {formatCurrency(totalValue)}
                </div>
              </div>

              {/* Cards Container */}
              <div className="flex-1 space-y-3 mt-3 overflow-y-auto max-h-[600px] pr-1">
                {stageLeads.length === 0 && (
                  <div className="py-6 text-center text-[11px] text-slate-600 italic border border-dashed border-slate-800 rounded-xl">
                    No leads in this stage
                  </div>
                )}
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 shadow-md space-y-2.5 transition group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="font-bold text-white text-xs">{lead.name}</div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold">
                        {lead.source}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-300 line-clamp-1">
                      🛍️ {lead.interestedProduct || "General Inquiry"}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                      <div className="font-bold text-emerald-400">
                        {formatCurrency(lead.value)}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>{lead.phone}</span>
                      </div>
                    </div>

                    {/* Quick Move Stage Controls */}
                    <div className="pt-2 flex items-center justify-between text-[10px] border-t border-slate-800/80">
                      <span className="text-slate-500">Advance:</span>
                      <div className="flex items-center gap-1">
                        {stage.id !== "NEW" && (
                          <button
                            onClick={() => {
                              const currentIndex = stages.findIndex((s) => s.id === stage.id);
                              if (currentIndex > 0) {
                                handleStageMove(lead.id, stages[currentIndex - 1].id);
                              }
                            }}
                            className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400"
                            title="Move back"
                          >
                            ←
                          </button>
                        )}
                        {stage.id !== "WON" && (
                          <button
                            onClick={() => {
                              const currentIndex = stages.findIndex((s) => s.id === stage.id);
                              if (currentIndex < stages.length - 1) {
                                handleStageMove(lead.id, stages[currentIndex + 1].id);
                              }
                            }}
                            className="px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-0.5"
                          >
                            <span>Next</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Lead Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Prospective Lead"
        description="Record incoming prospect from WhatsApp, Instagram, or referrals."
      >
        <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Prospect Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Vikram Malhotra"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">WhatsApp / Phone *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 99887 76655"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Inquiry Source</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="WhatsApp">WhatsApp</option>
                <option value="Instagram">Instagram</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Interested Product</label>
              <input
                type="text"
                value={formData.interestedProduct}
                onChange={(e) => setFormData({ ...formData, interestedProduct: e.target.value })}
                placeholder="Black Runner Shoes"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Estimated Deal Value (₹)</label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="2499"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition shadow-lg shadow-blue-600/20"
            >
              Add to Kanban
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
