"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Kanban,
  Users,
  Package,
  Boxes,
  Bot,
  MessageSquare,
  Sparkles,
  BarChart3,
  CreditCard,
  Settings,
  ChevronRight,
  ShieldCheck,
  Store,
  Menu,
  X,
  UserCheck,
  Clock,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [session, setSession] = useState<{
    name: string;
    businessName: string;
    plan: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setSession({
            name: data.user.name || "Merchant",
            businessName: data.user.businessName || "My Store",
            plan: data.user.plan || "FREE",
          });
        }
      })
      .catch(() => {});
  }, []);

  const navGroups: NavGroup[] = [
    {
      label: "Overview",
      items: [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      label: "Sales & CRM",
      items: [
        { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
        { name: "Leads", href: "/dashboard/leads", icon: Kanban },
        { name: "Customers (CRM)", href: "/dashboard/crm", icon: Users },
      ],
    },
    {
      label: "Inventory",
      items: [
        { name: "Products", href: "/dashboard/products", icon: Package },
      ],
    },
    {
      label: "AI Automation",
      items: [
        { name: "AI Sales Agent", href: "/dashboard/ai-agent", icon: Bot, badge: "Active" },
        { name: "WhatsApp Inbox", href: "/dashboard/inbox", icon: MessageSquare },
        { name: "AI Follow-ups", href: "/dashboard/follow-ups", icon: Clock },
      ],
    },
    {
      label: "Management",
      items: [
        { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
        { name: "Billing & Plans", href: "/dashboard/billing", icon: CreditCard },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
      ],
    },
  ];

  const initials = session?.name
    ? session.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "BP";

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800/80 select-none">
      {/* Brand Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800/80">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <Logo size="md" useImage={true} showText={false} className="group-hover:scale-105 transition-transform" />
          {!collapsed && (
            <div>
              <div className="font-bold text-white tracking-tight text-base flex items-center gap-1.5">
                MarketHub <span className="text-blue-400 font-semibold text-xs px-1.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">PRO</span>
              </div>
              <div className="text-[11px] text-slate-400 truncate max-w-[130px]">
                {session?.businessName || "My Store"}
              </div>
            </div>
          )}
        </Link>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx}>
            {!collapsed && (
              <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {group.label}
              </div>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "text-slate-300 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-400"}`} />
                    {!collapsed && (
                      <span className="flex-1 truncate">{item.name}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : item.badge === "Active"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Profile */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs">
            {initials}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">
                {session?.name || "Merchant"}
              </div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{session?.plan || "Free"} Plan</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:block sticky top-0 h-screen shrink-0 transition-all duration-300 z-30 ${collapsed ? "w-16" : "w-64"}`}>
        {sidebarContent}
      </aside>

      {/* Mobile Trigger Button */}
      <div className="md:hidden fixed top-3 left-3 z-40">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-white shadow-lg"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 max-w-full h-full z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
