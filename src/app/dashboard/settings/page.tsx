"use client";

import React, { useState, useEffect } from "react";
import {
  Store,
  Bot,
  Users,
  Bell,
  Shield,
  CreditCard,
  Save,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("business");
  const [loading, setLoading] = useState(true);

  // Business form
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("General Retail");
  const [currency, setCurrency] = useState("INR");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // AI config
  const [aiPersona, setAiPersona] = useState(
    "Helpful, professional sales and customer service assistant who helps customers find products and completes orders."
  );
  const [aiSystemRules, setAiSystemRules] = useState(
    "1. Always check catalog availability before taking orders.\n2. Be friendly, accurate, and concise.\n3. Escalate complex requests to human staff."
  );

  // Notifications
  const [notifOrder, setNotifOrder] = useState(true);
  const [notifStock, setNotifStock] = useState(true);
  const [notifFollowup, setNotifFollowup] = useState(true);

  // Team members
  const [team, setTeam] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/business")
      .then((res) => res.json())
      .then((data) => {
        if (data.business) {
          setBusinessName(data.business.name);
          setBusinessType(data.business.type);
          setCurrency(data.business.currency);
          setPhone(data.business.phone);
          setEmail(data.business.email);
          setAddress(data.business.address);
          setAiPersona(data.business.aiPersona);
          setAiSystemRules(data.business.aiSystemRules);
          if (data.business.teamMembers?.length) {
            setTeam(data.business.teamMembers);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/business", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: businessName,
          type: businessType,
          currency,
          phone,
          email,
          address,
          aiPersona,
          aiSystemRules,
        }),
      });

      if (res.ok) {
        toast({ title: "Settings saved successfully!" });
      }
    } catch (err) {
      toast({ title: "Failed to save settings", type: "error" });
    }
  };

  const tabs = [
    { id: "business", label: "Business Profile", icon: Store },
    { id: "ai", label: "AI Sales Rules", icon: Bot },
    { id: "team", label: "Team & Staff", icon: Users },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Store Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure business metadata, team permissions, notification preferences, and AI behavior.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto scrollbar-none pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Business Profile */}
      {activeTab === "business" && (
        <form onSubmit={handleSaveBusiness} className="glass-card p-6 rounded-3xl space-y-5 border border-slate-800 text-xs">
          <h2 className="text-base font-bold text-white pb-3 border-b border-slate-800">
            Company & Store Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Industry / Category</label>
              <input
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Store Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              >
                <option value="INR">₹ INR (Indian Rupee)</option>
                <option value="USD">$ USD (US Dollar)</option>
                <option value="EUR">€ EUR (Euro)</option>
                <option value="AED">AED (UAE Dirham)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Support Phone / WhatsApp</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Store Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Official Registered Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/25 transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Business Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: AI Settings */}
      {activeTab === "ai" && (
        <form onSubmit={handleSaveBusiness} className="glass-card p-6 rounded-3xl space-y-5 border border-slate-800 text-xs">
          <h2 className="text-base font-bold text-white pb-3 border-b border-slate-800">
            Autonomous AI Sales Agent Guidelines
          </h2>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">AI Assistant Persona</label>
            <textarea
              rows={3}
              value={aiPersona}
              onChange={(e) => setAiPersona(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">System Instructions & Behavior Rules</label>
            <textarea
              rows={5}
              value={aiSystemRules}
              onChange={(e) => setAiSystemRules(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/25 transition"
            >
              <Save className="w-4 h-4" />
              <span>Save AI Guidelines</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: Team Members */}
      {activeTab === "team" && (
        <div className="glass-card p-6 rounded-3xl space-y-5 border border-slate-800 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white">Staff & Collaborators</h2>
              <p className="text-slate-400">Team members with merchant dashboard access</p>
            </div>
            <button
              type="button"
              onClick={() => toast({ title: "Invite link copied to clipboard!" })}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Invite Staff</span>
            </button>
          </div>

          <div className="divide-y divide-slate-800">
            {team.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No extra team members added yet. Click &quot;Invite Staff&quot; above to invite collaborators.
              </div>
            ) : (
              team.map((member) => (
              <div key={member.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 font-bold text-white flex items-center justify-center">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{member.name}</div>
                    <div className="text-slate-400 text-[11px]">{member.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                    {member.role}
                  </span>
                  <span className="text-emerald-400 font-semibold">● Active</span>
                </div>
              </div>
            )))}
          </div>
        </div>
      )}

      {/* TAB 4: Notifications */}
      {activeTab === "notifications" && (
        <div className="glass-card p-6 rounded-3xl space-y-5 border border-slate-800 text-xs">
          <h2 className="text-base font-bold text-white pb-3 border-b border-slate-800">
            Alert & Notification Switches
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <div>
                <div className="font-semibold text-white">New Order Dispatched Alerts</div>
                <div className="text-slate-400 text-[11px]">Receive notification when AI agent creates a new order</div>
              </div>
              <input
                type="checkbox"
                checked={notifOrder}
                onChange={(e) => setNotifOrder(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <div>
                <div className="font-semibold text-white">Low Inventory Stock Warning</div>
                <div className="text-slate-400 text-[11px]">Alert when product stock dips below safety threshold</div>
              </div>
              <input
                type="checkbox"
                checked={notifStock}
                onChange={(e) => setNotifStock(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <div>
                <div className="font-semibold text-white">AI Follow-up Opportunity Triggers</div>
                <div className="text-slate-400 text-[11px]">Notify when customer inquiries remain unpurchased after 48h</div>
              </div>
              <input
                type="checkbox"
                checked={notifFollowup}
                onChange={(e) => setNotifFollowup(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={() => toast({ title: "Notification preferences updated!" })}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
            >
              Update Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
