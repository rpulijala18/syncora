"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function PublicPricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      id: "FREE",
      name: "Free",
      priceMonthly: 0,
      priceAnnual: 0,
      description: "Best for exploring Syncora and solo setup",
      features: [
        "Up to 50 customers in CRM",
        "50 orders / month",
        "20 catalog products",
        "Standard order management",
        "Community support",
      ],
      cta: "Start Free",
      popular: false,
      href: "/signup",
    },
    {
      id: "STARTER",
      name: "Starter",
      priceMonthly: 499,
      priceAnnual: 399,
      description: "For growing online sellers & boutique stores",
      features: [
        "Up to 500 customers",
        "Unlimited catalog products",
        "1,000 orders / month",
        "Customer tags & purchase history",
        "Stock tracking & low stock alerts",
        "Tax invoice generator",
        "Standard email support",
      ],
      cta: "Start 14-Day Free Trial",
      popular: false,
      href: "/signup",
    },
    {
      id: "BUSINESS",
      name: "Business",
      priceMonthly: 1499,
      priceAnnual: 1199,
      description: "Our most popular tier for active retail & e-commerce brands",
      features: [
        "Everything in Starter",
        "Automated WhatsApp sales assistant",
        "Live stock auto-decrement on order",
        "Automated customer follow-ups",
        "Up to 5 staff team accounts",
        "Sales analytics & velocity reports",
        "Priority WhatsApp & phone support",
      ],
      cta: "Start 14-Day Free Trial",
      popular: true,
      href: "/signup",
    },
    {
      id: "PRO",
      name: "Enterprise Pro",
      priceMonthly: 3999,
      priceAnnual: 3199,
      description: "For multi-branch retailers & high-volume commerce",
      features: [
        "Everything in Business",
        "Unlimited orders and contacts",
        "Multi-warehouse locations",
        "REST API & webhook access",
        "Dedicated account manager",
        "Custom setup & onboarding assistance",
      ],
      cta: "Contact Sales",
      popular: false,
      href: "/signup",
    },
  ];

  return (
    <div className="min-h-screen bg-transparent text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="group">
            <Logo size="md" theme="light" />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 py-2">
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition"
            >
              Live Demo
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-sm"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-16 pb-12 px-6 text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Transparent, Predictable Pricing</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Simple pricing designed for growing businesses
        </h1>
        <p className="text-base text-slate-600 max-w-xl mx-auto">
          Start with our free plan or 14-day free trial. Upgrade or cancel anytime with one click.
        </p>

        {/* Billing toggle */}
        <div className="pt-6 flex items-center justify-center gap-3">
          <span className={`text-xs font-semibold ${!isAnnual ? "text-slate-900" : "text-slate-500"}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-12 h-6 bg-slate-200 rounded-full p-1 transition-colors relative"
          >
            <div
              className={`w-4 h-4 rounded-full bg-blue-600 transition-transform ${
                isAnnual ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-xs font-semibold flex items-center gap-1.5 ${isAnnual ? "text-slate-900" : "text-slate-500"}`}>
            <span>Annual Billing</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-1.5 py-0.5 rounded-full">
              Save 20%
            </span>
          </span>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p) => {
            const price = isAnnual ? p.priceAnnual : p.priceMonthly;

            return (
              <div
                key={p.id}
                className={`rounded-2xl p-6 flex flex-col justify-between transition-all relative ${
                  p.popular
                    ? "bg-white border-2 border-blue-600 shadow-xl"
                    : "bg-white border border-slate-200 shadow-sm hover:shadow-md"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full bg-blue-600 text-white shadow-sm">
                    Most Popular
                  </span>
                )}

                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{p.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{p.description}</p>

                  <div className="my-6">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                      {price === 0 ? "Free" : `₹${price.toLocaleString("en-IN")}`}
                    </span>
                    {price > 0 && <span className="text-xs text-slate-500 font-normal"> / month</span>}
                  </div>

                  <ul className="space-y-3 pt-6 border-t border-slate-100 text-xs">
                    {p.features.map((feat, fi) => (
                      <li key={fi} className="flex items-start gap-2.5 text-slate-700">
                        <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <Link
                    href={p.href}
                    className={`block w-full text-center py-2.5 rounded-xl font-bold text-xs transition ${
                      p.popular
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20"
                        : "border border-slate-300 hover:bg-slate-50 text-slate-800"
                    }`}
                  >
                    {p.cta}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-200 text-xs text-slate-500 bg-slate-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size="sm" theme="light" />
            <span>© 2026 Syncora Technologies Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-slate-600">
            <a href="#" className="hover:text-slate-900 transition">Privacy</a>
            <a href="#" className="hover:text-slate-900 transition">Terms</a>
            <a href="#" className="hover:text-slate-900 transition">Security</a>
            <a href="#" className="hover:text-slate-900 transition">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
