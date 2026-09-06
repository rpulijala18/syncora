"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  MessageSquare,
  ShoppingCart,
  Users,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  Zap,
  Star,
  ExternalLink,
  Play,
  Package,
  Clock,
  Send,
  Sparkles,
  TrendingUp,
  Receipt,
  Headphones,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How does MarketHub connect to WhatsApp?",
      a: "MarketHub connects seamlessly to your official WhatsApp Business number via the Meta Cloud API. It automatically recognizes customer messages, checks your live catalog inventory, and replies instantly with prices, availability, and order confirmations.",
    },
    {
      q: "Can I take over the chat from the automated assistant?",
      a: "Yes, at any moment! The 3-column WhatsApp inbox allows you to switch between Automated Mode and Human Mode with a single click whenever you or your staff want to step in personally.",
    },
    {
      q: "Does MarketHub update stock automatically when an order is placed?",
      a: "Yes. The instant an order is confirmed (either automatically on WhatsApp or manually by your team), your product inventory is immediately decremented, and low-stock alerts are triggered if stock dips below your threshold.",
    },
    {
      q: "Do I need technical skills or coding to set up MarketHub?",
      a: "Not at all. You can set up your store name, add your first products, and start testing in under 3 minutes using our simple step-by-step setup wizard.",
    },
    {
      q: "Can I export invoices and customer reports?",
      a: "Yes. Every order generates a clean, printable tax invoice. You can also view real-time sales reports, customer purchase histories, and best-selling products anytime.",
    },
  ];

  return (
    <div className="min-h-screen bg-transparent text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Top Announcement Bar */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
          New
        </span>
        <span>Automated WhatsApp Catalog & Order Sync is now live.</span>
        <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2 ml-1">
          Try it free →
        </Link>
      </div>

      {/* Sticky Header Nav */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="group">
            <Logo size="md" theme="light" />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition">Features</a>
            <a href="#how-it-works" className="hover:text-slate-900 transition">How It Works</a>
            <a href="#pricing" className="hover:text-slate-900 transition">Pricing</a>
            <a href="#testimonials" className="hover:text-slate-900 transition">Customers</a>
            <a href="#faq" className="hover:text-slate-900 transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 transition"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm shadow-sm transition"
            >
              <span>Live Demo</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm hover:shadow transition"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>The All-In-One Business Platform for Retailers & Online Sellers</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Run your store, inventory, and{" "}
            <span className="text-blue-600">WhatsApp sales</span> effortlessly.
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            MarketHub combines your product catalog, orders, inventory, and customer chats in one simple dashboard.
            Answer customer inquiries, check stock, and close orders automatically 24/7.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <span>Start 14-Day Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-base shadow-sm transition flex items-center justify-center gap-2"
            >
              <span>Explore Live Dashboard</span>
            </Link>
          </div>

          {/* Social Proof Mini */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Setup in under 3 minutes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* HERO INTERACTIVE SHOWCASE: WhatsApp Conversation + Live Orders Dashboard */}
        <div className="max-w-6xl mx-auto mt-14">
          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xl overflow-hidden">
            {/* Top Browser / Window bar */}
            <div className="bg-slate-100/80 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs text-slate-500 font-medium ml-2">MarketHub Live Commerce View</span>
              </div>
              <div className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Catalog & WhatsApp Sync</span>
              </div>
            </div>

            {/* Split Screen Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
              {/* Left Column: Real WhatsApp Interaction (5 cols) */}
              <div className="lg:col-span-5 p-5 sm:p-6 bg-slate-50 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                      WA
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">WhatsApp Store Assistant</div>
                      <div className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> Online & Replying Instantly
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-md font-medium">
                    Auto-Pilot
                  </span>
                </div>

                {/* Chat Messages */}
                <div className="space-y-3 text-xs">
                  {/* Customer message */}
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 text-slate-800 p-3 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm">
                      <p className="font-medium">Hi! Do you have the Black Runner Shoes available in size 9?</p>
                      <span className="text-[10px] text-slate-400 block text-right mt-1">10:42 AM</span>
                    </div>
                  </div>

                  {/* BizPilot automated reply */}
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-sm max-w-[88%] shadow-sm space-y-1.5">
                      <p>
                        Hello! Yes, we have <strong>Black Runner Shoes</strong> in stock in size 9 (14 pairs left).
                      </p>
                      <p className="bg-blue-700/50 p-1.5 rounded text-[11px]">
                        💰 <strong>Price:</strong> ₹2,499 (Free shipping included)
                      </p>
                      <p>Would you like me to reserve a pair and generate your order confirmation?</p>
                      <span className="text-[10px] text-blue-200 block text-right">10:42 AM · Sent automatically</span>
                    </div>
                  </div>

                  {/* Customer confirms */}
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 text-slate-800 p-3 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm">
                      <p className="font-medium">Yes please! Deliver to Indiranagar, Bengaluru.</p>
                      <span className="text-[10px] text-slate-400 block text-right mt-1">10:43 AM</span>
                    </div>
                  </div>

                  {/* BizPilot confirms & creates order */}
                  <div className="flex justify-end">
                    <div className="bg-emerald-600 text-white p-3 rounded-2xl rounded-tr-sm max-w-[88%] shadow-sm space-y-1">
                      <p className="font-semibold">✅ Order #ORD-1082 Placed!</p>
                      <p className="text-[11px] text-emerald-100">
                        1x Black Runner Shoes (Size 9) reserved. Stock automatically updated. Tax invoice has been generated.
                      </p>
                      <span className="text-[10px] text-emerald-200 block text-right">10:43 AM</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Result in Store Dashboard (7 cols) */}
              <div className="lg:col-span-7 p-5 sm:p-6 bg-white space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Real-time Store Dashboard</div>
                    <div className="text-xs text-slate-500">Live inventory decrement & instant revenue sync</div>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                    Auto-Synced
                  </span>
                </div>

                {/* 3 Metric Cards */}
                <div className="grid grid-cols-3 gap-3 text-left">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[11px] text-slate-500 font-medium">New Order</div>
                    <div className="text-lg font-bold text-slate-900 mt-0.5">#ORD-1082</div>
                    <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">₹2,499 Confirmed</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[11px] text-slate-500 font-medium">Stock Updated</div>
                    <div className="text-lg font-bold text-slate-900 mt-0.5">13 pairs</div>
                    <div className="text-[10px] text-blue-600 font-semibold mt-0.5">-1 decremented</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[11px] text-slate-500 font-medium">Customer CRM</div>
                    <div className="text-lg font-bold text-slate-900 mt-0.5">Saved</div>
                    <div className="text-[10px] text-purple-600 font-semibold mt-0.5">+1 Repeat Buyer</div>
                  </div>
                </div>

                {/* Live Order Row */}
                <div className="rounded-xl border border-slate-200 p-4 space-y-3 bg-white shadow-sm">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                        👟
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Black Runner Shoes (Size 9)</div>
                        <div className="text-slate-500 text-[11px]">Customer: Priya M. · Bengaluru</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">₹2,499</div>
                      <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        PAID
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span>Channel: <strong>WhatsApp Business</strong></span>
                    <span className="text-blue-600 font-semibold">Tax Invoice Generated ✓</span>
                  </div>
                </div>

                {/* Callout */}
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-900 flex items-center gap-3">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    <strong>Zero human effort:</strong> Inquiries answered, inventory verified, orders recorded, and invoices issued completely in the background.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PILLARS (CORE FEATURES) */}
      <section id="features" className="py-20 px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Complete Business Suite
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything your business needs in one simple workspace
            </h3>
            <p className="text-slate-600 text-base">
              Say goodbye to juggling WhatsApp chats on one phone, stock counts in notebooks, and orders on spreadsheets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="clean-card p-6 rounded-2xl bg-white space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-sm">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Automated WhatsApp Sales</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Connect your WhatsApp number. When shoppers ask about sizes, colors, or prices, BizPilot replies instantly with real-time stock and takes their order.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="clean-card p-6 rounded-2xl bg-white space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-sm">
                <Package className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Real-Time Inventory Control</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Track stock across all products and variants. Whenever an item is sold, stock is decremented immediately with automatic warnings before you run out.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="clean-card p-6 rounded-2xl bg-white space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shadow-sm">
                <Receipt className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Order Management & Invoicing</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Create orders in seconds, track fulfillment status, record payments, and print professional GST-compliant tax invoices with one click.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="clean-card p-6 rounded-2xl bg-white space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Customer CRM & Follow-ups</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Maintain complete customer profiles, order histories, and contact info. Identify past shoppers and automatically follow up with customers who left without buying.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="clean-card p-6 rounded-2xl bg-white space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shadow-sm">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Clear Business Analytics</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Know your daily revenue, top-selling items, weekly sales velocity, and average order value without spending hours calculating spreadsheet formulas.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="clean-card p-6 rounded-2xl bg-white space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shadow-sm">
                <Headphones className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Human + Assistant Collaboration</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Toggle between automatic replies and personal staff intervention whenever you want. Add team members with permissions for seamless shift handovers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (3 SIMPLE STEPS) */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Simple 3-Step Setup
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Up and running in 3 minutes
            </h3>
            <p className="text-slate-600 text-sm">
              No developer needed. Get your store online today with zero technical hurdles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3 p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-md shadow-blue-600/20">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-base">Add Your Products</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your items, prices, available sizes/colors, and current inventory counts into your catalog.
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-md shadow-blue-600/20">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-base">Connect WhatsApp</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Link your WhatsApp business number so customer inquiries can be answered instantly with accurate product details.
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-md shadow-blue-600/20">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-base">Watch Sales Grow</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Orders flow directly into your dashboard, inventory syncs in real time, and customers receive automatic receipts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-20 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Trusted by Merchants
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Real stores getting real results
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="clean-card p-6 rounded-2xl bg-white space-y-4">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 text-sm italic leading-relaxed">
                &quot;We used to lose so many sales late at night when customers messaged asking if shoes were in stock. BizPilot answers them within 2 seconds and closes the sale immediately.&quot;
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                  RS
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">Rohit Sharma</div>
                  <div className="text-[11px] text-slate-500">Owner, Urban Footwear Co.</div>
                </div>
              </div>
            </div>

            <div className="clean-card p-6 rounded-2xl bg-white space-y-4">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 text-sm italic leading-relaxed">
                &quot;The automatic stock decrement has saved us from embarrassing overselling. Everything stays accurate, and issuing invoices takes literally one click.&quot;
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                  AP
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">Ananya Patel</div>
                  <div className="text-[11px] text-slate-500">Founder, Silk & Thread Boutique</div>
                </div>
              </div>
            </div>

            <div className="clean-card p-6 rounded-2xl bg-white space-y-4">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 text-sm italic leading-relaxed">
                &quot;The customer CRM and follow-up feature brought back over ₹40,000 in sales last month from people who asked questions but forgot to complete their order.&quot;
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                  VK
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">Vikram Kapoor</div>
                  <div className="text-[11px] text-slate-500">Managing Partner, Delhi Tech Hub</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-20 px-6 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Transparent Pricing
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Simple plans for businesses of all sizes
            </h3>
            <p className="text-slate-600 text-sm">
              Start free today and upgrade as your order volume grows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plan 1: Free */}
            <div className="clean-card p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-lg">Free Tier</h4>
                <p className="text-xs text-slate-500 mt-1">Perfect for trying out MarketHub</p>
                <div className="my-5">
                  <span className="text-4xl font-extrabold text-slate-900">₹0</span>
                  <span className="text-xs text-slate-500 font-medium"> / month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Up to 50 customers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>20 catalog products</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>50 orders per month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Basic store dashboard</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <Link
                  href="/signup"
                  className="block w-full text-center py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs transition"
                >
                  Start Free
                </Link>
              </div>
            </div>

            {/* Plan 2: Business (Popular) */}
            <div className="clean-card p-6 rounded-2xl bg-white border-2 border-blue-600 shadow-lg relative flex flex-col justify-between">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
                Most Popular
              </span>
              <div>
                <h4 className="font-bold text-slate-900 text-lg">Business</h4>
                <p className="text-xs text-slate-500 mt-1">For active retail & online stores</p>
                <div className="my-5">
                  <span className="text-4xl font-extrabold text-slate-900">₹1,499</span>
                  <span className="text-xs text-slate-500 font-medium"> / month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  <li className="flex items-center gap-2 font-medium text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Automated WhatsApp sales assistant</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Unlimited products & inventory</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Automatic stock decrements</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Tax invoice generation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Automated customer follow-ups</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Up to 5 staff accounts</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <Link
                  href="/signup"
                  className="block w-full text-center py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition"
                >
                  Start 14-Day Free Trial
                </Link>
              </div>
            </div>

            {/* Plan 3: Enterprise */}
            <div className="clean-card p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-lg">Enterprise Pro</h4>
                <p className="text-xs text-slate-500 mt-1">For multi-location & high-volume brands</p>
                <div className="my-5">
                  <span className="text-4xl font-extrabold text-slate-900">₹3,999</span>
                  <span className="text-xs text-slate-500 font-medium"> / month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Everything in Business</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Unlimited orders & contacts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Multiple warehouse locations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>REST API & webhook integrations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Dedicated account manager</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <Link
                  href="/signup"
                  className="block w-full text-center py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs transition"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Got Questions?
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full text-left p-4.5 flex items-center justify-between font-semibold text-slate-900 text-sm hover:bg-slate-50/50 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-blue-600" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4.5 pt-0 text-slate-600 text-xs leading-relaxed border-t border-slate-100 bg-slate-50/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="py-16 px-6 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to streamline your business and sell faster?
          </h2>
          <p className="text-blue-100 text-base max-w-2xl mx-auto">
            Join hundreds of retail stores, Instagram sellers, and online brands growing their business with MarketHub.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-white text-blue-600 hover:bg-blue-50 font-bold text-sm shadow-md transition"
            >
              Start Free 14-Day Trial
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm border border-blue-500 transition"
            >
              View Live Demo Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* CLEAN FOOTER */}
      <footer className="py-12 px-6 border-t border-slate-200 text-xs text-slate-500 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size="sm" theme="light" />
            <span>© 2026 MarketHub Technologies Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-slate-600">
            <a href="#" className="hover:text-slate-900 transition">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 transition">Terms of Service</a>
            <a href="#" className="hover:text-slate-900 transition">WhatsApp Integration</a>
            <a href="#" className="hover:text-slate-900 transition">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
