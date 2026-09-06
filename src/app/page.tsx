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
    <div className="min-h-screen bg-transparent text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Top Announcement Bar */}
      <div className="bg-blue-600/20 border-b border-blue-500/30 text-blue-200 text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
          New
        </span>
        <span>Automated WhatsApp Catalog &amp; Order Sync is now live.</span>
        <Link href="/signup" className="text-blue-300 hover:text-white font-semibold underline underline-offset-2 ml-1">
          Try it free →
        </Link>
      </div>

      {/* Sticky Header Nav */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="group">
            <Logo size="md" theme="dark" />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="#testimonials" className="hover:text-white transition">Customers</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-400 hover:text-white px-3 py-2 transition"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm shadow-sm transition"
            >
              <span>Live Demo</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-sm hover:shadow-blue-600/30 hover:shadow-md transition"
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>The All-In-One Business Platform for Retailers &amp; Online Sellers</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Run your store, inventory, and{" "}
            <span className="text-blue-400">WhatsApp sales</span> effortlessly.
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            MarketHub combines your product catalog, orders, inventory, and customer chats in one simple dashboard.
            Answer customer inquiries, check stock, and close orders automatically 24/7.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 transition flex items-center justify-center gap-2"
            >
              <span>Start 14-Day Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-base shadow-sm transition flex items-center justify-center gap-2"
            >
              <span>Explore Live Dashboard</span>
            </Link>
          </div>

          {/* Social Proof Mini */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Setup in under 3 minutes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* HERO INTERACTIVE SHOWCASE */}
        <div className="max-w-6xl mx-auto mt-14">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-blue-900/10 overflow-hidden">
            {/* Top Browser bar */}
            <div className="bg-slate-800/80 border-b border-slate-700/80 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                <span className="text-xs text-slate-400 font-medium ml-2">MarketHub Live Commerce View</span>
              </div>
              <div className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Catalog &amp; WhatsApp Sync</span>
              </div>
            </div>

            {/* Split Screen Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
              {/* Left Column: WhatsApp Interaction */}
              <div className="lg:col-span-5 p-5 sm:p-6 bg-slate-900/60 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                      WA
                    </div>
                    <div>
                      <div className="font-bold text-slate-100 text-sm">WhatsApp Store Assistant</div>
                      <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online &amp; Replying Instantly
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 bg-slate-800 border border-slate-700 px-2 py-1 rounded-md font-medium">
                    Auto-Pilot
                  </span>
                </div>

                {/* Chat Messages */}
                <div className="space-y-3 text-xs">
                  <div className="flex justify-start">
                    <div className="bg-slate-800 border border-slate-700 text-slate-200 p-3 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm">
                      <p className="font-medium">Hi! Do you have the Black Runner Shoes available in size 9?</p>
                      <span className="text-[10px] text-slate-500 block text-right mt-1">10:42 AM</span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-sm max-w-[88%] shadow-sm space-y-1.5">
                      <p>
                        Hello! Yes, we have <strong>Black Runner Shoes</strong> in stock in size 9 (14 pairs left).
                      </p>
                      <p className="bg-blue-700/60 p-1.5 rounded text-[11px]">
                        💰 <strong>Price:</strong> ₹2,499 (Free shipping included)
                      </p>
                      <p>Would you like me to reserve a pair and generate your order confirmation?</p>
                      <span className="text-[10px] text-blue-300 block text-right">10:42 AM · Sent automatically</span>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="bg-slate-800 border border-slate-700 text-slate-200 p-3 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm">
                      <p className="font-medium">Yes please! Deliver to Indiranagar, Bengaluru.</p>
                      <span className="text-[10px] text-slate-500 block text-right mt-1">10:43 AM</span>
                    </div>
                  </div>

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

              {/* Right Column: Dashboard */}
              <div className="lg:col-span-7 p-5 sm:p-6 bg-slate-900/40 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <div className="font-bold text-slate-100 text-sm">Real-time Store Dashboard</div>
                    <div className="text-xs text-slate-500">Live inventory decrement &amp; instant revenue sync</div>
                  </div>
                  <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2.5 py-1 rounded-full">
                    Auto-Synced
                  </span>
                </div>

                {/* 3 Metric Cards */}
                <div className="grid grid-cols-3 gap-3 text-left">
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                    <div className="text-[11px] text-slate-500 font-medium">New Order</div>
                    <div className="text-lg font-bold text-white mt-0.5">#ORD-1082</div>
                    <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">₹2,499 Confirmed</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                    <div className="text-[11px] text-slate-500 font-medium">Stock Updated</div>
                    <div className="text-lg font-bold text-white mt-0.5">13 pairs</div>
                    <div className="text-[10px] text-blue-400 font-semibold mt-0.5">-1 decremented</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                    <div className="text-[11px] text-slate-500 font-medium">Customer CRM</div>
                    <div className="text-lg font-bold text-white mt-0.5">Saved</div>
                    <div className="text-[10px] text-purple-400 font-semibold mt-0.5">+1 Repeat Buyer</div>
                  </div>
                </div>

                {/* Live Order Row */}
                <div className="rounded-xl border border-slate-700 p-4 space-y-3 bg-slate-800/60 shadow-sm">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                        👟
                      </div>
                      <div>
                        <div className="font-bold text-slate-100">Black Runner Shoes (Size 9)</div>
                        <div className="text-slate-500 text-[11px]">Customer: Priya M. · Bengaluru</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white">₹2,499</div>
                      <span className="inline-block text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        PAID
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-700 flex items-center justify-between text-xs text-slate-500">
                    <span>Channel: <strong className="text-slate-300">WhatsApp Business</strong></span>
                    <span className="text-blue-400 font-semibold">Tax Invoice Generated ✓</span>
                  </div>
                </div>

                {/* Callout */}
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 flex items-center gap-3">
                  <Clock className="w-4 h-4 text-blue-400 shrink-0" />
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
      <section id="features" className="py-20 px-6 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Complete Business Suite
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Everything your business needs in one simple workspace
            </h3>
            <p className="text-slate-400 text-base">
              Say goodbye to juggling WhatsApp chats on one phone, stock counts in notebooks, and orders on spreadsheets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: MessageSquare, color: "emerald", title: "Automated WhatsApp Sales", desc: "Connect your WhatsApp number. When shoppers ask about sizes, colors, or prices, MarketHub replies instantly with real-time stock and takes their order." },
              { icon: Package, color: "blue", title: "Real-Time Inventory Control", desc: "Track stock across all products and variants. Whenever an item is sold, stock is decremented immediately with automatic warnings before you run out." },
              { icon: Receipt, color: "indigo", title: "Order Management & Invoicing", desc: "Create orders in seconds, track fulfillment status, record payments, and print professional GST-compliant tax invoices with one click." },
              { icon: Users, color: "purple", title: "Customer CRM & Follow-ups", desc: "Maintain complete customer profiles, order histories, and contact info. Identify past shoppers and automatically follow up with customers who left without buying." },
              { icon: BarChart3, color: "amber", title: "Clear Business Analytics", desc: "Know your daily revenue, top-selling items, weekly sales velocity, and average order value without spending hours calculating spreadsheet formulas." },
              { icon: Headphones, color: "rose", title: "Human + Assistant Collaboration", desc: "Toggle between automatic replies and personal staff intervention whenever you want. Add team members with permissions for seamless shift handovers." },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="clean-card p-6 rounded-2xl space-y-4">
                <div className={`w-12 h-12 rounded-xl bg-${color}-500/10 border border-${color}-500/20 text-${color}-400 flex items-center justify-center shadow-sm`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">{title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Simple 3-Step Setup
            </h2>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              Up and running in 3 minutes
            </h3>
            <p className="text-slate-400 text-sm">
              No developer needed. Get your store online today with zero technical hurdles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: 1, title: "Add Your Products", desc: "Enter your items, prices, available sizes/colors, and current inventory counts into your catalog." },
              { n: 2, title: "Connect WhatsApp", desc: "Link your WhatsApp business number so customer inquiries can be answered instantly with accurate product details." },
              { n: 3, title: "Watch Sales Grow", desc: "Orders flow directly into your dashboard, inventory syncs in real time, and customers receive automatic receipts." },
            ].map(({ n, title, desc }) => (
              <div key={n} className="text-center space-y-3 p-6 rounded-2xl border border-slate-800 bg-slate-900/60">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-md shadow-blue-600/30">
                  {n}
                </div>
                <h4 className="font-bold text-white text-base">{title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-20 px-6 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Trusted by Merchants
            </h2>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              Real stores getting real results
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { initials: "RS", color: "blue", name: "Rohit Sharma", biz: "Owner, Urban Footwear Co.", quote: "We used to lose so many sales late at night when customers messaged asking if shoes were in stock. MarketHub answers them within 2 seconds and closes the sale immediately." },
              { initials: "AP", color: "emerald", name: "Ananya Patel", biz: "Founder, Silk & Thread Boutique", quote: "The automatic stock decrement has saved us from embarrassing overselling. Everything stays accurate, and issuing invoices takes literally one click." },
              { initials: "VK", color: "purple", name: "Vikram Kapoor", biz: "Managing Partner, Delhi Tech Hub", quote: "The customer CRM and follow-up feature brought back over ₹40,000 in sales last month from people who asked questions but forgot to complete their order." },
            ].map(({ initials, color, name, biz, quote }) => (
              <div key={name} className="clean-card p-6 rounded-2xl space-y-4">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm italic leading-relaxed">&quot;{quote}&quot;</p>
                <div className="pt-2 border-t border-slate-800 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-${color}-500/20 text-${color}-400 font-bold flex items-center justify-center text-xs`}>
                    {initials}
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">{name}</div>
                    <div className="text-[11px] text-slate-500">{biz}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-20 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Transparent Pricing
            </h2>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              Simple plans for businesses of all sizes
            </h3>
            <p className="text-slate-400 text-sm">
              Start free today and upgrade as your order volume grows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="clean-card p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-white text-lg">Free Tier</h4>
                <p className="text-xs text-slate-500 mt-1">Perfect for trying out MarketHub</p>
                <div className="my-5">
                  <span className="text-4xl font-extrabold text-white">₹0</span>
                  <span className="text-xs text-slate-500 font-medium"> / month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-400 border-t border-slate-800 pt-4">
                  {["Up to 50 customers", "20 catalog products", "50 orders per month", "Basic store dashboard"].map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-6">
                <Link href="/signup" className="block w-full text-center py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 font-bold text-xs transition">
                  Start Free
                </Link>
              </div>
            </div>

            {/* Business Plan */}
            <div className="clean-card p-6 rounded-2xl border-2 border-blue-600 shadow-lg shadow-blue-600/10 relative flex flex-col justify-between">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
                Most Popular
              </span>
              <div>
                <h4 className="font-bold text-white text-lg">Business</h4>
                <p className="text-xs text-slate-500 mt-1">For active retail &amp; online stores</p>
                <div className="my-5">
                  <span className="text-4xl font-extrabold text-white">₹1,499</span>
                  <span className="text-xs text-slate-500 font-medium"> / month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-400 border-t border-slate-800 pt-4">
                  {["Automated WhatsApp sales assistant", "Unlimited products & inventory", "Automatic stock decrements", "Tax invoice generation", "Automated customer follow-ups", "Up to 5 staff accounts"].map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="text-slate-300">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-6">
                <Link href="/signup" className="block w-full text-center py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition">
                  Start 14-Day Free Trial
                </Link>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="clean-card p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-white text-lg">Enterprise Pro</h4>
                <p className="text-xs text-slate-500 mt-1">For multi-location &amp; high-volume brands</p>
                <div className="my-5">
                  <span className="text-4xl font-extrabold text-white">₹3,999</span>
                  <span className="text-xs text-slate-500 font-medium"> / month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-400 border-t border-slate-800 pt-4">
                  {["Everything in Business", "Unlimited orders & contacts", "Multiple warehouse locations", "REST API & webhook integrations", "Dedicated account manager"].map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-6">
                <Link href="/signup" className="block w-full text-center py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 font-bold text-xs transition">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 px-6 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Got Questions?
            </h2>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60 shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between font-semibold text-slate-100 text-sm hover:bg-slate-800/50 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-blue-400" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-slate-400 text-xs leading-relaxed border-t border-slate-800 pt-3">
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

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-slate-800 text-xs text-slate-500 bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size="sm" theme="dark" />
            <span>© 2026 MarketHub Technologies Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-slate-500">
            <a href="#" className="hover:text-slate-300 transition">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition">WhatsApp Integration</a>
            <a href="#" className="hover:text-slate-300 transition">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
