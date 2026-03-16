"use client";

import Link from "next/link";
import { LogOut, User, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { logout } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { NotificationDropdown } from "./notification-dropdown";

interface HeaderProps {
  userName: string;
  avatarUrl?: string | null;
}

export function Header({ userName, avatarUrl }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-end border-b border-border/40 bg-background/70 backdrop-blur-xl px-4 pl-14 sm:px-6 lg:pl-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-[18px] w-[18px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Tema değiştir</span>
        </Button>

        <NotificationDropdown />

        <div className="h-6 w-px bg-border/60" />

        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-accent"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover shadow-sm" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-emerald-600 shadow-sm">
              <User size={14} className="text-white" />
            </div>
          )}
          <span className="hidden font-medium sm:inline">{userName}</span>
        </Link>

        <form action={logout}>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
          >
            <LogOut size={16} />
          </Button>
        </form>
      </div>
    </header>
  );
}
