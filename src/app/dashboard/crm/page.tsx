"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Plus,
  Filter,
  Phone,
  Mail,
  Building2,
  Tag,
  ShoppingBag,
  Clock,
  MoreVertical,
  Trash2,
  Edit2,
  ExternalLink,
  MessageSquare,
  X,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";

export default function CRMPage() {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    status: "NEW",
    tags: "VIP, Footwear",
    notes: "",
  });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/customers?search=${encodeURIComponent(search)}&status=${statusFilter}`);
      const json = await res.json();
      setCustomers(json.customers || []);
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to load customers", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({
      name: "",
      phone: "",
      email: "",
      company: "",
      status: "NEW",
      tags: "Footwear",
      notes: "",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (c: any) => {
    setEditingCustomer(c);
    let parsedTags = "";
    try {
      parsedTags = Array.isArray(JSON.parse(c.tags)) ? JSON.parse(c.tags).join(", ") : c.tags;
    } catch {
      parsedTags = c.tags || "";
    }
    setFormData({
      name: c.name,
      phone: c.phone,
      email: c.email || "",
      company: c.company || "",
      status: c.status,
      tags: parsedTags,
      notes: c.notes || "",
    });
    setModalOpen(true);
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast({ title: "Name and Phone are required", type: "error" });
      return;
    }

    const tagArray = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (editingCustomer) {
        const res = await fetch("/api/customers", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingCustomer.id,
            ...formData,
            tags: tagArray,
          }),
        });
        if (res.ok) {
          toast({ title: "Customer updated successfully!" });
          setModalOpen(false);
          fetchCustomers();
          if (selectedCustomer?.id === editingCustomer.id) {
            setSelectedCustomer({ ...selectedCustomer, ...formData, tags: JSON.stringify(tagArray) });
          }
        }
      } else {
        const res = await fetch("/api/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            tags: tagArray,
          }),
        });
        if (res.ok) {
          toast({ title: "Customer added to CRM!" });
          setModalOpen(false);
          fetchCustomers();
        }
      }
    } catch (err) {
      toast({ title: "Failed to save customer", type: "error" });
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm("Are you sure you want to remove this customer?")) return;
    try {
      const res = await fetch(`/api/customers?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast({ title: "Customer deleted" });
        if (selectedCustomer?.id === id) setSelectedCustomer(null);
        fetchCustomers();
      }
    } catch (err) {
      toast({ title: "Failed to delete customer", type: "error" });
    }
  };

  const statuses = ["ALL", "LEAD", "NEW", "ACTIVE", "RETURNING", "VIP", "INACTIVE"];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Customer CRM</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">
              {customers.length} Contacts
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete database of leads, repeat customers, order histories, and WhatsApp contact threads.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 transition self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, email, or company..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </form>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                statusFilter === st
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {st === "ALL" ? "All Contacts" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Customer List Table */}
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Customer</th>
                <th className="px-5 py-3.5 font-semibold">Contact Info</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold">Orders & Spend</th>
                <th className="px-5 py-3.5 font-semibold">Tags</th>
                <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    Loading customer contacts...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    No customers found matching your criteria.
                  </td>
                </tr>
              ) : (
                customers.map((c) => {
                  let parsedTags: string[] = [];
                  try {
                    parsedTags = Array.isArray(JSON.parse(c.tags)) ? JSON.parse(c.tags) : [c.tags];
                  } catch {
                    parsedTags = c.tags ? [c.tags] : [];
                  }

                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-slate-900/60 transition cursor-pointer"
                      onClick={() => setSelectedCustomer(c)}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{c.name}</div>
                            {c.company && (
                              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                <span>{c.company}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-slate-200">
                            <Phone className="w-3 h-3 text-emerald-400" />
                            <span>{c.phone}</span>
                          </div>
                          {c.email && (
                            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                              <Mail className="w-3 h-3 text-blue-400" />
                              <span>{c.email}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                            c.status === "VIP"
                              ? "bg-purple-500/10 text-purple-300 border-purple-500/30"
                              : c.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                              : c.status === "RETURNING"
                              ? "bg-blue-500/10 text-blue-300 border-blue-500/30"
                              : c.status === "LEAD"
                              ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                              : "bg-slate-800 text-slate-400 border-slate-700"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div>
                          <div className="font-bold text-white">{formatCurrency(c.totalSpend)}</div>
                          <div className="text-[11px] text-slate-400">{c.totalOrders} total orders</div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {parsedTags.map((t, ti) => (
                            <span
                              key={ti}
                              className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(c)}
                            title="Edit customer"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCustomer(c.id)}
                            title="Delete customer"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/30 text-slate-400 hover:text-rose-400 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Slide-over Details Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setSelectedCustomer(null)}
          />
          <div className="relative w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-base">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{selectedCustomer.name}</h3>
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{selectedCustomer.status} Customer</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-[11px] text-slate-400">Total Spent</div>
                  <div className="text-base font-bold text-white mt-1">
                    {formatCurrency(selectedCustomer.totalSpend)}
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-[11px] text-slate-400">Orders Placed</div>
                  <div className="text-base font-bold text-white mt-1">
                    {selectedCustomer.totalOrders} Orders
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Contact Details
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">WhatsApp / Phone:</span>
                    <span className="font-semibold text-emerald-400">{selectedCustomer.phone}</span>
                  </div>
                  {selectedCustomer.email && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Email:</span>
                      <span className="text-white">{selectedCustomer.email}</span>
                    </div>
                  )}
                  {selectedCustomer.company && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Company:</span>
                      <span className="text-white">{selectedCustomer.company}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Last Interaction:</span>
                    <span className="text-slate-300">{formatDate(selectedCustomer.lastInteraction)}</span>
                  </div>
                </div>
              </div>

              {/* CRM Notes */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Merchant & AI Notes
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  {selectedCustomer.notes || "No notes recorded yet."}
                </div>
              </div>

              {/* Quick WhatsApp Action */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-lg shadow-emerald-600/20"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open WhatsApp Direct Chat</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Customer Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCustomer ? "Edit Customer Details" : "Add New Customer"}
        description="Add contact records to your CRM and synchronize with WhatsApp conversations."
      >
        <form onSubmit={handleSaveCustomer} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Phone / WhatsApp *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98201 12345"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="rahul@example.com"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Company / Organization</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Freelance / TechCorp"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Customer Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="LEAD">Lead</option>
                <option value="NEW">New Customer</option>
                <option value="ACTIVE">Active Customer</option>
                <option value="RETURNING">Returning Customer</option>
                <option value="VIP">VIP</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Tags (Comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="VIP, Footwear, Size-9"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Merchant Notes</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Prefers size 9 shoes. Inquired about running shoes."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
            />
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
              {editingCustomer ? "Update Customer" : "Save Customer"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
