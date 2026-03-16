"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MessagesSquare,
  Plus,
  Search,
  Eye,
  MessageCircle,
  CheckCircle2,
  Clock,
  User,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FORUM_CATEGORIES } from "@tarimsis/shared";

interface ForumTopic {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  is_solved: boolean;
  view_count: number;
  reply_count: number;
  created_at: string;
  profiles: { full_name: string; avatar_url: string | null } | null;
}

const categoryColors: Record<string, string> = {
  general: "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
  disease: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  fertilizing: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  irrigation: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  planting: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  equipment: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
  market: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
  other: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

function timeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return "az önce";
  if (diff < 3600) return `${Math.floor(diff / 60)} dk önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} gün önce`;
  return date.toLocaleDateString("tr-TR");
}

export default function ForumPage() {
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState("newest");
  const [solved, setSolved] = useState("all");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    setPage(1);
  }, [category, search, sort, solved]);

  useEffect(() => {
    fetchTopics();
  }, [category, search, sort, solved, page]);

  async function fetchTopics() {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (search) params.set("search", search);
    if (sort !== "newest") params.set("sort", sort);
    if (solved !== "all") params.set("solved", solved);
    params.set("page", String(page));

    try {
      const res = await fetch(`/api/forum/topics?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTopics(data.topics);
        setTotal(data.total);
        setLimit(data.limit);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
  }

  const totalPages = Math.ceil(total / limit);
  const hasActiveFilters = search || category !== "all" || sort !== "newest" || solved !== "all";

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Başlık */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Forum</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Çiftçi topluluğuyla sorularınızı paylaşın ve yardımlaşın
          </p>
        </div>
        <Link href="/dashboard/forum/new">
          <Button size="sm" className="gap-1.5 shadow-sm">
            <Plus size={16} />
            Yeni Konu
          </Button>
        </Link>
      </div>

      {/* Filtre & Arama */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Konu ara..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  setSearch("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <Button type="submit" variant="outline" size="icon">
            <Search size={16} />
          </Button>
        </form>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter size={14} className="mr-1.5" />
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Kategoriler</SelectItem>
            {Object.entries(FORUM_CATEGORIES).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full sm:w-44">
            <ArrowUpDown size={14} className="mr-1.5" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">En Yeni</SelectItem>
            <SelectItem value="oldest">En Eski</SelectItem>
            <SelectItem value="most_viewed">En Çok Görüntülenen</SelectItem>
          </SelectContent>
        </Select>
        <Select value={solved} onValueChange={setSolved}>
          <SelectTrigger className="w-full sm:w-40">
            <CheckCircle2 size={14} className="mr-1.5" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            <SelectItem value="true">Çözülmüş</SelectItem>
            <SelectItem value="false">Çözülmemiş</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* İstatistik */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{total} konu</span>
        {hasActiveFilters && (
          <button
            onClick={() => {
              setSearch("");
              setSearchInput("");
              setCategory("all");
              setSort("newest");
              setSolved("all");
            }}
            className="text-primary hover:underline"
          >
            Filtreleri temizle
          </button>
        )}
      </div>

      {/* Konu Listesi */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : topics.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <MessagesSquare className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="mt-4 text-base font-medium">
              {hasActiveFilters ? "Filtreye uygun konu bulunamadı" : "Henüz konu yok"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {hasActiveFilters
                ? "Farklı filtreler deneyin"
                : "İlk konuyu açarak topluluğu başlatın!"}
            </p>
            {!hasActiveFilters && (
              <Link href="/dashboard/forum/new">
                <Button className="mt-4 gap-1.5">
                  <Plus size={16} />
                  Yeni Konu Aç
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {topics.map((topic) => (
            <Link key={topic.id} href={`/dashboard/forum/${topic.id}`}>
              <Card className="border-0 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-emerald-600 shadow-sm">
                      <User size={16} className="text-white" />
                    </div>

                    {/* İçerik */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-foreground truncate">
                              {topic.title}
                            </h3>
                            {topic.is_solved && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700 dark:bg-green-950/40 dark:text-green-400">
                                <CheckCircle2 size={12} />
                                Çözüldü
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                            {topic.content}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                        <span className={`rounded-md px-2 py-0.5 font-medium ${categoryColors[topic.category] || categoryColors.other}`}>
                          {FORUM_CATEGORIES[topic.category] || topic.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <User size={12} />
                          {topic.profiles?.full_name || "Anonim"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {timeAgo(topic.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle size={12} />
                          {topic.reply_count} yanıt
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={12} />
                          {topic.view_count}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Sayfalama */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-xs text-muted-foreground">
            {total} konudan {(page - 1) * limit + 1}-{Math.min(page * limit, total)} arası
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | string)[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                typeof p === "string" ? (
                  <span key={`dot-${i}`} className="px-1 text-xs text-muted-foreground">
                    ...
                  </span>
                ) : (
                  <Button
                    key={p}
                    variant={page === p ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8 text-xs"
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                ),
              )}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
