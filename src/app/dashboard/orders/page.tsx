"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Search,
  Plus,
  Filter,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  ExternalLink,
  ChevronRight,
  Package,
  Printer,
  X,
  CreditCard,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";

export default function OrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");

  // Create Order Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("PENDING");
  const [orderStatus, setOrderStatus] = useState("CONFIRMED");

  // Invoice Modal State
  const [invoiceOrder, setInvoiceOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/orders?search=${encodeURIComponent(search)}&status=${statusFilter}&paymentStatus=${paymentFilter}`
      );
      const json = await res.json();
      setOrders(json.orders || []);
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to load orders", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchCatalogAndCustomers = async () => {
    try {
      const [cRes, pRes] = await Promise.all([
        fetch("/api/customers"),
        fetch("/api/products"),
      ]);
      const cJson = await cRes.json();
      const pJson = await pRes.json();
      setCustomers(cJson.customers || []);
      setProducts(pJson.products || []);
      if (pJson.products?.length) {
        setSelectedProductId(pJson.products[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchCatalogAndCustomers();
  }, [statusFilter, paymentFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) {
      toast({ title: "Please select a product", type: "error" });
      return;
    }

    try {
      const payload = {
        customerId: selectedCustomerId || undefined,
        customerName: !selectedCustomerId ? newCustomerName || "Guest Customer" : undefined,
        customerPhone: !selectedCustomerId ? newCustomerPhone || "+91 98000 00000" : undefined,
        items: [{ productId: selectedProductId, quantity: parseInt(quantity, 10) || 1 }],
        shippingAddress: shippingAddress || "Commercial Street, Bengaluru",
        paymentStatus,
        status: orderStatus,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok) {
        toast({
          title: `Order #${json.order.orderNumber} placed!`,
          message: "Inventory automatically reduced and CRM updated.",
        });
        setModalOpen(false);
        fetchOrders();
      } else {
        toast({ title: json.error || "Failed to create order", type: "error" });
      }
    } catch (err) {
      toast({ title: "Network error creating order", type: "error" });
    }
  };

  const handleQuickStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      if (res.ok) {
        toast({ title: `Order status updated to ${newStatus}` });
        fetchOrders();
      }
    } catch (err) {
      toast({ title: "Failed to update status", type: "error" });
    }
  };

  const handleQuickPaymentChange = async (orderId: string, newPayment: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, paymentStatus: newPayment }),
      });
      if (res.ok) {
        toast({ title: `Payment status marked as ${newPayment}` });
        fetchOrders();
      }
    } catch (err) {
      toast({ title: "Failed to update payment", type: "error" });
    }
  };

  const statuses = ["ALL", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Orders Management</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">
              {orders.length} Orders
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track customer sales, delivery fulfillment, payment status, and invoices.
          </p>
        </div>

        <button
          onClick={() => {
            fetchCatalogAndCustomers();
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 transition self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>New Order</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearch} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, customer, or phone..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </form>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                statusFilter === st
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Order ID</th>
                <th className="px-5 py-3.5 font-semibold">Customer</th>
                <th className="px-5 py-3.5 font-semibold">Products</th>
                <th className="px-5 py-3.5 font-semibold">Total Amount</th>
                <th className="px-5 py-3.5 font-semibold">Payment</th>
                <th className="px-5 py-3.5 font-semibold">Fulfillment</th>
                <th className="px-5 py-3.5 font-semibold text-right">Invoice & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No orders found matching criteria.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-900/60 transition">
                    {/* Order ID & Date */}
                    <td className="px-5 py-4">
                      <div className="font-mono font-bold text-white text-sm">
                        #{o.orderNumber}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {formatDate(o.createdAt)}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">
                        {o.customer?.name || "Online Guest"}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {o.customer?.phone || "No phone"}
                      </div>
                    </td>

                    {/* Products */}
                    <td className="px-5 py-4">
                      <div className="text-slate-200">
                        {o.items?.map((it: any) => `${it.productName} (x${it.quantity})`).join(", ")}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                        Ship to: {o.shippingAddress || "Not provided"}
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="px-5 py-4">
                      <div className="font-bold text-white text-sm">
                        {formatCurrency(o.totalAmount)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Tax & Shipping incl.
                      </div>
                    </td>

                    {/* Payment Status Dropdown / Badge */}
                    <td className="px-5 py-4">
                      <select
                        value={o.paymentStatus}
                        onChange={(e) => handleQuickPaymentChange(o.id, e.target.value)}
                        className={`text-[10px] font-bold rounded-lg px-2 py-1 bg-slate-900 border cursor-pointer ${
                          o.paymentStatus === "PAID"
                            ? "text-emerald-400 border-emerald-500/40"
                            : o.paymentStatus === "PENDING"
                            ? "text-amber-400 border-amber-500/40"
                            : "text-rose-400 border-rose-500/40"
                        }`}
                      >
                        <option value="PAID">PAID</option>
                        <option value="PENDING">PENDING</option>
                        <option value="FAILED">FAILED</option>
                        <option value="REFUNDED">REFUNDED</option>
                      </select>
                    </td>

                    {/* Fulfillment Status Dropdown */}
                    <td className="px-5 py-4">
                      <select
                        value={o.status}
                        onChange={(e) => handleQuickStatusChange(o.id, e.target.value)}
                        className={`text-[10px] font-bold rounded-lg px-2 py-1 bg-slate-900 border cursor-pointer ${
                          o.status === "DELIVERED"
                            ? "text-emerald-400 border-emerald-500/40"
                            : o.status === "SHIPPED"
                            ? "text-purple-400 border-purple-500/40"
                            : o.status === "PROCESSING"
                            ? "text-blue-400 border-blue-500/40"
                            : o.status === "CONFIRMED"
                            ? "text-cyan-400 border-cyan-500/40"
                            : "text-amber-400 border-amber-500/40"
                        }`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setInvoiceOrder(o)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        <span>Invoice</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Invoice Modal */}
      {invoiceOrder && (
        <Modal
          isOpen={!!invoiceOrder}
          onClose={() => setInvoiceOrder(null)}
          title={`Tax Invoice #${invoiceOrder.orderNumber}`}
          description="Official merchant invoice with payment status and product breakdown."
          maxWidth="max-w-2xl"
        >
          <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-6 text-xs text-slate-300">
            {/* Invoice Top Brand Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="font-bold text-white text-lg">Urban Style Store</div>
                <div className="text-slate-400 text-xs">104, Commercial Street, Bengaluru, India</div>
                <div className="text-slate-400 text-xs">Phone: +91 98765 43210 | GSTIN: 29AAAAA0000A1Z5</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 uppercase">Invoice Number</div>
                <div className="text-base font-bold font-mono text-white">#{invoiceOrder.orderNumber}</div>
                <div className="text-[11px] text-slate-400 mt-1">Date: {formatDate(invoiceOrder.createdAt)}</div>
              </div>
            </div>

            {/* Billed To */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Customer Details
                </div>
                <div className="font-semibold text-white text-sm">{invoiceOrder.customer?.name || "Guest Customer"}</div>
                <div className="text-slate-300">{invoiceOrder.customer?.phone}</div>
                <div className="text-slate-400">{invoiceOrder.customer?.email || "No email"}</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Shipping Address
                </div>
                <div className="text-slate-200">{invoiceOrder.shippingAddress || "Commercial Area, Bengaluru"}</div>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Payment: {invoiceOrder.paymentStatus}
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Product Description</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {invoiceOrder.items?.map((item: any) => (
                    <tr key={item.id}>
                      <td className="p-3 font-semibold text-white">{item.productName}</td>
                      <td className="p-3 font-mono text-slate-400">{item.sku}</td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="p-3 text-right font-bold text-white">{formatCurrency(item.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* UPI Payment Scanner & Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
              {/* PhonePe Scanner Box */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-purple-500/30 flex items-center gap-3.5">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-black shrink-0 border border-purple-400 p-0.5 shadow-sm">
                  <img
                    src="/payment-scanner.png"
                    alt="PhonePe UPI Scanner"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-white flex items-center gap-1.5 text-xs">
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center">
                      पे
                    </span>
                    <span>Scan & Pay via PhonePe</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Supports PhonePe, Google Pay, Paytm, BHIM, CRED
                  </p>
                  <Link
                    href={`/pay/${invoiceOrder.id}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition underline underline-offset-2"
                  >
                    <span>Open Customer Payment Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="space-y-1.5 text-xs self-center">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(invoiceOrder.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>GST / Taxes (0%):</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Shipping:</span>
                  <span className="text-emerald-400 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                  <span>Total Due:</span>
                  <span className="text-emerald-400">{formatCurrency(invoiceOrder.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Print & Close */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-[10px] text-slate-500">
                Generated securely by MarketHub Commerce
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Invoice</span>
                </button>
                <button
                  onClick={() => setInvoiceOrder(null)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Order Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Customer Order"
        description="Select customer and catalog products. Inventory stock will automatically decrease."
      >
        <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
          {/* Customer Selection */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Select Customer</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">-- Add New / Guest Customer --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          {!selectedCustomerId && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Customer Name</label>
                <input
                  type="text"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">WhatsApp Phone</label>
                <input
                  type="text"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  placeholder="+91 98201 12345"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>
            </div>
          )}

          {/* Product Picker */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Select Product *</label>
            <select
              required
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                  {p.name} — {formatCurrency(p.price)} ({p.stock} in stock {p.stock <= 0 ? "- OUT OF STOCK" : ""})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                max="99"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Payment Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="PAID">PAID</option>
                <option value="PENDING">PENDING</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Order Status</label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Shipping Address</label>
            <input
              type="text"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="e.g. Flat 402, Green Glen Layout, Bellandur, Bengaluru 560103"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition shadow-lg shadow-blue-600/20"
            >
              Confirm & Decrement Stock
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
