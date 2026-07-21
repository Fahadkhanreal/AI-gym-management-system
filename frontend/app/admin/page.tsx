"use client";
import { getToken } from "@/lib/session";

import { useEffect, useState, Suspense } from "react";
import { useGym } from "@/lib/gym-context";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  DollarSign, ClipboardList, HelpCircle, MessageSquare,
  MessageCircle, TrendingUp, Users, Activity, UserPlus,
  Target, BarChart3, Mail,
} from "lucide-react";

// Dynamic import — only loads on admin page, zero impact on landing page
const RechartsPieChart = dynamic(() => import("@/components/Charts").then(m => m.PieChartCard), { ssr: false });
const RechartsBarChart = dynamic(() => import("@/components/Charts").then(m => m.BarChartCard), { ssr: false });

interface StatCard {
  label: string;
  value: string | number;
  icon: typeof TrendingUp;
  color: string;
}

interface ChartDataItem {
  label: string;
  value: number;
  color: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<StatCard[]>([
    { label: "Pricing Plans", value: "...", icon: DollarSign, color: "cyan" },
    { label: "Programs", value: "...", icon: ClipboardList, color: "pink" },
    { label: "FAQs", value: "...", icon: HelpCircle, color: "gold" },
    { label: "Testimonials", value: "...", icon: MessageSquare, color: "cyan" },
    { label: "Total Leads", value: "...", icon: UserPlus, color: "pink" },
    { label: "New Leads", value: "...", icon: Activity, color: "gold" },
  ]);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [leadsByDay, setLeadsByDay] = useState<{ date: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push("/admin/login"); return; }

    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch("/api/admin/pricing", { headers }).then(r => r.json()),
      fetch("/api/admin/programs", { headers }).then(r => r.json()),
      fetch("/api/admin/faqs", { headers }).then(r => r.json()),
      fetch("/api/admin/testimonials", { headers }).then(r => r.json()),
      fetch("/api/admin/leads", { headers }).then(r => r.json()),
    ]).then(([pricing, programs, faqs, testimonials, leadsResult]) => {
      const leadsArr = Array.isArray(leadsResult) ? leadsResult : leadsResult?.data || [];
      const totalLeads = leadsArr.length;
      const newLeads = leadsArr.filter((l: any) => l.status === "new").length;

      setStats([
        { label: "Pricing Plans", value: Array.isArray(pricing) ? pricing.length : 0, icon: DollarSign, color: "cyan" },
        { label: "Programs", value: Array.isArray(programs) ? programs.length : 0, icon: ClipboardList, color: "pink" },
        { label: "FAQs", value: Array.isArray(faqs) ? faqs.length : 0, icon: HelpCircle, color: "gold" },
        { label: "Testimonials", value: Array.isArray(testimonials) ? testimonials.length : 0, icon: MessageSquare, color: "cyan" },
        { label: "Total Leads", value: totalLeads, icon: UserPlus, color: "pink" },
        { label: "New Leads", value: newLeads, icon: Activity, color: "gold" },
      ]);

      // Chart: lead sources
      const contactCount = leadsArr.filter((l: any) => l.source === "contact-form" || l.source === "contact").length;
      const trialCount = leadsArr.filter((l: any) => l.source === "trial-signup" || l.source === "trial").length;
      const whatsappCount = leadsArr.filter((l: any) => l.source === "whatsapp").length;
      const otherCount = totalLeads - contactCount - trialCount - whatsappCount;

      setChartData([
        { label: "WhatsApp", value: Math.max(0, whatsappCount), color: "#25D366" },
        { label: "Contact Form", value: contactCount, color: "#00f5ff" },
        { label: "Trial Signup", value: trialCount, color: "#ff4d8f" },
        { label: "Other", value: Math.max(0, otherCount), color: "#f59e0b" },
      ]);

      // Leads by day (last 7 days)
      const dayMap: Record<string, number> = {};
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split("T")[0];
        dayMap[key] = 0;
      }
      leadsArr.forEach((l: any) => {
        const d = l.created_at?.split("T")[0];
        if (d && dayMap[d] !== undefined) dayMap[d]++;
      });
      setLeadsByDay(Object.entries(dayMap).map(([date, count]) => ({
        date: days[new Date(date).getDay()],
        count,
      })));

      setLoading(false);
    }).catch(() => setLoading(false));
  }, [router]);

  const colorMap: Record<string, string> = {
    cyan: "text-cyan bg-cyan/10 border-cyan/20",
    pink: "text-pink bg-pink/10 border-pink/20",
    gold: "text-gold bg-gold/10 border-gold/20",
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted mt-1">Welcome to TitanForge admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className={`flex items-center justify-center size-10 rounded-xl ${colorMap[stat.color]}`}>
                <stat.icon className="size-5" />
              </div>
            </div>
            <p className="text-2xl font-bold font-heading text-foreground">
              {loading ? <span className="inline-block size-5 rounded bg-white/10 animate-pulse" /> : stat.value}
            </p>
            <p className="text-xs text-muted mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Lead Sources Pie Chart */}
        <div className="glass rounded-2xl p-5 border border-white/5">
          <h2 className="font-heading text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="size-4 text-cyan" /> Lead Sources
          </h2>
          {chartData.length > 0 ? (
            <RechartsPieChart data={chartData} />
          ) : (
            <p className="text-xs text-muted py-4 text-center">No lead data yet</p>
          )}
        </div>

        {/* Leads by Day Bar Chart */}
        <div className="glass rounded-2xl p-5 border border-white/5">
          <h2 className="font-heading text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="size-4 text-cyan" /> Leads (Last 7 Days)
          </h2>
          <RechartsBarChart data={leadsByDay} />
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="glass rounded-2xl p-5 border border-white/5">
        <h2 className="font-heading text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="size-4 text-cyan" /> Analytics Summary
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-xl bg-white/5">
            <p className="text-2xl font-bold font-heading text-foreground">
              {loading ? "..." : chartData.reduce((s, d) => s + d.value, 0)}
            </p>
            <p className="text-xs text-muted mt-1">Total Interactions</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/5">
            <p className="text-2xl font-bold font-heading text-cyan">
              {loading ? "..." : leadsByDay.filter(d => d.count > 0).length}
            </p>
            <p className="text-xs text-muted mt-1">Active Days (7d)</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/5">
            <p className="text-2xl font-bold font-heading text-pink">
              {loading ? "..." : Math.round((leadsByDay.reduce((s, d) => s + d.count, 0) / Math.max(leadsByDay.filter(d => d.count > 0).length, 1)) * 10) / 10}
            </p>
            <p className="text-xs text-muted mt-1">Avg Leads/Day</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/5">
            <p className="text-2xl font-bold font-heading text-gold">
              {loading ? "..." : (chartData.find(d => d.label === "WhatsApp")?.value || 0) > 0
                ? Math.round((chartData.find(d => d.label === "WhatsApp")!.value / Math.max(chartData.reduce((s, d) => s + d.value, 0), 1)) * 100)
                : 0}%
            </p>
            <p className="text-xs text-muted mt-1">WhatsApp Share</p>
          </div>
        </div>
      </div>
    </div>
  );
}


