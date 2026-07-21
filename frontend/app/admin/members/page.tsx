"use client";
import { getToken } from "@/lib/session";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Search, Loader2, Check, X, UserPlus,
  User, Phone, Calendar, CreditCard, Clock,
  ChevronLeft, ChevronRight, Filter, RefreshCw,
  Trash2, QrCode, LogIn, DollarSign, Edit3, Save, Ban,
} from "lucide-react";

interface Member {
  id: string;
  member_id: string;
  name: string;
  phone: string;
  email: string;
  plan: string;
  membership_start: string;
  membership_end: string;
  fees_paid: boolean;
  fees_amount: number;
  last_checkin: string | null;
  status: string;
  notes: string;
  created_at: string;
}

const PLAN_COLORS: Record<string, string> = {
  basic: "bg-green-500/10 text-green-400 border-green-500/20",
  warrior: "bg-cyan/10 text-cyan border-cyan/20",
  titan: "bg-gold/10 text-gold border-gold/20",
};

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-500/10 text-green-400 border-green-500/20",
  expired: "bg-red-500/10 text-red-400 border-red-500/20",
  inactive: "bg-white/10 text-muted border-white/10",
};

export default function MembersPage() {
  const router = useRouter();
  const [items, setItems] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "", phone: "", email: "", plan: "basic",
    membership_start: "", membership_end: "",
    fees_amount: "0", notes: "",
  });
  const [checkingIn, setCheckingIn] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const PAGE_SIZE = 20;

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push("/admin/login"); return; }
    fetchMembers();
  }, [router, statusFilter, page]);

  const fetchMembers = async () => {
    const token = getToken();
    const url = `/api/admin/members?status=${statusFilter}&search=${search}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    const arr = Array.isArray(data) ? data : [];
    setItems(arr);
    setTotalCount(arr.length);
    setLoading(false);
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchMembers();
  };

  const addMember = async () => {
    if (!editForm.name || !editForm.phone) return;
    setSaving(true);
    setMessage(null);
    const token = getToken();
    const res = await fetch("/api/admin/members", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        ...editForm,
        fees_amount: Number(editForm.fees_amount),
      }),
    });
    if (res.ok) {
      setMessage({ type: "success", text: "Member added successfully!" });
      setShowAddForm(false);
      resetForm();
      fetchMembers();
    } else {
      const data = await res.json();
      setMessage({ type: "error", text: data.error || "Failed to add member" });
    }
    setSaving(false);
  };

  const checkIn = async (memberId: string, memberName: string) => {
    setCheckingIn(memberId);
    const token = getToken();
    const res = await fetch("/api/admin/check-in", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ member_id: memberId }),
    });
    if (res.ok) {
      const now = new Date();
      const time = now.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setMessage({ type: "success", text: `${memberName} checked in at ${time}` });
    } else {
      setMessage({ type: "error", text: "Check-in failed" });
    }
    fetchMembers();
    setCheckingIn(null);
    setTimeout(() => setMessage(null), 4000);
  };

  const deleteMember = async (id: string) => {
    if (!confirm("Delete this member?")) return;
    const token = getToken();
    await fetch(`/api/admin/members/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchMembers();
  };

  const toggleStatus = async (member: Member) => {
    const token = getToken();
    const newStatus = member.status === "active" ? "inactive" : "active";
    await fetch(`/api/admin/members/${member.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchMembers();
  };

  const resetForm = () => {
    setEditForm({
      name: "", phone: "", email: "", plan: "basic",
      membership_start: "", membership_end: "",
      fees_amount: "0", notes: "",
    });
  };

  const isExpiringSoon = (endDate: string) => {
    if (!endDate) return false;
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000; // within 7 days
  };

  const isExpired = (endDate: string) => {
    if (!endDate) return false;
    return new Date(endDate) < new Date();
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="size-6 rounded-full border-2 border-cyan border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Members</h1>
          <p className="text-sm text-muted mt-1">
            {totalCount} total member{totalCount !== 1 ? "s" : ""}
            {items.filter(m => m.status === "active").length > 0 && (
              <span className="text-green-400"> &middot; {items.filter(m => m.status === "active").length} active</span>
            )}
            {items.filter(m => isExpired(m.membership_end)).length > 0 && (
              <span className="text-red-400"> &middot; {items.filter(m => isExpired(m.membership_end)).length} expired</span>
            )}
          </p>
        </div>
        <button
          onClick={() => { setShowAddForm(!showAddForm); resetForm(); }}
          className="flex items-center gap-2 rounded-xl bg-cyan text-black font-semibold px-5 py-2.5 text-sm hover:shadow-[0_0_20px_#00f5ff66] transition-all"
        >
          <UserPlus className="size-4" />
          {showAddForm ? "Cancel" : "Add Member"}
        </button>
      </div>

      {/* Add Member Form */}
      {showAddForm && (
        <div className="glass rounded-2xl border border-cyan/20 p-5 space-y-4">
          <h2 className="font-heading text-sm font-semibold text-foreground mb-2">Add New Member</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Name *</label>
              <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})}
                placeholder="Member name" className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Phone *</label>
              <input type="tel" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})}
                placeholder="03XX-XXXXXXX" className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Email</label>
              <input type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})}
                placeholder="email@example.com" className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Plan</label>
              <select value={editForm.plan} onChange={e => setEditForm({...editForm, plan: e.target.value})}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-foreground focus:outline-none focus:border-cyan/50 transition-colors">
                <option value="basic" className="bg-surface">Basic</option>
                <option value="warrior" className="bg-surface">Warrior</option>
                <option value="titan" className="bg-surface">Titan</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Start Date</label>
              <input type="date" value={editForm.membership_start} onChange={e => setEditForm({...editForm, membership_start: e.target.value})}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-foreground focus:outline-none focus:border-cyan/50 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">End Date *</label>
              <input type="date" value={editForm.membership_end} onChange={e => setEditForm({...editForm, membership_end: e.target.value})}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-foreground focus:outline-none focus:border-cyan/50 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Amount Paid (PKR)</label>
              <input type="number" value={editForm.fees_amount} onChange={e => setEditForm({...editForm, fees_amount: e.target.value})}
                placeholder="0" className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Notes</label>
              <input type="text" value={editForm.notes} onChange={e => setEditForm({...editForm, notes: e.target.value})}
                placeholder="Optional notes" className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors" />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button onClick={() => setShowAddForm(false)} className="text-sm text-muted hover:text-foreground transition-colors">Cancel</button>
            <button onClick={addMember} disabled={saving || !editForm.name || !editForm.phone}
              className="flex items-center gap-2 rounded-xl bg-cyan text-black font-semibold px-5 py-2.5 text-sm disabled:opacity-50 hover:shadow-[0_0_20px_#00f5ff66] transition-all">
              {saving ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
              {saving ? "Adding..." : "Add Member"}
            </button>
          </div>
        </div>
      )}

      {/* Message */}
      {message && (
        <div className={`rounded-xl px-4 py-2.5 text-sm ${
          message.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
        }`}>
          {message.text}
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted/50" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, phone, or member ID..."
            className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors" />
        </form>
        <div className="flex items-center gap-2">
          {["all", "active", "expired", "inactive"].map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                statusFilter === s
                  ? "bg-cyan/10 text-cyan border border-cyan/20"
                  : "bg-white/5 text-muted hover:text-foreground border border-white/5"
              }`}>
              {s}
            </button>
          ))}
          <button onClick={() => { setMessage(null); fetchMembers(); }} className="flex items-center justify-center size-8 rounded-lg bg-white/5 text-muted hover:text-foreground transition-colors">
            <RefreshCw className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Members Table */}
      {items.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center border border-white/5">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-cyan/10 mb-4">
            <User className="size-7 text-cyan" />
          </div>
          <h3 className="font-heading text-base font-semibold text-foreground mb-2">No Members Found</h3>
          <p className="text-sm text-muted max-w-md mx-auto">
            {search ? "No members match your search." : "Add your first member to get started."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(member => {
            const expired = isExpired(member.membership_end);
            const expiringSoon = isExpiringSoon(member.membership_end);

            return (
              <div key={member.id} className={`glass rounded-2xl border transition-all ${
                expired ? "border-red-500/20 opacity-80" : expiringSoon ? "border-gold/30" : "border-white/5"
              }`}>
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                      {/* Avatar */}
                      <div className="size-10 sm:size-12 rounded-xl bg-gradient-to-br from-cyan/20 to-pink/20 flex items-center justify-center shrink-0">
                        <span className="font-heading text-sm sm:text-base font-bold text-cyan">
                          {member.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-heading text-sm sm:text-base font-semibold text-foreground">{member.name}</h3>
                          <span className="text-[10px] font-mono text-muted/50">{member.member_id}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                            PLAN_COLORS[member.plan] || PLAN_COLORS.basic
                          }`}>
                            {member.plan}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                            STATUS_COLORS[member.status] || STATUS_COLORS.inactive
                          }`}>
                            {member.status}
                          </span>
                          {expired && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20 font-medium">
                              Fees Expired
                            </span>
                          )}
                          {expiringSoon && !expired && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/20 font-medium">
                              Expiring Soon
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                          <span className="flex items-center gap-1">
                            <Phone className="size-3" /> {member.phone}
                          </span>
                          {member.email && (
                            <span className="flex items-center gap-1">
                              <span className="text-muted/50">|</span> {member.email}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" /> {member.membership_start} → <span className={expired ? "text-red-400" : ""}>{member.membership_end}</span>
                          </span>
                          {member.fees_amount > 0 && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="size-3" /> PKR {member.fees_amount.toLocaleString()}
                            </span>
                          )}
                          {member.last_checkin && (
                            <span className="flex items-center gap-1">
                              <Clock className="size-3" /> Last: {new Date(member.last_checkin).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button onClick={() => checkIn(member.id, member.name)} disabled={checkingIn === member.id || expired}
                        className={`flex items-center justify-center size-8 rounded-lg transition-all ${
                          expired
                            ? "bg-white/5 text-muted/30 cursor-not-allowed"
                            : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                        }`} title="Check In">
                        {checkingIn === member.id ? <Loader2 className="size-3.5 animate-spin" /> : <LogIn className="size-3.5" />}
                      </button>
                      <button onClick={() => deleteMember(member.id)}
                        className="flex items-center justify-center size-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all" title="Delete">
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                  {/* Actions Bar */}
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
                    <button onClick={() => toggleStatus(member)}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all ${
                        member.status === "active"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-white/5 text-muted hover:text-foreground border border-white/5"
                      }`}>
                      {member.status === "active" ? <Check className="size-3" /> : <X className="size-3" />}
                      {member.status === "active" ? "Active" : "Mark Active"}
                    </button>
                    {member.notes && (
                      <span className="text-xs text-muted/50 truncate">{member.notes}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
