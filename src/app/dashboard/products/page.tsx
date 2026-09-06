"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Package,
  Search,
  Plus,
  Filter,
  AlertTriangle,
  Edit2,
  Trash2,
  Tag,
  Boxes,
  ArrowUpDown,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";

export default function ProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "Footwear",
    price: "",
    discountPrice: "",
    stock: "15",
    lowStockThreshold: "5",
    description: "",
    imageUrl: "",
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/products?search=${encodeURIComponent(search)}&category=${encodeURIComponent(categoryFilter)}`
      );
      const json = await res.json();
      setProducts(json.products || []);
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to load products", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      sku: `SKU-${Date.now().toString().slice(-4)}`,
      category: "General",
      price: "",
      discountPrice: "",
      stock: "10",
      lowStockThreshold: "3",
      description: "",
      imageUrl: "",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      sku: p.sku,
      category: p.category,
      price: p.price.toString(),
      discountPrice: p.discountPrice ? p.discountPrice.toString() : "",
      stock: p.stock.toString(),
      lowStockThreshold: p.lowStockThreshold.toString(),
      description: p.description || "",
      imageUrl: p.imageUrl || "",
    });
    setModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const res = await fetch("/api/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingProduct.id,
            ...formData,
          }),
        });
        if (res.ok) {
          toast({ title: "Product updated successfully!" });
          setModalOpen(false);
          fetchProducts();
        }
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          toast({ title: "Product created and catalog updated!" });
          setModalOpen(false);
          fetchProducts();
        }
      }
    } catch (err) {
      toast({ title: "Failed to save product", type: "error" });
    }
  };

  const handleQuickAdjustStock = async (id: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, stock: newStock }),
      });
      if (res.ok) {
        toast({ title: `Stock adjusted to ${newStock} units` });
        fetchProducts();
      }
    } catch (err) {
      toast({ title: "Failed to update stock", type: "error" });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast({ title: "Product deleted" });
        fetchProducts();
      }
    } catch (err) {
      toast({ title: "Failed to delete", type: "error" });
    }
  };

  const categories = ["All", "Footwear", "Apparel", "Accessories"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Products & Inventory</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">
              {products.length} Items Listed
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time catalog synchronized with your AI Sales Agent and automated order checkout.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 transition self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, SKU, or tags..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </form>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                categoryFilter === cat
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Product</th>
                <th className="px-5 py-3.5 font-semibold">Category & SKU</th>
                <th className="px-5 py-3.5 font-semibold">Price</th>
                <th className="px-5 py-3.5 font-semibold">Inventory Status</th>
                <th className="px-5 py-3.5 font-semibold">Quick Adjust</th>
                <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    Loading catalog inventory...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    No products found in this category.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const isLow = p.stock <= p.lowStockThreshold;
                  return (
                    <tr key={p.id} className="hover:bg-slate-900/60 transition">
                      {/* Product Name & Image */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"}
                            alt={p.name}
                            className="w-11 h-11 rounded-xl object-cover border border-slate-700 shrink-0"
                          />
                          <div>
                            <div className="font-semibold text-white text-sm">{p.name}</div>
                            <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xs mt-0.5">
                              {p.description}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category & SKU */}
                      <td className="px-5 py-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium text-[11px]">
                          {p.category}
                        </span>
                        <div className="font-mono text-[10px] text-slate-400 mt-1">
                          {p.sku}
                        </div>
                      </td>

                      {/* Pricing */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-white text-sm">
                          {formatCurrency(p.price)}
                        </div>
                        {p.discountPrice && (
                          <div className="text-[10px] text-slate-400 line-through">
                            {formatCurrency(p.price + 300)}
                          </div>
                        )}
                      </td>

                      {/* Inventory Count & Badge */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${
                              isLow
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse"
                                : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                            }`}
                          >
                            {isLow ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                            <span>{p.stock} units left</span>
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Threshold: {p.lowStockThreshold} units
                        </div>
                      </td>

                      {/* Quick Adjust Buttons */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleQuickAdjustStock(p.id, p.stock, -1)}
                            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold text-xs"
                            title="Decrease 1"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-mono font-bold text-white">
                            {p.stock}
                          </span>
                          <button
                            onClick={() => handleQuickAdjustStock(p.id, p.stock, +1)}
                            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold text-xs"
                            title="Increase 1"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            title="Edit product"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            title="Delete product"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/30 text-slate-400 hover:text-rose-400 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? "Edit Product" : "Add Product to Catalog"}
        description="Provide details, pricing, and initial inventory stock."
      >
        <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Product Title *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Black Runner Shoes"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">SKU Code</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="RUN-BLK-09"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Footwear">Footwear</option>
                <option value="Apparel">Apparel</option>
                <option value="Accessories">Accessories</option>
                <option value="Electronics">Electronics</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Price (₹ INR) *</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="2499"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Discount Price (Optional)</label>
              <input
                type="number"
                value={formData.discountPrice}
                onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                placeholder="2199"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Stock Quantity *</label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="15"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Low-Stock Alert Threshold</label>
              <input
                type="number"
                value={formData.lowStockThreshold}
                onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                placeholder="5"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Product Image URL</label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Description (used by AI sales agent)</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Available in sizes 8, 9, 10. Lightweight breathable mesh..."
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
              {editingProduct ? "Update Product" : "Save Product"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
