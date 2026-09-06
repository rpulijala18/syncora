"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { UPICheckout } from "@/components/payment/upi-checkout";
import { Logo } from "@/components/ui/logo";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function OrderPayPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/pay?orderId=${encodeURIComponent(orderId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.order) {
          setOrder(data.order);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [orderId]);

  return (
    <div className="min-h-screen bg-transparent py-10 px-4 flex flex-col justify-center items-center">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-block group">
            <Logo size="md" theme="light" />
          </Link>
          <Link
            href="/dashboard/orders"
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Orders</span>
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs flex flex-col items-center gap-2 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            <span>Loading PhonePe payment scanner...</span>
          </div>
        ) : (
          <UPICheckout
            orderId={order?.id || orderId}
            orderNumber={order?.orderNumber || "1082"}
            amount={order?.totalAmount || 2499}
            customerName={order?.customer?.name || "Customer"}
            storeName={order?.business?.name || "MarketHub Merchant Store"}
            items={order?.items || []}
          />
        )}
      </div>
    </div>
  );
}
