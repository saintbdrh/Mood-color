"use client";

import { useState, useEffect } from "react";
import { Upload, DollarSign, ShoppingBag, FileText } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalDocuments: 0, totalOrders: 0, totalRevenue: 0, totalDownloads: 0 });
  const [form, setForm] = useState({ 
    title: "", 
    description: "", 
    price: "", 
    category: "", 
    fileUrl: "", 
    fileName: "", 
    fileSize: "" 
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const res = await fetch("/api/admin/stats");
    const data = await res.json();
    setStats(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: parseFloat(form.price) }),
    });
    setForm({ title: "", description: "", price: "", category: "", fileUrl: "", fileName: "", fileSize: "" });
    fetchStats();
  };

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard icon={<FileText />} label="Documents" value={stats.totalDocuments} />
        <StatCard icon={<ShoppingBag />} label="Orders" value={stats.totalOrders} />
        <StatCard icon={<DollarSign />} label="Revenue" value={`$${stats.totalRevenue}`} />
        <StatCard icon={<Upload />} label="Downloads" value={stats.totalDownloads} />
      </div>

      <div className="bg-gray-900 rounded-2xl border border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Add New Document</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input className="bg-gray-800 rounded-lg p-3 text-white" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            <input className="bg-gray-800 rounded-lg p-3 text-white" placeholder="Price (USD)" type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
          </div>
          <input className="w-full bg-gray-800 rounded-lg p-3 text-white" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
          <div className="grid grid-cols-3 gap-4">
            <input className="bg-gray-800 rounded-lg p-3 text-white" placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required />
            <input className="bg-gray-800 rounded-lg p-3 text-white" placeholder="File URL" value={form.fileUrl} onChange={e => setForm({...form, fileUrl: e.target.value})} required />
            <input className="bg-gray-800 rounded-lg p-3 text-white" placeholder="File Name" value={form.fileName} onChange={e => setForm({...form, fileName: e.target.value})} required />
          </div>
          <button type="submit" className="px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg text-white font-semibold">
            Upload Document
          </button>
        </form>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: any) {
  return (
    <div className="bg-gray-900 rounded-xl border border-white/10 p-6">
      <div className="text-purple-400 mb-2">{icon}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-gray-500 text-sm">{label}</div>
    </div>
  );
}
