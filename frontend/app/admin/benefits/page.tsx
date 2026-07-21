"use client";
import { getToken } from "@/lib/session";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Edit3, Trash2, Loader2, Check, X,
  Save, Ban, Sparkles, Star, Target, Heart,
  Dumbbell, Zap, Users, Flame, Hash,
} from "lucide-react";
import ImagePickerCrop from "@/components/ImagePickerCrop";

const ICON_MAP: Record<string, any> = {
  Dumbbell, Heart, Zap, Users, Target, Flame, Star,
};

const ICON_OPTIONS = [
  { value: "Dumbbell", label: "Dumbbell" },
  { value: "Heart", label: "Heart" },
  { value: "Zap", label: "Zap" },
  { value: "Users", label: "Users" },
  { value: "Target", label: "Target" },
  { value: "Flame", label: "Flame" },
  { value: "Star", label: "Star" },
];

interface BenefitItem {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  stat_value: number | null;
  stat_suffix: string;
  sort_order: number;
  is_active: boolean;
}

export default function BenefitsPage() {
  const router = useRouter();
  const [items, setItems] = useState<BenefitItem[]>([]);
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
    const res = await fetch("/api/admin/benefits", { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const sanitize = (obj: any) => {
    const clean: any = {};
    for (const key in obj) {
      clean[key] = obj[key] === null ? "" : obj[key];
    }
    return clean;
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this benefit?")) return;
    const token = getToken();
    await fetch(`/api/admin/benefits/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    await fetchItems();
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Benefits</h1>
          <p className="text-sm text-muted mt-1">Manage &quot;Built For Greatness&quot; cards</p>
        </div>
        <button
          onClick={() => {
            setEditingId("new");
            setEditForm({ title: "", description: "", icon_name: "Target", stat_value: null, stat_suffix: "", sort_order: items.length + 1, is_active: true });
          }}
          className="flex items-center gap-2 rounded-xl bg-cyan text-black font-semibold px-5 py-2.5 text-sm hover:shadow-[0_0_20px_#00f5ff66] transition-all"
        >
          <Plus className="size-4" /> Add Benefit
        </button>
      </div>

      {editingId === "new" && (
        <Form
          form={editForm}
          onChange={setEditForm}
          onSave={async () => {
            setSaving(true);
            const token = getToken();
            await fetch("/api/admin/benefits", {
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
      )}

      {items.length === 0 && editingId !== "new" ? (
        <div className="glass rounded-2xl p-12 text-center border border-white/5">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-cyan/10 mb-4">
            <Star className="size-7 text-cyan" />
          </div>
          <h3 className="font-heading text-base font-semibold text-foreground mb-2">No Benefits Yet</h3>
          <p className="text-sm text-muted">Add benefits to show on the &quot;Built For Greatness&quot; section.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map(item => {
            const IconComp = ICON_MAP[item.icon_name] || Target;
            return (
              <div key={item.id} className={`glass rounded-2xl border transition-all ${item.is_active ? "border-white/5" : "border-white/5 opacity-60"}`}>
                {editingId === item.id ? (
                  <div className="p-5">
                    <Form
                      form={editForm}
                      onChange={setEditForm}
                      onSave={async () => {
                        setSaving(true);
                        const token = getToken();
                        await fetch(`/api/admin/benefits/${item.id}`, {
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
                        <div className="size-12 rounded-xl bg-cyan/10 flex items-center justify-center shrink-0">
                          <IconComp className="size-6 text-cyan" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-heading text-base font-semibold text-foreground">{item.title}</h3>
                            {!item.is_active && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">Hidden</span>}
                          </div>
                          <p className="text-xs text-muted line-clamp-1">{item.description}</p>
                          {item.stat_value && (
                            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-cyan/10 text-cyan border border-cyan/20 mt-2">
                              {item.stat_value}{item.stat_suffix}
                            </span>
                          )}
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
            );
          })}
        </div>
      )}
    </div>
  );
}

function Form({ form, onChange, onSave, onCancel, saving }: any) {
  return (
    <div className="space-y-4">
      {/* Image Upload with Crop */}
      <ImagePickerCrop
        currentImage={form.image_url}
        aspect={3 / 2}
        folder="benefits"
        onImageChange={(url) => onChange({ ...form, image_url: url })}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Title</label>
          <input type="text" value={form.title} onChange={e => onChange({...form, title: e.target.value})} placeholder="e.g. Premium Equipment" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Stat Value (optional)</label>
          <input type="number" value={form.stat_value || ""} onChange={e => onChange({...form, stat_value: e.target.value ? Number(e.target.value) : null})} placeholder="e.g. 200" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-muted mb-1">Description</label>
        <textarea value={form.description} onChange={e => onChange({...form, description: e.target.value})} placeholder="e.g. State-of-the-art machines and free weights from top brands." rows={2} className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors resize-none" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Icon</label>
          <div className="grid grid-cols-4 gap-1.5">
            {ICON_OPTIONS.map(opt => {
              const IconComp = ICON_MAP[opt.value];
              return (
                <button key={opt.value} type="button" onClick={() => onChange({...form, icon_name: opt.value})} className={`flex items-center justify-center p-2 rounded-lg border transition-all ${form.icon_name === opt.value ? "bg-cyan/10 border-cyan/40 text-cyan" : "bg-white/5 border-white/10 text-muted hover:text-foreground"}`} title={opt.label}>
                  <IconComp className="size-4" />
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Stat Suffix</label>
          <input type="text" value={form.stat_suffix} onChange={e => onChange({...form, stat_suffix: e.target.value})} placeholder="e.g. + machines" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Sort Order</label>
          <input type="number" value={form.sort_order} onChange={e => onChange({...form, sort_order: Number(e.target.value)})} className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
          <div className={`relative size-5 rounded-md border ${form.is_active ? "bg-green-500 border-green-500" : "bg-white/5 border-white/10"}`}>
            <input type="checkbox" checked={form.is_active} onChange={e => onChange({...form, is_active: e.target.checked})} className="sr-only" />
            {form.is_active && <Check className="absolute inset-0 size-full p-0.5 text-white" />}
          </div>
          Active
        </label>
      </div>
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
        <button type="button" onClick={onCancel} className="flex items-center gap-2 px-5 py-2.5 text-sm text-muted hover:text-foreground transition-colors rounded-xl hover:bg-white/5"><Ban className="size-4" /> Cancel</button>
        <button type="button" onClick={onSave} disabled={saving || !form.title} className="flex items-center gap-2 rounded-xl bg-cyan text-black font-semibold px-6 py-2.5 text-sm disabled:opacity-50 hover:shadow-[0_0_20px_#00f5ff66] transition-all">
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Save
        </button>
      </div>
    </div>
  );
}

function Spinner() {
  return <div className="flex items-center justify-center py-20"><div className="size-6 rounded-full border-2 border-cyan border-t-transparent animate-spin" /></div>;
}

