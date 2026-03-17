"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Shield,
  Users,
  MapPin,
  Wallet,
  MessagesSquare,
  MessageCircle,
  CalendarDays,
  Bot,
  TrendingUp,
  Crown,
  UserPlus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Stats {
  totalUsers: number;
  totalFields: number;
  totalTransactions: number;
  totalTopics: number;
  totalReplies: number;
  totalEvents: number;
  totalSessions: number;
  planCounts: { free: number; monthly: number; yearly: number };
  newUsersWeek: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        İstatistikler yüklenemedi.
      </div>
    );
  }

  const statCards = [
    {
      label: "Toplam Kullanıcı",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "Bu Hafta Yeni",
      value: stats.newUsersWeek,
      icon: UserPlus,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-950/30",
    },
    {
      label: "Toplam Arazi",
      value: stats.totalFields,
      icon: MapPin,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      label: "İşlem Sayısı",
      value: stats.totalTransactions,
      icon: Wallet,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
      label: "Forum Konuları",
      value: stats.totalTopics,
      icon: MessagesSquare,
      color: "text-orange-600",
      bg: "bg-orange-50 dark:bg-orange-950/30",
    },
    {
      label: "Forum Yanıtları",
      value: stats.totalReplies,
      icon: MessageCircle,
      color: "text-pink-600",
      bg: "bg-pink-50 dark:bg-pink-950/30",
    },
    {
      label: "Takvim Etkinlikleri",
      value: stats.totalEvents,
      icon: CalendarDays,
      color: "text-cyan-600",
      bg: "bg-cyan-50 dark:bg-cyan-950/30",
    },
    {
      label: "AI Sohbet Oturumları",
      value: stats.totalSessions,
      icon: Bot,
      color: "text-violet-600",
      bg: "bg-violet-50 dark:bg-violet-950/30",
    },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Başlık */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Admin Paneli
          </h1>
          <p className="text-sm text-muted-foreground">
            Platform istatistikleri ve yönetim
          </p>
        </div>
      </div>

      {/* Hızlı Linkler */}
      <div className="flex flex-wrap gap-2">
        <Link href="/dashboard/admin/users">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Users size={14} />
            Kullanıcı Yönetimi
          </Button>
        </Link>
        <Link href="/dashboard/admin/forum">
          <Button variant="outline" size="sm" className="gap-1.5">
            <MessagesSquare size={14} />
            Forum Moderasyonu
          </Button>
        </Link>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.label} className="border-0 shadow-sm">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.bg}`}
                >
                  <card.icon size={18} className={card.color} />
                </div>
                <div>
                  <p className="text-xl font-bold sm:text-2xl">{card.value}</p>
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Plan Dağılımı */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Crown size={18} className="text-yellow-500" />
            <h2 className="text-lg font-semibold">Plan Dağılımı</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-slate-50 p-4 text-center dark:bg-slate-900/50">
              <p className="text-2xl font-bold">{stats.planCounts.free}</p>
              <p className="text-sm text-muted-foreground">Ücretsiz</p>
              <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-slate-500"
                  style={{
                    width: `${stats.totalUsers ? (stats.planCounts.free / stats.totalUsers) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
            <div className="rounded-xl bg-blue-50 p-4 text-center dark:bg-blue-950/30">
              <p className="text-2xl font-bold text-blue-600">
                {stats.planCounts.monthly}
              </p>
              <p className="text-sm text-muted-foreground">Aylık</p>
              <div className="mt-2 h-2 rounded-full bg-blue-100 dark:bg-blue-950">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{
                    width: `${stats.totalUsers ? (stats.planCounts.monthly / stats.totalUsers) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
            <div className="rounded-xl bg-emerald-50 p-4 text-center dark:bg-emerald-950/30">
              <p className="text-2xl font-bold text-emerald-600">
                {stats.planCounts.yearly}
              </p>
              <p className="text-sm text-muted-foreground">Yıllık</p>
              <div className="mt-2 h-2 rounded-full bg-emerald-100 dark:bg-emerald-950">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{
                    width: `${stats.totalUsers ? (stats.planCounts.yearly / stats.totalUsers) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hızlı Özet */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-primary" />
            <h2 className="text-lg font-semibold">Platform Özeti</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-muted-foreground">Kullanıcı başına arazi</span>
              <span className="font-medium">
                {stats.totalUsers
                  ? (stats.totalFields / stats.totalUsers).toFixed(1)
                  : "0"}
              </span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-muted-foreground">Kullanıcı başına işlem</span>
              <span className="font-medium">
                {stats.totalUsers
                  ? (stats.totalTransactions / stats.totalUsers).toFixed(1)
                  : "0"}
              </span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-muted-foreground">Konu başına yanıt</span>
              <span className="font-medium">
                {stats.totalTopics
                  ? (stats.totalReplies / stats.totalTopics).toFixed(1)
                  : "0"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Premium oran</span>
              <span className="font-medium">
                {stats.totalUsers
                  ? (
                      ((stats.planCounts.monthly + stats.planCounts.yearly) /
                        stats.totalUsers) *
                      100
                    ).toFixed(0)
                  : "0"}
                %
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
