"use client";
import { getToken } from "@/lib/session";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Edit3, Trash2, Loader2, Star, Check, X,
  Save, Ban, GripVertical, Sparkles, Tag, DollarSign,
  CalendarDays, FileText, ChevronDown, ChevronUp,
  PlusCircle, Trash2 as TrashIcon
} from "lucide-react";

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_quarterly: number;
  price_yearly: number;
  features: { text: string; included: boolean }[];
  is_popular: boolean;
  cta_text: string;
  sort_order: number;
  is_active: boolean;
}

interface FeatureItem {
  text: string;
  included: boolean;
}

export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push("/admin/login"); return; }
    fetchPlans();
  }, [router]);

  const fetchPlans = async () => {
    const token = getToken();
    const res = await fetch("/api/admin/pricing", { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setPlans(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const startEdit = (plan: PricingPlan) => {
    setEditingId(plan.id);
    setEditForm({ ...plan });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const savePlan = async (id: string) => {
    setSaving(true);
    const token = getToken();
    await fetch(`/api/admin/pricing/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(editForm),
    });
    await fetchPlans();
    cancelEdit();
    setSaving(false);
  };

  const deletePlan = async (id: string) => {
    if (!confirm("Delete this pricing plan?")) return;
    const token = getToken();
    await fetch(`/api/admin/pricing/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchPlans();
  };

  const togglePopular = async (plan: PricingPlan) => {
    setSaving(true);
    const token = getToken();
    await fetch(`/api/admin/pricing/${plan.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...plan, is_popular: !plan.is_popular }),
    });
    await fetchPlans();
    setSaving(false);
  };

  const toggleActive = async (plan: PricingPlan) => {
    setSaving(true);
    const token = getToken();
    await fetch(`/api/admin/pricing/${plan.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...plan, is_active: !plan.is_active }),
    });
    await fetchPlans();
    setSaving(false);
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
          <h1 className="font-heading text-2xl font-bold text-foreground">Membership Plans</h1>
          <p className="text-sm text-muted mt-1">Create and manage your gym membership tiers</p>
        </div>
        <button
          onClick={() => {
            setEditingId("new");
            setEditForm({
              name: "",
              description: "",
              price_monthly: 0,
              price_quarterly: 0,
              price_yearly: 0,
              features: [{ text: "", included: true }],
              is_popular: false,
              cta_text: "Join Now",
              sort_order: plans.length + 1,
              is_active: true,
            });
          }}
          className="flex items-center gap-2 rounded-xl bg-cyan text-black font-semibold px-5 py-2.5 text-sm hover:shadow-[0_0_20px_#00f5ff66] transition-all"
        >
          <Plus className="size-4" />
          Add New Plan
        </button>
      </div>

      {/* New Plan Form */}
      {editingId === "new" && (
        <div className="glass rounded-2xl border border-cyan/20 overflow-hidden">
          <div className="bg-cyan/10 px-5 py-3 border-b border-cyan/20 flex items-center gap-2">
            <Sparkles className="size-4 text-cyan" />
            <h2 className="font-heading text-sm font-semibold text-foreground">New Plan</h2>
          </div>
          <div className="p-5">
            <PlanForm
              form={editForm}
              onChange={setEditForm}
              onSave={async () => {
                setSaving(true);
                const token = getToken();
                const payload = {
                  ...editForm,
                  features: editForm.features.filter((f: FeatureItem) => f.text.trim()),
                };
                await fetch("/api/admin/pricing", {
                  method: "POST",
                  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                  body: JSON.stringify(payload),
                });
                await fetchPlans();
                cancelEdit();
                setSaving(false);
              }}
              onCancel={cancelEdit}
              saving={saving}
              isNew
            />
          </div>
        </div>
      )}

      {/* Plans List */}
      {plans.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center border border-white/5">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-cyan/10 mb-4">
            <Tag className="size-7 text-cyan" />
          </div>
          <h3 className="font-heading text-base font-semibold text-foreground mb-2">No Plans Yet</h3>
          <p className="text-sm text-muted max-w-md mx-auto mb-4">
            Start by creating your first membership plan. Click &quot;Add New Plan&quot; above to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`glass rounded-2xl border transition-all duration-200 ${
                plan.is_popular
                  ? "border-cyan/30 shadow-[0_0_15px_#00f5ff15]"
                  : plan.is_active
                    ? "border-white/5"
                    : "border-white/5 opacity-60"
              }`}
            >
              {editingId === plan.id ? (
                <div className="p-5">
                  <PlanForm
                    form={editForm}
                    onChange={setEditForm}
                    onSave={() => savePlan(plan.id)}
                    onCancel={cancelEdit}
                    saving={saving}
                  />
                </div>
              ) : (
                <>
                  {/* Card Header - Always visible */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-heading text-lg font-semibold text-foreground">
                            {plan.name}
                          </h3>
                          {plan.is_popular && (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full bg-gold/15 text-gold font-medium border border-gold/20">
                              <Star className="size-3 fill-gold" />
                              Popular
                            </span>
                          )}
                          {!plan.is_active && (
                            <span className="inline-flex items-center text-[10px] px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-medium">
                              Hidden
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-muted line-clamp-1">{plan.description}</p>

                        {/* Price Row */}
                        <div className="flex flex-wrap items-center gap-4 mt-3">
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg font-bold text-cyan">PKR {plan.price_monthly?.toLocaleString()}</span>
                            <span className="text-xs text-muted">/month</span>
                          </div>
                          <span className="text-muted/30">|</span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-sm font-semibold text-foreground">PKR {plan.price_quarterly?.toLocaleString()}</span>
                            <span className="text-[11px] text-muted">/quarter</span>
                          </div>
                          <span className="text-muted/30">|</span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-sm font-semibold text-foreground">PKR {plan.price_yearly?.toLocaleString()}</span>
                            <span className="text-[11px] text-muted">/year</span>
                          </div>
                        </div>

                        {/* Features Preview */}
                        {plan.features && plan.features.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {plan.features.slice(0, expandedId === plan.id ? undefined : 3).map((f, i) => (
                              <span
                                key={i}
                                className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full ${
                                  f.included
                                    ? "bg-cyan/10 text-cyan border border-cyan/20"
                                    : "bg-white/5 text-muted/50 border border-white/5"
                                }`}
                              >
                                {f.included ? <Check className="size-3" /> : <X className="size-3" />}
                                {f.text}
                              </span>
                            ))}
                            {plan.features.length > 3 && expandedId !== plan.id && (
                              <button
                                onClick={() => setExpandedId(plan.id)}
                                className="text-[11px] text-muted hover:text-foreground transition-colors px-1"
                              >
                                +{plan.features.length - 3} more
                              </button>
                            )}
                          </div>
                        )}

                        {/* Expanded Features */}
                        {expandedId === plan.id && plan.features.length > 3 && (
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {plan.features.slice(3).map((f, i) => (
                              <span
                                key={i}
                                className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full ${
                                  f.included
                                    ? "bg-cyan/10 text-cyan border border-cyan/20"
                                    : "bg-white/5 text-muted/50 border border-white/5"
                                }`}
                              >
                                {f.included ? <Check className="size-3" /> : <X className="size-3" />}
                                {f.text}
                              </span>
                            ))}
                            <button
                              onClick={() => setExpandedId(null)}
                              className="text-[11px] text-muted hover:text-foreground transition-colors px-1"
                            >
                              Show less
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Quick Actions */}
                      <div className="flex flex-col items-center gap-2 shrink-0">
                        <button
                          onClick={() => startEdit(plan)}
                          className="flex items-center justify-center size-9 rounded-xl bg-cyan/10 text-cyan hover:bg-cyan/20 transition-all"
                          title="Edit plan"
                        >
                          <Edit3 className="size-4" />
                        </button>
                        <button
                          onClick={() => deletePlan(plan.id)}
                          className="flex items-center justify-center size-9 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                          title="Delete plan"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>

                    {/* Action Toggles */}
                    <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/5">
                      <button
                        onClick={() => togglePopular(plan)}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all ${
                          plan.is_popular
                            ? "bg-gold/15 text-gold border border-gold/20"
                            : "bg-white/5 text-muted hover:text-foreground border border-white/5"
                        }`}
                      >
                        <Star className={`size-3 ${plan.is_popular ? "fill-gold" : ""}`} />
                        {plan.is_popular ? "Popular" : "Mark Popular"}
                      </button>
                      <button
                        onClick={() => toggleActive(plan)}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all ${
                          plan.is_active
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : "bg-white/5 text-muted hover:text-foreground border border-white/5"
                        }`}
                      >
                        {plan.is_active ? <Check className="size-3" /> : <X className="size-3" />}
                        {plan.is_active ? "Visible" : "Hidden"}
                      </button>
                      <span className="text-xs text-muted/50 ml-auto">
                        {plan.cta_text && `CTA: "${plan.cta_text}"`}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Plan Form Component ─── */
function PlanForm({ form, onChange, onSave, onCancel, saving, isNew }: {
  form: any; onChange: (f: any) => void; onSave: () => void; onCancel: () => void; saving: boolean; isNew?: boolean;
}) {
  const addFeature = () => {
    onChange({ ...form, features: [...(form.features || []), { text: "", included: true }] });
  };

  const removeFeature = (index: number) => {
    const updated = (form.features || []).filter((_: any, i: number) => i !== index);
    onChange({ ...form, features: updated.length ? updated : [{ text: "", included: true }] });
  };

  const updateFeature = (index: number, field: string, value: any) => {
    const updated = [...(form.features || [])];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...form, features: updated });
  };

  return (
    <div className="space-y-5">
      {/* Plan Name */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Plan Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={form.name}
          onChange={e => onChange({ ...form, name: e.target.value })}
          placeholder="e.g. Basic, Warrior, Titan"
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/30 transition-colors"
        />
        <p className="text-xs text-muted/50 mt-1">Short, memorable name for this membership tier</p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          value={form.description}
          onChange={e => onChange({ ...form, description: e.target.value })}
          placeholder="e.g. Everything you need to start your fitness journey"
          rows={2}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/30 transition-colors resize-none"
        />
        <p className="text-xs text-muted/50 mt-1">Brief description shown below the plan name</p>
      </div>

      {/* Prices */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Pricing (PKR)</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted/50 text-sm font-medium">Rs</div>
            <input
              type="number"
              value={form.price_monthly}
              onChange={e => onChange({ ...form, price_monthly: Number(e.target.value) })}
              placeholder="2999"
              className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/30 transition-colors"
            />
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted/40">/month</div>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted/50 text-sm font-medium">Rs</div>
            <input
              type="number"
              value={form.price_quarterly}
              onChange={e => onChange({ ...form, price_quarterly: Number(e.target.value) })}
              placeholder="7999"
              className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/30 transition-colors"
            />
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted/40">/quarter</div>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted/50 text-sm font-medium">Rs</div>
            <input
              type="number"
              value={form.price_yearly}
              onChange={e => onChange({ ...form, price_yearly: Number(e.target.value) })}
              placeholder="29999"
              className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/30 transition-colors"
            />
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted/40">/year</div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-foreground">Features</label>
          <button
            type="button"
            onClick={addFeature}
            className="flex items-center gap-1 text-xs text-cyan hover:text-cyan/80 transition-colors"
          >
            <PlusCircle className="size-3.5" />
            Add Feature
          </button>
        </div>
        <div className="space-y-2">
          {(form.features || []).map((feature: FeatureItem, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div className="relative flex-1">
                <div className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2">
                  <GripVertical className="size-3.5 text-muted/30" />
                </div>
                <input
                  type="text"
                  value={feature.text}
                  onChange={e => updateFeature(index, "text", e.target.value)}
                  placeholder={index === 0 ? "e.g. Gym access (6 AM - 11 PM)" : "e.g. Personal training session"}
                  className="w-full rounded-xl bg-white/5 border border-white/10 pl-8 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={() => updateFeature(index, "included", !feature.included)}
                className={`flex items-center justify-center size-9 rounded-xl shrink-0 transition-all ${
                  feature.included
                    ? "bg-green-500/15 text-green-400 border border-green-500/20"
                    : "bg-white/5 text-muted hover:text-foreground border border-white/5"
                }`}
                title={feature.included ? "Included" : "Not included"}
              >
                {feature.included ? <Check className="size-4" /> : <X className="size-4" />}
              </button>
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="flex items-center justify-center size-9 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all shrink-0"
                title="Remove feature"
              >
                <TrashIcon className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted/50 mt-1.5">
          Click <Check className="size-3 inline" /> / <X className="size-3 inline" /> to toggle if the feature is included or not
        </p>
      </div>

      {/* CTA Text */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Button Text
        </label>
        <input
          type="text"
          value={form.cta_text}
          onChange={e => onChange({ ...form, cta_text: e.target.value })}
          placeholder="e.g. Join Now, Start Free Trial, Go Titan"
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/30 transition-colors"
        />
        <p className="text-xs text-muted/50 mt-1">Text shown on the sign-up button</p>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap items-center gap-6 pt-2">
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <div className={`relative size-5 rounded-md border transition-all ${
            form.is_popular ? "bg-gold border-gold" : "bg-white/5 border-white/10 group-hover:border-white/20"
          }`}>
            <input
              type="checkbox"
              checked={form.is_popular}
              onChange={e => onChange({ ...form, is_popular: e.target.checked })}
              className="sr-only"
            />
            {form.is_popular && <Star className="absolute inset-0 size-full p-0.5 text-black" />}
          </div>
          <span className="text-sm text-muted group-hover:text-foreground transition-colors">Mark as Popular / Recommended</span>
        </label>
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <div className={`relative size-5 rounded-md border transition-all ${
            form.is_active ? "bg-green-500 border-green-500" : "bg-white/5 border-white/10 group-hover:border-white/20"
          }`}>
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={e => onChange({ ...form, is_active: e.target.checked })}
              className="sr-only"
            />
            {form.is_active && <Check className="absolute inset-0 size-full p-0.5 text-white" />}
          </div>
          <span className="text-sm text-muted group-hover:text-foreground transition-colors">Active / Visible on website</span>
        </label>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-5 py-2.5 text-sm text-muted hover:text-foreground transition-colors rounded-xl hover:bg-white/5"
        >
          <Ban className="size-4" />
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving || !form.name}
          className="flex items-center gap-2 rounded-xl bg-cyan text-black font-semibold px-6 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_#00f5ff66] transition-all"
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {isNew ? "Create Plan" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}


