import Link from "next/link";
import {
  MapPin,
  Wallet,
  CalendarDays,
  Bot,
  TrendingUp,
  TrendingDown,
  Sprout,
  Bell,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  BarChart3,
  Layers,
  MessagesSquare,
  CheckCircle2,
  MessageCircle,
  ScanSearch,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { CALENDAR_EVENT_LABELS, FORUM_CATEGORIES } from "@tarimsis/shared";
import type { Database } from "@tarimsis/supabase";
import { WeatherWidget } from "./weather-widget";
import { MonthlyChart } from "./monthly-chart";
import { RecentTransactions } from "./recent-transactions";
import { NewsTicker } from "@/components/news-ticker";

type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
type CalendarEvent = Database["public"]["Tables"]["calendar_events"]["Row"];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
  }).format(amount);
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Günaydın";
  if (hour < 18) return "İyi günler";
  return "İyi akşamlar";
}

const quickActions = [
  {
    href: "/dashboard/fields/new",
    label: "Arazi Ekle",
    icon: MapPin,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    href: "/dashboard/finance/new",
    label: "İşlem Ekle",
    icon: Wallet,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    href: "/dashboard/calendar/new",
    label: "Etkinlik Ekle",
    icon: CalendarDays,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    href: "/dashboard/ai-assistant",
    label: "AI'ya Sor",
    icon: Bot,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/30",
  },
  {
    href: "/dashboard/diagnose",
    label: "Teşhis Et",
    icon: ScanSearch,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-950/30",
  },
  {
    href: "/dashboard/weather",
    label: "Hava Durumu",
    icon: TrendingUp,
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-50 dark:bg-cyan-950/30",
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Profil bilgisi
  const { data: profileData } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user!.id)
    .single();

  const firstName = profileData?.full_name?.split(" ")[0] || "";

  // Arazi sayısı + toplam alan
  const { data: fieldsData } = await supabase
    .from("fields")
    .select("id, area_sqm")
    .eq("user_id", user!.id);

  const fieldsList = fieldsData ?? [];
  const fieldCount = fieldsList.length;
  const totalAreaHectar = fieldsList.reduce((s, f) => s + (f.area_sqm || 0), 0) / 10000;

  // Son 6 aylık işlemler (grafik + özet kartlar için)
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthStart = `${currentMonth}-01`;
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    .toISOString()
    .split("T")[0];
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const sixMonthsAgoStr = `${sixMonthsAgo.getFullYear()}-${String(sixMonthsAgo.getMonth() + 1).padStart(2, "0")}-01`;

  const { data: txData } = await supabase
    .from("transactions")
    .select("id, type, amount, category, description, transaction_date")
    .eq("user_id", user!.id)
    .gte("transaction_date", sixMonthsAgoStr)
    .lt("transaction_date", nextMonth)
    .order("transaction_date", { ascending: false });

  const allTx = (txData as Pick<Transaction, "id" | "type" | "amount" | "category" | "description" | "transaction_date">[] | null) ?? [];
  const currentTx = allTx.filter((t) => t.transaction_date >= monthStart);
  const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthStart = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, "0")}-01`;
  const prevTx = allTx.filter((t) => t.transaction_date >= prevMonthStart && t.transaction_date < monthStart);

  // Son 6 ay grafik verisi
  const turkishMonths = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
  const monthlyChartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const monthTx = allTx.filter((t) => t.transaction_date.startsWith(key));
    return {
      month: turkishMonths[d.getMonth()],
      income: monthTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
      expense: monthTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    };
  });

  // Son 5 işlem
  const recentTransactions = allTx.slice(0, 5);

  const monthlyIncome = currentTx
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const monthlyExpense = currentTx
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const prevIncome = prevTx
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const prevExpense = prevTx
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  function trendPercent(current: number, previous: number) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  const incomeTrend = trendPercent(monthlyIncome, prevIncome);
  const expenseTrend = trendPercent(monthlyExpense, prevExpense);
  const netBalance = monthlyIncome - monthlyExpense;

  // Yaklaşan etkinlikler
  const todayStr = now.toISOString().split("T")[0];
  const { data: eventsData } = await supabase
    .from("calendar_events")
    .select("*")
    .eq("user_id", user!.id)
    .gte("event_date", todayStr)
    .order("event_date", { ascending: true })
    .limit(5);

  const upcomingEvents = (eventsData as CalendarEvent[] | null) ?? [];

  // Son forum konuları
  const { data: forumData } = await supabase
    .from("forum_topics")
    .select("id, title, category, is_solved, view_count, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const recentForumTopics = (forumData ?? []) as {
    id: string;
    title: string;
    category: string;
    is_solved: boolean;
    view_count: number;
    created_at: string;
  }[];

  // Arazi listesi (isim + ürün)
  const { data: fieldsDetailData } = await supabase
    .from("fields")
    .select("id, name, current_crop, area_sqm")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const recentFields = (fieldsDetailData ?? []) as {
    id: string;
    name: string;
    current_crop: string | null;
    area_sqm: number | null;
  }[];

  // Hatırlatıcıları tetiklenmiş etkinlikler
  const nowISO = now.toISOString();
  const activeReminders = upcomingEvents.filter(
    (e) => e.reminder_enabled && e.reminder_date && e.reminder_date <= nowISO,
  );

  const summaryCards = [
    {
      title: "Toplam Arazi",
      value: fieldCount.toString(),
      subtitle: totalAreaHectar > 0 ? `${totalAreaHectar.toFixed(1)} hektar alan` : "arazi kaydı",
      icon: Layers,
      accent: "bg-emerald-500",
      borderColor: "border-t-emerald-500",
      trend: null,
      valueColor: "",
      href: "/dashboard/fields",
    },
    {
      title: "Aylık Gelir",
      value: formatCurrency(monthlyIncome),
      subtitle: "geçen aya göre",
      icon: TrendingUp,
      accent: "bg-green-500",
      borderColor: "border-t-green-500",
      trend: incomeTrend !== 0 ? { value: incomeTrend, positive: incomeTrend > 0 } : null,
      valueColor: "text-green-600 dark:text-green-400",
      href: "/dashboard/finance",
    },
    {
      title: "Aylık Gider",
      value: formatCurrency(monthlyExpense),
      subtitle: "geçen aya göre",
      icon: TrendingDown,
      accent: "bg-amber-500",
      borderColor: "border-t-amber-500",
      trend: expenseTrend !== 0 ? { value: expenseTrend, positive: false } : null,
      valueColor: "text-amber-600 dark:text-amber-400",
      href: "/dashboard/finance",
    },
    {
      title: "Net Bakiye",
      value: formatCurrency(netBalance),
      subtitle: "bu ay",
      icon: BarChart3,
      accent: netBalance >= 0 ? "bg-blue-500" : "bg-red-500",
      borderColor: netBalance >= 0 ? "border-t-blue-500" : "border-t-red-500",
      trend: null,
      valueColor: netBalance >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-500 dark:text-red-400",
      href: "/dashboard/finance",
    },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Haber Bandı */}
      <NewsTicker />

      {/* Karşılama */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            {getGreeting()}{firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tarımsal işletmenizin güncel durumuna göz atın
          </p>
        </div>
        <Link href="/dashboard/fields/new">
          <Button size="sm" className="gap-1.5 rounded-lg shadow-sm">
            <Plus size={16} />
            Yeni Arazi
          </Button>
        </Link>
      </div>

      {/* Hatırlatıcı Bildirimleri */}
      {activeReminders.length > 0 && (
        <div className="space-y-2">
          {activeReminders.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-3 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 dark:border-amber-900/50 dark:from-amber-950/20 dark:to-orange-950/10"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40">
                <Bell className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                  {r.title}
                </p>
                <p className="text-xs text-amber-600/80 dark:text-amber-400/70">
                  {new Date(r.event_date).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                  })}{" "}
                  tarihli etkinlik
                </p>
              </div>
              <Link href="/dashboard/calendar">
                <Button variant="outline" size="sm" className="shrink-0 rounded-lg text-xs">
                  Takvime Git
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Özet Kartlar */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Link key={card.title} href={card.href} className="group">
            <Card className={`card-glow relative overflow-hidden border-0 border-t-[3px] ${card.borderColor} bg-card shadow-sm`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {card.title}
                    </p>
                    <p className={`text-2xl font-extrabold tabular-nums ${card.valueColor}`}>
                      {card.value}
                    </p>
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.accent} shadow-sm`}>
                    <card.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  {card.trend ? (
                    <>
                      <span
                        className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-bold ${
                          card.trend.positive
                            ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                        }`}
                      >
                        {card.trend.positive ? (
                          <ArrowUpRight size={11} />
                        ) : (
                          <ArrowDownRight size={11} />
                        )}
                        %{Math.abs(card.trend.value)}
                      </span>
                      <span className="text-[11px] text-muted-foreground">{card.subtitle}</span>
                    </>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">{card.subtitle}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Hızlı İşlemler */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <div className={`group flex flex-col items-center gap-2.5 rounded-xl ${action.bg} p-4 transition-all duration-200 hover:scale-[1.03] hover:shadow-md cursor-pointer`}>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 dark:bg-white/10 shadow-sm transition-transform group-hover:scale-110`}>
                <action.icon className={`h-5 w-5 ${action.color}`} />
              </div>
              <span className="text-[11px] font-semibold text-foreground/70 text-center leading-tight">{action.label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Grafik & Son İşlemler */}
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="card-glow border-0 shadow-sm lg:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2.5 text-sm font-bold">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 shadow-sm">
                  <BarChart3 className="h-4 w-4 text-white" />
                </div>
                Aylık Gelir & Gider
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <MonthlyChart data={monthlyChartData} />
          </CardContent>
        </Card>

        <Card className="card-glow border-0 shadow-sm lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2.5 text-sm font-bold">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500 shadow-sm">
                  <Wallet className="h-4 w-4 text-white" />
                </div>
                Son İşlemler
              </CardTitle>
              <Link href="/dashboard/finance">
                <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground">
                  Tümü
                  <ArrowRight size={12} className="ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <RecentTransactions transactions={recentTransactions} />
          </CardContent>
        </Card>
      </div>

      {/* Alt Bölüm */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Hava Durumu */}
        <WeatherWidget />

        {/* Yaklaşan Etkinlikler */}
        <Card className="card-glow border-0 shadow-sm lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2.5 text-sm font-bold">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 shadow-sm">
                  <CalendarDays className="h-4 w-4 text-white" />
                </div>
                Yaklaşan Etkinlikler
              </CardTitle>
              <Link href="/dashboard/calendar">
                <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground">
                  Tümü
                  <ArrowRight size={12} className="ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl bg-muted/30 py-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Sprout className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="mt-3 text-sm font-medium text-muted-foreground">
                  Yaklaşan etkinlik yok
                </p>
                <Link href="/dashboard/calendar/new">
                  <Button size="sm" variant="outline" className="mt-3 gap-1.5 rounded-lg">
                    <Plus size={14} />
                    Etkinlik Ekle
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                {upcomingEvents.map((event) => {
                  const eventDate = new Date(event.event_date);
                  const diffDays = Math.ceil(
                    (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
                  );
                  const daysLabel =
                    diffDays <= 0
                      ? "Bugün"
                      : diffDays === 1
                        ? "Yarın"
                        : `${diffDays} gün`;
                  return (
                    <div
                      key={event.id}
                      className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            diffDays <= 0
                              ? "bg-primary"
                              : diffDays <= 2
                                ? "bg-amber-500"
                                : "bg-muted-foreground/30"
                          }`}
                        />
                        <div>
                          <p className="text-sm font-medium">{event.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {CALENDAR_EVENT_LABELS[event.type] || event.type} •{" "}
                            {eventDate.toLocaleDateString("tr-TR", {
                              day: "numeric",
                              month: "short",
                            })}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`rounded-md px-2 py-1 text-[11px] font-semibold ${
                          diffDays <= 0
                            ? "bg-primary/10 text-primary"
                            : diffDays <= 2
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {daysLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hızlı Bilgi */}
        <Card className="card-glow border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2.5 text-sm font-bold">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 shadow-sm">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              Arazilerim
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentFields.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl bg-muted/30 py-8">
                <MapPin className="h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Henüz arazi eklenmedi</p>
                <Link href="/dashboard/fields/new">
                  <Button size="sm" variant="outline" className="mt-3 gap-1.5 rounded-lg">
                    <Plus size={14} />
                    Arazi Ekle
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                {recentFields.map((field) => (
                  <Link key={field.id} href={`/dashboard/fields/${field.id}`}>
                    <div className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-950/30">
                          <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{field.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {field.area_sqm
                              ? `${(field.area_sqm / 10000).toFixed(1)} ha`
                              : "Alan belirtilmemiş"}
                          </p>
                        </div>
                      </div>
                      {field.current_crop && (
                        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                          {field.current_crop}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Forum */}
      <Card className="card-glow border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2.5 text-sm font-bold">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 shadow-sm">
                <MessagesSquare className="h-4 w-4 text-white" />
              </div>
              Son Forum Konuları
            </CardTitle>
            <Link href="/dashboard/forum">
              <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground">
                Tümü
                <ArrowRight size={12} className="ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentForumTopics.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl bg-muted/30 py-8">
              <MessagesSquare className="h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Henüz konu yok</p>
              <Link href="/dashboard/forum/new">
                <Button size="sm" variant="outline" className="mt-3 gap-1.5 rounded-lg">
                  <Plus size={14} />
                  Konu Aç
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
              {recentForumTopics.map((topic) => {
                const timeAgo = (() => {
                  const diff = Math.floor(
                    (now.getTime() - new Date(topic.created_at).getTime()) / 1000,
                  );
                  if (diff < 3600) return `${Math.floor(diff / 60)} dk`;
                  if (diff < 86400) return `${Math.floor(diff / 3600)} sa`;
                  return `${Math.floor(diff / 86400)} gün`;
                })();
                return (
                  <Link key={topic.id} href={`/dashboard/forum/${topic.id}`}>
                    <div className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">{topic.title}</p>
                          {topic.is_solved && (
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-600" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {FORUM_CATEGORIES[topic.category] || topic.category} • {timeAgo} önce
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
