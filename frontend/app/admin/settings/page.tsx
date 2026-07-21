"use client";
import { getToken } from "@/lib/session";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Building2 } from "lucide-react";

interface GymSettings {
  gym_name: string;
  tagline: string;
  address: string;
  phone: string;
  whatsapp_number: string;
  opening_time: string;
  closing_time: string;
  map_link: string;
  instagram_url: string;
  twitter_url: string;
  linkedin_url: string;
  hero_stat_members: string;
  hero_stat_years: string;
  hero_stat_award: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [form, setForm] = useState<GymSettings>({
    gym_name: "", tagline: "", address: "", phone: "",
    whatsapp_number: "", opening_time: "", closing_time: "", map_link: "",
    instagram_url: "", twitter_url: "", linkedin_url: "",
    hero_stat_members: "", hero_stat_years: "", hero_stat_award: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const loadSettings = () => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(data => { if (data && data.id) setForm(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push("/admin/login"); return; }

    loadSettings();
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess("");

    const token = getToken();
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSuccess("Settings updated successfully!");
      loadSettings(); // Refresh form from server
      setTimeout(() => setSuccess(""), 3000);
    }
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="size-6 rounded-full border-2 border-cyan border-t-transparent animate-spin" /></div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-foreground">Gym Settings</h1>
        <p className="text-sm text-muted mt-1">Manage your gym&apos;s public information</p>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 border border-white/5 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Gym Name" value={form.gym_name} onChange={v => setForm(f => ({...f, gym_name: v}))} />
          <Field label="Tagline" value={form.tagline} onChange={v => setForm(f => ({...f, tagline: v}))} />
          <div className="sm:col-span-2">
            <Field label="Address" value={form.address} onChange={v => setForm(f => ({...f, address: v}))} />
          </div>
          <Field label="Phone" value={form.phone} onChange={v => setForm(f => ({...f, phone: v}))} />
          <Field label="WhatsApp Number" value={form.whatsapp_number} onChange={v => setForm(f => ({...f, whatsapp_number: v}))} />
          <Field label="Opening Time" value={form.opening_time} onChange={v => setForm(f => ({...f, opening_time: v}))} />
          <Field label="Closing Time" value={form.closing_time} onChange={v => setForm(f => ({...f, closing_time: v}))} />
          <div className="sm:col-span-2">
            <Field label="Map Link (Google Maps)" value={form.map_link} onChange={v => setForm(f => ({...f, map_link: v}))} />
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-white/5 pt-5">
          <h3 className="font-heading text-sm font-semibold text-foreground mb-3">Social Media Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Instagram URL" value={form.instagram_url} onChange={v => setForm(f => ({...f, instagram_url: v}))} />
            <Field label="X (Twitter) URL" value={form.twitter_url} onChange={v => setForm(f => ({...f, twitter_url: v}))} />
            <Field label="LinkedIn URL" value={form.linkedin_url} onChange={v => setForm(f => ({...f, linkedin_url: v}))} />
          </div>
        </div>

        {/* Hero Stats */}
        <div className="border-t border-white/5 pt-5">
          <h3 className="font-heading text-sm font-semibold text-foreground mb-3">Hero Section Stats</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Members Stat" value={form.hero_stat_members} onChange={v => setForm(f => ({...f, hero_stat_members: v}))} />
            <Field label="Years Stat" value={form.hero_stat_years} onChange={v => setForm(f => ({...f, hero_stat_years: v}))} />
            <Field label="Award Stat" value={form.hero_stat_award} onChange={v => setForm(f => ({...f, hero_stat_award: v}))} />
          </div>
        </div>

        {success && (
          <div className="rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-2.5 text-sm text-green-400">
            {success}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-cyan text-black font-semibold px-6 py-2.5 text-sm hover:shadow-[0_0_20px_#00f5ff66] disabled:opacity-50 transition-all duration-200"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const placeholders: Record<string, string> = {
    "Gym Name": "e.g. TitanForge Gym",
    "Tagline": "e.g. Forge Your Legacy — World-class training",
    "Address": "e.g. 123 Main Boulevard, Gulshan-e-Iqbal, Karachi",
    "Phone": "e.g. +92 300 1234567",
    "WhatsApp Number": "e.g. 923001234567 (without +)",
    "Opening Time": "e.g. 06:00",
    "Closing Time": "e.g. 23:00",
    "Map Link (Google Maps)": "e.g. https://maps.google.com/?q=...",
    "Instagram URL": "e.g. https://instagram.com/titanforge",
    "X (Twitter) URL": "e.g. https://x.com/titanforge",
    "LinkedIn URL": "e.g. https://linkedin.com/company/titanforge",
    "Members Stat": "e.g. 5,000+ Members",
    "Years Stat": "e.g. 10+ Years",
    "Award Stat": "e.g. Award-Winning",
  };
  return (
    <div>
      <label className="block text-xs font-medium text-muted mb-1.5">{label}</label>
      <input
        type={label.includes("Time") ? "time" : "text"}
        value={value ?? ""}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholders[label] || ""}
        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/30 transition-colors"
      />
    </div>
  );
}


