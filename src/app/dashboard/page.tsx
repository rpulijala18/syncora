"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  AlertTriangle,
  CreditCard,
  MessageSquare,
  Bot,
  ArrowUpRight,
  Plus,
  Sparkles,
  Package,
  CheckCircle2,
  Clock,
  ChevronRight,
  RefreshCw,
  ArrowRight,
  Sliders,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const [metricsRes, meRes] = await Promise.all([
        fetch("/api/dashboard/metrics"),
        fetch("/api/auth/me"),
      ]);

      const json = await metricsRes.json();
      const meJson = await meRes.json();

      setData(json);
      if (meJson.user) setUser(meJson.user);
    } catch (err) {
      console.error("Metrics load failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"];

  if (loading && !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-slate-800 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-900 rounded-2xl border border-slate-800" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-80 lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800" />
          <div className="h-80 bg-slate-900 rounded-2xl border border-slate-800" />
        </div>
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const recentOrders = data?.recentOrders || [];
  const recentConversations = data?.recentConversations || [];
  const aiLogs = data?.aiLogs || [];
  const lowStock = data?.lowStockProducts || [];
  const revenueTrend = data?.revenueTrend || [];
  const categoryData = data?.categoryData || [];
  const counts = data?.counts || { customers: 0, products: 0, orders: 0 };
  const business = data?.business || {};

  const isBrandNew = counts.products === 0 && counts.orders === 0 && counts.customers === 0;
  const greetingName = user?.name ? user.name.split(" ")[0] : "Merchant";

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-slate-900/40 p-6 rounded-3xl border border-blue-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Autonomous Business Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Welcome back, {greetingName} 👋
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            {isBrandNew ? (
              <span>Your workspace for <strong className="text-white">{business.name || "your store"}</strong> is ready. Add your first product and customer to get started!</span>
            ) : (
              <span>Your AI assistant is monitoring stock and ready to handle incoming WhatsApp inquiries.</span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 z-10">
          <Link
            href="/dashboard/orders"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/25"
          >
            <Plus className="w-4 h-4" />
            <span>Create Order</span>
          </Link>
          <Link
            href="/dashboard/inbox"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs border border-slate-700 transition"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp Inbox</span>
          </Link>
          <button
            onClick={fetchMetrics}
            title="Refresh metrics"
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Low Stock Warning Banner if any real low stock products */}
      {lowStock.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">
                Low Inventory Warning: {lowStock.length} Product(s) Below Safety Threshold
              </div>
              <div className="text-xs text-amber-300/80">
                {lowStock.map((p: any) => `${p.name} (${p.stock} left)`).join(", ")}. Reorder now to avoid stockouts.
              </div>
            </div>
          </div>
          <Link
            href="/dashboard/products"
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 self-start sm:self-center transition"
          >
            Restock Inventory
          </Link>
        </div>
      )}

      {/* Top Row Metric Cards (100% Real Database Calculations) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue Card */}
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Store Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white tracking-tight">
              {formatCurrency(kpis.totalRevenue || 0, business.currency || "INR")}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
              <span>Gross settled sales</span>
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white tracking-tight">
              {kpis.totalOrders || 0}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
              <span>{kpis.pendingOrdersCount || 0} currently processing</span>
            </div>
          </div>
        </div>

        {/* Customers Card */}
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Registered Customers</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white tracking-tight">
              {kpis.totalCustomers || 0}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
              <span>In CRM database</span>
            </div>
          </div>
        </div>

        {/* Pending Payments Card */}
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Pending Payments</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-300 tracking-tight">
              {formatCurrency(kpis.pendingPayments || 0, business.currency || "INR")}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
              <span>{kpis.pendingOrdersCount || 0} awaiting payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* BEAUTIFUL EMPTY ONBOARDING STATE CARDS FOR NEW BUSINESSES */}
      {isBrandNew && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-blue-500/30 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" /> Quick Setup Steps
            </div>
            <h2 className="text-xl font-bold text-white">Get your store up and running</h2>
            <p className="text-xs text-slate-400 mt-1">
              Follow these recommended steps to build your customer base and enable automated AI selling.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Action 1: Add Product */}
            <Link
              href="/dashboard/products"
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500 transition space-y-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition">
                <Package className="w-5 h-5" />
              </div>
              <div className="font-bold text-white text-sm">Add your first product</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add products, set pricing, and track inventory for automatic stock decrementing.
              </p>
              <div className="text-xs font-semibold text-blue-400 flex items-center gap-1 pt-1">
                <span>Add Product</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* Action 2: Add Customer */}
            <Link
              href="/dashboard/crm"
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500 transition space-y-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
                <Users className="w-5 h-5" />
              </div>
              <div className="font-bold text-white text-sm">Add your first customer</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Save customer contacts, phone numbers, and notes in your centralized CRM.
              </p>
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 pt-1">
                <span>Add Customer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* Action 3: Create Order */}
            <Link
              href="/dashboard/orders"
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500 transition space-y-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div className="font-bold text-white text-sm">Create your first order</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Record a sale, automatically deduct product inventory, and generate a printable tax invoice.
              </p>
              <div className="text-xs font-semibold text-purple-400 flex items-center gap-1 pt-1">
                <span>Create Order</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* Action 4: Configure AI Assistant */}
            <Link
              href="/dashboard/ai-agent"
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500 transition space-y-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
                <Bot className="w-5 h-5" />
              </div>
              <div className="font-bold text-white text-sm">Configure AI assistant</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Set sales persona, business rules, and test interactive WhatsApp queries.
              </p>
              <div className="text-xs font-semibold text-amber-400 flex items-center gap-1 pt-1">
                <span>Test Sandbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Growth Trend Area Chart */}
        <div className="glass-card p-6 rounded-3xl lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Sales Trajectory</h2>
              <p className="text-xs text-slate-400">Actual gross revenue from completed orders</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 font-semibold">
              Live Database
            </span>
          </div>

          <div className="h-64 w-full">
            {kpis.totalRevenue === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-2xl">
                <TrendingUp className="w-8 h-8 text-slate-600 mb-2" />
                <div className="text-xs font-semibold text-slate-400">No revenue data yet</div>
                <p className="text-[11px] text-slate-500 max-w-xs mt-1">
                  Sales charts will automatically render as orders are marked as paid.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "12px",
                      color: "#f8fafc",
                      fontSize: "12px",
                    }}
                    formatter={(val: any) => [formatCurrency(val, business.currency || "INR"), "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#revenueGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category Breakdown Chart */}
        <div className="glass-card p-6 rounded-3xl flex flex-col justify-between">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-white">Catalog by Category</h2>
            <p className="text-xs text-slate-400">Product inventory distribution</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            {categoryData.length === 0 ? (
              <div className="text-center p-4 border border-dashed border-slate-800 rounded-2xl w-full">
                <Package className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <div className="text-xs text-slate-400 font-semibold">Catalog is empty</div>
                <Link
                  href="/dashboard/products"
                  className="mt-2 text-[11px] text-blue-400 hover:underline inline-block"
                >
                  + Add Products
                </Link>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "12px",
                      color: "#f8fafc",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-slate-800 text-xs">
            {categoryData.map((cat: any, i: number) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-slate-300">{cat.name}</span>
                <span className="text-slate-500 font-semibold">({cat.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Grid: Recent Orders + Live AI Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="glass-card p-6 rounded-3xl lg:col-span-2">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-semibold text-white">Recent Orders</h2>
              <p className="text-xs text-slate-400">Real-time order statuses and customer assignments</p>
            </div>
            <Link
              href="/dashboard/orders"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-800/80 mt-2">
            {recentOrders.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                <ShoppingCart className="w-8 h-8 text-slate-600 mx-auto" />
                <div>No orders placed yet.</div>
                <Link
                  href="/dashboard/orders"
                  className="text-blue-400 hover:underline text-xs font-semibold inline-block"
                >
                  Create an order to test fulfillment →
                </Link>
              </div>
            ) : (
              recentOrders.map((order: any) => (
                <div key={order.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 font-mono text-xs font-bold">
                      #{order.orderNumber.slice(-4)}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white flex items-center gap-2">
                        <span>{order.customer?.name || "Customer"}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            order.status === "DELIVERED"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : order.status === "PROCESSING"
                              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              : order.status === "SHIPPED"
                              ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {order.items?.map((it: any) => `${it.productName} (x${it.quantity})`).join(", ") || "Items"}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-white">
                      {formatCurrency(order.totalAmount, business.currency || "INR")}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {order.paymentStatus === "PAID" ? (
                        <span className="text-emerald-400 font-semibold">● Paid</span>
                      ) : (
                        <span className="text-amber-400 font-semibold">● Unpaid</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live AI Activity Stream */}
        <div className="glass-card p-6 rounded-3xl flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <h2 className="text-base font-semibold text-white">AI Activity Log</h2>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div className="flex-1 space-y-3 mt-4 overflow-y-auto max-h-80 pr-1">
            {aiLogs.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                <Bot className="w-8 h-8 text-slate-600 mx-auto" />
                <div>No autonomous actions logged yet.</div>
                <p className="text-[11px] text-slate-500">
                  Actions appear automatically when the AI creates orders or answers inquiries.
                </p>
              </div>
            ) : (
              aiLogs.map((log: any) => (
                <div
                  key={log.id}
                  className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5"
                >
                  <div className="mt-0.5 shrink-0">
                    {log.actionType === "CREATE_ORDER" ? (
                      <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" />
                    ) : log.actionType === "LOW_STOCK_ALERT" ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="leading-snug text-slate-200">{log.description}</p>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                      {formatDate(log.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <Link
              href="/dashboard/ai-agent"
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <span>Test AI Sales Sandbox</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
