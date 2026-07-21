"use client";
import { getToken } from "@/lib/session";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Edit3, Trash2, Loader2, Check, X,
  Save, Ban, Brain, Lightbulb, FileText, Info
} from "lucide-react";

interface KnowledgeItem {
  id: string;
  content: string;
  is_active: boolean;
}

export default function KnowledgeBasePage() {
  const router = useRouter();
  const [items, setItems] = useState<KnowledgeItem[]>([]);
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
    const res = await fetch("/api/admin/knowledge-base", { headers: { Authorization: `Bearer ${token}` } });
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
    if (!confirm("Delete this knowledge entry?")) return;
    const token = getToken();
    await fetch(`/api/admin/knowledge-base/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    await fetchItems();
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <Brain className="size-6 text-cyan" /> AI Knowledge Base
          </h1>
          <p className="text-sm text-muted mt-1">Add all gym information here — the AI will understand and answer accordingly</p>
        </div>
        <button
          onClick={() => {
            setEditingId("new");
            setEditForm({ content: "", is_active: true });
          }}
          className="flex items-center gap-2 rounded-xl bg-cyan text-black font-semibold px-5 py-2.5 text-sm hover:shadow-[0_0_20px_#00f5ff66] transition-all"
        >
          <Plus className="size-4" /> Add Info
        </button>
      </div>

      {/* How it works */}
      <div className="glass rounded-2xl p-4 border border-cyan/10 flex items-start gap-3">
        <Info className="size-5 text-cyan shrink-0 mt-0.5" />
        <div className="text-xs text-muted leading-relaxed">
          <strong className="text-foreground">Simple:</strong> Add any information — gym timings, diet plans, pricing, rules — in a single text block. The AI will search and give relevant answers automatically. <strong className="text-foreground">No question-answer format needed, no categories.</strong>
        </div>
      </div>

      {/* New Form */}
      {editingId === "new" && (
        <div className="glass rounded-2xl border border-cyan/20 overflow-hidden">
          <div className="bg-cyan/10 px-5 py-3 border-b border-cyan/20 flex items-center gap-2">
            <FileText className="size-4 text-cyan" />
            <span className="font-heading text-sm font-semibold text-foreground">New Info</span>
          </div>
          <div className="p-5">
            <FormCard
              form={editForm}
              onChange={setEditForm}
              onSave={async () => {
                setSaving(true);
                const token = getToken();
                await fetch("/api/admin/knowledge-base", {
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
            <Lightbulb className="size-7 text-cyan" />
          </div>
          <h3 className="font-heading text-base font-semibold text-foreground mb-2">No Info Added Yet</h3>
          <p className="text-sm text-muted max-w-md mx-auto">
            Add gym information — timings, diet plans, pricing, rules, anything. The AI chatbot will use this to answer user questions.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map(item => (
            <div key={item.id} className={`glass rounded-2xl border transition-all ${item.is_active ? "border-white/5" : "border-white/5 opacity-60"}`}>
              {editingId === item.id ? (
                <div className="p-5">
                  <FormCard
                    form={editForm}
                    onChange={setEditForm}
                    onSave={async () => {
                      setSaving(true);
                      const token = getToken();
                      await fetch(`/api/admin/knowledge-base/${item.id}`, {
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
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="size-9 rounded-lg bg-cyan/10 flex items-center justify-center shrink-0 mt-0.5">
                        <FileText className="size-4 text-cyan" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          {!item.is_active && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">Inactive</span>}
                        </div>
                        <p className="text-xs text-muted whitespace-pre-wrap leading-relaxed">{item.content}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button onClick={() => { setEditingId(item.id); setEditForm({ ...sanitize(item) }); }} className="flex items-center justify-center size-9 rounded-xl bg-cyan/10 text-cyan hover:bg-cyan/20 transition-all"><Edit3 className="size-4" /></button>
                      <button onClick={() => deleteItem(item.id)} className="flex items-center justify-center size-9 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"><Trash2 className="size-4" /></button>
                    </div>
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

/* ─── Simple Form: Sirf text area ─── */
function FormCard({ form, onChange, onSave, onCancel, saving, isNew }: {
  form: any; onChange: (f: any) => void; onSave: () => void; onCancel: () => void; saving: boolean; isNew?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-muted mb-1.5">
          Information <span className="text-red-400">*</span>
        </label>
        <textarea
          value={form.content || ""}
          onChange={e => onChange({...form, content: e.target.value})}
          placeholder={`Example:
TitanForge Gym timings: 6 AM to 10 PM (weekdays), 8 AM to 8 PM (weekends).

Basic membership: PKR 2,999/month.
Warrior membership: PKR 4,999/month (24/7 access).
Titan membership: PKR 8,999/month (VIP area + personal trainer).

BMI formula: Weight (kg) / Height (m)^2.
Healthy BMI range: 18.5 to 24.9.

Free 7-day trial available for all new members.`}
          rows={8}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors resize-none font-mono text-xs leading-relaxed"
        />
        <p className="text-[11px] text-muted/50 mt-1.5">
          💡 Jitni zyada information doge, utna smart AI answer dega. Ek hi block mein saari info daal sakte ho.
        </p>
      </div>
      <label className="flex items-center gap-2.5 text-sm text-muted cursor-pointer group">
        <div className={`relative size-5 rounded-md border transition-all ${form.is_active ? "bg-green-500 border-green-500" : "bg-white/5 border-white/10 group-hover:border-white/20"}`}>
          <input type="checkbox" checked={form.is_active} onChange={e => onChange({...form, is_active: e.target.checked})} className="sr-only" />
          {form.is_active && <Check className="absolute inset-0 size-full p-0.5 text-white" />}
        </div>
        <span className="group-hover:text-foreground transition-colors">Active</span>
      </label>
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
        <button type="button" onClick={onCancel} className="flex items-center gap-2 px-5 py-2.5 text-sm text-muted hover:text-foreground rounded-xl hover:bg-white/5 transition-colors"><Ban className="size-4" /> Cancel</button>
        <button type="button" onClick={onSave} disabled={saving || !form.content} className="flex items-center gap-2 rounded-xl bg-cyan text-black font-semibold px-6 py-2.5 text-sm disabled:opacity-50 hover:shadow-[0_0_20px_#00f5ff66] transition-all">
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} {isNew ? "Add" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

function Spinner() {
  return <div className="flex items-center justify-center py-20"><div className="size-6 rounded-full border-2 border-cyan border-t-transparent animate-spin" /></div>;
}


