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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/fields", label: "Arazilerim", icon: MapPin },
  { href: "/dashboard/finance", label: "Gelir & Gider", icon: Wallet },
  { href: "/dashboard/calendar", label: "Takvim", icon: CalendarDays },
  { href: "/dashboard/weather", label: "Hava Durumu", icon: CloudSun },
  { href: "/dashboard/ai-assistant", label: "AI Asistan", icon: Bot },
  { href: "/dashboard/forum", label: "Forum", icon: MessagesSquare },
  { href: "/dashboard/news", label: "Haberler", icon: Newspaper },
  { href: "/dashboard/education", label: "Bilgi Bankası", icon: BookOpen },
  { href: "/dashboard/profile", label: "Profil", icon: User },
];

export function Sidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const allNavItems = isAdmin
    ? [
        ...navItems,
        { href: "/dashboard/admin", label: "Admin Paneli", icon: Shield },
      ]
    : navItems;

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
          <Leaf className="h-4.5 w-4.5 text-emerald-300" />
        </div>
        <Link href="/dashboard" className="text-lg font-bold tracking-tight text-white">
          TarımSis
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-3">
        {allNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const isAdminItem = item.href === "/dashboard/admin";
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/60 hover:bg-white/8 hover:text-white/90",
                isAdminItem && !isActive && "text-red-300/70 hover:text-red-200",
              )}
            >
              <item.icon
                size={18}
                className={cn(
                  isActive ? "text-emerald-300" : "",
                  isAdminItem && isActive && "text-red-300",
                  isAdminItem && !isActive && "text-red-400/60",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-4">
        <p className="text-[10px] text-white/30">v1.0 MVP</p>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-card p-2 shadow-lg ring-1 ring-border lg:hidden"
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
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-64 flex-col bg-gradient-to-b from-[hsl(152,30%,12%)] to-[hsl(160,25%,8%)] lg:flex">
        {sidebarContent}
      </aside>

      {/* Sidebar - Mobile */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-full w-64 flex-col bg-gradient-to-b from-[hsl(152,30%,12%)] to-[hsl(160,25%,8%)] transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
