"use client";
import { getToken } from "@/lib/session";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Phone, Clock, RefreshCw, Trash2,
  UserPlus, Mail, Target, ChevronLeft, ChevronRight
} from "lucide-react";

interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  source: string;
  status: string;
  fitness_goal?: string;
  experience_level?: string;
  preferred_time?: string;
  days_per_week?: number;
  age?: number;
  gender?: string;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-cyan/10 text-cyan border-cyan/20",
  contacted: "bg-gold/10 text-gold border-gold/20",
  converted: "bg-green-500/10 text-green-400 border-green-500/20",
  member: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  closed: "bg-muted/10 text-muted border-white/10",
};

const STATUS_OPTIONS: { key: string; label: string }[] = [
  { key: "new", label: "🆕 New" },
  { key: "contacted", label: "📞 Contacted" },
  { key: "converted", label: "✅ Converted" },
  { key: "member", label: "⭐ Member" },
  { key: "closed", label: "❌ Closed" },
];
const PAGE_SIZE = 20;

export default function LeadsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [activeTab, setActiveTab] = useState<"all" | "contact" | "trial">("all");
  const [convertingMap, setConvertingMap] = useState<Record<string, string | null>>({});
  // Track which phone numbers are already members (from members table)
  const [memberPhones, setMemberPhones] = useState<Set<string>>(new Set());

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push("/admin/login"); return; }
    fetchLeads(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, statusFilter, page, activeTab]);

  const fetchLeadStatusFromMembers = async () => {
    // Also fetch members to cross-reference which leads should show "Member" badge
    const token = getToken();
    try {
      const res = await fetch("/api/admin/members", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const members = await res.json();
        const phones = new Set<string>((Array.isArray(members) ? members : []).map((m: any) => m.phone));
        setMemberPhones(phones);
      }
    } catch {
      // Non-critical
    }
  };

  const fetchLeads = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    const token = getToken();
    let url = `/api/admin/leads?page=${page}&pageSize=${PAGE_SIZE}`;
    if (statusFilter !== "all") url += `&status=${statusFilter}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const result = await res.json();
    const dataArr = Array.isArray(result) ? result : result.data || [];
    const count = result.count ?? dataArr.length;

    // Filter by source tab if active
    let filtered = dataArr;
    if (activeTab === "contact") filtered = dataArr.filter((l: Lead) => l.source === "contact-form");
    else if (activeTab === "trial") filtered = dataArr.filter((l: Lead) => l.source === "trial-signup");

    setItems(filtered);
    setTotalCount(count);
    if (showLoader) setLoading(false);

    // Also fetch members to cross-reference phone numbers
    fetchLeadStatusFromMembers();
  };

  const updateStatus = async (id: string, status: string) => {
    const token = getToken();
    const leadData = items.find(l => l.id === id);

    // Already converting — block double click
    if (convertingMap[id]) return;

    // Already a member — block
    if (status === "member" && leadData?.status === "member") return;

    // Also block if phone is already in members table
    if (status === "member" && leadData && memberPhones.has(leadData.phone)) {
      // Update lead status locally + server to keep in sync
      setItems(prev => prev.map(l => l.id === id ? { ...l, status: "member" } : l));
      setConvertingMap(prev => ({ ...prev, [id]: status }));
      await fetch(`/api/admin/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: "member" }),
      });
      setConvertingMap(prev => ({ ...prev, [id]: null }));
      return;
    }

    // Lock this lead's buttons while processing
    setConvertingMap(prev => ({ ...prev, [id]: status }));

    // === OPTIMISTIC UPDATE: instantly reflect in UI before API calls ===
    setItems(prev => prev.map(l => l.id === id ? { ...l, status } : l));

    // First update the lead status
    const leadRes = await fetch(`/api/admin/leads/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });

    if (!leadRes.ok) {
      // Revert optimistic update on failure
      setItems(prev => prev.map(l => l.id === id ? { ...l, status: leadData?.status || "new" } : l));
      setConvertingMap(prev => ({ ...prev, [id]: null }));
      alert("Failed to update lead status. Please try again.");
      return;
    }

    // If marking as "member", also create a member record
    if (status === "member" && leadData) {
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      try {
        const memberRes = await fetch("/api/admin/members", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            name: leadData.name,
            phone: leadData.phone,
            email: leadData.email || "",
            plan: "basic",
            membership_start: new Date().toISOString().split("T")[0],
            membership_end: endDate.toISOString().split("T")[0],
            fees_amount: 0,
            notes: `Converted from lead (${leadData.source})`,
          }),
        });

        if (memberRes.ok) {
          // Member created — add phone to our local set
          setMemberPhones(prev => new Set(prev).add(leadData.phone));
        } else if (memberRes.status === 409) {
          // Already a member — just add phone to set
          setMemberPhones(prev => new Set(prev).add(leadData.phone));
        }
        // Other errors: non-critical, lead status is already "member" in DB
      } catch (e) {
        console.error("Member creation failed (non-critical):", e);
      }
    }

    // Unlock buttons
    setConvertingMap(prev => ({ ...prev, [id]: null }));
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Delete this lead permanently?")) return;
    const token = getToken();
    setConvertingMap(prev => ({ ...prev, [id]: "deleting" }));
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setItems(prev => prev.filter(l => l.id !== id));
    }
    setConvertingMap(prev => ({ ...prev, [id]: null }));
  };

  const isMember = (lead: Lead) => lead.status === "member" || memberPhones.has(lead.phone);

  const getTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <UserPlus className="size-6 text-cyan" /> Leads
          </h1>
          <p className="text-sm text-muted mt-1">Inquiries from WhatsApp, contact form, and trial signups</p>
        </div>
        <button onClick={() => fetchLeads(true)} disabled={loading} className="flex items-center gap-2 rounded-xl bg-white/5 text-muted hover:text-foreground border border-white/10 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-50 transition-all">
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Source Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-3">
        {[
          { key: "all" as const, label: "All Leads", icon: UserPlus },
          { key: "contact" as const, label: "📧 Contact Form", icon: Mail },
          { key: "trial" as const, label: "🏋️ Trial Signups", icon: Target },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setPage(1); setLoading(true); }}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
              activeTab === tab.key
                ? "bg-cyan/10 border-cyan/40 text-cyan"
                : "bg-white/5 border-white/10 text-muted hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => { setStatusFilter("all"); setPage(1); setLoading(true); }}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${statusFilter === "all" ? "bg-cyan/10 border-cyan/40 text-cyan" : "bg-white/5 border-white/10 text-muted hover:text-foreground"}`}>
          All Status
        </button>
        {STATUS_OPTIONS.map(({ key, label }) => (
          <button key={key} onClick={() => { setStatusFilter(key); setPage(1); setLoading(true); }}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${statusFilter === key ? "bg-cyan/10 border-cyan/40 text-cyan" : "bg-white/5 border-white/10 text-muted hover:text-foreground"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center border border-white/5">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-cyan/10 mb-4">
            <UserPlus className="size-7 text-cyan" />
          </div>
          <h3 className="font-heading text-base font-semibold text-foreground mb-2">No Leads Yet</h3>
          <p className="text-sm text-muted max-w-md mx-auto">
            When someone inquires via contact form, trial signup, or WhatsApp, their lead will appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-3">
            {items.map(lead => (
              <div key={lead.id} className="glass rounded-2xl p-5 border border-white/5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="size-10 rounded-full bg-gradient-to-br from-cyan/20 to-pink/20 flex items-center justify-center shrink-0">
                      <span className="font-heading text-sm font-bold text-cyan">
                        {lead.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <h3 className="font-heading text-sm font-semibold text-foreground">{lead.name}</h3>
                        <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border capitalize ${STATUS_COLORS[lead.status] || STATUS_COLORS.new}`}>
                          {isMember(lead) ? "member" : lead.status}
                        </span>
                        <span className="text-[10px] text-muted/50">{getTimeAgo(lead.created_at)}</span>
                        {lead.source === "trial-signup" && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">Trial</span>
                        )}
                        {lead.source === "contact-form" && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Contact</span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted/70">
                        <span className="flex items-center gap-1"><Phone className="size-3" /> {lead.phone}</span>
                        {lead.email && <span className="flex items-center gap-1"><Mail className="size-3" /> {lead.email}</span>}
                        {lead.fitness_goal && <span className="flex items-center gap-1"><Target className="size-3" /> {lead.fitness_goal}</span>}
                        {lead.experience_level && <span className="flex items-center gap-1">{lead.experience_level}</span>}
                        {lead.preferred_time && <span className="flex items-center gap-1"><Clock className="size-3" /> {lead.preferred_time}</span>}
                        {lead.days_per_week && <span>{lead.days_per_week}d/wk</span>}
                      </div>

                      {lead.message && (
                        <p className="text-xs text-muted leading-relaxed mt-2 bg-white/5 rounded-xl p-3 border border-white/5">
                          &ldquo;{lead.message}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Actions */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5 flex-wrap">
                  {isMember(lead) ? (
                    <span className="text-[11px] px-3 py-1.5 rounded-lg border bg-purple-500/10 text-purple-400 border-purple-500/20 flex items-center gap-1.5">
                      <span>{'⭐'}</span> <span className="font-medium">Member</span>
                    </span>
                  ) : (
                    STATUS_OPTIONS.filter(opt => opt.key !== lead.status).map(({ key, label }) => (
                      <button
                        key={key}
                        disabled={lead.status === key || !!convertingMap[lead.id]}
                        onClick={() => updateStatus(lead.id, key)}
                        className={`text-[11px] px-3 py-1.5 rounded-lg border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                          lead.status === key
                            ? STATUS_COLORS[key]
                            : "bg-white/5 border-white/10 text-muted hover:text-foreground"
                        } ${!!convertingMap[lead.id] ? "cursor-wait" : ""}`}
                      >
                        {!!convertingMap[lead.id] && convertingMap[lead.id] === key ? "⏳" : label}
                      </button>
                    ))
                  )}
                  <button
                    onClick={() => deleteLead(lead.id)}
                    disabled={convertingMap[lead.id] === "deleting"}
                    className="ml-auto flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/15 transition-all disabled:opacity-50"
                    title="Delete lead"
                  >
                    {convertingMap[lead.id] === "deleting" ? <span className="size-3 animate-spin">⟳</span> : <Trash2 className="size-3" />}
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-4 pt-2">
              <p className="text-xs text-muted">
                Page {page} of {totalPages} ({totalCount} total)
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="flex items-center gap-1 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-muted hover:text-foreground disabled:opacity-30 transition-all"
                >
                  <ChevronLeft className="size-3" /> Prev
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (page <= 3) pageNum = i + 1;
                  else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = page - 2 + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => { setPage(pageNum); setLoading(true); }}
                      className={`size-8 rounded-xl text-xs font-medium border transition-all ${
                        page === pageNum
                          ? "bg-cyan/10 border-cyan/40 text-cyan"
                          : "bg-white/5 border-white/10 text-muted hover:text-foreground"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="flex items-center gap-1 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-muted hover:text-foreground disabled:opacity-30 transition-all"
                >
                  Next <ChevronRight className="size-3" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Spinner() {
  return <div className="flex items-center justify-center py-20"><div className="size-6 rounded-full border-2 border-cyan border-t-transparent animate-spin" /></div>;
}
