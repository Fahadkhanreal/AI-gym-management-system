"use client";
import { getToken } from "@/lib/session";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Edit3, Trash2, Loader2, Check, X,
  Save, Ban, Sparkles, GripVertical, PlusCircle,
  Dumbbell, Heart, Zap, Users, Target, Flame,
  Search, Hash, Clock, DollarSign,
} from "lucide-react";
import ImagePickerCrop from "@/components/ImagePickerCrop";

// Map icon names to Lucide components
const ICON_MAP: Record<string, any> = {
  Dumbbell, Heart, Zap, Users, Target, Flame,
  Armchair: Target, Run: Zap,
};

const ICON_OPTIONS = [
  { value: "Dumbbell", label: "Dumbbell" },
  { value: "Heart", label: "Heart" },
  { value: "Zap", label: "Zap / Lightning" },
  { value: "Users", label: "Users" },
  { value: "Target", label: "Target" },
  { value: "Flame", label: "Flame" },
];

interface Program {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  category: string;
  icon_name: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
}

export default function ProgramsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Convert null DB values to empty string (React hates null in input value)
  const sanitize = (obj: any) => {
    const clean: any = {};
    for (const key in obj) {
      clean[key] = obj[key] === null ? "" : obj[key];
    }
    return clean;
  };

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push("/admin/login"); return; }
    fetchItems();
  }, [router]);

  const fetchItems = async () => {
    const token = getToken();
    const res = await fetch("/api/admin/programs", { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const saveItem = async (id: string) => {
    setSaving(true);
    const token = getToken();
    await fetch(`/api/admin/programs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(editForm),
    });
    await fetchItems();
    setEditingId(null);
    setSaving(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this program?")) return;
    const token = getToken();
    await fetch(`/api/admin/programs/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    await fetchItems();
  };

  const toggleActive = async (item: Program) => {
    const token = getToken();
    await fetch(`/api/admin/programs/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...item, is_active: !item.is_active }),
    });
    await fetchItems();
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="size-6 rounded-full border-2 border-cyan border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Training Programs</h1>
          <p className="text-sm text-muted mt-1">Manage the &quot;Choose Your Path&quot; cards on the landing page</p>
        </div>
        <button
          onClick={() => {
            setEditingId("new");
            setEditForm({ title: "", description: "", duration: "", category: "", icon_name: "Dumbbell", image_url: "", sort_order: items.length + 1, is_active: true, price: 0 });
          }}
          className="flex items-center gap-2 rounded-xl bg-cyan text-black font-semibold px-5 py-2.5 text-sm hover:shadow-[0_0_20px_#00f5ff66] transition-all"
        >
          <Plus className="size-4" />
          Add New Program
        </button>
      </div>

      {/* New Item Form */}
      {editingId === "new" && (
        <div className="glass rounded-2xl border border-cyan/20 overflow-hidden">
          <div className="bg-cyan/10 px-5 py-3 border-b border-cyan/20 flex items-center gap-2">
            <Sparkles className="size-4 text-cyan" />
            <h2 className="font-heading text-sm font-semibold text-foreground">New Program</h2>
          </div>
          <div className="p-5">
            <ProgramForm
              form={editForm}
              onChange={setEditForm}
              onSave={async () => {
                setSaving(true);
                const token = getToken();
                await fetch("/api/admin/programs", {
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
            <Target className="size-7 text-cyan" />
          </div>
          <h3 className="font-heading text-base font-semibold text-foreground mb-2">No Programs Yet</h3>
          <p className="text-sm text-muted max-w-md mx-auto mb-4">
            Add your training programs here. They&apos;ll appear as cards in the &quot;Choose Your Path&quot; section on the website.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map(item => {
            const IconComp = ICON_MAP[item.icon_name] || Dumbbell;
            return (
              <div key={item.id} className={`glass rounded-2xl border transition-all duration-200 ${
                item.is_active ? "border-white/5" : "border-white/5 opacity-60"
              }`}>
                {editingId === item.id ? (
                  <div className="p-5">
                    <ProgramForm
                      form={editForm}
                      onChange={setEditForm}
                      onSave={() => saveItem(item.id)}
                      onCancel={() => setEditingId(null)}
                      saving={saving}
                    />
                  </div>
                ) : (
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        {/* Icon preview */}
                        <div className="size-12 rounded-xl bg-cyan/10 flex items-center justify-center shrink-0">
                          <IconComp className="size-6 text-cyan" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-heading text-base font-semibold text-foreground">{item.title}</h3>
                            {!item.is_active && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Hidden</span>
                            )}
                          </div>
                          <p className="text-xs text-muted line-clamp-1">{item.description}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-muted border border-white/5">
                              <Clock className="size-3" />
                              {item.duration || "N/A"}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-muted border border-white/5">
                              <Hash className="size-3" />
                              {item.category || "general"}
                            </span>
                            {item.price > 0 ? (
                              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-cyan/10 text-cyan border border-cyan/20">
                                <DollarSign className="size-3" />
                                PKR {item.price.toLocaleString()}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                                Free
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-2 shrink-0">
                        <button onClick={() => { setEditingId(item.id); setEditForm({ ...sanitize(item) }); }} className="flex items-center justify-center size-9 rounded-xl bg-cyan/10 text-cyan hover:bg-cyan/20 transition-all" title="Edit">
                          <Edit3 className="size-4" />
                        </button>
                        <button onClick={() => deleteItem(item.id)} className="flex items-center justify-center size-9 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all" title="Delete">
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                    {/* Actions bar */}
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
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
                      <span className="text-xs text-muted/50">Sort order: {item.sort_order}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Program Form ─── */
function ProgramForm({ form, onChange, onSave, onCancel, saving, isNew }: {
  form: any; onChange: (f: any) => void; onSave: () => void; onCancel: () => void; saving: boolean; isNew?: boolean;
}) {
  return (
    <div className="space-y-5">
      {/* Title & Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Program Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={e => onChange({ ...form, title: e.target.value })}
            placeholder="e.g. Strength Training, CrossFit, Yoga"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Category</label>
          <input
            type="text"
            value={form.category}
            onChange={e => onChange({ ...form, category: e.target.value })}
            placeholder="e.g. strength, hypertrophy, crossfit"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors"
          />
          <p className="text-xs text-muted/50 mt-1">Used to filter/group programs</p>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
        <textarea
          value={form.description}
          onChange={e => onChange({ ...form, description: e.target.value })}
          placeholder="e.g. Build raw power with compound lifts and progressive overload."
          rows={2}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors resize-none"
        />
      </div>

      {/* Icon Selector */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Icon</label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {ICON_OPTIONS.map(opt => {
            const IconComp = ICON_MAP[opt.value];
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ ...form, icon_name: opt.value })}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                  form.icon_name === opt.value
                    ? "bg-cyan/10 border-cyan/40 text-cyan"
                    : "bg-white/5 border-white/10 text-muted hover:text-foreground hover:border-white/20"
                }`}
              >
                <IconComp className="size-5" />
                <span className="text-[10px]">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration & Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Duration
          </label>
          <div className="relative">
            <Clock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted/40" />
            <input
              type="text"
              value={form.duration}
              onChange={e => onChange({ ...form, duration: e.target.value })}
              placeholder="e.g. 12 weeks, Per session, Ongoing"
              className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Price <span className="text-muted/50 text-xs">(0 = Free)</span>
          </label>
          <div className="relative">
            <DollarSign className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted/40" />
            <input
              type="number"
              value={form.price}
              onChange={e => onChange({ ...form, price: Number(e.target.value) })}
              placeholder="0"
              className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Image Upload with Crop */}
      <ImagePickerCrop
        currentImage={form.image_url}
        aspect={3 / 2}
        folder="programs"
        onImageChange={(url) => onChange({ ...form, image_url: url })}
      />

      {/* Sort Order & Active */}
      <div className="flex flex-wrap items-center gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Sort Order</label>
          <input
            type="number"
            value={form.sort_order}
            onChange={e => onChange({ ...form, sort_order: Number(e.target.value) })}
            className="w-20 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-foreground focus:outline-none focus:border-cyan/50 transition-colors"
          />
        </div>
        <label className="flex items-center gap-2.5 cursor-pointer group mt-5">
          <div className={`relative size-5 rounded-md border transition-all ${
            form.is_active ? "bg-green-500 border-green-500" : "bg-white/5 border-white/10 group-hover:border-white/20"
          }`}>
            <input type="checkbox" checked={form.is_active} onChange={e => onChange({ ...form, is_active: e.target.checked })} className="sr-only" />
            {form.is_active && <Check className="absolute inset-0 size-full p-0.5 text-white" />}
          </div>
          <span className="text-sm text-muted group-hover:text-foreground transition-colors">Active / Visible on website</span>
        </label>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
        <button type="button" onClick={onCancel} className="flex items-center gap-2 px-5 py-2.5 text-sm text-muted hover:text-foreground transition-colors rounded-xl hover:bg-white/5">
          <Ban className="size-4" /> Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving || !form.title}
          className="flex items-center gap-2 rounded-xl bg-cyan text-black font-semibold px-6 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_#00f5ff66] transition-all"
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {isNew ? "Create Program" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}


