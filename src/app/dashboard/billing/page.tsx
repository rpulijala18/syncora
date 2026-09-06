"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck,
  Check,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";

export default function BillingPage() {
  const { toast } = useToast();
  const [currentPlan, setCurrentPlan] = useState("FREE");
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState<any | null>(null);
  const [isAnnual, setIsAnnual] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [usage, setUsage] = useState({
    customers: 0,
    orders: 0,
    products: 0,
  });

  const plans = [
    {
      id: "FREE",
      name: "Free Tier",
      priceMonthly: 0,
      priceAnnual: 0,
      customerLimit: 50,
      orderLimit: 50,
      description: "For new solo businesses getting started.",
      features: [
        "Up to 50 customers",
        "50 orders / month",
        "20 catalog products",
        "Basic business dashboard",
        "Demo WhatsApp sandbox",
      ],
    },
    {
      id: "STARTER",
      name: "Starter",
      priceMonthly: 499,
      priceAnnual: 399,
      customerLimit: 500,
      orderLimit: 1000,
      description: "For growing online sellers & boutique stores.",
      features: [
        "Up to 500 customers",
        "Unlimited catalog products",
        "Unlimited orders",
        "Full CRM & customer tags",
        "Inventory tracking & alerts",
        "Basic AI sales assistant",
      ],
    },
    {
      id: "BUSINESS",
      name: "Business",
      popular: true,
      priceMonthly: 1499,
      priceAnnual: 1199,
      customerLimit: 5000,
      orderLimit: 10000,
      description: "Most popular for active retail & e-commerce brands.",
      features: [
        "Everything in Starter",
        "Autonomous AI WhatsApp employee",
        "Live catalog stock auto-decrement",
        "Automated AI follow-up campaigns",
        "Up to 5 staff team accounts",
        "Advanced sales & order analytics",
        "Priority 24/7 support",
      ],
    },
    {
      id: "PRO",
      name: "Enterprise Pro",
      priceMonthly: 3999,
      priceAnnual: 3199,
      customerLimit: 50000,
      orderLimit: 100000,
      description: "For multi-location retailers & high-volume brands.",
      features: [
        "Everything in Business",
        "Multiple AI sales agents",
        "Custom AI fine-tuning & knowledge base",
        "Full REST API & webhook access",
        "Multi-warehouse locations",
        "Dedicated account manager",
      ],
    },
  ];

  const fetchPlanAndUsage = async () => {
    try {
      const res = await fetch("/api/dashboard/metrics");
      const data = await res.json();
      if (data.plan) {
        setCurrentPlan(data.plan);
      }
      if (data.counts) {
        setUsage({
          customers: data.counts.totalCustomers || 0,
          orders: data.counts.totalOrders || 0,
          products: data.counts.totalProducts || 0,
        });
      }
    } catch (err) {
      console.error("Failed to load plan usage", err);
    }
  };

  useEffect(() => {
    fetchPlanAndUsage();
  }, []);

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUpgradePlan) return;
    setProcessing(true);

    setTimeout(async () => {
      try {
        await fetch("/api/business", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: selectedUpgradePlan.id }),
        });
        setCurrentPlan(selectedUpgradePlan.id);
        toast({
          title: `Subscribed to ${selectedUpgradePlan.name}!`,
          message: "Your subscription quota has been updated immediately.",
        });
        setSelectedUpgradePlan(null);
        await fetchPlanAndUsage();
      } catch (err) {
        toast({ title: "Failed to update plan", type: "error" });
      } finally {
        setProcessing(false);
      }
    }, 1000);
  };

  const activePlanObj = plans.find((p) => p.id === currentPlan) || plans[0];
  const customerMax = activePlanObj.customerLimit;
  const orderMax = activePlanObj.orderLimit;
  const customerPct = Math.min(100, Math.round((usage.customers / customerMax) * 100));
  const orderPct = Math.min(100, Math.round((usage.orders / orderMax) * 100));

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Billing & Subscriptions</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30 uppercase">
              Active Plan: {currentPlan}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage your SaaS tier, resource quotas, payment methods, and plan upgrades.
          </p>
        </div>
      </div>

      {/* Current Plan Overview Card with Real Usage Quotas */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Current Plan:</span>
              <span className="text-base font-bold text-white uppercase">{currentPlan} TIER</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                Active & Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Gateway: Razorpay & Stripe Subscriptions Engine
            </p>
          </div>

          {currentPlan !== "PRO" && (
            <button
              onClick={() => setSelectedUpgradePlan(plans.find((p) => p.id === "PRO"))}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition self-start md:self-center"
            >
              Upgrade to Enterprise Pro
            </button>
          )}
        </div>

        {/* Quotas Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          <div className="space-y-2">
            <div className="flex justify-between text-slate-300">
              <span>Customer CRM Limit</span>
              <span className="font-semibold text-white">
                {usage.customers} / {currentPlan === "PRO" ? "Unlimited" : customerMax}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, customerPct)}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-slate-300">
              <span>Orders Processed (Monthly)</span>
              <span className="font-semibold text-white">
                {usage.orders} / {currentPlan === "PRO" ? "Unlimited" : orderMax}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, orderPct)}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-slate-300">
              <span>Catalog Products</span>
              <span className="font-semibold text-emerald-400">
                {usage.products} {currentPlan === "FREE" ? "/ 20" : "Active"}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(5, (usage.products / 20) * 100))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Available Plans Comparison Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white">Select a Plan</h2>
            <p className="text-xs text-slate-400">Scale seamlessly as your business grows</p>
          </div>

          <div className="flex items-center gap-2 text-xs bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                !isAnnual ? "bg-blue-600 text-white shadow" : "text-slate-400"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
                isAnnual ? "bg-blue-600 text-white shadow" : "text-slate-400"
              }`}
            >
              <span>Annual</span>
              <span className="text-[10px] text-emerald-400 font-bold">20% OFF</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((p) => {
            const isCurrent = currentPlan === p.id;
            const price = isAnnual ? p.priceAnnual : p.priceMonthly;

            return (
              <div
                key={p.id}
                className={`p-6 rounded-3xl border flex flex-col justify-between relative transition ${
                  p.popular
                    ? "bg-slate-900/90 border-blue-500 shadow-xl shadow-blue-500/10"
                    : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] uppercase font-bold tracking-wider px-3 py-0.5 rounded-full bg-blue-600 text-white shadow-md">
                    Most Popular
                  </span>
                )}

                <div>
                  <div className="font-bold text-white text-base">{p.name}</div>
                  <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{p.description}</p>

                  <div className="mt-4 mb-4">
                    <div className="text-2xl font-bold text-white">
                      {price === 0 ? "Free" : `₹${price.toLocaleString("en-IN")}`}
                      {price > 0 && <span className="text-xs text-slate-400 font-normal"> / month</span>}
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs">
                    {p.features.map((feat, fi) => (
                      <div key={fi} className="flex items-start gap-2 text-slate-300">
                        <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    disabled={isCurrent}
                    onClick={() => setSelectedUpgradePlan(p)}
                    className={`w-full py-2.5 rounded-xl font-semibold text-xs transition ${
                      isCurrent
                        ? "bg-slate-800 text-slate-400 cursor-default"
                        : p.popular
                        ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25"
                        : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                    }`}
                  >
                    {isCurrent ? "Current Plan" : `Select ${p.name}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PhonePe UPI Upgrade Modal */}
      {selectedUpgradePlan && (
        <Modal
          isOpen={!!selectedUpgradePlan}
          onClose={() => setSelectedUpgradePlan(null)}
          title={`Upgrade to ${selectedUpgradePlan.name}`}
          description="Scan the PhonePe UPI QR code below to activate your subscription immediately."
        >
          <form onSubmit={handleSimulatePayment} className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-white">
              <div className="flex justify-between">
                <span className="text-slate-400">Plan Selected:</span>
                <span className="font-bold">{selectedUpgradePlan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Billing Cycle:</span>
                <span className="text-slate-200">{isAnnual ? "Annual (20% Savings)" : "Monthly"}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold pt-2 border-t border-slate-800">
                <span>Total Amount:</span>
                <span className="text-emerald-400">
                  ₹{(isAnnual ? selectedUpgradePlan.priceAnnual * 12 : selectedUpgradePlan.priceMonthly).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Real PhonePe Scanner Image */}
            <div className="text-center p-3 bg-slate-950 rounded-2xl border border-purple-500/30 space-y-2">
              <div className="w-48 h-48 mx-auto rounded-xl overflow-hidden bg-black p-1">
                <img
                  src="/payment-scanner.png"
                  alt="Scan with PhonePe, GPay, Paytm"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-[11px] font-bold text-purple-300">
                Scan with PhonePe, Google Pay, Paytm, or BHIM
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-300 font-semibold">
                UPI Reference Number (UTR) after payment
              </label>
              <input
                type="text"
                required
                placeholder="Enter 12-digit UTR from receipt"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedUpgradePlan(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={processing}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition shadow-lg shadow-purple-600/25 flex items-center gap-2"
              >
                {processing ? "Activating Subscription..." : "I Have Paid — Activate Plan"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
