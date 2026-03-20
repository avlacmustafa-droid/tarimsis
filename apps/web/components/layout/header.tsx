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
    <header className="sticky top-0 z-30 flex h-14 items-center justify-end border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 pl-14 sm:px-6 lg:pl-6">
      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Tema değiştir</span>
        </Button>

        <NotificationDropdown />

        <div className="mx-1 h-5 w-px bg-border/60" />

        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-accent"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-7 w-7 rounded-lg object-cover ring-1 ring-border/50" />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm">
              <User size={13} className="text-white" />
            </div>
          )}
          <span className="hidden text-[13px] font-medium sm:inline">{userName}</span>
        </Link>

        <form action={logout}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
          >
            <LogOut size={15} />
          </Button>
        </form>
      </div>
    </header>
  );
}
