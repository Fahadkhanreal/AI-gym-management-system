"use client";

import { useEffect, useState, useRef, useCallback, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getToken, initSession, logout as sessionLogout } from "@/lib/session";
import { GymProvider, useGym } from "@/lib/gym-context";
import {
  Dumbbell,
  LayoutDashboard,
  DollarSign,
  ClipboardList,
  HelpCircle,
  MessageSquare,
  Settings,
  MessageCircle,
  LogOut,
  BookUser,
  Menu,
  X,
  ChevronRight,
  Star,
  Building2,
  Users,
  TrendingUp,
  Brain,
  Key,
  UserPlus,
  ExternalLink,
  GripVertical,
} from "lucide-react";

const DEFAULT_NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/settings", label: "Gym Settings", icon: Settings },
  { href: "/admin/pricing", label: "Pricing Plans", icon: DollarSign },
  { href: "/admin/programs", label: "Programs", icon: ClipboardList },
  { href: "/admin/benefits", label: "Benefits", icon: Star },
  { href: "/admin/facilities", label: "Facilities", icon: Building2 },
  { href: "/admin/trainers", label: "Trainers", icon: Users },
  { href: "/admin/transformations", label: "Transformations", icon: TrendingUp },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/knowledge-base", label: "AI Knowledge Base", icon: Brain },
  { href: "/admin/api-settings", label: "API Settings", icon: Key },
  { href: "/admin/members", label: "Members", icon: BookUser },
  { href: "/admin/leads", label: "Leads", icon: UserPlus },
  { href: "/admin/whatsapp", label: "WhatsApp Inbox", icon: MessageCircle },
  { href: "/admin/bot-responses", label: "Bot Responses", icon: MessageCircle },
];

const STORAGE_KEY = "admin_sidebar_order";

function useNavOrder() {
  const [items, setItems] = useState(DEFAULT_NAV_ITEMS);
  const [orderLoaded, setOrderLoaded] = useState(false);

  // Fetch from server on mount
  useEffect(() => {
    const loadOrder = async () => {
      const token = getToken();
      if (!token) return;
      try {
        const res = await fetch("/api/admin/sidebar-order", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const { order } = await res.json();
          if (Array.isArray(order) && order.length === DEFAULT_NAV_ITEMS.length) {
            const itemMap = new Map(DEFAULT_NAV_ITEMS.map(i => [i.href, i]));
            const ordered = order.map((h: string) => itemMap.get(h)).filter(Boolean) as typeof DEFAULT_NAV_ITEMS;
            if (ordered.length === DEFAULT_NAV_ITEMS.length) {
              setItems(ordered);
            }
          }
        }
      } catch {}
      setOrderLoaded(true);
    };
    loadOrder();
  }, []);

  const save = async (newItems: typeof DEFAULT_NAV_ITEMS) => {
    setItems(newItems);
    const token = getToken();
    if (!token) return;
    try {
      await fetch("/api/admin/sidebar-order", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ order: newItems.map(i => i.href) }),
      });
    } catch {}
  };

  return [items, save, orderLoaded] as const;
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <GymProvider><AdminLayoutInner>{children}</AdminLayoutInner></GymProvider>;
}

function AdminLayoutInner({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthed, setIsAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { settings } = useGym();
  const [navItems, setNavItems] = useNavOrder();
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);
  const touchStartY = useRef<number>(0);
  const listRef = useRef<HTMLDivElement>(null);

  // Handle drag start
  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  // Handle drag over
  const handleDragOver = (index: number) => {
    dragOverIndex.current = index;
  };

  // Handle drop — reorder items
  const handleDrop = useCallback(() => {
    if (dragIndex === null || dragOverIndex.current === null) return;
    if (dragIndex === dragOverIndex.current) {
      setDragIndex(null);
      dragOverIndex.current = null;
      return;
    }

    const newItems = [...navItems];
    const [moved] = newItems.splice(dragIndex, 1);
    newItems.splice(dragOverIndex.current, 0, moved);
    setNavItems(newItems);
    setDragIndex(null);
    dragOverIndex.current = null;
  }, [dragIndex, navItems, setNavItems]);

  // Touch event handlers for mobile
  const handleTouchStart = (index: number, e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    setDragIndex(index);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const currentY = e.touches[0].clientY;
    const el = e.currentTarget as HTMLElement;
    const parent = el.closest('nav');
    if (!parent) return;
    const items = parent.querySelectorAll('[data-nav-item]');
    let overIndex: number | null = null;
    items.forEach((item, i) => {
      const rect = item.getBoundingClientRect();
      if (currentY >= rect.top && currentY <= rect.bottom) {
        overIndex = i;
      }
    });
    dragOverIndex.current = overIndex;
  };

  const handleTouchEnd = () => {
    handleDrop();
  };

  // Redirect to login if not on login page and no token
  useEffect(() => {
    initSession();
    const token = getToken();
    if (!token && !pathname.includes("/login")) {
      router.push("/admin/login");
    } else {
      setIsAuthed(!!token);
      setChecking(false);
    }
  }, [pathname, router]);

  // If on login page, render just the children (no sidebar)
  if (pathname.includes("/login")) {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <div className="size-6 rounded-full border-2 border-cyan border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthed) return null;

  const handleLogout = () => {
    sessionLogout();
  };

  return (
    <div className="min-h-dvh bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-white/5 flex flex-col transition-transform duration-300 md:translate-x-0 md:static md:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/5 shrink-0">
          <div className="flex items-center justify-center size-9 rounded-lg bg-cyan/10">
            <Dumbbell className="size-5 text-cyan" />
          </div>
          <div>
            <h1 className="font-heading text-sm font-bold text-foreground">{settings.gym_name}</h1>
            <p className="text-[10px] text-muted leading-tight">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {/* Website Home link - at the top */}
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm bg-cyan/5 text-cyan border border-cyan/10 hover:bg-cyan/10 hover:border-cyan/30 transition-all duration-200 mb-3"
          >
            <ExternalLink className="size-4 shrink-0" />
            <span>View Website</span>
          </a>
          <div className="border-t border-white/5 mb-2" />
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            const isDragging = dragIndex === index;
            const isDragOver = dragOverIndex.current === index;
            return (
              <div
                key={item.href}
                data-nav-item
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => { e.preventDefault(); handleDragOver(index); }}
                onDragEnd={handleDrop}
                onTouchStart={(e) => handleTouchStart(index, e)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`flex items-center gap-1 rounded-xl transition-all duration-200 group ${
                  isDragging ? "opacity-50" : ""
                } ${isDragOver && dragIndex !== null ? "pt-6" : ""}`}
              >
                <span className="flex items-center justify-center size-5 shrink-0 cursor-grab active:cursor-grabbing text-muted/30 hover:text-muted/60 transition-colors touch-none">
                  <GripVertical className="size-3.5" />
                </span>
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 text-sm rounded-xl flex-1 transition-all duration-200 ${
                    isActive
                      ? "bg-cyan/10 text-cyan border border-cyan/20"
                      : "text-muted hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <item.icon className="size-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {isActive && <ChevronRight className="size-3.5 ml-auto shrink-0" />}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/5 shrink-0">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
          >
            <LogOut className="size-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 md:px-6 shrink-0 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center justify-center size-9 rounded-lg text-muted hover:text-foreground hover:bg-white/5 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="size-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-8 rounded-lg bg-cyan/10">
              <Dumbbell className="size-4 text-cyan" />
            </div>
            <span className="font-heading text-sm font-bold">{settings.gym_name}</span>
          </div>
          <div className="size-9" /> {/* spacer */}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
