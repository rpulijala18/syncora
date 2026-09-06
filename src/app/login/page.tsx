"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, Store } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent, isDemo: boolean = false) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const loginEmail = isDemo ? "demo@bizpilot.com" : email;
    const loginPassword = isDemo ? "password123" : password;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/dashboard");
      } else {
        setError(data.error || "Invalid email or password");
      }
    } catch (err) {
      setError("Network connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col justify-center items-center p-4 text-slate-900">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <Link href="/" className="group">
            <Logo size="lg" theme="light" />
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign in to Syncora
          </h1>
          <p className="text-xs text-slate-500">
            Access your store catalog, orders, and customer messages
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={(e) => handleLogin(e, false)} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@business.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-700 font-semibold">Password</label>
                <Link
                  href="#"
                  className="text-blue-600 hover:text-blue-700 font-medium text-[11px]"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition shadow-sm hover:shadow flex items-center justify-center gap-2 text-xs mt-2"
            >
              <span>{loading ? "Signing in..." : "Sign In to Dashboard"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Button */}
          <div className="pt-4 border-t border-slate-100">
            <Link
              href="/dashboard"
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition flex items-center justify-center gap-2"
            >
              <Store className="w-4 h-4 text-slate-600" />
              <span>Explore Live Demo Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-bold">
            Start free trial
          </Link>
        </div>
      </div>
    </div>
  );
}
