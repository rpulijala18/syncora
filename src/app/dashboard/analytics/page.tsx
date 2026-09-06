"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  ShoppingCart,
  Users,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Layers,
  Award,
  Package,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/metrics")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const topProducts = data?.topProducts || [];
  const weekdaySales = data?.weekdaySales || [
    { day: "Mon", sales: 0 },
    { day: "Tue", sales: 0 },
    { day: "Wed", sales: 0 },
    { day: "Thu", sales: 0 },
    { day: "Fri", sales: 0 },
    { day: "Sat", sales: 0 },
    { day: "Sun", sales: 0 },
  ];

  const totalOrders = data?.kpis?.totalOrders || 0;
  const totalRevenue = data?.kpis?.totalRevenue || 0;
  const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const conversionRate = data?.kpis?.conversionRate || 0;
  const totalCustomers = data?.kpis?.totalCustomers || 0;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Business Intelligence & Analytics</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">
              Live Aggregate
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Store performance metrics, customer repeat patterns, and automated AI growth insights.
          </p>
        </div>
      </div>

      {/* AI Generated Insights Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/20 border border-blue-500/30 shadow-2xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>AI-Generated Executive Business Insights</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-200">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="font-bold text-white text-sm">🚀 Sales Performance</div>
            <p className="text-slate-300 leading-relaxed">
              {totalOrders > 0 ? (
                <>
                  Your store has fulfilled <strong className="text-emerald-400">{totalOrders} orders</strong> generating{" "}
                  <strong className="text-emerald-400">{formatCurrency(totalRevenue)}</strong> in gross revenue with an average order value of {formatCurrency(aov)}.
                </>
              ) : (
                <>
                  Your catalog is live and ready for sales. Inbound customer conversations and orders will automatically trigger live growth trajectories and velocity metrics.
                </>
              )}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="font-bold text-white text-sm">💡 AI Sales Copilot</div>
            <p className="text-slate-300 leading-relaxed">
              {conversionRate > 0 ? (
                <>
                  Inquiry conversion rate is tracking at <strong className="text-emerald-400">{conversionRate}%</strong>. The AI assistant is continuously engaging leads on WhatsApp.
                </>
              ) : (
                <>
                  AI autonomous sales assistant is synchronized with your catalog. When visitors ask about products, stock and size availability are verified in real time.
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs text-slate-400">Average Order Value (AOV)</span>
          <div className="text-2xl font-bold text-white mt-2">{formatCurrency(aov)}</div>
          <div className="text-xs text-slate-400 mt-1">
            {totalOrders > 0 ? `Across ${totalOrders} orders` : "Awaiting first order"}
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs text-slate-400">Total Registered Customers</span>
          <div className="text-2xl font-bold text-white mt-2">{totalCustomers}</div>
          <div className="text-xs text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> In CRM Database
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs text-slate-400">Inquiry Conversion</span>
          <div className="text-2xl font-bold text-white mt-2">{conversionRate}%</div>
          <div className="text-xs text-slate-400 mt-1">Leads converted to buyers</div>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs text-slate-400">Gross Paid Revenue</span>
          <div className="text-2xl font-bold text-emerald-400 mt-2">{formatCurrency(totalRevenue)}</div>
          <div className="text-xs text-slate-400 mt-1">Confirmed transactions</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Day of Week Bar Chart */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div>
            <h2 className="text-base font-semibold text-white">Weekly Sales Velocity</h2>
            <p className="text-xs text-slate-400">Daily gross revenue across all sales channels</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekdaySales}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => (v >= 1000 ? `₹${v / 1000}k` : `₹${v}`)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(v: any) => [`₹${Number(v).toLocaleString("en-IN")}`, "Sales"]}
                />
                <Bar dataKey="sales" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Products List */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Top Performing Products</h2>
              <p className="text-xs text-slate-400">Ranked by unit sales volume & revenue</p>
            </div>
            <Award className="w-5 h-5 text-amber-400" />
          </div>

          <div className="divide-y divide-slate-800">
            {topProducts.length > 0 ? (
              topProducts.map((p: any, i: number) => (
                <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-[11px]">
                      #{i + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-white">{p.name}</div>
                      <div className="text-[11px] text-slate-400">{p.sales} units sold</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">{formatCurrency(p.revenue)}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs flex flex-col items-center">
                <Package className="w-8 h-8 text-slate-600 mb-2 opacity-50" />
                <p className="font-semibold text-slate-400">No product sales yet</p>
                <p className="text-[11px] text-slate-600 mt-1 max-w-[220px]">
                  When orders are placed, top selling products and revenue distribution will show here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
