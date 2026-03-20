"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  Wallet,
  CalendarDays,
  CloudSun,
  Bot,
  User,
  Menu,
  X,
  Leaf,
  MessagesSquare,
  BookOpen,
  Shield,
  Newspaper,
  ScanSearch,
  Tractor,
  MessageCircle,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navGroups = [
  {
    label: "Ana Menü",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/fields", label: "Arazilerim", icon: MapPin },
      { href: "/dashboard/finance", label: "Gelir & Gider", icon: Wallet },
      { href: "/dashboard/calendar", label: "Takvim", icon: CalendarDays },
    ],
  },
  {
    label: "Araçlar",
    items: [
      { href: "/dashboard/weather", label: "Hava Durumu", icon: CloudSun },
      { href: "/dashboard/ai-assistant", label: "AI Asistan", icon: Bot },
      { href: "/dashboard/diagnose", label: "Hastalık Teşhisi", icon: ScanSearch },
    ],
  },
  {
    label: "Topluluk",
    items: [
      { href: "/dashboard/forum", label: "Forum", icon: MessagesSquare },
      { href: "/dashboard/news", label: "Haberler", icon: Newspaper },
      { href: "/dashboard/education", label: "Bilgi Bankası", icon: GraduationCap },
    ],
  },
];

const profileItem = { href: "/dashboard/profile", label: "Profil", icon: User };
const adminItem = { href: "/dashboard/admin", label: "Admin Paneli", icon: Shield };

export function Sidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    return pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 shadow-lg shadow-green-900/30">
          <Leaf className="h-5 w-5 text-white" />
        </div>
        <Link href="/dashboard" className="text-lg font-extrabold tracking-tight text-white">
          TarımSis
        </Link>
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-white/30">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
                      active
                        ? "bg-white/12 text-white shadow-sm backdrop-blur-sm"
                        : "text-white/50 hover:bg-white/6 hover:text-white/80",
                    )}
                  >
                    <item.icon
                      size={17}
                      className={cn(
                        "shrink-0 transition-colors",
                        active ? "text-emerald-400" : "text-white/40",
                      )}
                    />
                    {item.label}
                    {active && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-white/8 p-3 space-y-0.5">
        {/* Profile */}
        <Link
          href={profileItem.href}
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
            isActive(profileItem.href)
              ? "bg-white/12 text-white shadow-sm"
              : "text-white/50 hover:bg-white/6 hover:text-white/80",
          )}
        >
          <User
            size={17}
            className={cn(
              "shrink-0",
              isActive(profileItem.href) ? "text-emerald-400" : "text-white/40",
            )}
          />
          {profileItem.label}
        </Link>

        {/* Admin */}
        {isAdmin && (
          <Link
            href={adminItem.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
              isActive(adminItem.href)
                ? "bg-red-500/15 text-red-300 shadow-sm"
                : "text-red-400/50 hover:bg-red-500/8 hover:text-red-300/80",
            )}
          >
            <Shield
              size={17}
              className={cn(
                "shrink-0",
                isActive(adminItem.href) ? "text-red-400" : "text-red-400/50",
              )}
            />
            {adminItem.label}
          </Link>
        )}

        {/* Version */}
        <div className="px-3 pt-2">
          <p className="text-[10px] text-white/20">TarımSis v1.0</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed left-4 top-4 z-50 rounded-xl bg-card p-2.5 shadow-lg ring-1 ring-border lg:hidden"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-[260px] flex-col bg-gradient-to-b from-[hsl(150,25%,14%)] via-[hsl(155,20%,11%)] to-[hsl(160,18%,8%)] lg:flex">
        {sidebarContent}
      </aside>

      {/* Sidebar - Mobile */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-full w-[260px] flex-col bg-gradient-to-b from-[hsl(150,25%,14%)] via-[hsl(155,20%,11%)] to-[hsl(160,18%,8%)] transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
