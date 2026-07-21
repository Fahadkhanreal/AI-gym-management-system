"use client";
import { getToken } from "@/lib/session";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Edit3, Trash2, Loader2, Check, X,
  Save, Ban, TrendingUp, Sparkles, DollarSign,
} from "lucide-react";
import ImagePickerCrop from "@/components/ImagePickerCrop";

interface TransformationItem {
  id: string;
  name: string;
  before_value: string;
  after_value: string;
  duration: string;
  story: string;
  before_image_url: string;
  after_image_url: string;
  sort_order: number;
  is_active: boolean;
}

export default function TransformationsPage() {
  const router = useRouter();
  const [items, setItems] = useState<TransformationItem[]>([]);
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
    const res = await fetch("/api/admin/transformations", { headers: { Authorization: `Bearer ${token}` } });
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
    if (!confirm("Delete this transformation?")) return;
    const token = getToken();
    await fetch(`/api/admin/transformations/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    await fetchItems();
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Transformations</h1>
          <p className="text-sm text-muted mt-1">Manage &quot;Real Results&quot; transformation stories</p>
        </div>
        <button
          onClick={() => {
            setEditingId("new");
            setEditForm({ name: "", before_value: "", after_value: "", duration: "", story: "", before_image_url: "", after_image_url: "", sort_order: items.length + 1, is_active: true });
          }}
          className="flex items-center gap-2 rounded-xl bg-cyan text-black font-semibold px-5 py-2.5 text-sm hover:shadow-[0_0_20px_#00f5ff66] transition-all"
        >
          <Plus className="size-4" /> Add Transformation
        </button>
      </div>

      {editingId === "new" && (
        <div className="glass rounded-2xl border border-cyan/20 overflow-hidden">
          <div className="bg-cyan/10 px-5 py-3 border-b border-cyan/20 flex items-center gap-2">
            <Sparkles className="size-4 text-cyan" />
            <h2 className="font-heading text-sm font-semibold text-foreground">New Transformation</h2>
          </div>
          <div className="p-5">
            <FormCard
              form={editForm}
              onChange={setEditForm}
              onSave={async () => {
                setSaving(true);
                const token = getToken();
                await fetch("/api/admin/transformations", {
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

      {items.length === 0 && editingId !== "new" ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4">
          {items.map(item => (
            <div key={item.id} className={`glass rounded-2xl border ${item.is_active ? "border-white/5" : "border-white/5 opacity-60"}`}>
              {editingId === item.id ? (
                <div className="p-5">
                  <FormCard
                    form={editForm}
                    onChange={setEditForm}
                    onSave={async () => {
                      setSaving(true);
                      const token = getToken();
                      await fetch(`/api/admin/transformations/${item.id}`, {
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
                      {/* Before/After visual */}
                      <div className="flex rounded-xl overflow-hidden shrink-0 w-32 h-14 border border-white/5">
                        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-cyan/10 to-transparent">
                          <span className="font-heading text-sm font-bold text-muted">{item.before_value}</span>
                        </div>
                        <div className="w-0.5 bg-gradient-to-b from-cyan to-pink" />
                        <div className="flex-1 flex items-center justify-center bg-gradient-to-bl from-pink/10 to-transparent">
                          <span className="font-heading text-sm font-bold text-cyan">{item.after_value}</span>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-heading text-base font-semibold text-foreground">{item.name}</h3>
                          {!item.is_active && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">Hidden</span>}
                        </div>
                        <p className="text-xs text-gold mb-1">{item.duration}</p>
                        <p className="text-xs text-muted line-clamp-1">&ldquo;{item.story}&rdquo;</p>
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

function FormCard({ form, onChange, onSave, onCancel, saving, isNew }: {
  form: any; onChange: (f: any) => void; onSave: () => void; onCancel: () => void; saving: boolean; isNew?: boolean;
}) {
  return (
    <div className="space-y-4">
      {/* Before & After Images with Crop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted mb-2">Before Image</label>
          <ImagePickerCrop
            currentImage={form.before_image_url}
            aspect={3 / 4}
            folder="transformations"
            onImageChange={(url) => onChange({ ...form, before_image_url: url })}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-2">After Image</label>
          <ImagePickerCrop
            currentImage={form.after_image_url}
            aspect={3 / 4}
            folder="transformations"
            onImageChange={(url) => onChange({ ...form, after_image_url: url })}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Member Name</label>
          <input type="text" value={form.name} onChange={e => onChange({...form, name: e.target.value})} placeholder="e.g. Ahmed R." className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Duration</label>
          <input type="text" value={form.duration} onChange={e => onChange({...form, duration: e.target.value})} placeholder="e.g. 6 months, 4 months" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Before Value</label>
          <input type="text" value={form.before_value} onChange={e => onChange({...form, before_value: e.target.value})} placeholder="e.g. 95kg, Bench: 60kg" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-1">After Value</label>
          <input type="text" value={form.after_value} onChange={e => onChange({...form, after_value: e.target.value})} placeholder="e.g. 68kg, Bench: 140kg" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-muted mb-1">Story</label>
        <textarea value={form.story} onChange={e => onChange({...form, story: e.target.value})} placeholder="e.g. I never thought I could lose 27kg. The trainers at TitanForge designed a plan that worked..." rows={3} className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Sort Order</label>
          <input type="number" value={form.sort_order} onChange={e => onChange({...form, sort_order: Number(e.target.value)})} className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-cyan/50 transition-colors" />
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
        <button type="button" onClick={onCancel} className="flex items-center gap-2 px-5 py-2.5 text-sm text-muted hover:text-foreground rounded-xl hover:bg-white/5"><Ban className="size-4" /> Cancel</button>
        <button type="button" onClick={onSave} disabled={saving || !form.name} className="flex items-center gap-2 rounded-xl bg-cyan text-black font-semibold px-6 py-2.5 text-sm disabled:opacity-50 hover:shadow-[0_0_20px_#00f5ff66] transition-all">
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} {isNew ? "Create" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="glass rounded-2xl p-12 text-center border border-white/5">
      <div className="inline-flex items-center justify-center size-16 rounded-full bg-cyan/10 mb-4">
        <TrendingUp className="size-7 text-cyan" />
      </div>
      <h3 className="font-heading text-base font-semibold text-foreground mb-2">No Transformations Yet</h3>
      <p className="text-sm text-muted">Add transformation stories for the &quot;Real Results&quot; section.</p>
    </div>
  );
}

function Spinner() {
  return <div className="flex items-center justify-center py-20"><div className="size-6 rounded-full border-2 border-cyan border-t-transparent animate-spin" /></div>;
}


