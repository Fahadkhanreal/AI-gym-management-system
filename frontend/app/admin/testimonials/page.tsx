"use client";
import { getToken } from "@/lib/session";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Edit3, Trash2, Loader2, Check, X,
  Save, Ban, Star, Quote,
  Sparkles, MessageSquare
} from "lucide-react";
import ImagePickerCrop from "@/components/ImagePickerCrop";
import OptimizedImage from "@/components/OptimizedImage";

interface Testimonial {
  id: string;
  name: string;
  message: string;
  image_url: string;
  rating: number;
  sort_order: number;
  is_active: boolean;
}

export default function TestimonialsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [pendingItems, setPendingItems] = useState<Testimonial[]>([]);
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
    const res = await fetch("/api/admin/testimonials", { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (data.items) {
      setItems(data.approved || []);
      setPendingItems(data.pending || []);
    } else {
      setItems(Array.isArray(data) ? data : []);
      setPendingItems([]);
    }
    setLoading(false);
  };

  const sanitize = (obj: any) => {
    const clean: any = {};
    for (const key in obj) clean[key] = obj[key] === null ? "" : obj[key];
    return clean;
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    const token = getToken();
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    await fetchItems();
  };

  const toggleActive = async (item: Testimonial) => {
    const token = getToken();
    await fetch(`/api/admin/testimonials/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...item, is_active: !item.is_active }),
    });
    await fetchItems();
  };

  const approveTestimonial = async (id: string, approve: boolean) => {
    const token = getToken();
    await fetch(`/api/admin/testimonials/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ approve }),
    });
    await fetchItems();
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Testimonials</h1>
          <p className="text-sm text-muted mt-1">Member success stories for the landing page</p>
        </div>
        <button
          onClick={() => {
            setEditingId("new");
            setEditForm({ name: "", message: "", image_url: "", rating: 5, sort_order: items.length + 1, is_active: true });
          }}
          className="flex items-center gap-2 rounded-xl bg-cyan text-black font-semibold px-5 py-2.5 text-sm hover:shadow-[0_0_20px_#00f5ff66] transition-all"
        >
          <Plus className="size-4" /> Add Testimonial
        </button>
      </div>

      {/* ⏳ Pending Approval */}
      {pendingItems.length > 0 && (
        <div className="glass rounded-2xl border border-gold/30 overflow-hidden">
          <div className="bg-gold/10 px-5 py-3 border-b border-gold/20 flex items-center gap-2">
            <span className="text-gold text-lg">⏳</span>
            <h2 className="font-heading text-sm font-semibold text-foreground">
              Pending Approval ({pendingItems.length})
            </h2>
          </div>
          <div className="p-5 space-y-3">
            {pendingItems.map(item => (
              <div key={item.id} className="rounded-xl bg-white/5 border border-white/10 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-heading text-sm font-semibold text-foreground">{item.name}</span>
                      <span className="text-xs text-muted/50">— just now</span>
                    </div>
                    {item.rating > 0 && (
                      <div className="flex items-center gap-0.5 mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={11} className={i < item.rating ? "text-gold fill-gold" : "text-muted/30"} />
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted leading-relaxed">&ldquo;{item.message}&rdquo;</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => approveTestimonial(item.id, true)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 text-xs hover:bg-green-500/20 transition-all"
                    >
                      <Check className="size-3" /> Approve
                    </button>
                    <button
                      onClick={() => approveTestimonial(item.id, false)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-xs hover:bg-red-500/20 transition-all"
                    >
                      <X className="size-3" /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Form */}
      {editingId === "new" && (
        <div className="glass rounded-2xl border border-cyan/20 overflow-hidden">
          <div className="bg-cyan/10 px-5 py-3 border-b border-cyan/20 flex items-center gap-2">
            <Sparkles className="size-4 text-cyan" />
            <h2 className="font-heading text-sm font-semibold text-foreground">New Testimonial</h2>
          </div>
          <div className="p-5">
            <FormCard
              form={editForm}
              onChange={setEditForm}
              onSave={async () => {
                setSaving(true);
                const token = getToken();
                await fetch("/api/admin/testimonials", {
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
            <MessageSquare className="size-7 text-cyan" />
          </div>
          <h3 className="font-heading text-base font-semibold text-foreground mb-2">No Testimonials Yet</h3>
          <p className="text-sm text-muted max-w-md mx-auto mb-4">
            Share what your members are saying. Click &quot;Add Testimonial&quot; above to get started.
          </p>
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
                      await fetch(`/api/admin/testimonials/${item.id}`, {
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
                      {/* Avatar */}
                      <div className="size-12 rounded-full bg-gradient-to-br from-cyan/20 to-pink/20 flex items-center justify-center shrink-0 overflow-hidden">
                        {item.image_url ? (
                          <OptimizedImage src={item.image_url} alt={item.name} containerClassName="size-full" />
                        ) : (
                          <span className="font-heading text-sm font-bold text-cyan">
                            {item.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-heading text-base font-semibold text-foreground">{item.name}</h3>
                          {!item.is_active && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">Hidden</span>}
                        </div>
                        {/* Star rating */}
                        {item.rating > 0 && (
                          <div className="flex items-center gap-0.5 mb-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={12} className={i < item.rating ? "text-gold fill-gold" : "text-muted/30"} />
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                          <span className="text-muted/40">&ldquo;</span>{item.message}<span className="text-muted/40">&rdquo;</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => { setEditingId(item.id); setEditForm({ ...sanitize(item), rating: item.rating || 5 }); }}
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

/* ─── Form with Image Upload + Star Rating ─── */
function FormCard({ form, onChange, onSave, onCancel, saving, isNew }: {
  form: any; onChange: (f: any) => void; onSave: () => void; onCancel: () => void; saving: boolean; isNew?: boolean;
}) {
  return (
    <div className="space-y-4">
      {/* Image Upload with Crop */}
      <ImagePickerCrop
        currentImage={form.image_url}
        aspect={1 / 1}
        folder="testimonials"
        onImageChange={(url) => onChange({ ...form, image_url: url })}
      />

      {/* Name + Sort Order */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Member Name <span className="text-red-400">*</span></label>
          <input
            type="text"
            value={form.name || ""}
            onChange={e => onChange({...form, name: e.target.value})}
            placeholder="e.g. James Mitchell"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Sort Order</label>
          <input
            type="number"
            value={form.sort_order ?? ""}
            onChange={e => onChange({...form, sort_order: Number(e.target.value)})}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-cyan/50 transition-colors"
          />
        </div>
      </div>

      {/* Star Rating Selector */}
      <div>
        <label className="block text-xs font-medium text-muted mb-2">Rating</label>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const starVal = i + 1;
            return (
              <button
                key={starVal}
                type="button"
                onClick={() => onChange({...form, rating: starVal})}
                className={`p-1.5 rounded-lg transition-all duration-150 hover:scale-110 ${
                  starVal <= (form.rating || 0)
                    ? "text-gold"
                    : "text-muted/30 hover:text-muted/50"
                }`}
                aria-label={`Rate ${starVal} star${starVal > 1 ? 's' : ''}`}
              >
                <Star size={22} className={starVal <= (form.rating || 0) ? "fill-gold" : ""} />
              </button>
            );
          })}
          <span className="text-xs text-muted/50 ml-2">
            {form.rating || 0} / 5
          </span>
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs font-medium text-muted mb-1">Testimonial <span className="text-red-400">*</span></label>
        <textarea
          value={form.message || ""}
          onChange={e => onChange({...form, message: e.target.value})}
          placeholder="e.g. I dropped 22kg in 4 months. The coaches here don't just train you — they transform you."
          rows={3}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors resize-none"
        />
      </div>

      {/* Active Toggle */}
      <label className="flex items-center gap-2.5 text-sm text-muted cursor-pointer group pt-1">
        <div className={`relative size-5 rounded-md border transition-all ${
          form.is_active ? "bg-green-500 border-green-500" : "bg-white/5 border-white/10 group-hover:border-white/20"
        }`}>
          <input type="checkbox" checked={form.is_active} onChange={e => onChange({...form, is_active: e.target.checked})} className="sr-only" />
          {form.is_active && <Check className="absolute inset-0 size-full p-0.5 text-white" />}
        </div>
        <span className="group-hover:text-foreground transition-colors">Active / Visible on website</span>
      </label>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
        <button type="button" onClick={onCancel} className="flex items-center gap-2 px-5 py-2.5 text-sm text-muted hover:text-foreground rounded-xl hover:bg-white/5 transition-colors">
          <Ban className="size-4" /> Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving || !form.name || !form.message}
          className="flex items-center gap-2 rounded-xl bg-cyan text-black font-semibold px-6 py-2.5 text-sm disabled:opacity-50 hover:shadow-[0_0_20px_#00f5ff66] transition-all"
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {isNew ? "Create" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  );
}

function Spinner() {
  return <div className="flex items-center justify-center py-20"><div className="size-6 rounded-full border-2 border-cyan border-t-transparent animate-spin" /></div>;
}


