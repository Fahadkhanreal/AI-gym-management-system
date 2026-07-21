"use client";
import { getToken } from "@/lib/session";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit3, Trash2, Bot } from "lucide-react";

interface BotResponse {
  id: string;
  keywords: string[];
  response_text: string;
  is_active: boolean;
  match_type: string;
  sort_order: number;
}

export default function BotResponsesPage() {
  const router = useRouter();
  const [items, setItems] = useState<BotResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push("/admin/login"); return; }
    fetchItems();
  }, [router]);

  const fetchItems = async () => {
    const token = getToken();
    const res = await fetch("/api/admin/bot-responses", { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this bot response?")) return;
    const token = getToken();
    await fetch(`/api/admin/bot-responses/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    await fetchItems();
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="size-6 rounded-full border-2 border-cyan border-t-transparent animate-spin" /></div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Bot Responses</h1>
          <p className="text-sm text-muted mt-1">WhatsApp auto-reply keyword rules</p>
        </div>
        <button onClick={() => {
          setEditingId("new");
          setEditForm({ keywords: [], response_text: "", is_active: true, match_type: "any", sort_order: items.length + 1 });
        }} className="flex items-center gap-2 rounded-xl bg-cyan text-black font-semibold px-4 py-2 text-sm hover:shadow-[0_0_20px_#00f5ff66] transition-all">
          <Plus className="size-4" /> Add Rule
        </button>
      </div>

      {editingId === "new" && (
        <BotForm form={editForm} onChange={setEditForm} onSave={async () => {
          const token = getToken();
          await fetch("/api/admin/bot-responses", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(editForm),
          });
          await fetchItems(); setEditingId(null);
        }} onCancel={() => setEditingId(null)} />
      )}

      <div className="grid gap-3">
        {items.map(item => (
          <div key={item.id} className={`glass rounded-2xl p-4 border ${item.is_active ? "border-white/5" : "border-white/5 opacity-60"}`}>
            {editingId === item.id ? (
              <BotForm form={editForm} onChange={setEditForm} onSave={async () => {
                const token = getToken();
                await fetch(`/api/admin/bot-responses/${item.id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                  body: JSON.stringify(editForm),
                });
                await fetchItems(); setEditingId(null);
              }} onCancel={() => setEditingId(null)} />
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Bot className="size-4 text-cyan" />
                    <div className="flex flex-wrap gap-1">
                      {item.keywords.map((kw, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-pink/10 text-pink font-medium">
                          &quot;{kw}&quot;
                        </span>
                      ))}
                    </div>
                    {!item.is_active && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">Disabled</span>}
                  </div>
                  <p className="text-sm text-foreground mt-2 bg-white/5 rounded-xl p-3">{item.response_text}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => { setEditingId(item.id); setEditForm({ ...item }); }} className="icon-btn"><Edit3 className="size-4" /></button>
                  <button onClick={() => deleteItem(item.id)} className="icon-btn text-muted hover:text-red-400"><Trash2 className="size-4" /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function BotForm({ form, onChange, onSave, onCancel }: { form: any; onChange: (f: any) => void; onSave: () => void; onCancel: () => void }) {
  const [keywordInput, setKeywordInput] = useState("");

  const addKeyword = () => {
    if (!keywordInput.trim()) return;
    onChange({ ...form, keywords: [...(form.keywords || []), keywordInput.trim().toLowerCase()] });
    setKeywordInput("");
  };

  const removeKeyword = (idx: number) => {
    onChange({ ...form, keywords: form.keywords.filter((_: any, i: number) => i !== idx) });
  };

  return (
    <div className="glass rounded-2xl p-4 border border-cyan/20 mb-4 space-y-3">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={keywordInput}
          onChange={e => setKeywordInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addKeyword())}
          placeholder="Type keyword and press Enter"
          className="input-field flex-1"
        />
        <button onClick={addKeyword} className="rounded-lg bg-cyan/10 text-cyan px-3 py-2 text-xs font-medium hover:bg-cyan/20 transition-colors">Add</button>
      </div>
      {form.keywords?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {form.keywords.map((kw: string, i: number) => (
            <span key={i} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-pink/10 text-pink">
              &quot;{kw}&quot;
              <button onClick={() => removeKeyword(i)} className="hover:text-red-400">&times;</button>
            </span>
          ))}
        </div>
      )}
      <textarea
        placeholder="Auto-reply message text"
        value={form.response_text}
        onChange={e => onChange({...form, response_text: e.target.value})}
        className="input-field w-full min-h-[80px]"
        rows={3}
      />
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" checked={form.is_active} onChange={e => onChange({...form, is_active: e.target.checked})} className="rounded border-white/20 bg-white/5" /> Active
        </label>
        <label className="flex items-center gap-2 text-sm text-muted">
          <select value={form.match_type} onChange={e => onChange({...form, match_type: e.target.value})} className="rounded-xl bg-white/5 border border-white/10 px-3 py-1 text-xs text-foreground">
            <option value="any">Match Any Keyword</option>
            <option value="all">Match All Keywords</option>
          </select>
        </label>
      </div>
      <div className="flex items-center gap-3 justify-end">
        <button onClick={onCancel} className="text-sm text-muted hover:text-foreground px-4 py-2">Cancel</button>
        <button onClick={onSave} className="rounded-xl bg-cyan text-black font-semibold px-5 py-2 text-sm">Save</button>
      </div>
    </div>
  );
}


