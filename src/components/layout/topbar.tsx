"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Bell,
  MessageSquare,
  ExternalLink,
  LogOut,
  ChevronDown,
  User,
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
  Inbox,
} from "lucide-react";
import { GlobalAdvisorDrawer } from "./global-advisor-drawer";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export function Topbar() {
  const router = useRouter();
  const [advisorOpen, setAdvisorOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const [session, setSession] = useState<{
    name: string;
    email: string;
    businessName: string;
    plan: string;
  } | null>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setSession({
            name: data.user.name || "Business Owner",
            email: data.user.email || "",
            businessName: data.user.businessName || "My Business",
            plan: data.user.plan || "FREE",
          });
        }
      })
      .catch(() => {});

    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        if (data.notifications) {
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount || 0);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (e) {
      console.error(e);
      router.push("/login");
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return (name.slice(0, 2) || "BP").toUpperCase();
  };

  return (
    <>
      <header className="sticky top-0 z-20 h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Store Selector & Breadcrumb */}
        <div className="flex items-center gap-3 pl-10 md:pl-0">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-white truncate max-w-[140px] sm:max-w-[200px]">
              {session?.businessName || "BizPilot Store"}
            </span>
            <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded uppercase font-medium">
              {session?.plan || "FREE"}
            </span>
          </div>

          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition"
          >
            <span>Landing Page</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {/* Center/Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Advisor Trigger Button */}
          <button
            onClick={() => setAdvisorOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 border border-blue-500/40 hover:border-blue-400 text-blue-300 hover:text-white transition shadow-sm group"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400 group-hover:rotate-12 transition-transform" />
            <span className="text-xs font-semibold">AI Business Advisor</span>
            <span className="hidden lg:inline text-[10px] bg-blue-500/20 px-1.5 py-0.5 rounded font-mono text-blue-300">
              Live DB
            </span>
          </button>

          {/* WhatsApp Inbox Quick Link */}
          <Link
            href="/dashboard/inbox"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 text-xs font-medium transition"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp Inbox</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </Link>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition relative"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-30 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-semibold text-white">
                  <span>Notifications</span>
                  {unreadCount > 0 ? (
                    <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                      {unreadCount} new
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500">All caught up</span>
                  )}
                </div>
                <div className="space-y-2 py-2 max-h-72 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl text-xs flex items-start gap-2 border ${
                          n.type === "WARNING"
                            ? "bg-rose-500/10 border-rose-500/20 text-rose-200"
                            : n.type === "SUCCESS"
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-200"
                            : "bg-slate-800/60 border-slate-700/50 text-slate-200"
                        }`}
                      >
                        {n.type === "WARNING" ? (
                          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        ) : n.type === "SUCCESS" ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <ShoppingBag className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className="font-semibold">{n.title}</div>
                          <div className="text-[11px] opacity-80 mt-0.5">{n.message}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-slate-500 text-xs flex flex-col items-center">
                      <Inbox className="w-6 h-6 mb-1.5 opacity-40 text-slate-400" />
                      <p>No notifications yet</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        New orders, low stock, and AI alerts will appear here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 hover:text-white transition"
            >
              <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                {session ? getInitials(session.name) : "BP"}
              </div>
              <span className="hidden sm:inline font-medium truncate max-w-[100px]">
                {session?.name || "Account"}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-800 text-xs">
                  <div className="font-semibold text-white truncate">
                    {session?.name || "Business Owner"}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {session?.email || "owner@bizpilot.ai"}
                  </div>
                </div>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Store Settings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global AI Business Advisor Drawer */}
      <GlobalAdvisorDrawer isOpen={advisorOpen} onClose={() => setAdvisorOpen(false)} />
    </>
  );
}
