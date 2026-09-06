"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  Store,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Package,
  Bot,
  Coins,
  Rocket,
  Globe,
} from "lucide-react";

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStore = searchParams.get("storeName") || "";

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    businessName: initialStore || "My Store",
    businessType: "Retail & E-commerce",
    country: "India",
    currency: "INR",
    productName: "",
    productPrice: "",
    productStock: "10",
    aiName: "Aria",
    aiDescription: "Dedicated sales associate who recommends products and helps customers buy.",
    aiRules: "1. Check stock before confirming.\n2. Be polite and concise.\n3. Offer draft order creation for quick checkout.",
  });

  const totalSteps = 4;

  const handleNext = async () => {
    if (step === 3) {
      // Persist onboarding data to database
      setSubmitting(true);
      try {
        await fetch("/api/business/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businessName: formData.businessName,
            businessType: formData.businessType,
            country: formData.country,
            currency: formData.currency,
            productName: formData.productName,
            productPrice: formData.productPrice,
            productStock: formData.productStock,
            aiName: formData.aiName,
            aiPersona: formData.aiDescription,
            aiSystemRules: formData.aiRules,
          }),
        });
        setStep(4);
      } catch (err) {
        console.error("Onboarding failed:", err);
      } finally {
        setSubmitting(false);
      }
    } else if (step === 4) {
      router.push("/dashboard");
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1 && step < 4) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col justify-center items-center p-4 text-slate-100">
      <div className="w-full max-w-xl space-y-6">
        {/* Top Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>BizPilot Workspace Onboarding</span>
            </span>
            <span>
              Step {step} of {totalSteps}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-300 rounded-full"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Card */}
        <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
          {/* STEP 1: Create your business */}
          {step === 1 && (
            <div className="space-y-4 text-xs">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Store className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">Step 1: Create your business</h2>
              <p className="text-slate-400">
                Set up your business identity, market location, and operating currency.
              </p>
              <div className="space-y-3.5 pt-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Business / Store Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="e.g. Apex Apparel or Bangalore Roasters"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Business Type</label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Retail & E-commerce">Retail & E-commerce</option>
                    <option value="Fashion & Footwear">Fashion & Footwear</option>
                    <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                    <option value="Beauty & Cosmetics">Beauty & Cosmetics</option>
                    <option value="Instagram / WhatsApp Seller">Instagram / WhatsApp Seller</option>
                    <option value="Services & Consulting">Services & Consulting</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Country</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="India"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Store Currency</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="INR">₹ INR (Indian Rupee)</option>
                      <option value="USD">$ USD (US Dollar)</option>
                      <option value="EUR">€ EUR (Euro)</option>
                      <option value="AED">AED (UAE Dirham)</option>
                      <option value="GBP">£ GBP (British Pound)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Add your first product */}
          {step === 2 && (
            <div className="space-y-4 text-xs">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Step 2: Add your first product</h2>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, productName: "", productPrice: "" });
                    setStep(3);
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                >
                  Skip for now →
                </button>
              </div>
              <p className="text-slate-400">
                Add an initial item so your AI Sales Agent can immediately answer customer queries.
              </p>
              <div className="space-y-3.5 pt-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Product Name</label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    placeholder="e.g. Classic Runner Shoes or Organic Cotton T-Shirt"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Price ({formData.currency})</label>
                    <input
                      type="number"
                      value={formData.productPrice}
                      onChange={(e) => setFormData({ ...formData, productPrice: e.target.value })}
                      placeholder="1999"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Initial Stock Count</label>
                    <input
                      type="number"
                      value={formData.productStock}
                      onChange={(e) => setFormData({ ...formData, productStock: e.target.value })}
                      placeholder="10"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Configure AI assistant */}
          {step === 3 && (
            <div className="space-y-4 text-xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">Step 3: Configure your AI assistant</h2>
              <p className="text-slate-400">
                Customize how your autonomous AI employee talks to customers on WhatsApp and web chat.
              </p>
              <div className="space-y-3.5 pt-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">AI Employee Name</label>
                  <input
                    type="text"
                    value={formData.aiName}
                    onChange={(e) => setFormData({ ...formData, aiName: e.target.value })}
                    placeholder="Aria"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Business Description</label>
                  <textarea
                    rows={2}
                    value={formData.aiDescription}
                    onChange={(e) => setFormData({ ...formData, aiDescription: e.target.value })}
                    placeholder="We sell premium footwear and accessories with express 2-day delivery across metro cities."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Business Rules & Sizing Guidelines</label>
                  <textarea
                    rows={3}
                    value={formData.aiRules}
                    onChange={(e) => setFormData({ ...formData, aiRules: e.target.value })}
                    placeholder="1. Always check stock before confirming.\n2. Be polite and concise.\n3. Offer draft order creation for quick checkout."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Workspace Ready */}
          {step === 4 && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                <Rocket className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white">Your BizPilot workspace is ready!</h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                <strong>{formData.businessName}</strong> has been configured with real multi-tenant data isolation. You can now manage customers, inventory, and let your AI agent handle sales.
              </p>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-left space-y-2 max-w-sm mx-auto">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Business account initialized</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>AI Sales Agent ({formData.aiName}) active</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Free plan activated (50 customers, 20 products)</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {step > 1 && step < 4 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : <div />}

            <button
              type="button"
              disabled={submitting}
              onClick={handleNext}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/25"
            >
              <span>{submitting ? "Saving Workspace..." : step === 4 ? "Go to Dashboard" : step === 3 ? "Complete Setup" : "Continue"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-slate-400 text-xs">
          Loading BizPilot onboarding...
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}
