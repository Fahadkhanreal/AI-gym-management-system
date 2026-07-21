"use client";
import { getToken } from "@/lib/session";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Edit3, Trash2, Loader2, Check, X,
  Save, Ban, HelpCircle, Sparkles, Hash,
  FileText
} from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_active: boolean;
}

export default function FAQsPage() {
  const router = useRouter();
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push("/admin/login"); return; }
    fetchItems();
  }, [router]);

  const fetchItems = async () => {
    const token = getToken();
    const res = await fetch("/api/admin/faqs", { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const sanitize = (obj: any) => {
    const clean: any = {};
    for (const key in obj) clean[key] = obj[key] === null ? "" : obj[key];
    return clean;
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    const token = getToken();
    await fetch(`/api/admin/faqs/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    await fetchItems();
  };

  const toggleActive = async (item: FaqItem) => {
    const token = getToken();
    await fetch(`/api/admin/faqs/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...item, is_active: !item.is_active }),
    });
    await fetchItems();
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">FAQs</h1>
          <p className="text-sm text-muted mt-1">Manage frequently asked questions</p>
        </div>
        <button
          onClick={() => {
            setEditingId("new");
            setEditForm({ question: "", answer: "", category: "", sort_order: items.length + 1, is_active: true });
          }}
          className="flex items-center gap-2 rounded-xl bg-cyan text-black font-semibold px-5 py-2.5 text-sm hover:shadow-[0_0_20px_#00f5ff66] transition-all"
        >
          <Plus className="size-4" /> Add FAQ
        </button>
      </div>

      {/* New Form */}
      {editingId === "new" && (
        <div className="glass rounded-2xl border border-cyan/20 overflow-hidden">
          <div className="bg-cyan/10 px-5 py-3 border-b border-cyan/20 flex items-center gap-2">
            <Sparkles className="size-4 text-cyan" />
            <h2 className="font-heading text-sm font-semibold text-foreground">New FAQ</h2>
          </div>
          <div className="p-5">
            <FormCard
              form={editForm}
              onChange={setEditForm}
              onSave={async () => {
                setSaving(true);
                const token = getToken();
                await fetch("/api/admin/faqs", {
                  method: "POST",
                  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                  body: JSON.stringify(editForm),
                });
                await fetchItems();
                setEditingId(null);
                setSaving(false);
              }}
              onCancel={() => setEditingId(null)}
              saving={saving}
              isNew
            />
          </div>
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 && editingId !== "new" ? (
        <div className="glass rounded-2xl p-12 text-center border border-white/5">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-cyan/10 mb-4">
            <HelpCircle className="size-7 text-cyan" />
          </div>
          <h3 className="font-heading text-base font-semibold text-foreground mb-2">No FAQs Yet</h3>
          <p className="text-sm text-muted">Add questions to the FAQ section on the landing page.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map(item => (
            <div key={item.id} className={`glass rounded-2xl border transition-all ${
              item.is_active ? "border-white/5" : "border-white/5 opacity-60"
            }`}>
              {editingId === item.id ? (
                <div className="p-5">
                  <FormCard
                    form={editForm}
                    onChange={setEditForm}
                    onSave={async () => {
                      setSaving(true);
                      const token = getToken();
                      await fetch(`/api/admin/faqs/${item.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                        body: JSON.stringify(editForm),
                      });
                      await fetchItems();
                      setEditingId(null);
                      setSaving(false);
                    }}
                    onCancel={() => setEditingId(null)}
                    saving={saving}
                  />
                </div>
              ) : (
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="size-10 rounded-xl bg-cyan/10 flex items-center justify-center shrink-0 mt-0.5">
                        <HelpCircle className="size-5 text-cyan" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-heading text-sm font-semibold text-foreground">{item.question}</h3>
                          {!item.is_active && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">Hidden</span>}
                        </div>
                        <p className="text-xs text-muted leading-relaxed line-clamp-2">{item.answer}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {item.category && (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-pink/10 text-pink border border-pink/20">
                              <Hash className="size-3" /> {item.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => { setEditingId(item.id); setEditForm({ ...sanitize(item) }); }}
                        className="flex items-center justify-center size-9 rounded-xl bg-cyan/10 text-cyan hover:bg-cyan/20 transition-all"
                      >
                        <Edit3 className="size-4" />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="flex items-center justify-center size-9 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
                    <button
                      onClick={() => toggleActive(item)}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all ${
                        item.is_active
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-white/5 text-muted hover:text-foreground border border-white/5"
                      }`}
                    >
                      {item.is_active ? <Check className="size-3" /> : <X className="size-3" />}
                      {item.is_active ? "Visible" : "Hidden"}
                    </button>
                    <span className="text-xs text-muted/50">Sort: {item.sort_order}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Form ─── */
function FormCard({ form, onChange, onSave, onCancel, saving, isNew }: {
  form: any; onChange: (f: any) => void; onSave: () => void; onCancel: () => void; saving: boolean; isNew?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Question <span className="text-red-400">*</span></label>
          <input
            type="text"
            value={form.question || ""}
            onChange={e => onChange({...form, question: e.target.value})}
            placeholder="e.g. What are your operating hours?"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Category <span className="text-muted/50">(optional)</span></label>
          <input
            type="text"
            value={form.category || ""}
            onChange={e => onChange({...form, category: e.target.value})}
            placeholder="e.g. membership, schedule, facilities"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors"
          />
          <p className="text-[11px] text-muted/50 mt-1">Used to filter/group questions</p>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-muted mb-1">Answer <span className="text-red-400">*</span></label>
        <textarea
          value={form.answer || ""}
          onChange={e => onChange({...form, answer: e.target.value})}
          placeholder="e.g. Basic members have access from 6 AM to 10 PM daily..."
          rows={4}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Sort Order</label>
          <input
            type="number"
            value={form.sort_order ?? ""}
            onChange={e => onChange({...form, sort_order: Number(e.target.value)})}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-cyan/50 transition-colors"
          />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
            <div className={`relative size-5 rounded-md border ${form.is_active ? "bg-green-500 border-green-500" : "bg-white/5 border-white/10"}`}>
              <input type="checkbox" checked={form.is_active} onChange={e => onChange({...form, is_active: e.target.checked})} className="sr-only" />
              {form.is_active && <Check className="absolute inset-0 size-full p-0.5 text-white" />}
            </div>
            Active
          </label>
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
        <button type="button" onClick={onCancel} className="flex items-center gap-2 px-5 py-2.5 text-sm text-muted hover:text-foreground rounded-xl hover:bg-white/5 transition-colors">
          <Ban className="size-4" /> Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving || !form.question || !form.answer}
          className="flex items-center gap-2 rounded-xl bg-cyan text-black font-semibold px-6 py-2.5 text-sm disabled:opacity-50 hover:shadow-[0_0_20px_#00f5ff66] transition-all"
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {isNew ? "Create" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

function Spinner() {
  return <div className="flex items-center justify-center py-20"><div className="size-6 rounded-full border-2 border-cyan border-t-transparent animate-spin" /></div>;
}


