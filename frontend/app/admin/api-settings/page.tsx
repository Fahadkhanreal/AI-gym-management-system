"use client";
import { getToken } from "@/lib/session";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2, Check, X, Save, Ban,
  Key, Shield, Eye, EyeOff, Sparkles,
  Globe, Cpu, Trash2 as TrashIcon
} from "lucide-react";

interface ApiSetting {
  provider: string;
  api_key: string;
  is_active: boolean;
}

const PROVIDERS = [
  { value: "gemini", label: "Google Gemini", free: true, icon: "🔵", desc: "60 req/min — Free" },
  { value: "groq", label: "Groq (Llama)", free: true, icon: "🟢", desc: "30 req/min — Free" },
  { value: "openai", label: "OpenAI (GPT)", free: false, icon: "🟢", desc: "Pay per use" },
  { value: "anthropic", label: "Claude (Anthropic)", free: false, icon: "🟣", desc: "Pay per use" },
  { value: "deepseek", label: "DeepSeek", free: false, icon: "⚫", desc: "Cheap, good" },
];

export default function ApiSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<ApiSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingProvider, setSavingProvider] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push("/admin/login"); return; }
    fetchSettings();
  }, [router]);

  const fetchSettings = async () => {
    const token = getToken();
    const res = await fetch("/api/admin/api-settings", { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    const arr = Array.isArray(data) ? data : [];
    setSettings(arr);

    const form: Record<string, string> = {};
    arr.forEach(s => { form[s.provider] = s.api_key; });
    PROVIDERS.forEach(p => { if (!form[p.value]) form[p.value] = ""; });
    setEditForm(form);
    setLoading(false);
  };

  const saveKey = async (provider: string) => {
    setSavingProvider(provider);
    setMessage(null);
    const token = getToken();
    if (!token) {
      setMessage({ type: "error", text: "Not logged in. Redirecting..." });
      setTimeout(() => router.push("/admin/login"), 1500);
      setSavingProvider(null);
      return;
    }
    const res = await fetch("/api/admin/api-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ provider, api_key: editForm[provider], is_active: true }),
    });
    if (res.ok) {
      setMessage({ type: "success", text: `${PROVIDERS.find(p => p.value === provider)?.label} key saved!` });
      await fetchSettings();
    } else {
      const err = await res.json();
      setMessage({ type: "error", text: err.error || "Failed to save" });
    }
    setSavingProvider(null);
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
          <Key className="size-6 text-cyan" /> API Settings
        </h1>
        <p className="text-sm text-muted mt-1">
          Manage your AI provider keys. Chatbot and WhatsApp RAG will use the active key.
        </p>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-xl text-sm flex items-center gap-2 ${
          message.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
        }`}>
          {message.type === "success" ? <Check className="size-4" /> : <X className="size-4" />}
          {message.text}
        </div>
      )}

      <div className="glass rounded-2xl p-5 border border-cyan/10">
        <div className="flex items-start gap-3">
          <Shield className="size-5 text-cyan shrink-0 mt-0.5" />
          <div>
            <h3 className="font-heading text-sm font-semibold text-foreground mb-1">How it works</h3>
            <p className="text-xs text-muted leading-relaxed">
              Keys are stored securely in your database. The chatbot automatically uses the active provider.
              When you sell this website, the new owner can change keys here — no developer needed.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {PROVIDERS.map(provider => {
          const existing = settings.find(s => s.provider === provider.value);
          const keyValue = editForm[provider.value] || "";
          const isVisible = showKeys[provider.value];
          const isSaving = savingProvider === provider.value;

          return (
            <div key={provider.value} className="glass rounded-2xl p-5 border border-white/5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="size-10 rounded-xl bg-cyan/10 flex items-center justify-center shrink-0 text-lg">
                    {provider.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-heading text-sm font-semibold text-foreground">{provider.label}</h3>
                      {existing?.is_active && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">Active</span>
                      )}
                      {provider.free && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan/10 text-cyan border border-cyan/20">Free Tier</span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted/70 mb-2">{provider.desc}</p>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1 max-w-md">
                        <input
                          type={isVisible ? "text" : "password"}
                          value={keyValue}
                          onChange={e => setEditForm({ ...editForm, [provider.value]: e.target.value })}
                          placeholder={`Enter your ${provider.label} API key...`}
                          className="w-full rounded-xl bg-white/5 border border-white/10 pl-4 pr-10 py-2 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors font-mono text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowKeys({ ...showKeys, [provider.value]: !isVisible })}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted/50 hover:text-muted transition-colors"
                        >
                          {isVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                      <button
                        onClick={() => saveKey(provider.value)}
                        disabled={isSaving || !keyValue}
                        className="flex items-center gap-1.5 rounded-xl bg-cyan text-black font-semibold px-4 py-2 text-xs disabled:opacity-50 hover:shadow-[0_0_20px_#00f5ff66] transition-all shrink-0"
                      >
                        {isSaving ? <Loader2 className="size-3 animate-spin" /> : <Save className="size-3" />}
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                      {existing && (
                        <button
                          onClick={async () => {
                            if (!confirm(`Remove ${provider.label} key?`)) return;
                            const token = getToken();
                            await fetch("/api/admin/api-settings", {
                              method: "POST",
                              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                              body: JSON.stringify({ provider: provider.value, api_key: "", is_active: false }),
                            });
                            setEditForm({ ...editForm, [provider.value]: "" });
                            await fetchSettings();
                            setMessage({ type: "success", text: `${provider.label} key removed` });
                            setTimeout(() => setMessage(null), 3000);
                          }}
                          className="flex items-center gap-1.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-2 text-xs hover:bg-red-500/20 transition-all shrink-0"
                          title="Remove key"
                        >
                          <TrashIcon className="size-3" /> Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass rounded-2xl p-5 border border-white/5">
        <div className="flex items-start gap-3">
          <Cpu className="size-5 text-cyan shrink-0 mt-0.5" />
          <div>
            <h3 className="font-heading text-sm font-semibold text-foreground mb-1">Recommended for gyms</h3>
            <p className="text-xs text-muted leading-relaxed">
              <strong className="text-cyan">Google Gemini</strong> — free, 60 requests/minute, enough for any gym chatbot.
              <br />
              <strong className="text-cyan">Groq</strong> — also free, very fast. If you need GPT/Claude, just add the key.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return <div className="flex items-center justify-center py-20"><div className="size-6 rounded-full border-2 border-cyan border-t-transparent animate-spin" /></div>;
}


