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
    gradient: "from-emerald-500 to-green-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    href: "/dashboard/finance/new",
    label: "İşlem Ekle",
    icon: Wallet,
    gradient: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    href: "/dashboard/calendar/new",
    label: "Etkinlik Ekle",
    icon: CalendarDays,
    gradient: "from-orange-500 to-amber-600",
    bg: "bg-orange-50 dark:bg-orange-950/30",
  },
  {
    href: "/dashboard/ai-assistant",
    label: "AI'ya Sor",
    icon: Bot,
    gradient: "from-purple-500 to-violet-600",
    bg: "bg-purple-50 dark:bg-purple-950/30",
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
      iconBg: "bg-emerald-500",
      trend: null,
      valueColor: "",
      href: "/dashboard/fields",
    },
    {
      title: "Aylık Gelir",
      value: formatCurrency(monthlyIncome),
      subtitle: "geçen aya göre",
      icon: TrendingUp,
      iconBg: "bg-green-500",
      trend: incomeTrend !== 0 ? { value: incomeTrend, positive: incomeTrend > 0 } : null,
      valueColor: "text-green-600 dark:text-green-400",
      href: "/dashboard/finance",
    },
    {
      title: "Aylık Gider",
      value: formatCurrency(monthlyExpense),
      subtitle: "geçen aya göre",
      icon: TrendingDown,
      iconBg: "bg-red-500",
      trend: expenseTrend !== 0 ? { value: expenseTrend, positive: false } : null,
      valueColor: "text-red-500 dark:text-red-400",
      href: "/dashboard/finance",
    },
    {
      title: "Net Bakiye",
      value: formatCurrency(netBalance),
      subtitle: "bu ay",
      icon: BarChart3,
      iconBg: netBalance >= 0 ? "bg-blue-500" : "bg-red-500",
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
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {getGreeting()}{firstName ? `, ${firstName}` : ""} 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            İşletmenizin güncel durumuna göz atın
          </p>
        </div>
        <Link href="/dashboard/fields/new">
          <Button size="sm" className="gap-1.5 shadow-sm">
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
              className="flex items-center gap-3 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 dark:border-amber-900 dark:from-amber-950/30 dark:to-orange-950/20"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/50">
                <Bell className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  {r.title}
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  {new Date(r.event_date).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                  })}{" "}
                  tarihli etkinlik için hatırlatıcı
                </p>
              </div>
              <Link href="/dashboard/calendar">
                <Button variant="outline" size="sm" className="shrink-0 text-xs">
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
            <Card className="relative overflow-hidden border-0 bg-card shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-0.5">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {card.title}
                    </p>
                    <p className={`text-2xl font-bold tabular-nums ${card.valueColor}`}>
                      {card.value}
                    </p>
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg} shadow-sm`}>
                    <card.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  {card.trend ? (
                    <>
                      <span
                        className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                          card.trend.positive
                            ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                        }`}
                      >
                        {card.trend.positive ? (
                          <ArrowUpRight size={12} />
                        ) : (
                          <ArrowDownRight size={12} />
                        )}
                        %{Math.abs(card.trend.value)}
                      </span>
                      <span className="text-xs text-muted-foreground">{card.subtitle}</span>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground">{card.subtitle}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Grafik & Son İşlemler */}
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="border-0 shadow-sm lg:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
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

        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
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
        <Card className="border-0 shadow-sm lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 shadow-sm">
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
                  <Button size="sm" variant="outline" className="mt-3 gap-1.5">
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
                        className={`rounded-md px-2 py-1 text-[11px] font-medium ${
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

        {/* Hızlı İşlemler */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Hızlı İşlemler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Link key={action.href} href={action.href}>
                  <div className={`group/action flex flex-col items-center gap-3 rounded-xl ${action.bg} p-5 transition-all duration-200 hover:scale-[1.02] hover:shadow-md cursor-pointer`}>
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} shadow-sm transition-transform duration-200 group-hover/action:scale-110`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-foreground/80">{action.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forum & Araziler */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Son Forum Konuları */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
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
                  <Button size="sm" variant="outline" className="mt-3 gap-1.5">
                    <Plus size={14} />
                    Konu Aç
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
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

        {/* Arazilerim Özeti */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 shadow-sm">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                Arazilerim
              </CardTitle>
              <Link href="/dashboard/fields">
                <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground">
                  Tümü
                  <ArrowRight size={12} className="ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentFields.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl bg-muted/30 py-8">
                <MapPin className="h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Henüz arazi eklenmedi</p>
                <Link href="/dashboard/fields/new">
                  <Button size="sm" variant="outline" className="mt-3 gap-1.5">
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
                        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
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
    </div>
  );
}
